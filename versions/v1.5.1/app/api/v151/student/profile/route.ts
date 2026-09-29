import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { requirePermission } from "@/lib/v151/authorization";
import { saveStudentProfile } from "@/lib/v151/repository";
import { asObject, optionalNumber, optionalText, stringList } from "@/lib/v151/validation";

export async function GET() {
  try {
    const { database, session } = await requireSession();
    requirePermission(session.roles, "profile:student");
    const profile = await database.prepare(`SELECT home_university_id AS homeUniversityId, programme, field_of_study AS fieldOfStudy,
      study_level AS studyLevel, study_year AS studyYear, interests_json AS interests, skills_json AS skills, goals_json AS goals,
      preferred_types_json AS preferredTypes, preferred_delivery_json AS preferredDelivery, languages_json AS languages,
      preferred_countries_json AS preferredCountries, travel_willingness AS travelWillingness, preferred_semester AS preferredSemester,
      schedule_constraints_json AS scheduleConstraints, desired_credits_min AS desiredCreditsMin, desired_credits_max AS desiredCreditsMax,
      accessibility_json AS accessibility FROM student_profiles WHERE profile_id = ?`)
      .bind(session.profileId).first<Record<string, unknown>>();
    return jsonResponse({ profile });
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "student_profile", session.profileId, 60);
    requirePermission(session.roles, "profile:student");
    const input = asObject(await readJson(request));
    const profile = {
      homeUniversityId: optionalText(input, "homeUniversityId", 160), programme: optionalText(input, "programme", 200),
      fieldOfStudy: optionalText(input, "fieldOfStudy", 200), studyLevel: optionalText(input, "studyLevel", 80), studyYear: optionalText(input, "studyYear", 40),
      interests: stringList(input, "interests"), skills: stringList(input, "skills"), goals: stringList(input, "goals"),
      preferredTypes: stringList(input, "preferredTypes"), preferredDelivery: stringList(input, "preferredDelivery"),
      languages: stringList(input, "languages"), preferredCountries: stringList(input, "preferredCountries"),
      travelWillingness: optionalText(input, "travelWillingness", 80), preferredSemester: optionalText(input, "preferredSemester", 100),
      scheduleConstraints: stringList(input, "scheduleConstraints"), desiredCreditsMin: optionalNumber(input, "desiredCreditsMin", 0, 60),
      desiredCreditsMax: optionalNumber(input, "desiredCreditsMax", 0, 60), accessibility: stringList(input, "accessibility", 20),
    };
    if (profile.desiredCreditsMin !== undefined && profile.desiredCreditsMax !== undefined && profile.desiredCreditsMin > profile.desiredCreditsMax) {
      return jsonResponse({ error: "desiredCreditsMin cannot exceed desiredCreditsMax" }, 400);
    }
    await saveStudentProfile(database, session.profileId, profile);
    return jsonResponse({ saved: true, profile });
  } catch (error) { return handleApiError(error); }
}
