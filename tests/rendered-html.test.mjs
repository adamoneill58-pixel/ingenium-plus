import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { DatabaseSync } from "node:sqlite";
import { buildImportSql } from "../scripts/import-dataset.mjs";
import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/", environment = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname}`,
  );
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ALLOW_STATIC_FALLBACK: "true",
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      ...environment,
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete INGENIUM+ homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Your European campus/);
  assert.match(html, /Closer than you think/);
  assert.match(html, /Discovery view/);
  assert.match(html, /Find your next connection/);
  assert.match(html, /Research snapshot/);
  assert.doesNotMatch(
    html,
    /Your site is taking shape|codex-preview|react-loading-skeleton/i,
  );
});

test("production snapshot mode serves the reviewed public catalogue without database writes", async () => {
  const response = await render("/api/v2/catalogue", {
    ALLOW_STATIC_FALLBACK:"false",
    PUBLIC_CATALOGUE_MODE:"release-snapshot",
    DB:{prepare(){throw new Error("Release snapshot must not read or mutate the database");}},
  });
  assert.equal(response.status,200);
  const data = await response.json();
  assert.equal(data.storage,"release-snapshot");
  assert.equal(data.records.length,222);
  assert.ok(data.records.every((record)=>record.type !== "student" && record.dataClassification !== "sample"));
  const html = await (await render("/",{PUBLIC_CATALOGUE_MODE:"release-snapshot"})).text();
  assert.match(html,/Source-backed release snapshot/);
});

for (const [pathname, heading] of [
  ["/opportunities", "Choose your next move"],
  ["/programmes", "Study across one European campus"],
  ["/build", "Build something that travels"],
  ["/events", "Meet INGENIUM in motion"],
  ["/communities", "Find your people"],
  ["/platforms", "Use the right official platform"],
  ["/universities", "Ten universities"],

  ["/research", "See what the network is built on"],
  ["/about", "A clearer way into your European campus"],
  ["/explore", "Explore all of INGENIUM"],
  ["/calendar", "A year of possibilities"],
  ["/collaborate", "Find the expertise"],
  ["/survey", "What worked for you"],
  ["/about-pilot", "About this pilot"],
  ["/pilot/mtu", "A new connection starts here"],
  ["/learning", "Build a European semester"],
  ["/community", "Find the work"],
  ["/learn/clarity-ai-studio", "CLARITY-AI studio"],
  ["/my-campus", "Make the campus yours"],
  ["/campus?mode=student", "connected campus"],
  ["/messages", "Messages, with context"],
  ["/campus/clarity-bip", "CLARITY-AI · BIP studio"],
  ["/campus/oviedo-conference?tab=workshops", "Build your conference workshop plan"],
  ["/campus/chess-club", "INGENIUM online chess club"],
  ["/campus/wp5-teaching?mode=staff", "WP5 · Teaching innovation studio"],
  ["/campus/shared-ai-module?mode=staff", "Responsible AI · shared module"],
  ["/campus/responsible-ai-research?mode=staff", "Responsible AI across the alliance"],
  ["/people/demo-maya", "Maya Jensen"],
  ["/people/demo-paul?mode=staff", "Paul O’Neill"],
  ["/student", "Personal accounts are paused"],
  ["/staff", "Staff accounts are paused"],

  [
    "/records/sustainable-wellbeing-changing-society",
    "Sustainable Wellbeing in Changing Society",
  ],
]) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(heading, "i"));
  });
}

test("unknown campus entry is 404 and does not record a visit", async () => {
  assert.equal((await render("/pilot/unknown")).status, 404);
  assert.equal((await render("/campus/unknown")).status, 404);
  assert.equal((await render("/people/unknown")).status, 404);
});
test("legacy private APIs reject forged identity without data writes", async () => {
  const { default: worker } = await import(
    new URL("../dist/server/index.js", import.meta.url)
  );
  let writes = 0;
  const env = {
    DB: {
      prepare() {
        writes++;
        throw new Error("Database must not be touched");
      },
    },
  };
  for (const path of [
    "/api/v151/session",
    "/api/v151/recommendations",
    "/api/v151/documents/test",
  ]) {
    const response = await worker.fetch(
      new Request(`http://localhost${path}`, {
        headers: {
          "oai-authenticated-user-id": "owner",
          "oai-authenticated-user-email": "owner@example.invalid",
        },
      }),
      env,
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 403);
  }
  assert.equal(writes, 0);
});
test("team dashboard cannot be opened with an unsigned identity", async () => {
  assert.equal((await render("/pilot-dashboard")).status, 401);
});

test("public catalogue API and calendar downloads work without an identity", async () => {
  const response = await render("/api/v2/catalogue?query=AI");
  assert.equal(response.status, 200);
  const d = await response.json();
  assert.ok(d.records.length > 0);
  assert.ok(d.records.every((r) => r.type !== "student"));
  const calendar = await render(
    "/api/v2/calendar?id=opportunity-student-tandems-autumn-2026-deadline&alarm=1",
  );
  assert.equal(calendar.status, 200);
  assert.match(await calendar.text(), /TRIGGER:-P1D/);
  assert.equal(
    (
      await render(
        "/api/v2/calendar?id=opportunity-student-partnerships-2627-round1-deadline",
      )
    ).status,
    422,
  );
  assert.equal((await render("/api/v2/calendar?id=unknown")).status, 404);
});
test("pilot API enforces collection gate, same origin, method and arbitrary-field rejection", async () => {
  const { default: worker } = await import(
    new URL("../dist/server/index.js", import.meta.url)
  );
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  const request = (
    origin = "http://localhost",
    body = {
      event: "node_open",
      target: "university-mtu",
      identifier: "forbidden",
    },
  ) =>
    new Request("http://localhost/api/v2/events", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  const env = {
    ALLOW_STATIC_FALLBACK: "true",
    PILOT_START_DATE: new Date().toISOString().slice(0, 10),
    PILOT_ANALYTICS_ENABLED: "true",
    EDGE_RATE_LIMIT_READY: "true",
  };
  assert.equal((await worker.fetch(request(), {}, ctx)).status, 503);
  assert.equal(
    (await worker.fetch(request("https://other.invalid"), env, ctx)).status,
    403,
  );
  assert.equal((await worker.fetch(request(), env, ctx)).status, 400);
  assert.equal(
    (
      await worker.fetch(
        new Request("http://localhost/api/v2/events"),
        env,
        ctx,
      )
    ).status,
    404,
  );
});

test("public client chunks keep catalogue payloads out and report size without constraining the simulation", async (context) => {
  const dir = new URL("../dist/client/assets/", import.meta.url);
  const chunks = await readdir(dir);
  let compressed = 0;
  for (const name of chunks.filter((n) => n.endsWith(".js"))) {
    const bytes = await readFile(new URL(name, dir));
    compressed += gzipSync(bytes).length;
    assert.ok(
      !bytes.includes(
        Buffer.from(
          "Practise a language with a student at another INGENIUM university.",
        ),
      ),
      "Catalogue prose entered a routine client chunk",
    );
  }
  context.diagnostic(`Client gzip: ${compressed} bytes. The former 330 KB cap is deferred by the user's 17 October product instruction.`);
  const html = await (await render("/")).text();
  assert.doesNotMatch(html, /<script[^>]+src=[^>]*cytoscape/i);
});

test("signed team identity still requires membership and protects reporting and review end to end", async () => {
  const db = new DatabaseSync(":memory:");
  for (const f of ["0000_v151_production.sql", "0001_v2_pilot.sql"])
    db.exec(
      await readFile(new URL("../drizzle/" + f, import.meta.url), "utf8"),
    );
  db.exec(
    buildImportSql(
      JSON.parse(
        await readFile(
          new URL("../data/catalogue/v2.json", import.meta.url),
          "utf8",
        ),
      ),
    ),
  );
  class Statement {
    constructor(sql, args = []) {
      this.sql = sql;
      this.args = args;
    }
    bind(...args) {
      return new Statement(this.sql, args);
    }
    async first() {
      return db.prepare(this.sql).get(...this.args) ?? null;
    }
    async all() {
      return { results: db.prepare(this.sql).all(...this.args), success: true };
    }
    async run() {
      return {
        success: true,
        meta: { changes: db.prepare(this.sql).run(...this.args).changes },
      };
    }
  }
  const database = {
    prepare(sql) {
      return new Statement(sql);
    },
    async batch(statements) {
      db.exec("BEGIN");
      try {
        const out = [];
        for (const s of statements) out.push(await s.run());
        db.exec("COMMIT");
        return out;
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
  };
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
  jwk.kid = "route-team-key";
  jwk.alg = "RS256";
  const encode = (v) => Buffer.from(JSON.stringify(v)).toString("base64url");
  const unsigned =
    encode({ alg: "RS256", kid: jwk.kid }) +
    "." +
    encode({
      sub: "fictional-operator",
      email: "operator@example.invalid",
      aud: ["route-aud"],
      iss: "https://route-test.cloudflareaccess.com",
      exp: Math.floor(Date.now() / 1000) + 600,
    });
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    pair.privateKey,
    new TextEncoder().encode(unsigned),
  );
  const token = unsigned + "." + Buffer.from(signature).toString("base64url");
  const { default: worker } = await import(
    new URL("../dist/server/index.js", import.meta.url)
  );
  const env = {
    DB: database,
    ACCESS_TEAM_DOMAIN: "route-test.cloudflareaccess.com",
    ACCESS_AUD: "route-aud",
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  const request = (path, method = "GET", value) =>
    new Request("http://localhost" + path, {
      method,
      headers: {
        "Cf-Access-Jwt-Assertion": token,
        origin: "http://localhost",
        "content-type": "application/json",
      },
      ...(value ? { body: JSON.stringify(value) } : {}),
    });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ keys: [jwk] });
  try {
    assert.equal(
      (await worker.fetch(request("/api/v2/dashboard"), env, ctx)).status,
      403,
    );
    db.exec(
      "INSERT INTO pilot_team_memberships(subject,role) VALUES('fictional-operator','pilot_team');INSERT INTO usage_daily_counts VALUES('page_view','/','2026-10-14','',2)",
    );
    const response = await worker.fetch(request("/api/v2/dashboard"), env, ctx);
    assert.equal(response.status, 200);
    const d = await response.json();
    assert.equal(d.total.count, 2);
    assert.equal(d.health.coverage.length, 10);
    assert.equal(
      (await worker.fetch(request("/api/v2/review"), env, ctx)).status,
      403,
    );
    const csv = await worker.fetch(request("/api/v2/export"), env, ctx);
    assert.equal(csv.status, 200);
    assert.match(await csv.text(), /<5/);
    assert.equal(db.prepare("SELECT COUNT(*) n FROM pilot_audit").get().n, 1);
    db.exec(
      "UPDATE pilot_team_memberships SET role='administrator';INSERT INTO proposed_changes(id,target_type,target_id,payload_json,rationale,status) VALUES('route-proposal','availability','opportunity-ingenium-ambassadors-2026','{\"availability\":\"open\",\"deadline\":\"2027-12-01\"}','Synthetic official observation','pending')",
    );
    assert.equal(
      (
        await worker.fetch(
          request("/api/v2/review", "POST", {
            id: "route-proposal",
            decision: "approved",
            reason: "Reviewed synthetic source observation",
          }),
          env,
          ctx,
        )
      ).status,
      200,
    );
    assert.equal(
      db
        .prepare(
          "SELECT deadline FROM content_records WHERE id='opportunity-ingenium-ambassadors-2026'",
        )
        .get().deadline,
      "2027-12-01",
    );
  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
