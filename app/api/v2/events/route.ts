import { allCalendarEntries } from "@/lib/v2/domain";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";
import { requireDatabase } from "@/lib/v151/api";
import { validateEvent, storeEvent } from "@/lib/v2/pilot";
import { readPilotBody, apiFailure } from "@/lib/v2/public-api";
export async function POST(request: Request) {
  try {
    const value = await readPilotBody(request);
    const d = await getRuntimeDataset();
    const ids = new Set(d.records.map((r) => r.id));
    for (const e of allCalendarEntries(d.records, d.calendarEvents))
      ids.add(e.id);
    try {
      validateEvent(value, ids);
    } catch {
      return Response.json(
        { error: "Invalid anonymous event" },
        { status: 400 },
      );
    }
    await storeEvent(requireDatabase(), value, ids);
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "no-store" },
    });
  } catch (e) {
    return apiFailure(e);
  }
}
