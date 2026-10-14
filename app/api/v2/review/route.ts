import { reviewAvailability } from "@/lib/v2/review";
import { requirePilotTeam } from "@/lib/v2/team";
import { apiFailure } from "@/lib/v2/public-api";
import { assertSameOrigin } from "@/lib/v151/api";
export async function GET(request: Request) {
  try {
    const { database } = await requirePilotTeam(request, true);
    const rows = await database
      .prepare(
        "SELECT id,target_id AS targetId,payload_json AS payload,rationale FROM proposed_changes WHERE target_type='availability' AND status='pending'",
      )
      .all();
    const refresh = await database
      .prepare(
        "SELECT value_json FROM system_state WHERE key='v2_status_refresh'",
      )
      .first();
    return Response.json(
      { proposals: rows.results, refresh },
      { headers: { "cache-control": "private,no-store" } },
    );
  } catch (e) {
    return apiFailure(e);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw Object.assign(new Error("Origin required"), { status: 403 });
    const { database, identity } = await requirePilotTeam(request, true);
    const text = await request.text();
    if (text.length > 2000)
      throw Object.assign(new Error("Request too large"), { status: 413 });
    let input: unknown;
    try {
      input = JSON.parse(text);
    } catch {
      throw Object.assign(new Error("Invalid JSON"), { status: 400 });
    }
    return Response.json(
      await reviewAvailability(database, identity.userId, input),
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    return apiFailure(e);
  }
}
