import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-v151-private-bootstrap-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const bootstrap = await server.ssrLoadModule("/lib/v151/private-bootstrap.ts");
const repository = await server.ssrLoadModule("/lib/v151/repository.ts");
const bindings = await server.ssrLoadModule("/lib/v151/bindings.ts");
const chatgptUser = await server.ssrLoadModule("/lib/v151/chatgpt-user.ts");
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

test("an email match cannot seed data or grant administrator permissions", async () => {
  const sqlite=new DatabaseSync(":memory:");sqlite.exec(schema);
  sqlite.exec("INSERT INTO profiles(id,auth_subject,email,display_name) VALUES('owner','auth-owner','owner@example.invalid','Owner')");
  const database=new D1TestDatabase(sqlite);
  await bootstrap.bootstrapPrivateOwner(database,{userId:"auth-owner",email:"owner@example.invalid",displayName:"Owner",fullName:null},"owner","owner@example.invalid");
  const session=await repository.getOrCreateSession(database,{userId:"auth-owner",email:"owner@example.invalid",displayName:"Owner",fullName:null});
  assert.deepEqual(session.roles,[]);assert.equal(session.mode,"student");
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM content_records").get().n,0);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM memberships").get().n,0);sqlite.close();
});
test("unprovisioned identities cannot create profiles during sign-in",async()=>{const sqlite=new DatabaseSync(":memory:");sqlite.exec(schema);bindings.setRuntimeBindings({DB:new D1TestDatabase(sqlite)});await assert.rejects(()=>repository.getOrCreateSession(new D1TestDatabase(sqlite),{userId:"forged",email:"owner@example.invalid",displayName:"Forged",fullName:null}),/provision/);assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM profiles").get().n,0);sqlite.close();});
test("legacy identity headers are never authentication",()=>{assert.equal(chatgptUser.chatGPTUserFromHeaders(new Headers({"oai-authenticated-user-id":"owner","oai-authenticated-user-email":"owner@example.invalid"})),null);});
