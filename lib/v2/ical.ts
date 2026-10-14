import type { CalendarEntry } from "./domain";
import { validDay } from "./domain";
const escapeText = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
function fold(line: string): string {
  let out = "",
    current = "",
    bytes = 0;
  for (const c of line) {
    const n = new TextEncoder().encode(c).length;
    if (bytes + n > 75) {
      out += current + "\r\n";
      current = " ";
      bytes = 1;
    }
    current += c;
    bytes += n;
  }
  return out + current;
}
export function makeCalendar(
  entry: CalendarEntry,
  alarmDays?: number,
  now = new Date(),
): string {
  if (entry.conflict || entry.precision === "approximate")
    throw new Error(
      "A conflicting or approximate date cannot be exported as confirmed.",
    );
  if (entry.precision === "instant") {
    try {
      if (!entry.timezone) throw new Error();
      new Intl.DateTimeFormat("en", { timeZone: entry.timezone }).format(
        new Date(entry.start),
      );
    } catch {
      throw new Error("A timed event requires a valid confirmed timezone.");
    }
  }
  if (!/^https:\/\//.test(entry.sourceUrl) || /[\r\n]/.test(entry.sourceUrl))
    throw new Error("An HTTPS source is required.");
  if (
    alarmDays !== undefined &&
    (!Number.isInteger(alarmDays) || alarmDays < 0 || alarmDays > 30)
  )
    throw new Error("Reminder must be 0–30 days.");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//INGENIUM+//Campus Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${encodeURIComponent(entry.id)}@ingenium-plus`,
    `DTSTAMP:${now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z")}`,
  ];
  if (entry.precision === "day") {
    if (
      !validDay(entry.start) ||
      !validDay(entry.end ?? entry.start) ||
      (entry.end ?? entry.start) < entry.start
    )
      throw new Error("Invalid date range.");
    const end = new Date(`${entry.end ?? entry.start}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    lines.push(
      `DTSTART;VALUE=DATE:${entry.start.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replace(/-/g, "")}`,
    );
  } else {
    if (
      !/(Z|[+-]\d{2}:\d{2})$/.test(entry.start) ||
      !Number.isFinite(Date.parse(entry.start))
    )
      throw new Error("A timestamp needs an explicit UTC offset.");
    const end = entry.end ?? entry.start;
    if (
      !/(Z|[+-]\d{2}:\d{2})$/.test(end) ||
      !Number.isFinite(Date.parse(end)) ||
      Date.parse(end) < Date.parse(entry.start)
    )
      throw new Error("Invalid timestamp range.");
    const stamp = (v: string) =>
      new Date(v)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    lines.push(`DTSTART:${stamp(entry.start)}`, `DTEND:${stamp(end)}`);
  }
  lines.push(
    `SUMMARY:${escapeText(entry.title)}`,
    `DESCRIPTION:${escapeText(`${entry.sample ? "Fictional sample. " : ""}Check the official source before applying. ${entry.precision === "day" && entry.kind !== "activity" && !entry.timezone ? "Date only; exact closing time/timezone not supplied. " : ""}Downloaded files do not update automatically.`)}`,
    `URL:${entry.sourceUrl}`,
  );
  if (alarmDays !== undefined)
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(entry.title)}`,
      `TRIGGER:-P${alarmDays}D`,
      "END:VALARM",
    );
  lines.push("END:VEVENT", "END:VCALENDAR", "");
  return lines.map(fold).join("\r\n");
}
