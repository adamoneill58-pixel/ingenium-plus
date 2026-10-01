import type {
  EvaluationExample,
  MatchLabel,
  RecommendationCandidate,
  RecommendationResult,
  RecommendationType,
  ScoreComponents,
  StaffRecommendationProfile,
  StudentRecommendationProfile,
} from "./types";
import { cosineSimilarity, embedText } from "./embeddings";

export const RECOMMENDATION_ENGINE_VERSION = "ingenium-hybrid-1.0.0";

const weights: Record<RecommendationType, ScoreComponents> = {
  student_module: { theme: 22, method: 0, goal: 16, language: 10, mobility: 6, complementarity: 0, graph: 10, freshness: 8, delivery: 10, schedule: 5, credits: 5, feedback: 8 },
  staff_call: { theme: 20, method: 14, goal: 14, language: 7, mobility: 5, complementarity: 22, graph: 8, freshness: 6, delivery: 4, schedule: 0, credits: 0, feedback: 0 },
  call_staff: { theme: 18, method: 14, goal: 12, language: 7, mobility: 5, complementarity: 28, graph: 8, freshness: 4, delivery: 4, schedule: 0, credits: 0, feedback: 0 },
  academic_academic: { theme: 15, method: 12, goal: 12, language: 6, mobility: 4, complementarity: 32, graph: 9, freshness: 4, delivery: 6, schedule: 0, credits: 0, feedback: 0 },
};

const normalise = (value: string) => value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const words = (values: string[]) => new Set(values.flatMap((value) => normalise(value).split(" ")).filter((value) => value.length > 2));

function similarity(left: string[], right: string[]): number {
  const a = words(left);
  const b = words(right);
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const value of a) if (b.has(value)) overlap += 1;
  const lexical = overlap / Math.sqrt(a.size * b.size);
  const semantic = cosineSimilarity(embedText(left.join(" ")), embedText(right.join(" ")));
  return Math.min(1, lexical * 0.55 + semantic * 0.45);
}

function shared(left: string[], right: string[]): string[] {
  const rightValues = new Set(right.map(normalise));
  return left.filter((value) => rightValues.has(normalise(value)));
}

function isFuture(deadline?: string, today = new Date()): boolean {
  if (!deadline) return true;
  const end = new Date(`${deadline.slice(0, 10)}T23:59:59Z`);
  return Number.isFinite(end.getTime()) && end >= today;
}

function hardEligible(
  type: RecommendationType,
  profile: StudentRecommendationProfile | StaffRecommendationProfile,
  candidate: RecommendationCandidate,
  today: Date,
): boolean {
  if (candidate.status && ["closed", "archived", "rejected", "draft", "pending"].includes(normalise(candidate.status))) return false;
  if (!isFuture(candidate.deadline, today)) return false;
  if ("dismissedCandidateIds" in profile && profile.dismissedCandidateIds.includes(candidate.id)) return false;
  if ((type === "call_staff" || type === "academic_academic") && candidate.discoverable !== true) return false;
  if (type === "student_module") {
    const student = profile as StudentRecommendationProfile;
    if (candidate.studyLevels.length && student.studyLevel && !candidate.studyLevels.some((level) => normalise(level).includes(normalise(student.studyLevel!)))) return false;
    if (candidate.languages.length && student.languages.length && !shared(candidate.languages, student.languages).length) return false;
    if (student.travelWillingness === "none" && candidate.deliveryMode && /physical|campus|in.person/i.test(candidate.deliveryMode)) return false;
  }
  return true;
}

function label(score: number): MatchLabel {
  if (score >= 75) return "Strong match";
  if (score >= 50) return "Good match";
  return "Possible match";
}

function vectorFor(type: RecommendationType, profile: StudentRecommendationProfile | StaffRecommendationProfile) {
  if (type === "student_module") {
    const student = profile as StudentRecommendationProfile;
    return { themes: [...student.interests, ...(student.skills ?? [])], methods: [], goals: student.goals, languages: student.languages, countries: student.preferredCountries,
      skillsOffered: student.skills ?? [], skillsSought: student.skills ?? [], methodsOffered: [], methodsSought: [], facilitiesOffered: [], facilitiesSought: [] };
  }
  const staff = profile as StaffRecommendationProfile;
  return {
    themes: [...staff.disciplines, ...staff.researchInterests, ...staff.teachingAreas],
    methods: [...staff.methods, ...(staff.methodsOffered ?? [])],
    goals: staff.collaborationGoals,
    languages: staff.languages,
    countries: [],
    skillsOffered: staff.skillsOffered ?? [],
    skillsSought: staff.skillsSought ?? [],
    methodsOffered: staff.methodsOffered ?? [],
    methodsSought: staff.methodsSought ?? [],
    facilitiesOffered: staff.facilitiesOffered ?? [],
    facilitiesSought: staff.facilitiesSought ?? [],
  };
}

function complementarityScore(input: ReturnType<typeof vectorFor>, candidate: RecommendationCandidate): number {
  const forward = similarity(
    [...input.skillsOffered, ...input.methodsOffered, ...input.facilitiesOffered],
    [...(candidate.skillsSought ?? []), ...(candidate.methodsSought ?? []), ...(candidate.facilitiesSought ?? []), ...candidate.needs],
  );
  const reverse = similarity(
    [...(candidate.skillsOffered ?? []), ...(candidate.methodsOffered ?? []), ...(candidate.facilitiesOffered ?? [])],
    [...input.skillsSought, ...input.methodsSought, ...input.facilitiesSought],
  );
  return Math.max(forward, reverse, (forward + reverse) / 2);
}

export function recommend(
  type: RecommendationType,
  profile: StudentRecommendationProfile | StaffRecommendationProfile,
  candidates: RecommendationCandidate[],
  options: { limit?: number; today?: Date; graphAffinity?: Record<string, number>; maxPerOrganization?: number } = {},
): RecommendationResult[] {
  const today = options.today ?? new Date();
  const input = vectorFor(type, profile);
  const typeWeights = weights[type];
  const scored = candidates
    .filter((candidate) => hardEligible(type, profile, candidate, today))
    .map((candidate) => {
      const themeSimilarity = similarity(input.themes, [...candidate.themes, ...candidate.disciplines]);
      const methodSimilarity = similarity(input.methods, candidate.methods);
      const goalSimilarity = similarity(input.goals, [...candidate.needs, ...candidate.themes]);
      const languageSimilarity = candidate.languages.length ? similarity(input.languages, candidate.languages) : 0.6;
      const mobilitySimilarity = candidate.countries.length && input.countries.length ? similarity(input.countries, candidate.countries) : 0.4;
      const complementarity = type === "student_module" ? 0 : complementarityScore(input, candidate);
      const graphAffinity = Math.max(0, Math.min(1, options.graphAffinity?.[candidate.id] ?? 0.35));
      const deadlineDays = candidate.deadline ? Math.max(0, (new Date(candidate.deadline).getTime() - today.getTime()) / 86_400_000) : 60;
      const freshness = Math.min(1, deadlineDays <= 45 ? 1 : 45 / deadlineDays);
      const student = type === "student_module" ? profile as StudentRecommendationProfile : undefined;
      const delivery = !student?.preferredDelivery?.length || !candidate.deliveryMode ? 0.6 : similarity(student.preferredDelivery, [candidate.deliveryMode]);
      const schedule = !student?.preferredSemester || !candidate.semester ? 0.6 : similarity([student.preferredSemester], [candidate.semester]);
      const credits = !student || candidate.ects === undefined || (student.desiredCreditsMin === undefined && student.desiredCreditsMax === undefined)
        ? 0.6
        : candidate.ects >= (student.desiredCreditsMin ?? 0) && candidate.ects <= (student.desiredCreditsMax ?? Number.POSITIVE_INFINITY) ? 1 : 0;
      const feedback = student?.savedCandidateIds?.includes(candidate.id) ? 1 : 0;
      const raw = {
        theme: themeSimilarity * typeWeights.theme,
        method: methodSimilarity * typeWeights.method,
        goal: goalSimilarity * typeWeights.goal,
        language: languageSimilarity * typeWeights.language,
        mobility: mobilitySimilarity * typeWeights.mobility,
        complementarity: complementarity * typeWeights.complementarity,
        graph: graphAffinity * typeWeights.graph,
        freshness: freshness * typeWeights.freshness,
        delivery: delivery * typeWeights.delivery,
        schedule: schedule * typeWeights.schedule,
        credits: credits * typeWeights.credits,
        feedback: feedback * typeWeights.feedback,
      };
      const components = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Math.round(value)])) as unknown as ScoreComponents;
      const score = Math.max(0, Math.min(100, Object.values(raw).reduce((sum, value) => sum + value, 0)));
      const themeMatches = shared(input.themes, [...candidate.themes, ...candidate.disciplines]);
      const methodMatches = shared(input.methods, candidate.methods);
      const goalMatches = shared(input.goals, [...candidate.needs, ...candidate.themes]);
      const explanations = [
        themeMatches.length ? `Shared focus: ${themeMatches.slice(0, 3).join(", ")}.` : "Adjacent subject area that could broaden your network.",
        methodMatches.length ? `Methods in common: ${methodMatches.slice(0, 2).join(", ")}.` : undefined,
        goalMatches.length ? `Supports your goal: ${goalMatches.slice(0, 2).join(", ")}.` : undefined,
        complementarity >= 0.3 && type !== "student_module" ? "Offered and sought expertise complement each other." : undefined,
        student?.preferredDelivery?.length && candidate.deliveryMode && delivery > 0.4 ? `Matches your preferred ${candidate.deliveryMode} delivery.` : undefined,
        student?.preferredSemester && candidate.semester && schedule > 0.4 ? `Available in your preferred ${candidate.semester} period.` : undefined,
        feedback ? "You previously saved this opportunity." : undefined,
        candidate.organizationId && candidate.organizationId !== ("homeUniversityId" in profile ? profile.homeUniversityId : undefined) ? "Adds a cross-university connection." : undefined,
      ].filter((value): value is string => Boolean(value));
      return {
        candidateId: candidate.id,
        candidateTitle: candidate.title,
        candidateKind: candidate.kind,
        score: Math.round(score),
        label: label(score),
        components,
        explanations,
        engineVersion: RECOMMENDATION_ENGINE_VERSION,
        organizationId: candidate.organizationId ?? candidate.hostUniversityId ?? "unknown",
      };
    })
    .filter((result) => result.score >= 18)
    .sort((left, right) => right.score - left.score || left.candidateTitle.localeCompare(right.candidateTitle));

  const limited: RecommendationResult[] = [];
  const organizationCounts = new Map<string, number>();
  const maximum = options.maxPerOrganization ?? 2;
  for (const item of scored) {
    const organizationId = item.organizationId;
    if ((organizationCounts.get(organizationId) ?? 0) >= maximum) continue;
    organizationCounts.set(organizationId, (organizationCounts.get(organizationId) ?? 0) + 1);
    const result = Object.fromEntries(Object.entries(item).filter(([key]) => key !== "organizationId")) as unknown as RecommendationResult;
    limited.push(result);
    if (limited.length >= (options.limit ?? 8)) break;
  }
  return limited;
}

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export function evaluateRecommendations(examples: EvaluationExample[], k = 5) {
  const metrics = examples.map((example) => {
    const top = example.rankedIds.slice(0, k);
    const relevant = new Set(example.relevantIds);
    const eligible = new Set(example.eligibleIds);
    const hits = top.filter((id) => relevant.has(id)).length;
    const dcg = top.reduce((sum, id, index) => sum + (relevant.has(id) ? 1 / Math.log2(index + 2) : 0), 0);
    const idealHits = Math.min(k, relevant.size);
    const idcg = Array.from({ length: idealHits }, (_, index) => 1 / Math.log2(index + 2)).reduce((sum, value) => sum + value, 0);
    return {
      precision: hits / Math.max(top.length, 1),
      recall: hits / Math.max(relevant.size, 1),
      ndcg: idcg ? dcg / idcg : 0,
      eligibilityViolations: top.filter((id) => !eligible.has(id)).length / Math.max(top.length, 1),
    };
  });
  const covered = new Set(examples.flatMap((example) => example.rankedIds.slice(0, k)));
  const eligibleUniverse = new Set(examples.flatMap((example) => example.eligibleIds));
  return {
    k,
    precisionAtK: average(metrics.map((metric) => metric.precision)),
    recallAtK: average(metrics.map((metric) => metric.recall)),
    ndcgAtK: average(metrics.map((metric) => metric.ndcg)),
    eligibilityViolationRate: average(metrics.map((metric) => metric.eligibilityViolations)),
    coverage: covered.size / Math.max(eligibleUniverse.size, 1),
    examples: examples.length,
  };
}
