import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const directory = await mkdtemp(join(tmpdir(), "ingenium-v151-restore-"));
try {
  const livePath = join(directory, "live.sqlite");
  const backupPath = join(directory, "backup.sqlite");
  const schema = await readFile(new URL("../drizzle/0000_v151_production.sql", import.meta.url), "utf8");
  const seed = await readFile(new URL("../db/seed/v151.sql", import.meta.url), "utf8");
  const live = new DatabaseSync(livePath);
  live.exec(schema); live.exec(seed);
  const expected = live.prepare("SELECT COUNT(*) AS count FROM content_records").get().count;
  live.exec(`VACUUM INTO '${backupPath.replaceAll("'", "''")}'`); live.close();
  const restored = new DatabaseSync(backupPath, { readOnly: true });
  assert.equal(restored.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
  assert.equal(restored.prepare("SELECT COUNT(*) AS count FROM content_records").get().count, expected);
  restored.close();
  console.log(`Verified database backup and non-production restore with ${expected} content records.`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
