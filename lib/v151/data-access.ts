import { evidenceSources as staticSources, networkRelationships as staticRelationships, records as staticRecords } from "@/lib/v15-data";
import type { Entity, Relationship, Source } from "@/lib/data";

const parse = <T>(value: string | null | undefined, fallback: T): T => {
  try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

export async function getPublishedDataset(database?: D1Database): Promise<{ records: Entity[]; relationships: Relationship[]; sources: Source[]; storage: "database" | "static-fallback" }> {
  if (!database) return { records: staticRecords, relationships: staticRelationships, sources: staticSources, storage: "static-fallback" };
  try {
    const [recordRows, relationshipRows, sourceRows] = await Promise.all([
      database.prepare(`SELECT cr.id, cr.slug, cr.type, cr.title, cr.summary, cr.status, cr.classification, cr.confidence, cr.owner_organization_id AS ownerOrganizationId,
        cr.source_id AS sourceId, cr.official_url AS officialUrl, cr.last_verified_at AS lastVerifiedAt, cv.payload_json AS payloadJson
        FROM content_records cr LEFT JOIN content_versions cv ON cv.id = cr.published_version_id WHERE cr.is_published = 1 ORDER BY cr.title`).all<Record<string, string | null>>(),
      database.prepare("SELECT id, source_record_id AS source, target_record_id AS target, type, label, explanation, classification FROM content_relationships ORDER BY id").all<Record<string, string>>(),
      database.prepare("SELECT id, title, kind, url, publisher, published_at AS published, verified_at AS verifiedAt, notes FROM evidence_sources ORDER BY title").all<Record<string, string | null>>(),
    ]);
    if (!recordRows.results.length) return { records: staticRecords, relationships: staticRelationships, sources: staticSources, storage: "static-fallback" };
    const records = recordRows.results.map((row) => {
      const payload = parse<Partial<Entity>>(row.payloadJson, {});
      return {
        ...payload, id: row.id!, slug: row.slug!, type: row.type as Entity["type"], title: row.title!,
        studentSummary: row.summary!, status: row.status as Entity["status"], dataClassification: row.classification as Entity["dataClassification"],
        confidence: row.confidence as Entity["confidence"], sourceId: row.sourceId ?? "database", officialUrl: row.officialUrl ?? undefined,
        lastVerified: row.lastVerifiedAt ?? "Verification required", universityIds: Array.isArray(payload.universityIds) ? payload.universityIds : [],
        themes: Array.isArray(payload.themes) ? payload.themes : [],
      };
    }) as Entity[];
    const relationships = relationshipRows.results.map((row) => ({ ...row, dataClassification: row.classification as Relationship["dataClassification"] })) as Relationship[];
    const sources = sourceRows.results.map((row) => ({ id: row.id!, title: row.title!, kind: row.kind!, url: row.url ?? undefined, publisher: row.publisher ?? undefined, published: row.published ?? undefined, verifiedAt: row.verifiedAt ?? undefined, notes: row.notes ?? undefined })) as Source[];
    return { records, relationships, sources, storage: "database" };
  } catch {
    return { records: staticRecords, relationships: staticRelationships, sources: staticSources, storage: "static-fallback" };
  }
}
