import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireDatabase, requireSession } from "@/lib/v151/api";
import { createModuleProposal } from "@/lib/v151/repository";
import { validateModulePayload } from "@/lib/v151/validation";

export async function GET() {
  try {
    const database = requireDatabase();
    const rows = await database.prepare("SELECT id, slug, type, title, summary, status, classification, confidence, official_url AS officialUrl, updated_at AS updatedAt FROM content_records WHERE is_published=1 AND type IN ('module','course','microcredential') ORDER BY title").all();
    return jsonResponse({ modules: rows.results });
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "module_submission", session.profileId, 30);
    requirePermission(session.roles, "module:draft");
    const result = await createModuleProposal(database, session.profileId, validateModulePayload(await readJson(request)));
    return jsonResponse({ ...result, status: "pending_review" }, 201);
  } catch (error) { return handleApiError(error); }
}
