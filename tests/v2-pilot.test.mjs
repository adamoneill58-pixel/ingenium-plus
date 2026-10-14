import { retentionPlan } from "../scripts/retention.mjs";
import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createServer } from "vite";
import { buildImportSql, validateDataset } from "../scripts/import-dataset.mjs";
const server = await createServer({
  configFile: false,
  cacheDir: ".vite-v2-test-cache",
  resolve: { alias: { "@": resolve(".") } },
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});
const domain = await server.ssrLoadModule("/lib/v2/domain.ts");
const ical = await server.ssrLoadModule("/lib/v2/ical.ts");
const pilot = await server.ssrLoadModule("/lib/v2/pilot.ts");
const policy = await server.ssrLoadModule("/lib/v2/policy.ts");
const identity = await server.ssrLoadModule("/lib/v2/identity.ts");
const review = await server.ssrLoadModule("/lib/v2/review.ts");
const windowRules = await server.ssrLoadModule("/lib/v2/window.ts");
const refresh = await server.ssrLoadModule("/lib/v2/status-refresh.ts");
const access = await server.ssrLoadModule("/lib/v151/data-access.ts");
after(() => server.close());
const baseSql = await readFile(
  new URL("../drizzle/0000_v151_production.sql", import.meta.url),
  "utf8",
);
const migration = await readFile(
  new URL("../drizzle/0001_v2_pilot.sql", import.meta.url),
  "utf8",
);
const catalogue = JSON.parse(
  await readFile(new URL("../data/catalogue/v2.json", import.meta.url), "utf8"),
);
class Statement {
  constructor(db, sql, args = []) {
    this.db = db;
    this.sql = sql;
    this.args = args;
  }
  bind(...args) {
    return new Statement(this.db, this.sql, args);
  }
  async first() {
    return this.db.prepare(this.sql).get(...this.args) ?? null;
  }
  async all() {
    return {
      results: this.db.prepare(this.sql).all(...this.args),
      success: true,
    };
  }
  async run() {
    return {
      success: true,
      meta: { changes: this.db.prepare(this.sql).run(...this.args).changes },
    };
  }
}
class D1 {
  constructor(db) {
    this.db = db;
  }
  prepare(sql) {
    return new Statement(this.db, sql);
  }
  async batch(statements) {
    this.db.exec("BEGIN");
    try {
      for (const s of statements) await s.run();
      this.db.exec("COMMIT");
      return [];
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
}
function database() {
  const db = new DatabaseSync(":memory:");
  db.exec(baseSql);
  db.exec(migration);
  return { db, d1: new D1(db) };
}
const record = {
  id: "r",
  slug: "r",
  title: "AI online course",
  type: "course",
  studentSummary: "Artificial intelligence, virtual learning",
  themes: ["Artificial intelligence"],
  universityIds: [],
  status: "Open",
  sourceId: "s",
  lastVerified: "2026-10-14",
  confidence: "High",
  officialUrl: "https://example.invalid/course",
};
test("availability separates a running activity from closed applications and flags conflicts", () => {
  assert.equal(
    domain.availability(
      {
        ...record,
        startDate: "2026-10-01",
        endDate: "2026-12-01",
        applicationDeadline: "2026-09-27",
      },
      "2026-10-14",
    ).value,
    "closed",
  );
  assert.equal(domain.availability(record, "2026-10-14").value, "unknown");
  assert.equal(
    domain.availability(
      { ...record, applicationDeadline: "2026-10-18" },
      "2026-10-14",
    ).label,
    "Closing soon",
  );
  assert.equal(
    domain.availability(
      { ...record, sourceConflict: true, applicationDeadline: "2026-12-01" },
      "2026-10-14",
    ).value,
    "unknown",
  );
  assert.equal(domain.fit({ ...record, status: "Closed" }, ["AI"]), null);
});
test("discovery applies hard constraints, synonyms and open-first sorting", () => {
  const closed = {
    ...record,
    id: "closed",
    status: "Closed",
    applicationDeadline: "2026-01-01",
  };
  assert.deepEqual(
    domain
      .discover([closed, record], { query: "ai online", delivery: "online" })
      .map((r) => r.id),
    [],
  );
  const virtual = { ...record, deliveryMode: "Virtual" };
  assert.deepEqual(
    domain
      .discover([virtual], { query: "ai online", delivery: "online" })
      .map((r) => r.id),
    ["r"],
  );
  assert.deepEqual(
    domain.discover([closed, virtual], {}).map((r) => r.id),
    ["r", "closed"],
  );
  assert.equal(domain.discover([virtual], { language: "Finnish" }).length, 0);
});
test("iCalendar handles exclusive all-day end, UTC offsets, alarms and UTF8 line folding", () => {
  const e = {
    id: "test",
    recordId: "r",
    title: "A, B; C\nD " + "é".repeat(70),
    kind: "activity",
    start: "2026-10-24",
    end: "2026-10-25",
    precision: "day",
    sourceUrl: "https://example.invalid/event",
  };
  const text = ical.makeCalendar(e, 7, new Date("2026-10-14T12:00:00Z"));
  assert.match(text, /DTEND;VALUE=DATE:20261026/);
  assert.match(text, /TRIGGER:-P7D/);
  assert.match(text, /SUMMARY:A\\, B\\; C\\nD/);
  for (const line of text.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  assert.throws(
    () => ical.makeCalendar({ ...e, conflict: true }),
    /conflicting/,
  );
  assert.throws(
    () => ical.makeCalendar({ ...e, precision: "approximate" }),
    /approximate/,
  );
  assert.throws(
    () => ical.makeCalendar({ ...e, start: "2026-02-30" }),
    /Invalid/,
  );
  const timed = ical.makeCalendar({
    ...e,
    precision: "instant",
    start: "2026-10-25T01:30:00+01:00",
    end: "2026-10-25T02:30:00+00:00",
    timezone: "Europe/Dublin",
  });
  assert.match(timed, /DTSTART:20261025T003000Z/);
  assert.match(timed, /DTEND:20261025T023000Z/);
});
test("migration and repeatable import preserve reviewed records, keys and privacy constraints", () => {
  const { db } = database();
  const sql = buildImportSql(catalogue);
  db.exec(sql);
  const n = db.prepare("SELECT COUNT(*) n FROM content_records").get().n;
  assert.equal(n, catalogue.records.length);
  db.exec(
    "UPDATE content_records SET title='Reviewed title' WHERE id='university-mtu'",
  );
  db.exec(sql);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM content_records").get().n, n);
  assert.equal(
    db
      .prepare("SELECT title FROM content_records WHERE id='university-mtu'")
      .get().title,
    "Reviewed title",
  );
  assert.ok(
    !db
      .prepare("PRAGMA table_info(audit_events)")
      .all()
      .some((c) => c.name === "ip_hash"),
  );
  db.exec(
    "INSERT INTO profiles(id,auth_subject,email,display_name) VALUES('p','p','test@example.invalid','Test')",
  );
  assert.throws(
    () => db.exec("INSERT INTO student_profiles(profile_id) VALUES('p')"),
    /paused/,
  );
  assert.throws(() =>
    validateDataset({
      ...catalogue,
      records: [{ ...catalogue.records[0], availabilityStatus: "maybe" }],
    }),
  );
  db.close();
});
test("anonymous event allowlist rejects identifiers, search text and campus carry-forward", async () => {
  const { db, d1 } = database();
  const ids = new Set(["r"]);
  await pilot.storeEvent(d1, { event: "useful_yes", target: "r" }, ids);
  await pilot.storeEvent(d1, { event: "useful_yes", target: "r" }, ids);
  assert.equal(
    db.prepare("SELECT count FROM usage_daily_counts").get().count,
    2,
  );
  assert.equal(
    db.prepare("SELECT COUNT(*) n FROM usage_daily_counts").get().n,
    1,
  );
  assert.throws(() =>
    pilot.validateEvent({ event: "search", target: "private search" }, ids),
  );
  assert.throws(() =>
    pilot.validateEvent(
      { event: "page_view", target: "/explore", campus: "mtu" },
      ids,
    ),
  );
  assert.throws(() =>
    pilot.validateEvent({ event: "node_open", target: "r", userId: "x" }, ids),
  );
  assert.throws(() =>
    pilot.validateEvent(
      { event: "page_view", target: "/pilot/fake", campus: "fake" },
      ids,
    ),
  );
  assert.deepEqual(
    pilot.validateEvent(
      { event: "page_view", target: "/pilot/mtu", campus: "mtu" },
      ids,
    ),
    { event: "page_view", target: "/pilot/mtu", campus: "mtu" },
  );
  db.close();
});
const answers = {
  1: "MTU",
  2: "Student",
  3: "Bachelor",
  4: "4",
  5: "Yes",
  6: "Graph",
  7: "5",
  8: "Yes",
  9: "Yes",
  10: "No",
  11: "8",
  12: "Clearer filters",
  13: "Upcoming opportunities",
};
test("survey stores independent counts, separates campus from role, and quarantines free text", async () => {
  const { db, d1 } = database();
  await pilot.storeSurvey(d1, answers, new Date("2026-10-14T12:00:00Z"));
  const rows = db.prepare("SELECT * FROM survey_answer_counts").all();
  assert.equal(
    rows.filter((r) => r.question <= 2).every((r) => r.role === ""),
    true,
  );
  assert.equal(rows.find((r) => r.question === 5).role, "Student");
  const text = db.prepare("SELECT * FROM survey_free_text").all();
  assert.equal(text.length, 2);
  assert.equal(text[0].flagged, 1);
  assert.ok(!("role" in text[0]) && !("campus" in text[0]));
  assert.throws(() => pilot.surveyRows({ ...answers, email: "x" }));
  assert.throws(() =>
    db.exec(
      "INSERT INTO survey_answer_counts VALUES(1,'MTU','2026-W42','Student',1)",
    ),
  );
  assert.equal(pilot.isoWeek(new Date("2027-01-01")), "2026-W53");
  db.close();
});
test("weekly export applies complementary suppression without lying about larger hidden cells", () => {
  const rows = pilot.suppress([
    { week: "2026-W42", group: "survey", target: "a", count: 2 },
    { week: "2026-W42", group: "survey", target: "b", count: 8 },
    { week: "2026-W42", group: "survey", target: "c", count: 20 },
  ]);
  assert.deepEqual(
    rows.map((r) => r.count),
    ["<5", "suppressed", 20],
  );
  const csv = pilot.reportCsv([
    { week: "2026-W42", group: "visits", target: "r", count: 2 },
  ]);
  assert.ok(!csv.includes("2026-10-14"));
  assert.match(csv, /<5/);
});
test("public projection excludes unpublished graph endpoints and private source notes", async () => {
  const { db, d1 } = database();
  db.exec(buildImportSql(catalogue));
  db.exec(
    "INSERT INTO evidence_sources(id,title,kind,notes) VALUES('private-source','Secret title','private','PRIVATE NOTE');INSERT INTO content_records(id,slug,type,title,summary,status,classification,confidence,source_id,is_published) VALUES('draft','draft','course','PRIVATE DRAFT','PRIVATE SUMMARY','draft','verified','Low','private-source',0);INSERT INTO content_relationships(id,source_record_id,target_record_id,type,label,explanation,classification) VALUES('secret-edge','draft','university-mtu','test','PRIVATE EDGE','PRIVATE EXPLANATION','verified');",
  );
  const d = await access.getPublishedDataset(d1);
  assert.equal(d.storage, "database");
  assert.ok(!JSON.stringify(d).includes("PRIVATE"));
  assert.ok(!d.sources.some((s) => s.id === "private-source"));
  db.close();
});
test("status parser rejects conflicts, parsing failures and robots exclusions", () => {
  assert.deepEqual(
    refresh.parseAvailability(
      "<p>Application deadline: 18 October 2026</p>",
      2026,
      "2026-10-14",
    ),
    { deadline: "2026-10-18", availability: "open" },
  );
  assert.throws(
    () =>
      refresh.parseAvailability(
        "Application deadline: 1 December 2026. Apply by 18 December 2026",
        2026,
      ),
    /Conflicting/,
  );
  assert.throws(
    () => refresh.parseAvailability("No date supplied", 2026),
    /safely/,
  );
  assert.equal(
    refresh.robotsAllows("User-agent: *\nDisallow: /private/", "/private/a"),
    false,
  );
});
test("bounded source reader stops excessive streamed responses", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    pull(c) {
      c.enqueue(new Uint8Array(20));
    },
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(
    () => refresh.boundedText(new Response(stream), 10),
    /limit/,
  );
  assert.equal(cancelled, true);
});
test("every legacy API method is paused and unknown APIs are fail-closed", async () => {
  async function walk(dir) {
    const out = [];
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const p = `${dir}/${item.name}`;
      if (item.isDirectory()) out.push(...(await walk(p)));
      else if (item.name === "route.ts") out.push(p);
    }
    return out;
  }
  for (const file of await walk("app/api/v151")) {
    const url =
      "/" +
      file
        .replace(/^app\//, "")
        .replace(/\/route.ts$/, "")
        .replace(/\[id\]/, "test");
    for (const method of ["GET", "POST", "PATCH", "DELETE", "HEAD", "OPTIONS"])
      assert.equal(
        policy.classifyRoute(url, method),
        "paused",
        `${method} ${url}`,
      );
  }
  assert.equal(policy.classifyRoute("/api/v2/future", "GET"), "denied");
  assert.equal(policy.classifyRoute("/api/v2/events", "GET"), "denied");
  assert.equal(policy.classifyRoute("/api/v2/dashboard", "GET"), "team");
  const response = await policy.checkRequestPolicy(
    new Request("https://example.invalid/api/v151/session", {
      headers: {
        "oai-authenticated-user-id": "owner",
        "oai-authenticated-user-email": "owner@example.invalid",
      },
    }),
    {},
  );
  assert.equal(response.status, 403);
});
test("Access verifies signature, issuer, audience, time claims; forged identity has no effect", async () => {
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  jwk.kid = "sample-key";
  jwk.alg = "RS256";
  const config = {
    ACCESS_TEAM_DOMAIN: "test-v2.cloudflareaccess.com",
    ACCESS_AUD: "sample-audience",
  };
  const now = Date.now();
  const encode = (v) => Buffer.from(JSON.stringify(v)).toString("base64url");
  async function token(
    overrides = {},
    head = { alg: "RS256", kid: "sample-key" },
  ) {
    const data = `${encode(head)}.${encode({ sub: "sample-team", email: "team@example.invalid", aud: ["sample-audience"], iss: "https://test-v2.cloudflareaccess.com", exp: Math.floor(now / 1000) + 60, ...overrides })}`;
    const sig = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      pair.privateKey,
      new TextEncoder().encode(data),
    );
    return data + "." + Buffer.from(sig).toString("base64url");
  }
  const fetcher = async () => Response.json({ keys: [jwk] });
  assert.equal(
    (await identity.verifyAccessToken(await token(), config, fetcher, now))
      .userId,
    "sample-team",
  );
  for (const overrides of [
    { aud: ["wrong"] },
    { iss: "https://wrong.invalid" },
    { exp: 0 },
    { nbf: Math.floor(now / 1000) + 500 },
  ])
    assert.equal(
      await identity.verifyAccessToken(
        await token(overrides),
        config,
        fetcher,
        now,
      ),
      null,
    );
  assert.equal(
    await identity.verifyAccessToken(
      await token({}, { alg: "none", kid: "sample-key" }),
      config,
      fetcher,
      now,
    ),
    null,
  );
  assert.equal(
    await identity.verifyAccessToken(
      (await token()).slice(0, -10) + "AAAAAAAAAA",
      config,
      fetcher,
      now,
    ),
    null,
  );
  assert.equal(
    await identity.verifyAccessToken(null, config, fetcher, now),
    null,
  );
});

test("multiple imported calendar entries round-trip through the public dataset", async () => {
  const { db, d1 } = database();
  const eventRecord = {
    ...record,
    id: "event-record",
    slug: "event-record",
    type: "calendar_event",
    sourceId: catalogue.sources[0].id,
  };
  const event = (id, kind, start) => ({
    id,
    recordId: "event-record",
    title: "Imported test date",
    kind,
    start,
    precision: "day",
    sourceUrl: "https://example.invalid/event",
  });
  const d = {
    ...catalogue,
    records: [...catalogue.records, eventRecord],
    calendarEvents: [
      event("nomination", "nomination", "2026-11-01"),
      event("online", "online_component", "2026-11-20"),
    ],
  };
  db.exec(buildImportSql(d));
  db.exec(buildImportSql(d));
  const data = await access.getPublishedDataset(d1);
  assert.equal(
    data.calendarEvents.filter((e) => e.recordId === "event-record").length,
    2,
  );
  assert.match(ical.makeCalendar(data.calendarEvents[0]), /BEGIN:VEVENT/);
  db.close();
});
test("an approved reopening supersedes a closed lifecycle label and requires an audit reason", async () => {
  const { db, d1 } = database();
  db.exec(buildImportSql(catalogue));
  db.exec(
    "UPDATE content_records SET status='Closed',availability_status='closed' WHERE id='university-mtu';INSERT INTO proposed_changes(id,target_type,target_id,payload_json,rationale,status) VALUES('review-test','availability','university-mtu','{\"deadline\":\"2027-12-01\",\"availability\":\"open\"}','Source changed','pending');",
  );
  await assert.rejects(
    () =>
      review.reviewAvailability(d1, "team", {
        id: "review-test",
        decision: "approved",
        reason: "",
      }),
    /reason/,
  );
  await review.reviewAvailability(d1, "team", {
    id: "review-test",
    decision: "approved",
    reason: "Verified against the official call",
  });
  assert.equal(
    db
      .prepare(
        "SELECT availability_status FROM content_records WHERE id='university-mtu'",
      )
      .get().availability_status,
    "open",
  );
  assert.equal(
    domain.availability(
      {
        ...record,
        status: "Closed",
        availabilityStatus: "open",
        applicationDeadline: "2027-12-01",
      },
      "2026-10-14",
    ).value,
    "open",
  );
  await assert.rejects(
    () =>
      review.reviewAvailability(d1, "team", {
        id: "review-test",
        decision: "approved",
        reason: "Another decision",
      }),
    /Pending/,
  );
  assert.equal(db.prepare("SELECT COUNT(*) n FROM pilot_audit").get().n, 1);
  db.close();
});
test("conflicting refreshes remove actionable availability and retain failure evidence", async () => {
  const { db, d1 } = database();
  db.exec(buildImportSql(catalogue));
  const fetcher = async (url) =>
    String(url).endsWith("robots.txt")
      ? new Response("User-agent: *\nAllow: /")
      : new Response(
          "Application deadline: 1 December 2026. Apply by 18 December 2026",
        );
  await refresh.refreshAvailability(d1, fetcher);
  const row = db
    .prepare(
      "SELECT availability_status,source_conflict,last_check_attempt,check_error FROM content_records WHERE id='opportunity-ingenium-ambassadors-2026'",
    )
    .get();
  assert.equal(row.source_conflict, 1);
  assert.equal(row.availability_status, "unknown");
  assert.ok(row.last_check_attempt);
  assert.ok(row.check_error);
  const fail = async () => {
    throw new Error("network failed");
  };
  await refresh.refreshAvailability(d1, fail);
  assert.match(
    db
      .prepare(
        "SELECT value_json FROM system_state WHERE key='v2_status_refresh'",
      )
      .get().value_json,
    /failed/,
  );
  db.close();
});
test("robots group parsing and six-week pilot activation are explicit", () => {
  assert.equal(
    refresh.robotsAllows(
      "User-agent: *\nUser-agent: OtherBot\nDisallow: /private/",
      "/private/a",
    ),
    false,
  );
  const env = {
    PILOT_START_DATE: "2026-10-14",
    PILOT_ANALYTICS_ENABLED: "true",
    EDGE_RATE_LIMIT_READY: "true",
  };
  assert.equal(
    windowRules.pilotWindow(env, new Date("2026-10-13")).enabled,
    false,
  );
  assert.equal(
    windowRules.pilotWindow(env, new Date("2026-10-14")).enabled,
    true,
  );
  assert.equal(
    windowRules.pilotWindow(env, new Date("2026-11-25")).enabled,
    false,
  );
  assert.equal(
    windowRules.pilotWindow({ ...env, PILOT_START_DATE: "" }).enabled,
    false,
  );
});

test("calendar imports reject invented dates, ambiguous instants and duplicate stable IDs", () => {
  const e = {
    id: "calendar-test",
    recordId: catalogue.records[0].id,
    kind: "activity",
    start: "2026-02-30",
    precision: "day",
    sourceUrl: "https://example.invalid/event",
  };
  assert.throws(
    () => validateDataset({ ...catalogue, calendarEvents: [e] }),
    /calendar day/,
  );
  assert.throws(
    () =>
      validateDataset({
        ...catalogue,
        calendarEvents: [
          { ...e, precision: "instant", start: "2026-11-01T12:00:00" },
        ],
      }),
    /UTC or offset/,
  );
  const valid = { ...e, start: "2026-11-01" };
  assert.throws(
    () => validateDataset({ ...catalogue, calendarEvents: [valid, valid] }),
    /calendar event/,
  );
  const { db } = database();
  const sql = buildImportSql(catalogue).split("\n");
  db.exec(sql.slice(0, Math.floor(sql.length / 2)).join("\n"));
  db.exec(sql.join("\n"));
  assert.equal(
    db.prepare("SELECT COUNT(*) n FROM content_records").get().n,
    catalogue.records.length,
  );
  assert.equal(db.prepare("PRAGMA foreign_key_check").all().length, 0);
  db.close();
});

test("ordinary punctuation in a search is literal and never crashes discovery", () => {
  for (const query of ["[", "(", ".", "a|", "*", "\\"])
    assert.doesNotThrow(() => domain.discover([record], { query }));
  assert.equal(domain.discover([record], { query: "." }).length, 0);
});

test("timed calendar entries appear on their confirmed local day across midnight and DST", () => {
  const e = {
    id: "timed",
    recordId: "r",
    title: "Timed activity",
    kind: "activity",
    precision: "instant",
    start: "2026-10-25T23:30:00Z",
    end: "2026-10-26T00:30:00Z",
    timezone: "Europe/Helsinki",
    sourceUrl: "https://example.invalid/event",
  };
  assert.equal(domain.calendarDay(e), "2026-10-26");
  assert.equal(domain.calendarDay(e, true), "2026-10-26");
});

test("reviewed availability supersedes a legacy verification label while active conflicts still block it", () => {
  assert.equal(
    domain.availability(
      {
        ...record,
        status: "Verification required",
        availabilityStatus: "open",
        applicationDeadline: "2027-12-01",
      },
      "2026-10-14",
    ).value,
    "open",
  );
  assert.equal(
    domain.availability(
      {
        ...record,
        status: "Verification required",
        availabilityStatus: "open",
        sourceConflict: true,
      },
      "2026-10-14",
    ).value,
    "unknown",
  );
});

test("search uses published aliases and timed imports require a confirmed valid timezone", async () => {
  const { summary } = await server.ssrLoadModule("/lib/v2/summary.ts");
  assert.equal(
    domain.discover([summary({ ...record, aliases: ["SynonymOnly"] })], {
      query: "SynonymOnly",
    }).length,
    1,
  );
  const e = {
    id: "time",
    recordId: catalogue.records[0].id,
    kind: "activity",
    start: "2026-10-25T12:00:00Z",
    precision: "instant",
    sourceUrl: "https://example.invalid/event",
  };
  for (const timezone of [undefined, "Mars/Invalid"])
    assert.throws(
      () =>
        validateDataset({ ...catalogue, calendarEvents: [{ ...e, timezone }] }),
      /confirmed timezone/,
    );
});

test("legacy date placeholders are not exported as exact activities and BIP components remain separate", () => {
  assert.equal(
    domain.calendarEntries([
      { ...record, startDate: "2026-01-01", dateLabel: "2026" },
    ]).length,
    0,
  );
  const entries = domain.allCalendarEntries(
    catalogue.records,
    catalogue.calendarEvents,
  );
  assert.ok(
    !entries.some(
      (e) => e.id === "bip-digital-health-activity" && e.start === "2026-10-05",
    ),
  );
  assert.equal(
    entries.find((e) => e.id === "bip-digital-health-online_component").end,
    "2026-10-24",
  );
  const approx = domain.calendarEntries([
    {
      ...record,
      startDate: "2026-11-01",
      endDate: "2026-12-31",
      activityDatePrecision: "approximate",
      dateLabel: "November–December 2026",
    },
  ])[0];
  assert.equal(approx.precision, "approximate");
  assert.throws(() => ical.makeCalendar(approx), /approximate/);
});

test("retention preview preserves rows and approved cleanup removes only eligible data", () => {
  const { db } = database();
  db.exec(
    "INSERT INTO survey_free_text VALUES('t',12,'2025-W01','Synthetic feedback',1,0);INSERT INTO pilot_audit VALUES('old','fictional','test','r','2020-01-01');INSERT INTO pilot_audit VALUES('new','fictional','test','r',CURRENT_TIMESTAMP)",
  );
  const env = { PILOT_START_DATE: "2025-01-01" };
  const preview = retentionPlan(env);
  assert.equal(preview.approved, false);
  db.exec(preview.sql);
  assert.equal(
    db.prepare("SELECT COUNT(*) n FROM survey_free_text").get().n,
    1,
  );
  const approved = retentionPlan({ ...env, RETENTION_APPROVED: "true" });
  db.exec(approved.sql);
  assert.equal(
    db.prepare("SELECT COUNT(*) n FROM survey_free_text").get().n,
    0,
  );
  assert.equal(db.prepare("SELECT COUNT(*) n FROM pilot_audit").get().n, 1);
  assert.throws(() => retentionPlan({ PILOT_START_DATE: "2026-02-30" }));
  db.close();
});

test("data health exposes missing coverage and distinguishes conflicts from failed checks", async () => {
  const { catalogueHealth } = await server.ssrLoadModule("/lib/v2/health.ts");
  const h = catalogueHealth(
    [
      { ...record, type: "university", id: "u", universityIds: [] },
      {
        ...record,
        sourceConflict: true,
        lastCheckError: "Check failed",
        universityIds: [],
      },
    ],
    new Date("2026-10-14"),
  );
  assert.equal(h.conflicts, 1);
  assert.equal(h.failed, 1);
  assert.equal(h.coverage[0].records, 0);
  assert.equal(h.records.length, 2);
});
