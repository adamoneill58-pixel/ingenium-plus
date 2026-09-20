import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, requireSession } from "@/lib/v151/api";
import { runScheduledRefresh } from "@/lib/v151/refresh-service";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "manual_refresh", session.profileId, 10);
    requirePermission(session.roles, "refresh:run");
    return jsonResponse({ results: await runScheduledRefresh(database) });
  } catch (error) { return handleApiError(error); }
}
