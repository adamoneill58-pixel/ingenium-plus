import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test, { after } from "node:test";
import { createServer } from "vite";
const server = await createServer({configFile:false, cacheDir:".vite-connected-test-cache", server:{middlewareMode:true}, appType:"custom", logLevel:"silent"});
after(() => server.close());
const geometry = await server.ssrLoadModule("/lib/v2/map-geometry.ts");
const embeds = await server.ssrLoadModule("/lib/v2/external-embeds.ts");

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("map projection round-trips and multi-campus records retain every association", () => {
  for (const zoom of [3, 6, 10]) {
    for (const coordinate of Object.values(geometry.campusCoordinates)) {
      const restored = geometry.longitudeLatitude(geometry.worldPoint(coordinate, zoom), zoom);
      assert.ok(Math.abs(restored[0] - coordinate[0]) < 1e-8);
      assert.ok(Math.abs(restored[1] - coordinate[1]) < 1e-8);
    }
  }
  const record = {id:"shared-course", universityIds:["university-mtu","university-hs"], hostUniversityId:"university-mtu"};
  assert.deepEqual(geometry.recordCampusIds(record),["university-mtu","university-hs"]);
  assert.notDeepEqual(geometry.recordCoordinate(record,"university-mtu"), geometry.recordCoordinate(record,"university-hs"));
  assert.equal(geometry.recordCoordinate(record,"university-hka"),undefined);
});

test("progressive clustering preserves every point and separates nearby items as zoom grows", () => {
  const items = [0,1,2].map((id) => ({record:{id:String(id)},campusId:"university-mtu",coordinate:[0,0],point:{left:id*30,top:0}}));
  const low = geometry.clusterPositions(items,7);
  const high = geometry.clusterPositions(items,9);
  assert.equal(low.flatMap((cluster)=>cluster.members).length,3);
  assert.equal(high.length,3);
  assert.ok(low.length < high.length);
});

test("embed policy constructs supported URLs and rejects injection or arbitrary locations", () => {
  assert.equal(embeds.externalEmbedUrl({provider:"youtube-video",id:"abcdefghijk",title:"Example"}),"https://www.youtube-nocookie.com/embed/abcdefghijk");
  assert.equal(embeds.isValidExternalEmbed({provider:"linkedin-post",id:"urn:li:activity:123456789012345",title:"Public post"}),true);
  for (const id of ["https://evil.invalid", "javascript:alert(1)", 'abc\" onload=\"x', "../secret"]) {
    assert.equal(embeds.isValidExternalEmbed({provider:"youtube-video",id,title:"Example"}),false);
    assert.throws(()=>embeds.externalEmbedUrl({provider:"youtube-video",id,title:"Example"}));
  }
});

test("source registry covers the alliance and every university", async () => {
  const registry = JSON.parse(await read("data/sources/registry.json"));
  const catalogue = JSON.parse(await read("data/catalogue/v2.json"));
  const expected = new Set(
    catalogue.records
      .filter((record) => record.type === "university")
      .map((record) => record.id),
  );
  const actual = new Set(
    registry.sources
      .filter((source) => source.institutionId.startsWith("university-"))
      .map((source) => source.institutionId),
  );
  assert.deepEqual(actual, expected);
  assert.ok(registry.sources.every((source) => source.baseUrl.startsWith("https://")));
  assert.ok(registry.sources.every((source) => source.imageReuse));
});

test("functional slippy map clusters records and states its location boundary", async () => {
  const source = await read("components/v2/CampusMap.tsx");
  assert.match(source, /tile\.openstreetmap\.org/);
  assert.match(source, /onPointerMove=\{moveDrag\}/);
  assert.match(source, /addEventListener\("wheel", wheel, \{passive:false\}\)/);
  assert.match(source, /zoom < 6/);
  assert.match(source, /OpenStreetMap contributors/);
  assert.match(source, /not a claimed venue/);
  assert.doesNotMatch(source, /europe-map\.svg/);
});

test("external content uses provider-specific identifiers and no raw HTML", async () => {
  const policy = await read("lib/v2/external-embeds.ts");
  const component = await read("components/v2/ExternalEmbed.tsx");
  assert.match(policy, /youtube-nocookie\.com/);
  assert.match(policy, /urn:li:/);
  assert.match(policy, /calendar\.google\.com/);
  assert.match(component, /sandbox=/);
  assert.match(component, /only after you choose to load it/);
  assert.doesNotMatch(component, /dangerouslySetInnerHTML/);
});

test("synthetic community and course content stays explicitly labelled", async () => {
  const data = await read("lib/v2/demo-community.ts");
  const community = await read("components/v2/CommunityWorkspace.tsx");
  const learning = await read("components/v2/DemoCourseSpace.tsx");
  assert.match(data, /synthetic:\s*true/g);
  assert.match(data, /fictional/g);
  assert.doesNotMatch(data, /@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  assert.match(community, /every person, post and message below is synthetic/);
  assert.match(learning, /no enrolment, grades or Canvas data|not an LMS or an enrolment/);
});

test("connected campus routes and data-governance documents exist", async () => {
  for (const path of [
    "app/community/page.tsx",
    "app/learn/[slug]/page.tsx",
    "docs/v2/SOURCE_CENSUS.md",
    "data/sources/registry.json",
  ]) assert.ok((await stat(new URL(path, root))).isFile(), path);
});
