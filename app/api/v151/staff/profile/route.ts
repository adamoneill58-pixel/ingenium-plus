import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { requirePermission } from "@/lib/v151/authorization";
import { saveStaffProfile } from "@/lib/v151/repository";
import { asObject, optionalText, stringList } from "@/lib/v151/validation";

export async function GET() {
  try {
    const { database, session } = await requireSession();
    requirePermission(session.roles, "profile:staff");
    const profile = await database.prepare("SELECT sp.*, p.discoverable FROM staff_profiles sp JOIN profiles p ON p.id = sp.profile_id WHERE sp.profile_id = ?")
      .bind(session.profileId).first<Record<string, unknown>>();
    return jsonResponse({ profile });
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "staff_profile", session.profileId, 60);
    requirePermission(session.roles, "profile:staff");
    const input = asObject(await readJson(request));
    const profile = {
      homeUniversityId: optionalText(input, "homeUniversityId", 160), title: optionalText(input, "title", 160), department: optionalText(input, "department", 200),
      researchInterests: stringList(input, "researchInterests"), teachingAreas: stringList(input, "teachingAreas"), methods: stringList(input, "methods"),
      skillsOffered: stringList(input, "skillsOffered"), skillsSought: stringList(input, "skillsSought"),
      methodsOffered: stringList(input, "methodsOffered"), methodsSought: stringList(input, "methodsSought"),
      facilitiesOffered: stringList(input, "facilitiesOffered"), facilitiesSought: stringList(input, "facilitiesSought"),
      teachingOffered: stringList(input, "teachingOffered"), teachingSought: stringList(input, "teachingSought"),
      collaborationFormats: stringList(input, "collaborationFormats"),
      collaborationGoals: stringList(input, "collaborationGoals"), languages: stringList(input, "languages"), availability: optionalText(input, "availability", 300),
      contactRoute: optionalText(input, "contactRoute", 300),
      discoverable: input.discoverable === true,
    };
    await saveStaffProfile(database, session.profileId, profile);
    return jsonResponse({ saved: true, profile });
  } catch (error) { return handleApiError(error); }
}
