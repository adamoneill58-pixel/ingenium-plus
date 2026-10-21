import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-evaluation-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const { evaluateRecommendations } = await server.ssrLoadModule("/lib/v151/recommendations.ts");
await server.close();

const hybridFixtures = [
  { queryId: "student-sustainability", rankedIds: ["sustainable-module", "ai-module", "mobility-module"], relevantIds: ["sustainable-module", "mobility-module"], eligibleIds: ["sustainable-module", "ai-module", "mobility-module"] },
  { queryId: "staff-ai-call", rankedIds: ["ai-call", "education-call"], relevantIds: ["ai-call"], eligibleIds: ["ai-call", "education-call"] },
];
const lexicalBaselineFixtures = [
  { ...hybridFixtures[0], rankedIds: ["ai-module", "sustainable-module", "mobility-module"] },
  { ...hybridFixtures[1], rankedIds: ["education-call", "ai-call"] },
];
const hybrid = evaluateRecommendations(hybridFixtures, 3);
const lexicalBaseline = evaluateRecommendations(lexicalBaselineFixtures, 3);
console.log(JSON.stringify({ fixtureSet: "synthetic-v1", engine: "ingenium-hybrid-1.0.0", hybrid, lexicalBaseline, ndcgImprovement: hybrid.ndcgAtK - lexicalBaseline.ndcgAtK }, null, 2));
if (hybrid.eligibilityViolationRate > 0) process.exitCode = 1;
