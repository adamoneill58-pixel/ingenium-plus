import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test, { after } from "node:test";
import { createServer } from "vite";
const server = await createServer({configFile:false, cacheDir:".vite-connected-test-cache", server:{middlewareMode:true}, appType:"custom", logLevel:"silent"});
after(() => server.close());
const geometry = await server.ssrLoadModule("/lib/v2/map-geometry.ts");
const embeds = await server.ssrLoadModule("/lib/v2/external-embeds.ts");
const simulation = await server.ssrLoadModule("/lib/v2/campus-simulation.ts");
const simState = await server.ssrLoadModule("/lib/v2/simulation-state.ts");

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Adam and Paul each have three distinct coherent workspaces with real catalogue references",async()=>{
  const catalogue=JSON.parse(await read("data/catalogue/v2.json"));
  const ids=new Set(catalogue.records.map((record)=>record.id));
  for(const mode of ["student","staff"]){
    const spaces=simulation.simSpaces.filter((space)=>space.mode===mode);
    assert.equal(spaces.length,3);
    assert.deepEqual(new Set(spaces.map((space)=>space.id)),new Set(simulation.personas[mode].joinedSpaceIds));
    for(const space of spaces){
      assert.ok(ids.has(space.recordId),space.id+" refers to an unknown real record");
      assert.ok(space.messages.length>=6);
      assert.ok(space.resources.length>=2);
      assert.ok(space.resources.every((resource)=>resource.body.includes("SYNTHETIC")));
      for(const id of space.memberIds)assert.ok(simulation.personById(id));
      for(const message of space.messages)assert.ok(space.memberIds.includes(message.authorId));
    }
  }
});

test("degree priorities put memberships and direct people before topic relevance and wider discovery",()=>{
  const initial=simState.initialSimulation();
  const make=(id,title,themes=[])=>({id,title,studentSummary:"Example",themes,type:"course"});
  const joined=make("bip-clarity-ai","BIP");
  const connected=make("demo-maya","Maya");
  const related=make("ai-course","Artificial intelligence");
  const wider=make("history-course","Classical archaeology");
  assert.equal(simState.connectionInfo(joined,"student",initial.student).degree,1);
  assert.equal(simState.connectionInfo(connected,"student",initial.student).degree,1);
  assert.equal(simState.connectionInfo(related,"student",initial.student).degree,2);
  assert.equal(simState.connectionInfo(wider,"student",initial.student).degree,4);
  assert.deepEqual(simState.prioritiseConnections([wider,related,joined,connected],"student",initial.student).map((r)=>r.id),[joined.id,connected.id,related.id,wider.id]);
  assert.deepEqual(simState.prioritiseConnections([wider,related,joined],"student",initial.student,"2").map((r)=>r.id),[related.id]);
});

test("connecting and leaving immediately change first degree without changing the other persona",()=>{
  const initial=simState.initialSimulation();
  const person=simulation.simulationEntities("student").find((p)=>p.id==="demo-ines");
  assert.equal(simState.connectionInfo(person,"student",initial.student).degree,3);
  const connected=simState.simulationReducer(initial,{type:"connect",id:"demo-ines"});
  assert.equal(simState.connectionInfo(person,"student",connected.student).degree,1);
  assert.deepEqual(connected.staff,initial.staff);
  const left=simState.simulationReducer(connected,{type:"join",id:"clarity-bip"});
  assert.ok(!left.student.joined.includes("clarity-bip"));
  const blocked=simState.simulationReducer(left,{type:"message",id:"room-clarity-bip",text:"Should not send"});
  assert.equal(blocked.student.messages["room-clarity-bip"],undefined);
});

test("workshop sheet rejects capacity and overlap, permits cancellation and preserves staff state",()=>{
  const initial=simState.initialSimulation();
  const booked=simState.simulationReducer(initial,{type:"workshop",id:"workshop-innovation"});
  assert.deepEqual(booked.student.workshops,["workshop-innovation"]);
  const clash=simState.simulationReducer(booked,{type:"workshop",id:"workshop-voice"});
  assert.deepEqual(clash.student.workshops,booked.student.workshops);
  assert.match(clash.notice,/Time clash/);
  const full=simState.simulationReducer(clash,{type:"workshop",id:"workshop-full"});
  assert.match(full.notice,/full/);
  const compatible=simState.simulationReducer(full,{type:"workshop",id:"workshop-digital"});
  assert.equal(compatible.student.workshops.length,2);
  const cancelled=simState.simulationReducer(compatible,{type:"workshop",id:"workshop-innovation"});
  assert.deepEqual(cancelled.student.workshops,["workshop-digital"]);
  assert.deepEqual(cancelled.staff,initial.staff);
});

test("DMs, small groups and workspace messages are persona-scoped and survive state serialization",()=>{
  let state=simState.initialSimulation();
  state=simState.simulationReducer(state,{type:"message",id:"adam-maya",text:"  BIP concept reviewed  "});
  assert.equal(state.student.messages["adam-maya"][0].text,"BIP concept reviewed");
  state=simState.simulationReducer(state,{type:"mode",mode:"staff"});
  const before=state.staff;
  state=simState.simulationReducer(state,{type:"message",id:"adam-maya",text:"Wrong persona"});
  assert.deepEqual(state.staff,before);
  state=simState.simulationReducer(state,{type:"message",id:"paul-design-team",text:"Review the module"});
  assert.equal(state.staff.messages["paul-design-team"].length,1);
  const restored=simState.simulationReducer(simState.initialSimulation(),{type:"hydrate",state:JSON.parse(JSON.stringify(state))});
  assert.deepEqual(restored.student.messages,state.student.messages);
  assert.deepEqual(restored.staff.messages,state.staff.messages);
});

test("staff drafts, proposal stage and task state remain local to Paul and reset independently",()=>{
  const initial=simState.initialSimulation("staff");
  let state=simState.simulationReducer(initial,{type:"draft",id:"module-outline",text:"Synthetic revised module"});
  state=simState.simulationReducer(state,{type:"proposal",id:"responsible-ai-research",stage:"Partner review"});
  state=simState.simulationReducer(state,{type:"task",id:"wp-review"});
  assert.equal(state.staff.drafts["module-outline"],"Synthetic revised module");
  assert.equal(state.staff.proposals["responsible-ai-research"],"Partner review");
  assert.ok(state.staff.completed.includes("wp-review"));
  assert.deepEqual(state.student,initial.student);
  state=simState.simulationReducer(state,{type:"reset"});
  assert.deepEqual(state.staff,initial.staff);
  assert.deepEqual(state.student,initial.student);
});

test("people and personal graph edges never enter the canonical public snapshot",async()=>{
  const catalogue=JSON.parse(await read("data/catalogue/v2.json"));
  assert.ok(!catalogue.records.some((record)=>record.id.startsWith("demo-")||record.type==="person"));
  const state=simState.initialSimulation();
  const edges=simState.simulationEdges("student",state.student);
  assert.ok(edges.some((edge)=>edge.source==="demo-adam"&&edge.target==="bip-clarity-ai"));
  assert.ok(edges.some((edge)=>edge.source==="demo-adam"&&edge.target==="demo-maya"));
  assert.ok(!edges.some((edge)=>edge.source==="demo-paul"));
});

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
