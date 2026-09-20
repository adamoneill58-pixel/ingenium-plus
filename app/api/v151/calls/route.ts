import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireDatabase, requireSession } from "@/lib/v151/api";
import { createCall } from "@/lib/v151/repository";
import { validateCallPayload } from "@/lib/v151/validation";

export async function GET() {
  try {
    const database = requireDatabase();
    const rows = await database.prepare(`SELECT id, organization_id AS organizationId, title, summary, description, call_type AS callType,
      disciplines_json AS disciplines, methods_json AS methods, skills_offered_json AS skillsOffered, skills_sought_json AS skillsSought,
      methods_offered_json AS methodsOffered, methods_sought_json AS methodsSought, facilities_offered_json AS facilitiesOffered,
      facilities_sought_json AS facilitiesSought, needs_json AS needs, eligibility_json AS eligibility, languages_json AS languages,
      countries_json AS countries, delivery_mode AS deliveryMode, deadline,
      CASE WHEN deadline IS NOT NULL AND deadline < date('now') THEN 'closed' ELSE status END AS status,
      source_url AS sourceUrl, updated_at AS updatedAt FROM collaboration_calls
      WHERE status='published' AND (deadline IS NULL OR deadline >= date('now'))
      ORDER BY CASE WHEN deadline IS NULL THEN 1 ELSE 0 END, deadline, title`).all();
    return jsonResponse({ calls: rows.results });
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "call_submission", session.profileId, 30);
    requirePermission(session.roles, "call:draft");
    const callId = await createCall(database, session.profileId, validateCallPayload(await readJson(request)));
    return jsonResponse({ callId, status: "pending_review" }, 201);
  } catch (error) { return handleApiError(error); }
}
