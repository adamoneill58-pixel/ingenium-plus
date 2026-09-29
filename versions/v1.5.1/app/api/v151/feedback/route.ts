import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { asObject, optionalText, requiredText } from "@/lib/v151/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "recommendation_feedback", session.profileId, 120);
    requirePermission(session.roles, "feedback:write");
    const input = asObject(await readJson(request));
    const resultId = requiredText(input, "resultId", 180);
    const signal = requiredText(input, "signal", 40);
    if (!["useful", "not_useful", "saved", "dismissed", "contacted", "applied"].includes(signal)) return jsonResponse({ error: "Unsupported feedback signal" }, 400);
    await database.prepare(`INSERT INTO recommendation_feedback (id, result_id, profile_id, signal, comment) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(result_id, profile_id) DO UPDATE SET signal=excluded.signal, comment=excluded.comment, created_at=CURRENT_TIMESTAMP`)
      .bind(`feedback_${crypto.randomUUID()}`, resultId, session.profileId, signal, optionalText(input, "comment", 1_000) ?? null).run();
    return jsonResponse({ saved: true });
  } catch (error) { return handleApiError(error); }
}
