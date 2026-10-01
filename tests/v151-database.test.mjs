import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";

const schema = await readFile(new URL("../drizzle/0000_v151_production.sql", import.meta.url), "utf8");
const seed = await readFile(new URL("../db/seed/v151.sql", import.meta.url), "utf8");
const seedMigration = await readFile(new URL("../drizzle/0001_v151_seed.sql", import.meta.url), "utf8");

test("production migration and v1.5 seed apply to a clean SQLite database", () => {
  const database = new DatabaseSync(":memory:");
  database.exec(schema);
  database.exec(seed);
  const tables = database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((row) => row.name);
  for (const table of ["profiles", "memberships", "content_records", "documents", "ingestion_jobs", "extraction_results", "proposed_changes", "recommendation_results", "audit_events"]) assert.ok(tables.includes(table), `${table} exists`);
  assert.ok(database.prepare("SELECT COUNT(*) AS count FROM content_records WHERE is_published=1").get().count >= 100);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM organizations WHERE kind='university'").get().count, 10);
  assert.ok(database.prepare("SELECT COUNT(*) AS count FROM content_relationships").get().count >= 400);
  database.close();
});

test("deployment migrations initialize the complete catalogue without a user session", () => {
  const database = new DatabaseSync(":memory:");
  database.exec(schema);
  database.exec(seedMigration);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM content_records").get().count, 226);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM content_relationships").get().count, 1007);
  assert.equal(database.prepare("SELECT COUNT(*) AS count FROM evidence_sources").get().count, 159);
  assert.equal(database.prepare("SELECT json_extract(value_json, '$.version') AS version FROM system_state WHERE key='dataset_version'").get().version, "1.5.1");
  database.close();
});

test("database constraints reject invalid state and audit mutation", () => {
  const database = new DatabaseSync(":memory:");
  database.exec(schema);
  database.exec("INSERT INTO audit_events (id,action,resource_type,metadata_json) VALUES ('audit-1','test','test','{}')");
  assert.throws(() => database.exec("UPDATE audit_events SET action='changed' WHERE id='audit-1'"), /immutable/i);
  assert.throws(() => database.exec("INSERT INTO recommendation_results (id,run_id,candidate_type,candidate_id,rank,score,label,components_json,explanations_json) VALUES ('r','missing','module','m',1,101,'Strong match','{}','[]')"));
  database.exec("INSERT INTO profiles (id,auth_subject,email,display_name) VALUES ('p','auth','person@example.invalid','Test person')");
  database.exec("INSERT INTO documents (id,uploaded_by,storage_key,original_name,mime_type,byte_size,sha256) VALUES ('d1','p','quarantine/d1','a.pdf','application/pdf',10,'same-hash')");
  assert.throws(() => database.exec("INSERT INTO documents (id,uploaded_by,storage_key,original_name,mime_type,byte_size,sha256) VALUES ('d2','p','quarantine/d2','b.pdf','application/pdf',10,'same-hash')"), /unique/i);
  database.close();
});
