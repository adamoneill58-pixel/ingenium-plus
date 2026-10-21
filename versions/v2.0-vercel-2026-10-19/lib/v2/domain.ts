import type { Entity } from "../data";
import { CLOSING_SOON_DAYS } from "./features";
export type Availability = "open" | "closed" | "unknown";
export interface CalendarEntry {
  id: string;
  recordId: string;
  title: string;
  kind:
    | "activity"
    | "deadline"
    | "application_window"
    | "nomination"
    | "online_component";
  start: string;
  end?: string;
  precision: "day" | "instant" | "approximate";
  timezone?: string;
  dateLabel?: string;
  sourceUrl: string;
  sample?: boolean;
  conflict?: boolean;
  hostId?: string;
}
export function validDay(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function availability(
  record: Entity,
  today = new Date().toISOString().slice(0, 10),
) {
  const conflict =
    ((!record.availabilityStatus || record.availabilityStatus === "unknown") &&
      (record.statusOverride === "Verification required" ||
        record.status === "Verification required")) ||
    Boolean(record.sourceConflict);
  if (conflict)
    return {
      value: "unknown" as Availability,
      label: "Status unknown",
      conflict: true,
    };
  if (
    (validDay(record.applicationDeadline ?? "") &&
      record.applicationDeadline! < today) ||
    (record.availabilityStatus !== "open" &&
      ["Closed", "Past", "Historical", "Archived", "Completed"].includes(
        record.status,
      ))
  )
    return {
      value: "closed" as Availability,
      label: "Closed",
      conflict: false,
    };
  if (record.applicationOpenDate && record.applicationOpenDate > today)
    return {
      value: "unknown" as Availability,
      label: "Status unknown",
      conflict: false,
    };
  const value: Availability =
    record.availabilityStatus ??
    (record.applicationDeadline && validDay(record.applicationDeadline)
      ? "open"
      : "unknown");
  const days =
    record.applicationDeadline && validDay(record.applicationDeadline)
      ? (Date.parse(record.applicationDeadline) - Date.parse(today)) / 86400000
      : Infinity;
  return {
    value,
    label:
      value === "open" && days >= 0 && days <= CLOSING_SOON_DAYS
        ? "Closing soon"
        : value === "open"
          ? "Open"
          : value === "closed"
            ? "Closed"
            : "Status unknown",
    conflict: false,
  };
}
export function calendarEntries(records: Entity[]): CalendarEntry[] {
  return records.flatMap((r) => {
    if (!r.officialUrl?.startsWith("https://") || r.type === "university")
      return [];
    const common = {
      recordId: r.id,
      title: r.title,
      sourceUrl: r.officialUrl,
      hostId: r.hostUniversityId,
      sample: r.dataClassification === "sample",
      conflict: availability(r).conflict,
    };
    const entries: CalendarEntry[] = [];
    if (
      r.startDate &&
      r.activityDatePrecision &&
      validDay(r.startDate) &&
      (!r.endDate || validDay(r.endDate))
    )
      entries.push({
        ...common,
        id: `${r.id}-activity`,
        kind: "activity",
        start: r.startDate,
        end: r.endDate,
        precision: r.activityDatePrecision,
        dateLabel: r.dateLabel,
      });
    if (r.applicationDeadline && validDay(r.applicationDeadline))
      entries.push({
        ...common,
        id: `${r.id}-deadline`,
        title: `Application deadline · ${r.title}`,
        kind: "deadline",
        start: r.applicationDeadline,
        precision: "day",
        timezone: r.deadlineTimezone,
      });
    return entries;
  });
}
export interface DiscoveryFilters {
  query?: string;
  type?: string;
  university?: string;
  delivery?: string;
  level?: string;
  language?: string;
  status?: string;
  theme?: string;
  funding?: string;
  deadline?: string;
}
const synonyms: Record<string, string[]> = {
  exchange: ["mobility", "bip"],
  abroad: ["mobility", "bip"],
  online: ["online", "virtual", "distance", "remote"],
  ai: ["artificial intelligence", "ai"],
  business: ["entrepreneurship", "business"],
  funded: ["funding", "funded", "grant"],
};
export function discover(
  records: Entity[],
  filters: DiscoveryFilters,
  today?: string,
): Entity[] {
  const terms = (filters.query ?? "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return records
    .filter((r) => {
      const a = availability(r, today);
      const text = [
        r.title,
        r.studentSummary,
        ...r.themes,
        ...(r.aliases ?? []),
        r.deliveryMode,
        r.funding,
      ]
        .join(" ")
        .toLowerCase();
      return (
        r.type !== "student" &&
        terms.every((t) =>
          (synonyms[t] ?? [t]).some((s) =>
            s.length <= 2
              ? new RegExp(
                  `\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                  "i",
                ).test(text)
              : text.includes(s),
          ),
        ) &&
        (!filters.type || r.type === filters.type) &&
        (!filters.university ||
          r.id === filters.university ||
          r.universityIds.includes(filters.university)) &&
        (!filters.delivery ||
          (filters.delivery === "online"
            ? /online|virtual|distance|remote/i.test(r.deliveryMode ?? "")
            : /physical|in.person|blended|campus/i.test(
                r.deliveryMode ?? "",
              ))) &&
        (!filters.level ||
          [...(r.studyLevels ?? []), r.academicLevel ?? ""].some((s) =>
            s.toLowerCase().includes(filters.level!.toLowerCase()),
          )) &&
        (!filters.language ||
          [...(r.languages ?? []), r.language ?? ""].some((s) =>
            s.toLowerCase().includes(filters.language!.toLowerCase()),
          )) &&
        (!filters.status || a.value === filters.status) &&
        (!filters.theme || r.themes.includes(filters.theme)) &&
        (!filters.funding ||
          Boolean(
            r.funding &&
            /funded|grant|scholarship|financial support|erasmus/i.test(
              r.funding,
            ) &&
            !/not funded|no funding|unfunded/i.test(r.funding),
          )) &&
        (!filters.deadline ||
          Boolean(
            r.applicationDeadline &&
            r.applicationDeadline >=
              (today ?? new Date().toISOString().slice(0, 10)) &&
            !a.conflict,
          ))
      );
    })
    .sort((a, b) => {
      const weight = (r: Entity) =>
        ({ open: 0, unknown: 1, closed: 2 })[availability(r, today).value];
      return (
        weight(a) - weight(b) ||
        (a.applicationDeadline ?? "9999").localeCompare(
          b.applicationDeadline ?? "9999",
        ) ||
        a.title.localeCompare(b.title)
      );
    });
}
export function fit(record: Entity, interests: string[], today?: string) {
  const a = availability(record, today);
  if (
    a.value === "closed" ||
    a.conflict ||
    record.type === "university" ||
    record.type === "student"
  )
    return null;
  const matched = interests.filter((t) =>
    [record.title, record.studentSummary, ...record.themes]
      .join(" ")
      .toLowerCase()
      .includes(t.toLowerCase()),
  );
  if (!matched.length) return null;
  return {
    record,
    reasons: matched.map((t) => `Connected to your interest in ${t}`),
    checks: [
      ...(!record.eligibility ? ["Eligibility needs checking"] : []),
      ...(!record.funding ? ["Funding is not confirmed"] : []),
      ...(a.value === "unknown"
        ? ["Application availability needs checking"]
        : []),
    ],
    score: matched.length,
  };
}

export function allCalendarEntries(
  records: Entity[],
  imported: CalendarEntry[] = [],
) {
  const ids = new Set(imported.map((e) => e.id));
  return [
    ...imported.map((e) => ({
      ...e,
      conflict:
        e.conflict ||
        Boolean(
          records.find((r) => r.id === e.recordId) &&
          availability(records.find((r) => r.id === e.recordId)!).conflict,
        ),
    })),
    ...calendarEntries(records).filter((e) => !ids.has(e.id)),
  ];
}

export function calendarDay(entry: CalendarEntry, end = false): string {
  const value = (end ? entry.end : entry.start) ?? entry.start;
  if (entry.precision !== "instant") return value.slice(0, 10);
  if (!entry.timezone) return value.slice(0, 10);
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: entry.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value.slice(0, 10);
  }
}
