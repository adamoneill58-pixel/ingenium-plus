import { asObject } from "@/lib/v151/validation";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { saveMode } from "@/lib/v151/repository";

export async function GET() {
  try { return jsonResponse((await requireSession()).session); } catch (error) { return handleApiError(error); }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "mode_change", session.profileId, 120);
    const input = asObject(await readJson(request));
    if (input.mode !== "student" && input.mode !== "staff") return jsonResponse({ error: "mode must be student or staff" }, 400);
    if (input.mode === "staff" && !session.roles.some((role) => ["staff", "contributor", "reviewer", "administrator"].includes(role))) {
      return jsonResponse({ error: "A verified staff membership is required for Staff mode." }, 403);
    }
    await saveMode(database, session.profileId, input.mode);
    return jsonResponse({ ...session, mode: input.mode });
  } catch (error) { return handleApiError(error); }
}
