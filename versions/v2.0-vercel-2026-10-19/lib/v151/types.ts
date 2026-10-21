import type { AppRole } from "@/db/schema";

export type RecommendationType = "student_module" | "staff_call" | "call_staff" | "academic_academic";
export type MatchLabel = "Strong match" | "Good match" | "Possible match";

export interface StudentRecommendationProfile {
  id: string;
  homeUniversityId?: string;
  studyLevel?: string;
  interests: string[];
  skills: string[];
  goals: string[];
  languages: string[];
  preferredCountries: string[];
  preferredTypes: string[];
  preferredDelivery: string[];
  travelWillingness?: string;
  preferredSemester?: string;
  scheduleConstraints: string[];
  desiredCreditsMin?: number;
  desiredCreditsMax?: number;
  savedCandidateIds: string[];
  dismissedCandidateIds: string[];
}

export interface StaffRecommendationProfile {
  id: string;
  homeUniversityId?: string;
  disciplines: string[];
  researchInterests: string[];
  teachingAreas: string[];
  methods: string[];
  skillsOffered: string[];
  skillsSought: string[];
  methodsOffered: string[];
  methodsSought: string[];
  facilitiesOffered: string[];
  facilitiesSought: string[];
  teachingOffered: string[];
  teachingSought: string[];
  collaborationFormats: string[];
  collaborationGoals: string[];
  languages: string[];
  availability?: string;
  discoverable: boolean;
}

export interface RecommendationCandidate {
  id: string;
  title: string;
  kind: "module" | "call" | "staff";
  organizationId?: string;
  hostUniversityId?: string;
  disciplines: string[];
  themes: string[];
  methods: string[];
  needs: string[];
  skillsOffered: string[];
  skillsSought: string[];
  methodsOffered: string[];
  methodsSought: string[];
  facilitiesOffered: string[];
  facilitiesSought: string[];
  languages: string[];
  countries: string[];
  studyLevels: string[];
  eligibility: string[];
  deliveryMode?: string;
  semester?: string;
  ects?: number;
  location?: string;
  deadline?: string;
  discoverable?: boolean;
  status?: string;
}

export interface ScoreComponents {
  theme: number;
  method: number;
  goal: number;
  language: number;
  mobility: number;
  complementarity: number;
  graph: number;
  freshness: number;
  delivery: number;
  schedule: number;
  credits: number;
  feedback: number;
}

export interface RecommendationResult {
  candidateId: string;
  candidateTitle: string;
  candidateKind: RecommendationCandidate["kind"];
  score: number;
  label: MatchLabel;
  components: ScoreComponents;
  explanations: string[];
  engineVersion: string;
}

export interface SessionContext {
  profileId: string;
  authSubject: string;
  email: string;
  displayName: string;
  roles: AppRole[];
  mode: "student" | "staff";
}

export interface EvaluationExample {
  queryId: string;
  rankedIds: string[];
  relevantIds: string[];
  eligibleIds: string[];
}
