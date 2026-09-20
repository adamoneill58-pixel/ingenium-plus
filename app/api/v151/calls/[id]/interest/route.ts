import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { asObject, requiredText } from "@/lib/v151/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "call_interest", session.profileId, 20);
    if (!session.roles.some((role) => ["staff", "contributor", "reviewer", "administrator"].includes(role))) return jsonResponse({ error: "Verified staff membership required" }, 403);
    const callId = (await params).id;
    const call = await database.prepare("SELECT id FROM collaboration_calls WHERE id=? AND status='published'").bind(callId).first();
    if (!call) return jsonResponse({ error: "Published call not found" }, 404);
    const input = asObject(await readJson(request));
    const message = requiredText(input, "message", 2_000);
    await database.prepare(`INSERT INTO expressions_of_interest (id,call_id,profile_id,message,status) VALUES (?,?,?,?,'submitted')
      ON CONFLICT(call_id,profile_id) DO UPDATE SET message=excluded.message,status='submitted',created_at=CURRENT_TIMESTAMP`)
      .bind(`interest_${crypto.randomUUID()}`, callId, session.profileId, message).run();
    return jsonResponse({ submitted: true, message: "Interest recorded inside INGENIUM+. No email was sent." }, 201);
  } catch (error) { return handleApiError(error); }
}
