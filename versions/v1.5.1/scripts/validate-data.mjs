import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const sourceUrl = new URL("../lib/data.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const unique = (values, label) => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

unique(data.entities.map((entity) => entity.id), "Entity IDs");
unique(data.entities.map((entity) => entity.slug), "Entity slugs");
unique(data.sources.map((sourceItem) => sourceItem.id), "Source IDs");
unique(data.relationships.map((relationship) => relationship.id), "Relationship IDs");
unique(data.journeys.map((journey) => journey.id), "Journey IDs");

const entityIds = new Set(data.entities.map((entity) => entity.id));
const sourceIds = new Set(data.sources.map((sourceItem) => sourceItem.id));
const universityIds = new Set(data.entities.filter((entity) => entity.type === "university").map((entity) => entity.id));
const validTypes = new Set(["university", "bip", "programme", "pathway", "project", "event", "community", "platform", "opportunity", "initiative", "framework"]);
const validStatuses = new Set(["Open", "Upcoming", "Ongoing", "Completed", "Recurring", "Planned", "Under development", "Archived", "Access unverified", "Verification required"]);

const validateUrl = (value, label) => {
  if (!value) return;
  const url = new URL(value);
  assert.ok(["http:", "https:"].includes(url.protocol), `${label} must use HTTP or HTTPS`);
};

assert.equal(universityIds.size, 10, "INGENIUM+ must have exactly ten canonical university anchors");
assert.equal(data.entities.filter((entity) => entity.type === "bip").length, 13, "The frozen 2026/27 catalogue must contain 13 BIP records");

for (const entity of data.entities) {
  assert.ok(entity.title?.trim(), `${entity.id} is missing a title`);
  assert.ok(validTypes.has(entity.type), `${entity.id} has an invalid type: ${entity.type}`);
  assert.ok(validStatuses.has(entity.status), `${entity.id} has an invalid status: ${entity.status}`);
  assert.ok(sourceIds.has(entity.sourceId), `${entity.id} has an unknown source`);
  assert.ok(entity.lastVerified, `${entity.id} is missing a verification date`);
  assert.ok(entity.studentSummary, `${entity.id} is missing a student summary`);
  for (const universityId of entity.universityIds) {
    assert.ok(universityIds.has(universityId), `${entity.id} has an invalid university link: ${universityId}`);
  }
  if (entity.hostUniversityId) {
    assert.ok(entity.universityIds.includes(entity.hostUniversityId), `${entity.id} host is not present in universityIds`);
  }
  validateUrl(entity.officialUrl, `${entity.id} officialUrl`);
  if (entity.startDate || entity.endDate || entity.applicationDeadline) {
    assert.ok(entity.sourceId && entity.lastVerified, `${entity.id} has exact dates without source provenance`);
  }
  if (["Planned", "Under development", "Verification required"].includes(entity.status)) {
    assert.ok(!/^apply|^register|^enrol/i.test(entity.actionLabel ?? ""), `${entity.id} exposes an application CTA despite status ${entity.status}`);
  }
}

for (const sourceItem of data.sources) validateUrl(sourceItem.url, `${sourceItem.id} source URL`);

for (const relationship of data.relationships) {
  assert.ok(entityIds.has(relationship.source), `${relationship.id} has an invalid source endpoint`);
  assert.ok(entityIds.has(relationship.target), `${relationship.id} has an invalid target endpoint`);
  assert.ok(relationship.explanation, `${relationship.id} is missing an explanation`);
}

for (const journey of data.journeys) {
  assert.ok(journey.nodeIds.length > 1, `${journey.id} needs more than one node`);
  for (const entityId of journey.nodeIds) {
    assert.ok(entityIds.has(entityId), `${journey.id} references an unknown node: ${entityId}`);
  }
}

const declaredUniversityAssociations = data.entities
  .filter((entity) => entity.type !== "university")
  .reduce((sum, entity) => sum + entity.universityIds.length, 0);
const representedUniversityAssociations = data.relationships.filter((relationship) => universityIds.has(relationship.target)).length;
assert.equal(representedUniversityAssociations, declaredUniversityAssociations, "Every declared university association must have a graph relationship");

console.log(`Validated ${data.entities.length} entities, ${data.relationships.length} relationships, ${data.sources.length} sources and ${data.journeys.length} journeys.`);
