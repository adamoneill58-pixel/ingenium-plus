import { buildImportSql } from "./import-dataset.mjs";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const directory = await mkdtemp(join(tmpdir(), "ingenium-v151-restore-"));
try {
  const livePath = join(directory, "live.sqlite");
  const backupPath = join(directory, "backup.sqlite");
  const schema = await readFile(
    new URL("../drizzle/0000_v151_production.sql", import.meta.url),
    "utf8",
  );
  const seed = await readFile(
    new URL("../db/seed/v151.sql", import.meta.url),
    "utf8",
  );
  const live = new DatabaseSync(livePath);
  live.exec(schema);
  live.exec(seed);
  const before = live
    .prepare("SELECT COUNT(*) AS count FROM content_records")
    .get().count;
  live.exec(
    await readFile(
      new URL("../drizzle/0001_v2_pilot.sql", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(
    live.prepare("SELECT COUNT(*) AS count FROM content_records").get().count,
    before,
  );
  live.exec(
    buildImportSql(
      JSON.parse(
        await readFile(
          new URL("../data/catalogue/v2.json", import.meta.url),
          "utf8",
        ),
      ),
    ),
  );
  live.exec(
    "INSERT INTO usage_daily_counts VALUES('page_view','/','2026-10-14','',7)",
  );
  const expected = live
    .prepare("SELECT COUNT(*) AS count FROM content_records")
    .get().count;
  live.exec(`VACUUM INTO '${backupPath.replaceAll("'", "''")}'`);
  live.close();
  const restored = new DatabaseSync(backupPath, { readOnly: true });
  assert.equal(
    restored.prepare("PRAGMA integrity_check").get().integrity_check,
    "ok",
  );
  assert.equal(
    restored.prepare("SELECT COUNT(*) AS count FROM content_records").get()
      .count,
    expected,
  );
  assert.equal(
    restored.prepare("SELECT count FROM usage_daily_counts").get().count,
    7,
  );
  assert.equal(restored.prepare("PRAGMA foreign_key_check").all().length, 0);
  restored.close();
  console.log(
    `Verified additive v2 upgrade, database backup and non-production restore with ${expected} content records.`,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
