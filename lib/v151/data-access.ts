import type { CalendarEntry } from "../v2/domain";
import { getRuntimeBindings } from "./bindings";
async function fallback() {
  const allowed =
    getRuntimeBindings().ALLOW_STATIC_FALLBACK === "true" ||
    process.env.NODE_ENV !== "production";
  if (!allowed)
    return {
      records: [],
      relationships: [],
      sources: [],
      calendarEvents: [],
      storage: "unavailable" as const,
    };
  return {...await getPublicReleaseSnapshot(), storage:"static-fallback" as const};
}
export async function getPublicReleaseSnapshot(): Promise<{records:Entity[]; relationships:Relationship[]; sources:Source[]; calendarEvents:CalendarEntry[]; storage:"release-snapshot"}> {
  const { default: d } = await import("../../data/catalogue/v2.json");
  const records = (d.records as Entity[]).filter((r) => r.type !== "student");
  const ids = new Set(records.map((r) => r.id));
  return {
    records,
    calendarEvents:
      (d as unknown as { calendarEvents?: CalendarEntry[] }).calendarEvents ??
      [],
    relationships: (d.relationships as Relationship[]).filter(
      (r) => ids.has(r.source) && ids.has(r.target),
    ),
    sources: (d.sources as Source[]).map(({ notes: _notes, ...s }) => {
      void _notes;
      return s;
    }),
    storage: "release-snapshot" as const,
  };
}
import type { Entity, Relationship, Source } from "@/lib/data";

const parse = <T>(value: string | null | undefined, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export async function getPublishedDataset(database?: D1Database): Promise<{
  records: Entity[];
  relationships: Relationship[];
  sources: Source[];
  calendarEvents: CalendarEntry[];
  storage: "database" | "static-fallback" | "unavailable";
}> {
  if (!database) return fallback();
  try {
    const [recordRows, relationshipRows, sourceRows, calendarRows] =
      await Promise.all([
        database
          .prepare(
            `SELECT cr.id, cr.slug, cr.type, cr.title, cr.summary, cr.status, cr.classification, cr.confidence, cr.owner_organization_id AS ownerOrganizationId,
        cr.source_id AS sourceId, cr.official_url AS officialUrl, cr.last_verified_at AS lastVerifiedAt,cr.availability_status AS availabilityStatus,cr.deadline AS deadline,cr.last_checked AS lastChecked,cr.last_check_attempt AS lastCheckAttempt,cr.check_error AS checkError,cr.source_conflict AS sourceConflict, cv.payload_json AS payloadJson
        FROM content_records cr LEFT JOIN content_versions cv ON cv.id = cr.published_version_id WHERE cr.is_published = 1 AND cr.type <> 'student' ORDER BY cr.title`,
          )
          .all<Record<string, string | null>>(),
        database
          .prepare(
            "SELECT r.id,r.source_record_id AS source,r.target_record_id AS target,r.type,r.label,r.explanation,r.classification FROM content_relationships r JOIN content_records a ON a.id=r.source_record_id AND a.is_published=1 AND a.type<>'student' JOIN content_records b ON b.id=r.target_record_id AND b.is_published=1 AND b.type<>'student' ORDER BY r.id",
          )
          .all<Record<string, string>>(),
        database
          .prepare(
            "SELECT id, title, kind, url, publisher, published_at AS published, verified_at AS verifiedAt, notes FROM evidence_sources ORDER BY title",
          )
          .all<Record<string, string | null>>(),
        database
          .prepare(
            "SELECT e.id,e.record_id AS recordId,cr.title,e.kind,e.start_date AS start,e.end_date AS end,e.precision,e.timezone,e.source_url AS sourceUrl,e.date_label AS dateLabel,cr.source_conflict AS conflict FROM calendar_events e JOIN content_records cr ON cr.id=e.record_id WHERE cr.is_published=1 AND cr.type<>'student'",
          )
          .all<CalendarEntry>(),
      ]);
    if (!recordRows.results.length) return fallback();
    const records = recordRows.results.map((row) => {
      const payload = parse<Partial<Entity>>(row.payloadJson, {});
      return {
        ...payload,
        id: row.id!,
        slug: row.slug!,
        type: row.type as Entity["type"],
        title: row.title!,
        studentSummary: row.summary!,
        status: row.status as Entity["status"],
        dataClassification: row.classification as Entity["dataClassification"],
        statusOverride: Number(row.sourceConflict)
          ? "Verification required"
          : row.availabilityStatus === "open"
            ? undefined
            : payload.statusOverride,
        confidence: row.confidence as Entity["confidence"],
        sourceId: row.sourceId ?? "database",
        officialUrl: row.officialUrl ?? undefined,
        lastVerified: row.lastVerifiedAt ?? "Verification required",
        availabilityStatus:
          row.availabilityStatus as Entity["availabilityStatus"],
        lastChecked: row.lastChecked ?? undefined,
        lastCheckAttempt: row.lastCheckAttempt ?? undefined,
        lastCheckError: row.checkError
          ? "The latest source check failed; verify before acting."
          : undefined,
        sourceConflict: Boolean(Number(row.sourceConflict)),
        applicationDeadline: row.deadline ?? payload.applicationDeadline,
        universityIds: Array.isArray(payload.universityIds)
          ? payload.universityIds
          : [],
        themes: Array.isArray(payload.themes) ? payload.themes : [],
      };
    }) as Entity[];
    const publicSourceIds = new Set(
      records.flatMap((r) => [r.sourceId, ...(r.sourceIds ?? [])]),
    );
    const relationships = relationshipRows.results.map((row) => ({
      ...row,
      dataClassification:
        row.classification as Relationship["dataClassification"],
    })) as Relationship[];
    const sources = sourceRows.results
      .filter((r) => publicSourceIds.has(r.id!))
      .map((row) => ({
        id: row.id!,
        title: row.title!,
        kind: row.kind!,
        url: row.url ?? undefined,
        publisher: row.publisher ?? undefined,
        published: row.published ?? undefined,
        verifiedAt: row.verifiedAt ?? undefined,
        notes: undefined,
      })) as Source[];
    return {
      records,
      relationships,
      sources,
      calendarEvents: calendarRows.results.map((e) => ({
        ...e,
        hostId: records.find((r) => r.id === e.recordId)?.hostUniversityId,
        conflict: Boolean(e.conflict),
      })),
      storage: "database",
    };
  } catch {
    return fallback();
  }
}
