import { hasPermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, requireDocumentsBucket, requireSession } from "@/lib/v151/api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { database, session } = await requireSession();
    const { id } = await params;
    const document = await database.prepare("SELECT uploaded_by AS uploadedBy,storage_key AS storageKey,original_name AS originalName,mime_type AS mimeType,visibility FROM documents WHERE id=?").bind(id).first<{ uploadedBy: string; storageKey: string; originalName: string; mimeType: string; visibility: string }>();
    if (!document) return jsonResponse({ error: "Document not found" }, 404);
    if (document.uploadedBy !== session.profileId && !hasPermission(session.roles, "document:review")) return jsonResponse({ error: "Document access denied" }, 403);
    const object = await requireDocumentsBucket().get(document.storageKey);
    if (!object) return jsonResponse({ error: "Stored document is unavailable" }, 404);
    return new Response(object.body, { headers: { "content-type": document.mimeType, "content-disposition": `attachment; filename="${document.originalName.replaceAll('"', "")}"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "document_review", session.profileId, 120);
    const { id } = await params;
    if (!hasPermission(session.roles, "document:review")) return jsonResponse({ error: "Document-review permission required" }, 403);
    const input = await request.json() as { decision?: string; reason?: string };
    if (!input.reason?.trim()) return jsonResponse({ error: "A review reason is required" }, 400);
    if (!["approved_private", "approved_alliance", "rejected"].includes(input.decision ?? "")) return jsonResponse({ error: "Unsupported document decision" }, 400);
    const document = await database.prepare("SELECT scan_status AS scanStatus FROM documents WHERE id=?").bind(id).first<{ scanStatus: string }>();
    if (!document) return jsonResponse({ error: "Document not found" }, 404);
    if (input.decision !== "rejected" && document.scanStatus !== "clean") return jsonResponse({ error: "A document cannot be approved until an approved scanner marks it clean." }, 409);
    const reviewStatus = input.decision === "rejected" ? "rejected" : "approved";
    const visibility = input.decision === "approved_alliance" ? "alliance" : "private";
    const documentId = id;
    await database.batch([
      database.prepare("UPDATE documents SET review_status=?,visibility=? WHERE id=?").bind(reviewStatus, visibility, documentId),
      database.prepare("INSERT INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,'document.reviewed','document',?,?)")
        .bind(`audit_${crypto.randomUUID()}`, session.profileId, documentId, JSON.stringify({ decision: input.decision, reason: input.reason.trim(), scanStatus: document.scanStatus })),
    ]);
    return jsonResponse({ reviewed: true, reviewStatus, visibility });
  } catch (error) { return handleApiError(error); }
}
