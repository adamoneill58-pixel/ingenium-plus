import { PILOT_CAMPUSES } from "./features";
import { questions, roles } from "./survey";
export const events = [
  "page_view",
  "search",
  "node_open",
  "recommendation_click",
  "calendar_export",
  "useful_yes",
  "useful_no",
] as const;
export function isoWeek(value = new Date()): string {
  const d = new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  const week = Math.ceil(
    ((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7,
  );
  return `${year}-W${String(week).padStart(2, "0")}`;
}
function object(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw new Error("Expected an object");
  return v as Record<string, unknown>;
}
export function validateEvent(value: unknown, contentIds: Set<string>) {
  const v = object(value);
  if (
    Object.keys(v).some((k) => !["event", "target", "campus"].includes(k)) ||
    !events.includes(v.event as (typeof events)[number])
  )
    throw new Error("Unsupported event or fields");
  const event = String(v.event),
    target = typeof v.target === "string" ? v.target : "",
    campus = typeof v.campus === "string" ? v.campus : "";
  if (
    campus &&
    (!(PILOT_CAMPUSES as readonly string[]).includes(campus) ||
      event !== "page_view" ||
      target !== `/pilot/${campus}`)
  )
    throw new Error("Campus is only permitted on the matching landing visit");
  if (event === "search") {
    if (!["0", "1-10", "11-50", "51+"].includes(target))
      throw new Error("Search stores a result-count bucket only");
  } else if (event === "page_view") {
    if (
      ![
        "/",
        "/explore",
        "/calendar",
        "/my-campus",
        "/learning",
        "/collaborate",
        "/universities",
        "/survey",
        "/about-pilot",
        "/records/[slug]",
        ...PILOT_CAMPUSES.map((c) => `/pilot/${c}`),
      ].includes(target)
    )
      throw new Error("Unknown route pattern");
    if (target.startsWith("/pilot/") && !campus)
      throw new Error("Landing campus is required");
  } else if (!contentIds.has(target))
    throw new Error("Target must be published content");
  return { event, target, campus };
}
export async function storeEvent(
  database: D1Database,
  value: unknown,
  contentIds: Set<string>,
  now = new Date(),
) {
  const e = validateEvent(value, contentIds);
  await database
    .prepare(
      "INSERT INTO usage_daily_counts(event_type,target_id,day,campus,count) VALUES (?,?,?,?,1) ON CONFLICT(event_type,target_id,day,campus) DO UPDATE SET count=count+1",
    )
    .bind(e.event, e.target, now.toISOString().slice(0, 10), e.campus)
    .run();
}
export function surveyRows(value: unknown, now = new Date()) {
  const answers = object(value);
  if (
    Object.keys(answers).some((k) => !questions.some((q) => String(q.id) === k))
  )
    throw new Error("Unknown survey field");
  const role = String(answers["2"] ?? "");
  if (!roles.includes(role)) throw new Error("Choose a role");
  const week = isoWeek(now);
  const counts: {
    question: number;
    option: string;
    week: string;
    role: string;
  }[] = [];
  const texts: {
    question: number;
    week: string;
    text: string;
    flagged: number;
  }[] = [];
  for (const q of questions) {
    const a = answers[String(q.id)];
    if (q.id === 3 && role !== "Student") {
      if (a) throw new Error("Study level is for students only");
      continue;
    }
    if (q.id <= 11) {
      if (typeof a !== "string" || !q.options.includes(a))
        throw new Error(`Check question ${q.id}`);
      counts.push({
        question: q.id,
        option: a,
        week,
        role: q.id <= 2 ? "" : role,
      });
    } else {
      if (a === undefined || a === "") continue;
      if (typeof a !== "string" || a.length > 500)
        throw new Error("Free text must be at most 500 characters");
      texts.push({ question: q.id, week, text: a.trim(), flagged: 1 });
    }
  }
  return { counts, texts };
}
export async function storeSurvey(
  database: D1Database,
  value: unknown,
  now = new Date(),
) {
  const rows = surveyRows(value, now);
  const statements = rows.counts.map((r) =>
    database
      .prepare(
        "INSERT INTO survey_answer_counts(question,option,iso_week,role,count) VALUES (?,?,?,?,1) ON CONFLICT(question,option,iso_week,role) DO UPDATE SET count=count+1",
      )
      .bind(r.question, r.option, r.week, r.role),
  );
  for (const r of rows.texts)
    statements.push(
      database
        .prepare(
          "INSERT INTO survey_free_text(id,question,iso_week,text,flagged) VALUES (?,?,?,?,1)",
        )
        .bind(`text_${crypto.randomUUID()}`, r.question, r.week, r.text),
    );
  await database.batch(statements);
}
export interface ReportRow {
  week: string;
  group: string;
  target: string;
  count: number | string;
}
export function suppress(rows: ReportRow[]): ReportRow[] {
  const result = rows.map((r) => ({ ...r }));
  const groups = new Map<string, ReportRow[]>();
  for (const r of result) {
    const k = `${r.week}:${r.group}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  for (const group of groups.values()) {
    const small = group.filter((r) => Number(r.count) < 5);
    if (small.length) {
      for (const r of small) r.count = "<5";
      const secondary = group
        .filter((r) => typeof r.count === "number")
        .sort((a, b) => Number(a.count) - Number(b.count))[0];
      if (secondary) secondary.count = "suppressed";
    }
  }
  return result;
}
export function reportCsv(rows: ReportRow[]) {
  const quote = (v: unknown) =>
    `"${String(v)
      .replace(/^[=+@-]/, "'$&")
      .replace(/"/g, '""')}"`;
  return [
    ["ISO week", "Metric", "Target", "Count"],
    ...suppress(rows).map((r) => [r.week, r.group, r.target, r.count]),
  ]
    .map((r) => r.map(quote).join(","))
    .join("\r\n");
}
