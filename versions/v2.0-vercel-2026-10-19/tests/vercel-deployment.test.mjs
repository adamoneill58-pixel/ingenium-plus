import assert from "node:assert/strict";
import test from "node:test";

process.env.INGENIUM_HOSTING_TARGET = "vercel";
process.env.PUBLIC_CATALOGUE_MODE = "release-snapshot";
const { default: server } = await import("../.vercel/output/functions/__server.func/index.mjs");

function request(path, options) {
  delete globalThis[Symbol.for("ingenium.runtime.bindings")];
  return server.fetch(new Request(`https://ingenium.test${path}`, options), { waitUntil() {} });
}

test("Vercel serves the reviewed public release without Cloudflare bindings", async () => {
  const response = await request("/api/v2/catalogue");
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.storage, "release-snapshot");
  assert.equal(data.records.length, 222);
  assert.ok(data.records.every((record) => record.type !== "student" && record.dataClassification !== "sample"));
  const html = await (await request("/")).text();
  assert.match(html, /Source-backed release snapshot/);
  assert.doesNotMatch(html, /Database setup required/);
});

test("the filmed business to MTU to details journey works on the Vercel function", async () => {
  const search = await (await request("/api/v2/catalogue?query=business")).json();
  const filtered = await (await request("/api/v2/catalogue?query=business&university=university-mtu")).json();
  assert.ok(search.records.length > filtered.records.length);
  assert.ok(filtered.records.some((record) => record.id === "initiative-bmc"));
  assert.ok(filtered.records.every((record) => record.universityIds.includes("university-mtu")));
  const details = await request("/records/business-model-canvas");
  assert.equal(details.status, 200);
  assert.match(await details.text(), /INGENIUM Business Model Canvas Resource/);
});

test("the public entry is neutral and all ten campus shortcuts use real university IDs", async () => {
  const html = await (await request("/")).text();
  assert.match(html, /STUDENT-BUILT PREVIEW/);
  assert.match(html, /name="query"/);
  assert.match(html, /Choose your direction/);
  assert.match(html, /CAMPUS DEMO/);
  assert.doesNotMatch(html, /Welcome back, Adam|Adam’s closest connections|Adam’s connection degrees/);
  const catalogue = await (await request("/api/v2/catalogue")).json();
  const ids = new Set(catalogue.records.filter((record) => record.type === "university").map((record) => record.id));
  const links = [...html.matchAll(/href="\/explore\?university=(university-[a-z]+)&amp;view=list/g)].map((match) => match[1]);
  assert.equal(new Set(links).size, 10);
  for (const id of links) assert.ok(ids.has(id), id);
  const privacy = await request("/privacy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /without creating an account/);
});

test("the Vercel entrypoint preserves restricted and paused routes", async () => {
  for (const path of ["/pilot-dashboard", "/api/v2/dashboard", "/api/v2/export"]) {
    const response = await request(path, { headers: { "oai-user-id": "forged", "oai-user-email": "owner@example.invalid" } });
    assert.equal(response.status, 401, path);
  }
  for (const path of ["/api/v151/session", "/staff/calls/new"]) {
    assert.equal((await request(path)).status, 403, path);
  }
  const response = await request("/api/v2/survey", {
    method: "POST", headers: { origin: "https://ingenium.test", "content-type": "application/json" }, body: "{}",
  });
  assert.equal(response.status, 503);
  assert.match(await response.text(), /Pilot service is unavailable or not configured/);
});
