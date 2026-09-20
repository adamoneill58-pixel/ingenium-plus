import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-v151-test-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const engine = await server.ssrLoadModule("/lib/v151/recommendations.ts");
const embedding = await server.ssrLoadModule("/lib/v151/embeddings.ts");
after(async () => server.close());

const student = { id: "student", homeUniversityId: "mtu", studyLevel: "Bachelor", interests: ["Artificial intelligence", "Sustainability"], goals: ["Study abroad"], languages: ["English"], preferredCountries: ["Finland"] };
const candidates = [
  { id: "strong", title: "Sustainable AI", kind: "module", organizationId: "xamk", disciplines: ["Artificial intelligence"], themes: ["Sustainability"], methods: [], needs: ["Study abroad"], languages: ["English"], countries: ["Finland"], studyLevels: ["Bachelor"], eligibility: [], status: "Open", deadline: "2027-01-01" },
  { id: "wrong-level", title: "Doctoral chemistry", kind: "module", organizationId: "uoc", disciplines: ["Chemistry"], themes: [], methods: [], needs: [], languages: ["English"], countries: [], studyLevels: ["PhD"], eligibility: [], status: "Open" },
  { id: "closed", title: "Closed AI", kind: "module", organizationId: "hka", disciplines: ["Artificial intelligence"], themes: [], methods: [], needs: [], languages: ["English"], countries: [], studyLevels: ["Bachelor"], eligibility: [], status: "Closed" },
];

test("student recommendations apply eligibility filters before ranking", () => {
  const results = engine.recommend("student_module", student, candidates, { today: new Date("2026-09-19T00:00:00Z") });
  assert.deepEqual(results.map((item) => item.candidateId), ["strong"]);
  assert.ok(results[0].score > 50);
  assert.ok(results[0].explanations.some((reason) => reason.includes("Shared focus")));
  assert.equal(results[0].engineVersion, engine.RECOMMENDATION_ENGINE_VERSION);
});

test("staff discovery is opt-in and rankings are deterministic", () => {
  const profile = { id: "staff-a", homeUniversityId: "mtu", disciplines: ["AI"], researchInterests: ["AI ethics"], teachingAreas: [], methods: ["qualitative"], collaborationGoals: ["Horizon Europe"], languages: ["English"], discoverable: true };
  const staffCandidates = [
    { id: "private", title: "Private person", kind: "staff", organizationId: "xamk", disciplines: ["AI"], themes: ["Ethics"], methods: ["qualitative"], needs: [], languages: ["English"], countries: [], studyLevels: [], eligibility: [], discoverable: false, status: "published" },
    { id: "public", title: "Public person", kind: "staff", organizationId: "xamk", disciplines: ["AI"], themes: ["Ethics"], methods: ["qualitative"], needs: ["Horizon Europe"], languages: ["English"], countries: [], studyLevels: [], eligibility: [], discoverable: true, status: "published" },
  ];
  const first = engine.recommend("academic_academic", profile, staffCandidates);
  const second = engine.recommend("academic_academic", profile, staffCandidates);
  assert.deepEqual(first, second);
  assert.deepEqual(first.map((item) => item.candidateId), ["public"]);
});

test("evaluation reports relevance, coverage and eligibility", () => {
  const report = engine.evaluateRecommendations([{ queryId: "q", rankedIds: ["a", "b"], relevantIds: ["a"], eligibleIds: ["a", "b", "c"] }], 2);
  assert.equal(report.precisionAtK, 0.5);
  assert.equal(report.recallAtK, 1);
  assert.equal(report.ndcgAtK, 1);
  assert.equal(report.eligibilityViolationRate, 0);
  assert.equal(report.coverage, 2 / 3);
});

test("local semantic feature vectors are deterministic and recognise controlled concepts", () => {
  const first = embedding.embedText("Artificial intelligence for climate education");
  const second = embedding.embedText("Artificial intelligence for climate education");
  assert.deepEqual(first, second);
  assert.equal(first.length, embedding.EMBEDDING_DIMENSIONS);
  assert.ok(embedding.cosineSimilarity(first, embedding.embedText("AI and sustainable learning")) > 0);
});
