import { CalendarWorkspace } from "@/components/v2/CalendarWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { allCalendarEntries, type CalendarEntry } from "@/lib/v2/domain";
import samples from "@/data/samples/calendar.sample.json";
export const metadata = { title: "Calendar" };
export default async function CalendarPage() {
  const d = await getDiscoveryData();
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">LOOK AHEAD · MAKE A PLAN</span>
        <h1>A year of possibilities.</h1>
        <p>
          Courses, activities and application dates across the European campus.
          Find your next moment to take part.
        </p>
      </header>
      <div className="workspace-banner">
        <strong>Calendar preview</strong>
        <p>
          Dates below come from the existing source-backed research catalogue. A
          direct content route with the official Student Calendar has not yet
          been agreed. Fictional workflow examples are optional and clearly
          labelled.
        </p>
      </div>
      <CalendarWorkspace
        entries={allCalendarEntries(d.records, d.calendarEvents)}
        samples={samples as CalendarEntry[]}
        records={d.records}
      />
    </main>
  );
}
