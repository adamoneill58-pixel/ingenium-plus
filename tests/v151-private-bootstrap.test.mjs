import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-v151-private-bootstrap-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const bootstrap = await server.ssrLoadModule("/lib/v151/private-bootstrap.ts");
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
}

test("the private Site owner initializes the dataset and receives operational roles exactly once", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(schema);
  sqlite.exec(`INSERT INTO profiles (id,auth_subject,email,display_name) VALUES ('owner','auth-owner','owner@example.invalid','Owner');
    INSERT INTO memberships (id,profile_id,role,status) VALUES ('member-student','owner','student','active');
    INSERT INTO student_profiles (profile_id) VALUES ('owner');`);
  const database = new D1TestDatabase(sqlite);
  const user = { userId: "auth-owner", email: "owner@example.invalid", displayName: "Owner", fullName: "Owner" };

  await bootstrap.bootstrapPrivateOwner(database, user, "owner", " OWNER@example.invalid ");
  await bootstrap.bootstrapPrivateOwner(database, user, "owner", "owner@example.invalid");

  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM content_records").get().count, 104);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM memberships WHERE profile_id='owner' AND role='administrator'").get().count, 1);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM memberships WHERE profile_id='owner' AND role='staff'").get().count, 1);
  assert.equal(sqlite.prepare("SELECT mode FROM profiles WHERE id='owner'").get().mode, "staff");
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM audit_events WHERE action='private_owner.bootstrap'").get().count, 1);
  sqlite.close();
});

test("a non-owner cannot trigger private bootstrap", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(schema);
  sqlite.exec("INSERT INTO profiles (id,auth_subject,email,display_name) VALUES ('visitor','auth-visitor','visitor@example.invalid','Visitor')");
  const database = new D1TestDatabase(sqlite);
  await bootstrap.bootstrapPrivateOwner(database, { userId: "auth-visitor", email: "visitor@example.invalid", displayName: "Visitor", fullName: null }, "visitor", "owner@example.invalid");
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM content_records").get().count, 0);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM memberships").get().count, 0);
  sqlite.close();
});
