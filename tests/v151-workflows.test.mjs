import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-v151-workflow-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const repository = await server.ssrLoadModule("/lib/v151/repository.ts");
const schema = await readFile(new URL("../drizzle/0000_v151_production.sql", import.meta.url), "utf8");
after(async () => server.close());

class D1Statement {
  constructor(database, sql, values = []) { this.database = database; this.sql = sql; this.values = values; }
  bind(...values) { return new D1Statement(this.database, this.sql, values); }
  async first(column) { const row = this.database.prepare(this.sql).get(...this.values) ?? null; return column && row ? row[column] ?? null : row; }
  async all() { return { results: this.database.prepare(this.sql).all(...this.values), success: true }; }
  async run() { return this.runSync(); }
  runSync() { const result = this.database.prepare(this.sql).run(...this.values); return { results: [], success: true, meta: { changes: result.changes } }; }
}

class D1TestDatabase {
  constructor(database) { this.database = database; }
  prepare(sql) { return new D1Statement(this.database, sql); }
  async batch(statements) {
    this.database.exec("BEGIN");
    try { const results = statements.map((statement) => statement.runSync()); this.database.exec("COMMIT"); return results; }
    catch (error) { this.database.exec("ROLLBACK"); throw error; }
  }
  async exec(sql) { this.database.exec(sql); return { results: [], success: true }; }
}

function setup() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(schema);
  sqlite.exec(`INSERT INTO organizations (id,slug,name) VALUES ('org-a','org-a','University A');
    INSERT INTO profiles (id,auth_subject,email,display_name) VALUES ('author','auth-a','author@example.invalid','Author');
    INSERT INTO profiles (id,auth_subject,email,display_name) VALUES ('reviewer','auth-r','reviewer@example.invalid','Reviewer');`);
  return { sqlite, database: new D1TestDatabase(sqlite) };
}

const callInput = (title) => ({ title, summary: `${title} summary`, description: `${title} full description`, callType: "research",
  organizationId: "org-a", disciplines: ["energy"], methods: ["modelling"], skillsOffered: ["data analysis"], skillsSought: ["field research"],
  methodsOffered: ["simulation"], methodsSought: ["participatory design"], facilitiesOffered: [], facilitiesSought: ["living lab"], needs: ["field research"],
  eligibility: [], languages: ["English"], countries: ["Ireland"], deliveryMode: "hybrid", deadline: "2027-06-01", sourceUrl: "https://ingenium-university.eu/example" });

test("published call revisions preserve the live version until independent approval", async () => {
  const { sqlite, database } = setup();
  const callId = await repository.createCall(database, "author", callInput("Original call"));
  const initialProposal = sqlite.prepare("SELECT id FROM proposed_changes WHERE target_id=?").get(callId).id;
  await repository.reviewProposal(database, "reviewer", initialProposal, "approved", "Verified against evidence");
  assert.equal(sqlite.prepare("SELECT title FROM collaboration_calls WHERE id=?").get(callId).title, "Original call");

  const rejected = await repository.reviseCall(database, "author", callId, callInput("Rejected revision"));
  await repository.reviewProposal(database, "reviewer", rejected.proposalId, "rejected", "Unsupported change");
  const afterRejection = sqlite.prepare("SELECT title,status FROM collaboration_calls WHERE id=?").get(callId);
  assert.equal(afterRejection.title, "Original call");
  assert.equal(afterRejection.status, "published");

  const approved = await repository.reviseCall(database, "author", callId, callInput("Approved revision"));
  await repository.reviewProposal(database, "reviewer", approved.proposalId, "approved", "Updated evidence accepted");
  assert.equal(sqlite.prepare("SELECT title FROM collaboration_calls WHERE id=?").get(callId).title, "Approved revision");
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM call_versions WHERE call_id=?").get(callId).count, 3);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM call_versions WHERE call_id=? AND is_published=1").get(callId).count, 1);
  sqlite.close();
});

test("module publication is versioned and rejected revisions do not alter public data", async () => {
  const { sqlite, database } = setup();
  const initial = await repository.createModuleProposal(database, "author", { title: "Original module", summary: "Original summary", fullDescription: "Details", organizationId: "org-a", themes: ["AI"], methods: [], languages: ["English"], studyLevels: ["Bachelor"], officialUrl: "https://ingenium-university.eu/module" });
  await repository.reviewProposal(database, "reviewer", initial.proposalId, "approved", "Initial module verified");
  const revision = await repository.reviseModuleProposal(database, "author", initial.recordId, { title: "Rejected title", summary: "Rejected summary", fullDescription: "Changed", organizationId: "org-a", themes: ["AI"], methods: [], languages: ["English"], studyLevels: ["Bachelor"] });
  await repository.reviewProposal(database, "reviewer", revision.proposalId, "rejected", "Evidence did not support the change");
  const record = sqlite.prepare("SELECT title,is_published AS isPublished FROM content_records WHERE id=?").get(initial.recordId);
  assert.equal(record.title, "Original module");
  assert.equal(record.isPublished, 1);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM content_versions WHERE record_id=?").get(initial.recordId).count, 1);
  sqlite.close();
});
