import { handleApiError, jsonResponse, requireSession } from "@/lib/v151/api";

export async function GET() {
  try {
    const { database, session } = await requireSession();
    const [proposals, calls, documents] = await Promise.all([
      database.prepare("SELECT id,target_type AS targetType,target_id AS targetId,rationale,status,submitted_at AS submittedAt,reviewed_at AS reviewedAt FROM proposed_changes WHERE proposed_by=? ORDER BY submitted_at DESC").bind(session.profileId).all(),
      database.prepare("SELECT id,title,status,deadline,updated_at AS updatedAt FROM collaboration_calls WHERE owner_profile_id=? ORDER BY updated_at DESC").bind(session.profileId).all(),
      database.prepare("SELECT id,original_name AS originalName,scan_status AS scanStatus,review_status AS reviewStatus,created_at AS createdAt FROM documents WHERE uploaded_by=? ORDER BY created_at DESC").bind(session.profileId).all(),
    ]);
    return jsonResponse({ proposals: proposals.results, calls: calls.results, documents: documents.results });
  } catch (error) { return handleApiError(error); }
}
