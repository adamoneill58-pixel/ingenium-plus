import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { reviewProposal } from "@/lib/v151/repository";
import { asObject, requiredText } from "@/lib/v151/validation";

export async function GET() {
  try {
    const { database, session } = await requireSession();
    requirePermission(session.roles, "proposal:review");
    const proposals = await database.prepare(`SELECT pc.id, pc.target_type AS targetType, pc.target_id AS targetId, pc.proposed_by AS proposedBy,
      p.display_name AS proposedByName, pc.rationale, pc.status, pc.submitted_at AS submittedAt, pc.payload_json AS payloadJson,
      CASE
        WHEN pc.target_type='content_record' THEN (SELECT cv.payload_json FROM content_records cr LEFT JOIN content_versions cv ON cv.id=cr.published_version_id WHERE cr.id=pc.target_id)
        WHEN pc.target_type='call' THEN (SELECT cv.payload_json FROM call_versions cv WHERE cv.call_id=pc.target_id AND cv.is_published=1 LIMIT 1)
        ELSE NULL
      END AS currentPayloadJson
      FROM proposed_changes pc LEFT JOIN profiles p ON p.id=pc.proposed_by
      WHERE pc.status='pending' ORDER BY pc.submitted_at`).all<Record<string, unknown>>();
    const documents = await database.prepare("SELECT id, original_name AS originalName, mime_type AS mimeType, byte_size AS byteSize, scan_status AS scanStatus, review_status AS reviewStatus, created_at AS createdAt FROM documents WHERE review_status='pending' ORDER BY created_at").all();
    const parse = (value: unknown) => { try { return typeof value === "string" ? JSON.parse(value) : null; } catch { return null; } };
    return jsonResponse({ proposals: proposals.results.map((proposal) => ({ ...proposal, proposed: parse(proposal.payloadJson), current: parse(proposal.currentPayloadJson), payloadJson: undefined, currentPayloadJson: undefined })), documents: documents.results });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "review_decision", session.profileId, 120);
    requirePermission(session.roles, "proposal:review");
    const input = asObject(await readJson(request));
    const proposalId = requiredText(input, "proposalId", 160);
    const reason = requiredText(input, "reason", 2_000);
    if (!["approved", "rejected", "changes_requested"].includes(String(input.decision))) return jsonResponse({ error: "decision must be approved, rejected or changes_requested" }, 400);
    return jsonResponse(await reviewProposal(database, session.profileId, proposalId, input.decision as "approved" | "rejected" | "changes_requested", reason));
  } catch (error) { return handleApiError(error); }
}
