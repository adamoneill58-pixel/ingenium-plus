import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { reviseCall } from "@/lib/v151/repository";
import { validateCallPayload } from "@/lib/v151/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "call_revision", session.profileId, 30);
    requirePermission(session.roles, "call:draft");
    const result = await reviseCall(database, session.profileId, (await params).id, validateCallPayload(await readJson(request)));
    return jsonResponse({ ...result, status: "pending_review" });
  } catch (error) { return handleApiError(error); }
}
