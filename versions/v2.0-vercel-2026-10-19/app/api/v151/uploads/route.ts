import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, requireDocumentsBucket, requireSession } from "@/lib/v151/api";
import { storeQuarantinedUpload } from "@/lib/v151/uploads";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "document_upload", session.profileId, 10);
    requirePermission(session.roles, "upload:create");
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonResponse({ error: "A file field is required" }, 400);
    const result = await storeQuarantinedUpload({
      database, bucket: requireDocumentsBucket(), profileId: session.profileId, file,
      organizationId: typeof form.get("organizationId") === "string" ? String(form.get("organizationId")) : undefined,
      recordId: typeof form.get("recordId") === "string" ? String(form.get("recordId")) : undefined,
      callId: typeof form.get("callId") === "string" ? String(form.get("callId")) : undefined,
    });
    return jsonResponse({ ...result, message: "Stored privately in quarantine. It will not be published until scanning and human review succeed." }, 201);
  } catch (error) { return handleApiError(error); }
}
