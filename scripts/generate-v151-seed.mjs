import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-seed-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const data = await server.ssrLoadModule("/lib/v15-data.ts");
const embedding = await server.ssrLoadModule("/lib/v151/embeddings.ts");
await server.close();

const q = (value) => value === undefined || value === null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const bool = (value) => value ? 1 : 0;
const statements = ["PRAGMA foreign_keys = ON;", "BEGIN TRANSACTION;"];

for (const source of data.evidenceSources) {
  statements.push(`INSERT OR IGNORE INTO evidence_sources (id,title,kind,url,publisher,published_at,verified_at,notes) VALUES (${q(source.id)},${q(source.title)},${q(source.kind)},${q(source.url)},${q(source.publisher)},${q(source.published)},${q(source.verifiedAt)},${q(source.notes)});`);
}

for (const record of data.records.filter((item) => item.type === "university")) {
  statements.push(`INSERT OR IGNORE INTO organizations (id,slug,name,kind,country,official_url,active) VALUES (${q(record.id)},${q(record.slug)},${q(record.title)},'university',${q(record.countries?.[0])},${q(record.officialUrl)},1);`);
}

for (const record of data.records) {
  const versionId = `version_seed_${record.id}`;
  const host = record.hostUniversityId ?? record.universityIds?.[0] ?? null;
  statements.push(`INSERT OR IGNORE INTO content_records (id,slug,type,title,summary,status,classification,confidence,owner_organization_id,source_id,official_url,published_version_id,is_published,last_verified_at) VALUES (${q(record.id)},${q(record.slug)},${q(record.type)},${q(record.title)},${q(record.studentSummary)},${q(record.status)},${q(record.dataClassification ?? "verified")},${q(record.confidence)},${q(host)},${q(record.sourceId)},${q(record.officialUrl)},${q(versionId)},1,${q(record.lastVerified)});`);
  statements.push(`INSERT OR IGNORE INTO content_versions (id,record_id,version_number,payload_json,change_summary,source_id) VALUES (${q(versionId)},${q(record.id)},1,${q(JSON.stringify(record))},'Imported from the verified INGENIUM+ v1.5 dataset',${q(record.sourceId)});`);
  const embeddingInput = JSON.stringify(record);
  statements.push(`INSERT OR REPLACE INTO content_embeddings (id,target_type,target_id,provider,model,dimensions,input_hash,vector_json) VALUES (${q(`embedding_seed_${record.id}`)},'content_record',${q(record.id)},${q(embedding.EMBEDDING_PROVIDER)},${q(embedding.EMBEDDING_MODEL)},${embedding.EMBEDDING_DIMENSIONS},${q(createHash("sha256").update(embeddingInput).digest("hex"))},${q(JSON.stringify(embedding.embedText(embeddingInput)))});`);
}

for (const relationship of data.networkRelationships) {
  statements.push(`INSERT OR IGNORE INTO content_relationships (id,source_record_id,target_record_id,type,label,explanation,classification) VALUES (${q(relationship.id)},${q(relationship.source)},${q(relationship.target)},${q(relationship.type)},${q(relationship.label)},${q(relationship.explanation)},${q(relationship.dataClassification ?? "verified")});`);
}

for (const source of data.evidenceSources.filter((item) => item.url?.startsWith("https://ingenium-university.eu/"))) {
  statements.push(`INSERT OR IGNORE INTO refresh_schedules (id,source_id,cadence,enabled,next_run_at) VALUES (${q(`refresh_schedule_${source.id}`)},${q(source.id)},'weekly',${bool(true)},CURRENT_TIMESTAMP);`);
}

statements.push("INSERT OR REPLACE INTO system_state (key,value_json,updated_at) VALUES ('dataset_version','{\"version\":\"1.5.1\",\"seed\":\"v1.5-static\"}',CURRENT_TIMESTAMP);");
statements.push("COMMIT;");
await mkdir(new URL("../db/seed/", import.meta.url), { recursive: true });
const generatedSeed = `${statements.join("\n")}\n`;
await writeFile(new URL("../db/seed/v151.sql", import.meta.url), generatedSeed);
console.log(`Generated runtime seed for ${data.records.length} records, ${data.networkRelationships.length} relationships and ${data.evidenceSources.length} sources.`);
