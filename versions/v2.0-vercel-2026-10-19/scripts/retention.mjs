import { writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
export function retentionPlan(env) {
  const start = env.PILOT_START_DATE ?? "";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !Number.isFinite(Date.parse(start)) ||
    new Date(start).toISOString().slice(0, 10) !== start
  )
    throw new Error("Supply approved PILOT_START_DATE");
  const duration = Number(env.PILOT_DURATION_DAYS ?? 42),
    days = Number(env.SURVEY_RETENTION_DAYS ?? 90),
    audit = Number(env.AUDIT_RETENTION_DAYS ?? 365);
  if (
    [duration, days, audit].some(
      (v) => !Number.isInteger(v) || v < 1 || v > 3650,
    )
  )
    throw new Error("Invalid retention duration");
  const cutoff = new Date(`${start}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() + duration + days);
  const date = cutoff.toISOString().slice(0, 10),
    approved = env.RETENTION_APPROVED === "true";
  const sql = approved
    ? `DELETE FROM survey_free_text WHERE date('now') >= '${date}';\nDELETE FROM pilot_audit WHERE created_at < datetime('now','-${audit} days');\n`
    : `SELECT COUNT(*) AS free_text_to_remove FROM survey_free_text WHERE date('now') >= '${date}';\nSELECT COUNT(*) AS old_audit FROM pilot_audit WHERE created_at < datetime('now','-${audit} days');\n`;
  return { sql, date, approved };
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const p = retentionPlan(process.env);
  await mkdir("work", { recursive: true });
  await writeFile("work/retention.sql", p.sql);
  console.log(
    JSON.stringify({
      mode: p.approved
        ? "prepared cleanup; not executed"
        : "dry-run queries only",
      freeTextRemovalFrom: p.date,
      path: "work/retention.sql",
    }),
  );
}
