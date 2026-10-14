import { validDay } from "./domain";
import { getRuntimeBindings } from "../v151/bindings";
// Only explicit, reviewed URLs are eligible. Add a parser fixture with every source.
export const statusSources = [
  {
    recordId: "opportunity-ingenium-ambassadors-2026",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/ingenium-ambassadors-call-2026-2027/",
    year: 2026,
  },
  {
    recordId: "event-final-student-conference-oviedo-2026",
    url: "https://ingenium-university.eu/applications-open-for-the-ingenium-student-conference-in-oviedo/",
    year: 2026,
  },
  {
    recordId: "opportunity-student-tandems-autumn-2026",
    url: "https://ingenium-university.eu/ingenium-linguistic-tandems-student-edition/",
    year: 2026,
  },
];
export function parseAvailability(
  html: string,
  year: number,
  today = new Date().toISOString().slice(0, 10),
) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ");
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const pattern =
    /(?:application deadline|applications? (?:are )?open until|apply by)\s*:?\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(20\d{2}))?/gi;
  const dates = new Set<string>();
  for (const m of text.matchAll(pattern)) {
    const d = `${m[3] ?? year}-${String(months.indexOf(m[2].toLowerCase()) + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    if (validDay(d)) dates.add(d);
  }
  if (dates.size !== 1)
    throw Object.assign(
      new Error(
        dates.size
          ? "Conflicting application dates"
          : "Application date could not be parsed safely",
      ),
      { conflict: dates.size > 1 },
    );
  const deadline = [...dates][0];
  return {
    deadline,
    availability: deadline < today ? ("closed" as const) : ("open" as const),
  };
}
export async function boundedText(response: Response, max = 1024 * 1024) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Empty response");
  const chunks: Uint8Array[] = [];
  let n = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    n += value.length;
    if (n > max) {
      await reader.cancel();
      throw new Error("Source exceeds the response limit");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(n);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder().decode(bytes);
}
export function robotsAllows(text: string, path: string) {
  const groups: { agents: string[]; disallow: string[]; allow: string[] }[] =
    [];
  let group = {
    agents: [] as string[],
    disallow: [] as string[],
    allow: [] as string[],
  };
  let rules = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    if (!line) continue;
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    const k = key.toLowerCase();
    if (k === "user-agent") {
      if (rules) {
        groups.push(group);
        group = { agents: [], disallow: [], allow: [] };
        rules = false;
      }
      group.agents.push(value.toLowerCase());
    } else if (k === "allow" || k === "disallow") {
      rules = true;
      group[k].push(value);
    }
  }
  groups.push(group);
  const specific = groups.filter((g) =>
    g.agents.some((a) => a.includes("ingenium-plus")),
  );
  const relevant = specific.length
    ? specific
    : groups.filter((g) => g.agents.includes("*"));
  let forbidden = 0,
    permitted = 0;
  for (const g of relevant) {
    for (const d of g.disallow)
      if (d && path.startsWith(d)) forbidden = Math.max(forbidden, d.length);
    for (const a of g.allow)
      if (a && path.startsWith(a)) permitted = Math.max(permitted, a.length);
  }
  return forbidden === 0 || permitted >= forbidden;
}
export async function refreshAvailability(
  database: D1Database,
  fetcher: typeof fetch = fetch,
) {
  const results = [];
  let policy = "";
  try {
    const robots = await fetcher("https://ingenium-university.eu/robots.txt", {
      headers: { "user-agent": "INGENIUM-Plus-Status/2.0" },
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!robots.ok && robots.status !== 404)
      throw new Error("Could not verify source access rules");
    policy = robots.ok ? await boundedText(robots, 128000) : "";
  } catch {
    for (const source of statusSources) {
      results.push({ id: source.recordId, status: "failed" });
      await database
        .prepare(
          "UPDATE content_records SET last_check_attempt=CURRENT_TIMESTAMP,check_error='source_access_check_failed' WHERE id=?",
        )
        .bind(source.recordId)
        .run();
    }
    const alert = getRuntimeBindings().ALERT_WEBHOOK_URL;
    if (alert?.startsWith("https://"))
      await fetcher(alert, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service: "INGENIUM+",
          message: "Source access checks failed. Inspect Data Health.",
        }),
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    await database
      .prepare(
        "INSERT OR REPLACE INTO system_state(key,value_json,updated_at) VALUES('v2_status_refresh',?,CURRENT_TIMESTAMP)",
      )
      .bind(JSON.stringify(results))
      .run();
    return results;
  }
  for (const source of statusSources) {
    try {
      await database
        .prepare(
          "UPDATE content_records SET last_check_attempt=CURRENT_TIMESTAMP WHERE id=?",
        )
        .bind(source.recordId)
        .run();
      if (!robotsAllows(policy, new URL(source.url).pathname))
        throw new Error("Source access rules disallow this page");
      const res = await fetcher(source.url, {
        headers: { "user-agent": "INGENIUM-Plus-Status/2.0" },
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Source check returned ${res.status}`);
      const observation = parseAvailability(
        await boundedText(res),
        source.year,
      );
      const current = await database
        .prepare(
          "SELECT availability_status AS availability,deadline,source_conflict AS conflict FROM content_records WHERE id=? AND is_published=1",
        )
        .bind(source.recordId)
        .first<{
          availability: string;
          deadline: string | null;
          conflict: number;
        }>();
      if (!current) continue;
      const changed =
        current.deadline !== observation.deadline ||
        current.availability !== observation.availability;
      const statements = [
        database
          .prepare(
            "UPDATE content_records SET last_checked=CURRENT_TIMESTAMP,check_error=NULL WHERE id=?",
          )
          .bind(source.recordId),
      ];
      // Closure is automatic only from an already-reviewed matching elapsed deadline.
      if (
        !current.conflict &&
        current.deadline === observation.deadline &&
        observation.availability === "closed"
      )
        statements.push(
          database
            .prepare(
              "UPDATE content_records SET availability_status='closed' WHERE id=?",
            )
            .bind(source.recordId),
        );
      else if (changed)
        statements.push(
          database
            .prepare(
              "INSERT INTO proposed_changes(id,target_type,target_id,payload_json,rationale,status) SELECT ?,'availability',?,?,?,'pending' WHERE NOT EXISTS(SELECT 1 FROM proposed_changes WHERE target_type='availability' AND target_id=? AND payload_json=? AND status='pending')",
            )
            .bind(
              `status_${crypto.randomUUID()}`,
              source.recordId,
              JSON.stringify(observation),
              "Official-source availability observation requires independent review",
              source.recordId,
              JSON.stringify(observation),
            ),
        );
      await database.batch(statements);
      results.push({ id: source.recordId, status: "checked" });
    } catch (error) {
      await database
        .prepare(
          "UPDATE content_records SET last_check_attempt=CURRENT_TIMESTAMP,check_error='source_check_failed' WHERE id=?",
        )
        .bind(source.recordId)
        .run();
      if (
        error &&
        typeof error === "object" &&
        "conflict" in error &&
        error.conflict
      )
        await database
          .prepare(
            "UPDATE content_records SET source_conflict=1,availability_status='unknown' WHERE id=?",
          )
          .bind(source.recordId)
          .run();
      results.push({ id: source.recordId, status: "failed" });
    }
  }
  if (results.some((r) => r.status === "failed")) {
    const url = getRuntimeBindings().ALERT_WEBHOOK_URL;
    if (url?.startsWith("https://"))
      await fetcher(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service: "INGENIUM+",
          message:
            "One or more official-source availability checks failed. Inspect Data Health.",
        }),
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
  }
  await database
    .prepare(
      "INSERT OR REPLACE INTO system_state(key,value_json,updated_at) VALUES('v2_status_refresh',?,CURRENT_TIMESTAMP)",
    )
    .bind(JSON.stringify(results))
    .run();
  return results;
}
