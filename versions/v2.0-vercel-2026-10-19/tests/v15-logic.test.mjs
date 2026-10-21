import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Keep this unit harness independent from the production Vite configuration.
// Loading vite.config.ts here would also boot the Cloudflare inspector, which is
// unnecessary for pure selector and data-integrity tests.
const server = await createServer({
  configFile: false,
  cacheDir: ".vite-test-cache",
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});
const logic = await server.ssrLoadModule("/lib/v15-logic.ts");
const data = await server.ssrLoadModule("/lib/v15-data.ts");

after(async () => server.close());

const baseEntity = {
  id: "test", slug: "test", title: "Test", type: "course", studentSummary: "Test", status: "Open",
  universityIds: [], themes: [], sourceId: "test", lastVerified: "2026-09-13", confidence: "High",
};

test("date status uses explicit dates instead of stale labels", () => {
  assert.equal(logic.getComputedStatus({ ...baseEntity, applicationDeadline: "2026-09-14" }, "2026-09-13"), "Open now");
  assert.equal(logic.getComputedStatus({ ...baseEntity, applicationDeadline: "2026-09-13" }, "2026-09-13"), "Open now");
  assert.equal(logic.getComputedStatus({ ...baseEntity, applicationDeadline: "2026-09-12" }, "2026-09-13"), "Closed");
  assert.equal(logic.getComputedStatus({ ...baseEntity, applicationOpenDate: "2026-09-14", applicationDeadline: "2026-09-30" }, "2026-09-13"), "Opens soon");
  assert.equal(logic.getComputedStatus({ ...baseEntity, startDate: "2026-08-01", endDate: "2026-09-12", status: "Completed" }, "2026-09-13"), "Past");
  assert.equal(logic.getComputedStatus({ ...baseEntity, status: "Recurring", recurrence: "recurring" }, "2026-09-13"), "Recurring");
  assert.equal(logic.getComputedStatus({ ...baseEntity, status: "Under development" }, "2026-09-13"), "Under development");
});

test("student degrees explain connection context deterministically", () => {
  const a = { id: "a", joinedEntityIds: ["module-1", "bip-1"], connectionIds: ["b", "mutual"] };
  const b = { id: "b", joinedEntityIds: [], connectionIds: ["a"] };
  const c = { id: "c", joinedEntityIds: ["bip-1"], connectionIds: [] };
  const d = { id: "d", joinedEntityIds: [], connectionIds: ["mutual"] };
  assert.equal(logic.getStudentDegree(a, b), 1);
  assert.equal(logic.getStudentDegree(a, c), 2);
  assert.equal(logic.getStudentDegree(a, d), 3);
  assert.deepEqual(logic.getSharedContexts(a, c), ["bip-1"]);
  assert.deepEqual(logic.getMutualConnections(a, d), ["mutual"]);
});

test("profile completion and recommendations are deterministic", () => {
  const profile = { displayName: "Adam", universityId: "university-mtu", studyLevel: "Bachelor", fieldOfStudy: "Artificial intelligence", interests: ["Sustainability"], goals: ["Study abroad"], languages: ["English"], preferredCountries: ["Finland"] };
  assert.equal(logic.getProfileCompletion(profile).percentage, 100);
  const first = logic.getRecommendationsForProfile(profile).map((item) => [item.entity.id, item.score]);
  const second = logic.getRecommendationsForProfile(profile).map((item) => [item.entity.id, item.score]);
  assert.deepEqual(first, second);
  assert.ok(first.length > 0);
});

test("semester operations prevent duplicates and total ECTS", () => {
  const once = logic.addSemesterItem([], "course-sustainable-wellbeing", "2026-09-13T00:00:00.000Z");
  const twice = logic.addSemesterItem(once, "course-sustainable-wellbeing", "2026-09-13T01:00:00.000Z");
  assert.equal(twice.length, 1);
  assert.equal(logic.getSemesterECTSTotal(twice), 5);
  assert.deepEqual(logic.removeSemesterItem(twice, "course-sustainable-wellbeing"), []);
});

test("v1.5 data preserves classification and source integrity", () => {
  const ids = new Set(data.records.map((record) => record.id));
  const sourceIds = new Set(data.evidenceSources.map((source) => source.id));
  assert.equal(ids.size, data.records.length);
  for (const record of data.records) {
    assert.ok(record.dataClassification);
    assert.ok(sourceIds.has(record.sourceId), `${record.id} has missing source ${record.sourceId}`);
  }
  for (const relationship of data.networkRelationships) {
    assert.ok(ids.has(relationship.source));
    assert.ok(ids.has(relationship.target));
    assert.ok(relationship.dataClassification);
  }
});

test("client components do not import static datasets or v15-logic", async () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const componentsDir = resolve(root, "components");
  const entries = await readdir(componentsDir);

  const forbiddenImportPatterns = [
    /from\s+["'].*v15-logic["']/,
    /from\s+["'].*v15-data["']/,
    /from\s+["'].*research-.*["']/,
    /import\s+(?!type\s)(?:(?!\btype\b).)*from\s+["'].*\/data["']/,
  ];

  for (const entry of entries) {
    if (!entry.endsWith(".tsx") && !entry.endsWith(".ts")) continue;
    const filePath = resolve(componentsDir, entry);
    const content = await readFile(filePath, "utf8");
    if (!content.includes('"use client"') && !content.includes("'use client'")) continue;

    for (const pattern of forbiddenImportPatterns) {
      assert.ok(
        !pattern.test(content),
        `${entry} must not import static dataset/logic (matched ${pattern})`,
      );
    }
  }

  const clientAssetsDir = resolve(root, "dist/client/assets");
  try {
    const assetFiles = await readdir(clientAssetsDir);
    for (const file of assetFiles) {
      assert.ok(!file.startsWith("v15-logic-"), `client asset ${file} must not be present`);
      assert.ok(!file.startsWith("v15-data-"), `client asset ${file} must not be present`);
      assert.ok(!file.startsWith("data-"), `client asset ${file} must not be present`);
      assert.ok(!file.startsWith("research-"), `client asset ${file} must not be present`);
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") throw error;
  }
});
