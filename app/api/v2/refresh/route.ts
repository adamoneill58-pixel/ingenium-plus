import { requirePilotTeam } from "@/lib/v2/team";
import { assertSameOrigin } from "@/lib/v151/api";
import { refreshAvailability } from "@/lib/v2/status-refresh";
import { apiFailure } from "@/lib/v2/public-api";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw Object.assign(new Error("Origin required"), { status: 403 });
    const { database } = await requirePilotTeam(request, true);
    return Response.json(
      { results: await refreshAvailability(database) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    return apiFailure(e);
  }
}
