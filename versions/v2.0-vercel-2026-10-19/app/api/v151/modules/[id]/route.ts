import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { reviseModuleProposal } from "@/lib/v151/repository";
import { validateModulePayload } from "@/lib/v151/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "module_revision", session.profileId, 30);
    requirePermission(session.roles, "module:draft");
    const { id } = await params;
    const result = await reviseModuleProposal(database, session.profileId, id, validateModulePayload(await readJson(request)));
    return jsonResponse({ ...result, status: "pending_review" });
  } catch (error) { return handleApiError(error); }
}
