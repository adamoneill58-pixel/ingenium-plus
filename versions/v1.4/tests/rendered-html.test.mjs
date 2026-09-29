import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete INGENIUM+ homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Your European campus/);
  assert.match(html, /made visible/);
  assert.match(html, /The European Campus map/);
  assert.match(html, /Accessible list/);
  assert.match(html, /Research checked/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

for (const [pathname, heading] of [
  ["/opportunities", "Choose your next move"],
  ["/programmes", "Study across one European campus"],
  ["/build", "Build something that travels"],
  ["/events", "Meet INGENIUM in motion"],
  ["/communities", "Find your people"],
  ["/platforms", "Use the right official platform"],
  ["/universities", "Ten universities"],
  ["/my-journey", "Turn discovery into a plan"],
  ["/research", "See what the network is built on"],
  ["/about", "A clearer way into your European campus"],
]) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(heading, "i"));
  });
}
