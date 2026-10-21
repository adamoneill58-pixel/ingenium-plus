import { requirePermission } from "@/lib/v151/authorization";
import { handleApiError, jsonResponse, requireSession } from "@/lib/v151/api";

export async function GET() {
  try {
    const { database, session } = await requireSession();
    requirePermission(session.roles, "data-health:read");
    const [records, proposals, documents, ingestion, refreshes, recommendations, dueSources, closingDeadlines, staleIndexes] = await Promise.all([
      database.prepare(`SELECT COUNT(*) AS total, SUM(is_published) AS published,
        SUM(CASE WHEN last_verified_at IS NULL THEN 1 ELSE 0 END) AS unverified,
        SUM(CASE WHEN is_published=1 AND source_id IS NULL THEN 1 ELSE 0 END) AS withoutProvenance,
        SUM(CASE WHEN is_published=1 AND last_verified_at IS NOT NULL AND last_verified_at < date('now','-180 days') THEN 1 ELSE 0 END) AS stale
        FROM content_records`).first(),
      database.prepare("SELECT status, COUNT(*) AS count FROM proposed_changes GROUP BY status").all(),
      database.prepare("SELECT scan_status AS scanStatus, review_status AS reviewStatus, COUNT(*) AS count FROM documents GROUP BY scan_status, review_status").all(),
      database.prepare("SELECT stage,status,COUNT(*) AS count,MAX(last_error) AS latestError FROM ingestion_jobs GROUP BY stage,status").all(),
      database.prepare("SELECT status, COUNT(*) AS count, MAX(completed_at) AS latest FROM refresh_runs GROUP BY status").all(),
      database.prepare("SELECT recommendation_type AS type, COUNT(*) AS runs, MAX(created_at) AS latest FROM recommendation_runs GROUP BY recommendation_type").all(),
      database.prepare("SELECT es.id,es.title,rs.next_run_at AS nextRunAt,rs.last_success_at AS lastSuccessAt FROM refresh_schedules rs JOIN evidence_sources es ON es.id=rs.source_id WHERE rs.enabled=1 AND (rs.next_run_at IS NULL OR rs.next_run_at<=CURRENT_TIMESTAMP) ORDER BY COALESCE(rs.next_run_at,'1970-01-01') LIMIT 20").all(),
      database.prepare("SELECT id,title,deadline FROM collaboration_calls WHERE status='published' AND deadline BETWEEN date('now') AND date('now','+30 days') ORDER BY deadline LIMIT 20").all(),
      database.prepare(`SELECT cr.id,cr.title,cr.updated_at AS updatedAt,ce.updated_at AS embeddingUpdatedAt FROM content_records cr
        LEFT JOIN content_embeddings ce ON ce.target_type='content_record' AND ce.target_id=cr.id
        WHERE cr.is_published=1 AND (ce.id IS NULL OR ce.updated_at<cr.updated_at) ORDER BY cr.updated_at DESC LIMIT 20`).all(),
    ]);
    return jsonResponse({ records, proposals: proposals.results, documents: documents.results, ingestion: ingestion.results, refreshes: refreshes.results,
      recommendations: recommendations.results, dueSources: dueSources.results, closingDeadlines: closingDeadlines.results, staleIndexes: staleIndexes.results });
  } catch (error) { return handleApiError(error); }
}
