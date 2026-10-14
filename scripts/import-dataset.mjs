import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
const validDay = (v) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;
const validInstant = (v) =>
  /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
const https = (v) => {
  try {
    const u = new URL(v);
    return (
      u.protocol === "https:" && !u.username && !u.password && !/[\r\n]/.test(v)
    );
  } catch {
    return false;
  }
};
export function validateDataset(d) {
  if (
    d.version !== "2.0.0" ||
    !Array.isArray(d.records) ||
    !Array.isArray(d.sources) ||
    !Array.isArray(d.relationships)
  )
    throw new Error("Unsupported dataset format");
  const ids = new Set(),
    slugs = new Set(),
    sources = new Set();
  for (const s of d.sources) {
    if (
      !s.id ||
      !s.title ||
      !s.kind ||
      sources.has(s.id) ||
      (s.url && !https(s.url))
    )
      throw new Error("Invalid or duplicate source");
    sources.add(s.id);
  }
  const types = new Set([
    "university",
    "course",
    "opportunity",
    "project",
    "research_group",
    "living_lab",
    "community",
    "event",
    "programme",
    "calendar_event",
    "bip",
    "framework",
    "initiative",
    "learning_resource",
    "microcredential",
    "module",
    "pathway",
    "platform",
  ]);
  for (const r of d.records) {
    if (
      !r.id ||
      !r.slug ||
      !r.title ||
      !types.has(r.type) ||
      ids.has(r.id) ||
      slugs.has(r.slug)
    )
      throw new Error("Invalid or duplicate public record");
    ids.add(r.id);
    slugs.add(r.slug);
    if (!sources.has(r.sourceId)) throw new Error(`Missing source for ${r.id}`);
    if (
      r.availabilityStatus &&
      !["open", "closed", "unknown"].includes(r.availabilityStatus)
    )
      throw new Error("Invalid availability");
    for (const field of [
      "applicationDeadline",
      "applicationOpenDate",
      "startDate",
      "endDate",
    ])
      if (r[field] && !validDay(r[field])) throw new Error(`Invalid ${field}`);
    if (r.officialUrl && !https(r.officialUrl))
      throw new Error("Official URL must be HTTPS");
  }
  const edges = new Set();
  for (const e of d.relationships) {
    if (!e.id || edges.has(e.id) || !ids.has(e.source) || !ids.has(e.target))
      throw new Error("Invalid relationship");
    edges.add(e.id);
  }
  const dates = new Set();
  for (const e of d.calendarEvents ?? []) {
    if (
      !e.id ||
      dates.has(e.id) ||
      !ids.has(e.recordId) ||
      ![
        "activity",
        "deadline",
        "application_window",
        "nomination",
        "online_component",
      ].includes(e.kind) ||
      !["day", "instant", "approximate"].includes(e.precision) ||
      !https(e.sourceUrl) ||
      !e.start ||
      (e.end && e.end < e.start)
    )
      throw new Error("Invalid calendar event");
    if (
      e.precision === "day" &&
      (!validDay(e.start) || (e.end && !validDay(e.end)))
    )
      throw new Error("Invalid calendar day");
    if (
      e.precision === "instant" &&
      (!validInstant(e.start) || (e.end && !validInstant(e.end)))
    )
      throw new Error("Calendar times require explicit UTC or offset");
    if (e.precision === "instant") {
      try {
        if (!e.timezone) throw new Error();
        new Intl.DateTimeFormat("en", { timeZone: e.timezone }).format(
          new Date(e.start),
        );
      } catch {
        throw new Error(
          "Timed calendar events require a valid confirmed timezone",
        );
      }
    }
    if (e.precision === "approximate" && !e.dateLabel)
      throw new Error("Approximate windows need a human-readable date label");
    dates.add(e.id);
  }
  return d;
}
export function buildImportSql(input) {
  const d = validateDataset(input);
  const q = (v) =>
    v === undefined || v === null
      ? "NULL"
      : `'${String(v).replace(/'/g, "''")}'`;
  const statements = [];
  for (const s of d.sources)
    statements.push(
      `INSERT OR IGNORE INTO evidence_sources(id,title,kind,url,verified_at) VALUES (${[s.id, s.title, s.kind, s.url, s.verifiedAt].map(q).join(",")});`,
    );
  for (const r of d.records.filter((r) => r.type === "university"))
    statements.push(
      `INSERT OR IGNORE INTO organizations(id,slug,name,kind,country,official_url) VALUES (${[r.id, r.slug, r.title, "university", r.countries?.[0], r.officialUrl].map(q).join(",")});`,
    );
  for (const r of d.records) {
    const version = `v2_import_${r.id}`;
    statements.push(
      `INSERT OR IGNORE INTO content_records(id,slug,type,title,summary,status,classification,confidence,source_id,official_url,published_version_id,is_published,last_verified_at,availability_status,deadline,last_checked,source_conflict) VALUES (${[r.id, r.slug, r.type, r.title, r.studentSummary, r.status, r.dataClassification ?? "verified", r.confidence, r.sourceId, r.officialUrl, version].map(q).join(",")},1,${[r.lastVerified, r.availabilityStatus ?? "unknown", r.applicationDeadline, r.lastChecked].map(q).join(",")},${r.sourceConflict ? 1 : 0});`,
    );
    statements.push(
      `INSERT OR IGNORE INTO content_versions(id,record_id,version_number,payload_json,change_summary,source_id) SELECT ${q(version)},${q(r.id)},1,${q(JSON.stringify(r))},'Versioned v2 public import',${q(r.sourceId)} WHERE NOT EXISTS(SELECT 1 FROM content_versions WHERE record_id=${q(r.id)} AND version_number=1);`,
    );
  }
  for (const e of d.relationships)
    statements.push(
      `INSERT OR IGNORE INTO content_relationships(id,source_record_id,target_record_id,type,label,explanation,classification) VALUES (${[e.id, e.source, e.target, e.type, e.label, e.explanation, e.dataClassification ?? "verified"].map(q).join(",")});`,
    );
  for (const e of d.calendarEvents ?? [])
    statements.push(
      `INSERT OR IGNORE INTO calendar_events(id,record_id,kind,start_date,end_date,precision,timezone,source_url,date_label) VALUES (${[e.id, e.recordId, e.kind, e.start, e.end, e.precision, e.timezone, e.sourceUrl, e.dateLabel].map(q).join(",")});`,
    );
  statements.push(
    `INSERT OR REPLACE INTO system_state(key,value_json) VALUES('dataset_version',${q(JSON.stringify({ version: d.version, records: d.records.length, policy: "insert-only; existing reviewed records preserved" }))});`,
  );
  return statements.join("\n") + "\n";
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const input =
    args.find((a) => a.endsWith(".json")) ?? "data/catalogue/v2.json";
  const d = JSON.parse(await readFile(input, "utf8"));
  const sql = buildImportSql(d);
  const output = "work/v2-import.sql";
  await import("node:fs/promises").then((m) =>
    m.mkdir("work", { recursive: true }),
  );
  await writeFile(output, sql);
  if (!args.includes("--apply-local") && !args.includes("--apply-remote")) {
    console.log(
      JSON.stringify({
        dryRun: true,
        records: d.records.length,
        relationships: d.relationships.length,
        output,
        bytes: Buffer.byteLength(sql),
      }),
    );
  } else {
    const remote = args.includes("--apply-remote");
    const config = process.env.INGENIUM_DEPLOY_CONFIG;
    if (!config)
      throw new Error(
        "Select INGENIUM_DEPLOY_CONFIG before applying an import",
      );
    if (remote && !args.includes("--confirm-remote-import"))
      throw new Error(
        "Remote imports require explicit --confirm-remote-import",
      );
    const result = spawnSync(
      "npx",
      [
        "wrangler",
        "--config",
        config,
        "d1",
        "execute",
        "DB",
        remote ? "--remote" : "--local",
        "--file",
        output,
      ],
      { stdio: "inherit", env: process.env },
    );
    if (result.status) process.exit(result.status);
  }
}
