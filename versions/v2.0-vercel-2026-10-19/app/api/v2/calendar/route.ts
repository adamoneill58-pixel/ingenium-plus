import { getRuntimeDataset } from "@/lib/v151/runtime-data";
import { allCalendarEntries } from "@/lib/v2/domain";
import { makeCalendar } from "@/lib/v2/ical";
import samples from "@/data/samples/calendar.sample.json";
import type { CalendarEntry } from "@/lib/v2/domain";
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const d = await getRuntimeDataset();
  const entries = allCalendarEntries(d.records, d.calendarEvents);
  const entry = [...entries, ...(samples as CalendarEntry[])].find(
    (e) => e.id === p.get("id"),
  );
  if (!entry)
    return Response.json(
      { error: "Calendar entry not found" },
      { status: 404 },
    );
  try {
    const alarm = p.has("alarm") ? Number(p.get("alarm")) : undefined;
    const text = makeCalendar(entry, alarm);
    return new Response(text, {
      headers: {
        "content-type": "text/calendar;charset=utf-8",
        "content-disposition": `attachment; filename="${entry.id.replace(/[^a-z0-9_-]/gi, "_")}.ics"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Invalid event" },
      { status: 422 },
    );
  }
}
