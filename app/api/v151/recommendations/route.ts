import { handleApiError, jsonResponse, requireSession } from "@/lib/v151/api";
import { recommend, RECOMMENDATION_ENGINE_VERSION } from "@/lib/v151/recommendations";
import type { RecommendationCandidate, RecommendationType, StaffRecommendationProfile, StudentRecommendationProfile } from "@/lib/v151/types";
import { sha256Hex } from "@/lib/v151/upload-security";

const parse = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== "string") return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

const staffFromRow = (row: Record<string, unknown>): StaffRecommendationProfile => ({
  id: String(row.id), homeUniversityId: row.homeUniversityId ? String(row.homeUniversityId) : undefined,
  disciplines: parse<string[]>(row.researchInterests, []), researchInterests: parse<string[]>(row.researchInterests, []),
  teachingAreas: parse<string[]>(row.teachingAreas, []), methods: parse<string[]>(row.methods, []), collaborationGoals: parse<string[]>(row.collaborationGoals, []),
  skillsOffered: parse<string[]>(row.skillsOffered, []), skillsSought: parse<string[]>(row.skillsSought, []),
  methodsOffered: parse<string[]>(row.methodsOffered, []), methodsSought: parse<string[]>(row.methodsSought, []),
  facilitiesOffered: parse<string[]>(row.facilitiesOffered, []), facilitiesSought: parse<string[]>(row.facilitiesSought, []),
  teachingOffered: parse<string[]>(row.teachingOffered, []), teachingSought: parse<string[]>(row.teachingSought, []),
  collaborationFormats: parse<string[]>(row.collaborationFormats, []),
  languages: parse<string[]>(row.languages, []), availability: row.availability ? String(row.availability) : undefined, discoverable: Boolean(row.discoverable),
});

export async function GET(request: Request) {
  try {
    const { database, session } = await requireSession();
    const requested = new URL(request.url).searchParams.get("type") as RecommendationType | null;
    const type: RecommendationType = requested ?? (session.mode === "staff" ? "staff_call" : "student_module");
    if (!["student_module", "staff_call", "call_staff", "academic_academic"].includes(type)) return jsonResponse({ error: "Unsupported recommendation type" }, 400);

    let profile: StudentRecommendationProfile | StaffRecommendationProfile;
    let candidates: RecommendationCandidate[];
    if (type === "student_module") {
      if (!session.roles.includes("student")) return jsonResponse({ error: "Student membership required" }, 403);
      const row = await database.prepare(`SELECT home_university_id AS homeUniversityId, study_level AS studyLevel, interests_json AS interests,
        skills_json AS skills, goals_json AS goals, preferred_types_json AS preferredTypes, preferred_delivery_json AS preferredDelivery,
        languages_json AS languages, preferred_countries_json AS preferredCountries, travel_willingness AS travelWillingness,
        preferred_semester AS preferredSemester, schedule_constraints_json AS scheduleConstraints,
        desired_credits_min AS desiredCreditsMin, desired_credits_max AS desiredCreditsMax FROM student_profiles WHERE profile_id=?`)
        .bind(session.profileId).first<Record<string, unknown>>();
      const feedbackRows = await database.prepare(`SELECT rr.candidate_id AS candidateId, rf.signal FROM recommendation_feedback rf
        JOIN recommendation_results rr ON rr.id=rf.result_id WHERE rf.profile_id=? AND rf.signal IN ('saved','dismissed')`)
        .bind(session.profileId).all<{ candidateId: string; signal: string }>();
      profile = { id: session.profileId, homeUniversityId: row?.homeUniversityId ? String(row.homeUniversityId) : undefined, studyLevel: row?.studyLevel ? String(row.studyLevel) : undefined,
        interests: parse<string[]>(row?.interests, []), skills: parse<string[]>(row?.skills, []), goals: parse<string[]>(row?.goals, []),
        languages: parse<string[]>(row?.languages, []), preferredCountries: parse<string[]>(row?.preferredCountries, []),
        preferredTypes: parse<string[]>(row?.preferredTypes, []), preferredDelivery: parse<string[]>(row?.preferredDelivery, []),
        travelWillingness: text(row?.travelWillingness), preferredSemester: text(row?.preferredSemester), scheduleConstraints: parse<string[]>(row?.scheduleConstraints, []),
        desiredCreditsMin: numberValue(row?.desiredCreditsMin), desiredCreditsMax: numberValue(row?.desiredCreditsMax),
        savedCandidateIds: feedbackRows.results.filter((item) => item.signal === "saved").map((item) => item.candidateId),
        dismissedCandidateIds: feedbackRows.results.filter((item) => item.signal === "dismissed").map((item) => item.candidateId) };
      const rows = await database.prepare("SELECT id, title, type, owner_organization_id AS organizationId, status, payload_json AS payloadJson FROM content_records cr LEFT JOIN content_versions cv ON cv.id=cr.published_version_id WHERE cr.is_published=1 AND cr.type IN ('module','course','microcredential')").all<Record<string, unknown>>();
      candidates = rows.results.map((item) => { const payload = parse<Record<string, unknown>>(item.payloadJson, {}); return {
        id: String(item.id), title: String(item.title), kind: "module" as const, organizationId: item.organizationId ? String(item.organizationId) : undefined,
        disciplines: parseArray(payload.disciplines), themes: parseArray(payload.themes), methods: parseArray(payload.methods), needs: parseArray(payload.skillsDeveloped),
        skillsOffered: parseArray(payload.skillsDeveloped), skillsSought: [], methodsOffered: parseArray(payload.methods), methodsSought: [], facilitiesOffered: [], facilitiesSought: [],
        languages: parseArray(payload.languages), countries: parseArray(payload.countries), studyLevels: parseArray(payload.studyLevels), eligibility: parseArray(payload.eligibility),
        deliveryMode: text(payload.deliveryMode), semester: text(payload.semester), ects: numberValue(payload.ects), location: text(payload.location), deadline: text(payload.applicationDeadline), status: String(item.status),
      }; });
    } else if (type === "staff_call" || type === "academic_academic") {
      if (!session.roles.some((role) => ["staff", "contributor", "reviewer", "administrator"].includes(role))) return jsonResponse({ error: "Staff membership required" }, 403);
      const row = await database.prepare(`${staffProfileSelect()} WHERE sp.profile_id=?`)
        .bind(session.profileId).first<Record<string, unknown>>();
      if (!row) return jsonResponse({ error: "Complete your staff profile before requesting recommendations" }, 409);
      profile = staffFromRow(row);
      if (type === "staff_call") {
        const rows = await database.prepare("SELECT id, title, organization_id AS organizationId, disciplines_json AS disciplines, methods_json AS methods, skills_offered_json AS skillsOffered, skills_sought_json AS skillsSought, methods_offered_json AS methodsOffered, methods_sought_json AS methodsSought, facilities_offered_json AS facilitiesOffered, facilities_sought_json AS facilitiesSought, needs_json AS needs, eligibility_json AS eligibility, languages_json AS languages, countries_json AS countries, delivery_mode AS deliveryMode, deadline, status FROM collaboration_calls WHERE status='published'").all<Record<string, unknown>>();
        candidates = rows.results.map(callCandidate);
      } else {
        const rows = await database.prepare(`${staffCandidateSelect()} WHERE p.discoverable=1 AND sp.profile_id<>?`)
          .bind(session.profileId).all<Record<string, unknown>>();
        candidates = rows.results.map(staffCandidate);
      }
    } else {
      const callId = new URL(request.url).searchParams.get("callId");
      if (!callId) return jsonResponse({ error: "callId is required" }, 400);
      const call = await database.prepare("SELECT id, owner_profile_id AS ownerProfileId, title, organization_id AS organizationId, disciplines_json AS disciplines, methods_json AS methods, skills_offered_json AS skillsOffered, skills_sought_json AS skillsSought, methods_offered_json AS methodsOffered, methods_sought_json AS methodsSought, facilities_offered_json AS facilitiesOffered, facilities_sought_json AS facilitiesSought, needs_json AS needs, languages_json AS languages, countries_json AS countries, deadline, status FROM collaboration_calls WHERE id=? AND status='published'").bind(callId).first<Record<string, unknown>>();
      if (!call) return jsonResponse({ error: "Published call not found" }, 404);
      if (String(call.ownerProfileId) !== session.profileId && !session.roles.some((role) => ["reviewer", "administrator"].includes(role))) return jsonResponse({ error: "Only the call owner or a reviewer can access call-to-staff recommendations" }, 403);
      profile = { id: callId, homeUniversityId: text(call.organizationId), disciplines: parse<string[]>(call.disciplines, []), researchInterests: parse<string[]>(call.disciplines, []), teachingAreas: [],
        methods: parse<string[]>(call.methods, []), skillsOffered: parse<string[]>(call.skillsOffered, []), skillsSought: parse<string[]>(call.skillsSought, []),
        methodsOffered: parse<string[]>(call.methodsOffered, []), methodsSought: parse<string[]>(call.methodsSought, []),
        facilitiesOffered: parse<string[]>(call.facilitiesOffered, []), facilitiesSought: parse<string[]>(call.facilitiesSought, []),
        teachingOffered: [], teachingSought: [], collaborationFormats: [], collaborationGoals: parse<string[]>(call.needs, []),
        languages: parse<string[]>(call.languages, []), discoverable: false };
      const rows = await database.prepare(`${staffCandidateSelect()} WHERE p.discoverable=1 AND sp.profile_id<>?`)
        .bind(String(call.ownerProfileId)).all<Record<string, unknown>>();
      candidates = rows.results.map(staffCandidate);
    }

    const graphAffinity: Record<string, number> = {};
    const homeUniversityId = "homeUniversityId" in profile ? profile.homeUniversityId : undefined;
    if (type === "student_module" && homeUniversityId) {
      const links = await database.prepare("SELECT source_record_id AS source, target_record_id AS target FROM content_relationships WHERE source_record_id IN (SELECT id FROM content_records WHERE is_published=1) AND (source_record_id=? OR target_record_id=?)")
        .bind(homeUniversityId, homeUniversityId).all<{ source: string; target: string }>();
      const connected = new Set(links.results.map((link) => link.source === homeUniversityId ? link.target : link.source));
      for (const candidate of candidates) graphAffinity[candidate.id] = connected.has(candidate.id) ? 1 : 0.2;
    } else {
      for (const candidate of candidates) graphAffinity[candidate.id] = candidate.organizationId && candidate.organizationId !== homeUniversityId ? 0.65 : 0.45;
    }
    candidates.sort((left, right) => left.id.localeCompare(right.id));
    const input = JSON.stringify({ type, profile, candidates, graphAffinity, engineVersion: RECOMMENDATION_ENGINE_VERSION });
    const inputHash = await sha256Hex(new TextEncoder().encode(input).buffer as ArrayBuffer);
    const existing = await database.prepare("SELECT id FROM recommendation_runs WHERE input_hash=?").bind(inputHash).first<{ id: string }>();
    if (existing) {
      const rows = await database.prepare("SELECT id,candidate_id AS candidateId,candidate_type AS candidateKind,rank,score,label,components_json AS components,explanations_json AS explanations FROM recommendation_results WHERE run_id=? ORDER BY rank").bind(existing.id).all<Record<string, unknown>>();
      return jsonResponse({ runId: existing.id, type, engineVersion: RECOMMENDATION_ENGINE_VERSION, cached: true, results: rows.results.map((row) => ({ ...row, candidateTitle: candidates.find((candidate) => candidate.id === row.candidateId)?.title ?? String(row.candidateId), components: parse<Record<string, number>>(row.components, {}), explanations: parse<string[]>(row.explanations, []) })) });
    }
    const results = recommend(type, profile, candidates, { limit: 12, maxPerOrganization: 2, graphAffinity });
    const runId = `recommendation_${crypto.randomUUID()}`;
    const resultRows = results.map((result, index) => ({ id: `result_${crypto.randomUUID()}`, ...result, rank: index + 1 }));
    await database.batch([
      database.prepare("INSERT INTO recommendation_runs (id, profile_id, recommendation_type, engine_version, input_hash, context_json) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(runId, session.profileId, type, RECOMMENDATION_ENGINE_VERSION, inputHash, JSON.stringify({ candidateCount: candidates.length })),
      ...resultRows.map((result) => database.prepare("INSERT INTO recommendation_results (id, run_id, candidate_type, candidate_id, rank, score, label, components_json, explanations_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(result.id, runId, result.candidateKind, result.candidateId, result.rank, result.score, result.label, JSON.stringify(result.components), JSON.stringify(result.explanations))),
    ]);
    return jsonResponse({ runId, type, engineVersion: RECOMMENDATION_ENGINE_VERSION, results: resultRows });
  } catch (error) { return handleApiError(error); }
}

function parseArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : typeof value === "string" ? parse<string[]>(value, []) : []; }
function text(value: unknown): string | undefined { return typeof value === "string" && value ? value : undefined; }
function numberValue(value: unknown): number | undefined { return typeof value === "number" && Number.isFinite(value) ? value : undefined; }
function staffProfileSelect() { return `SELECT sp.profile_id AS id, sp.home_university_id AS homeUniversityId, sp.research_interests_json AS researchInterests,
  sp.teaching_areas_json AS teachingAreas, sp.methods_json AS methods, sp.skills_offered_json AS skillsOffered, sp.skills_sought_json AS skillsSought,
  sp.methods_offered_json AS methodsOffered, sp.methods_sought_json AS methodsSought, sp.facilities_offered_json AS facilitiesOffered,
  sp.facilities_sought_json AS facilitiesSought, sp.teaching_offered_json AS teachingOffered, sp.teaching_sought_json AS teachingSought,
  sp.collaboration_formats_json AS collaborationFormats, sp.collaboration_goals_json AS collaborationGoals, sp.languages_json AS languages,
  sp.availability, p.discoverable FROM staff_profiles sp JOIN profiles p ON p.id=sp.profile_id`; }
function staffCandidateSelect() { return staffProfileSelect().replace("sp.home_university_id AS homeUniversityId", "p.display_name AS title, sp.home_university_id AS organizationId"); }
function callCandidate(row: Record<string, unknown>): RecommendationCandidate { return {
  id: String(row.id), title: String(row.title), kind: "call", organizationId: text(row.organizationId), disciplines: parse<string[]>(row.disciplines, []), themes: parse<string[]>(row.disciplines, []),
  methods: parse<string[]>(row.methods, []), needs: parse<string[]>(row.needs, []), languages: parse<string[]>(row.languages, []), countries: parse<string[]>(row.countries, []),
  skillsOffered: parse<string[]>(row.skillsOffered, []), skillsSought: parse<string[]>(row.skillsSought, []),
  methodsOffered: parse<string[]>(row.methodsOffered, []), methodsSought: parse<string[]>(row.methodsSought, []),
  facilitiesOffered: parse<string[]>(row.facilitiesOffered, []), facilitiesSought: parse<string[]>(row.facilitiesSought, []),
  studyLevels: [], eligibility: parse<string[]>(row.eligibility, []), deliveryMode: text(row.deliveryMode), deadline: text(row.deadline), status: text(row.status),
}; }
function staffCandidate(row: Record<string, unknown>): RecommendationCandidate { return {
  id: String(row.id), title: String(row.title), kind: "staff", organizationId: text(row.organizationId), disciplines: parse<string[]>(row.researchInterests, []),
  themes: [...parse<string[]>(row.researchInterests, []), ...parse<string[]>(row.teachingAreas, [])], methods: parse<string[]>(row.methods, []), needs: parse<string[]>(row.collaborationGoals, []),
  skillsOffered: parse<string[]>(row.skillsOffered, []), skillsSought: parse<string[]>(row.skillsSought, []),
  methodsOffered: parse<string[]>(row.methodsOffered, []), methodsSought: parse<string[]>(row.methodsSought, []),
  facilitiesOffered: parse<string[]>(row.facilitiesOffered, []), facilitiesSought: parse<string[]>(row.facilitiesSought, []),
  languages: parse<string[]>(row.languages, []), countries: [], studyLevels: [], eligibility: [], discoverable: Boolean(row.discoverable), status: "published",
}; }
