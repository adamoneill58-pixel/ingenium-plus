import type { AppRole } from "@/db/schema";
import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { audit } from "@/lib/v151/repository";
import { asObject, optionalText, requiredText } from "@/lib/v151/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "membership_grant", session.profileId, 30);
    requirePermission(session.roles, "roles:grant");
    const input = asObject(await readJson(request));
    const email = requiredText(input, "email", 320).toLocaleLowerCase();
    const role = requiredText(input, "role", 40) as AppRole;
    if (!["student", "staff", "contributor", "reviewer", "administrator"].includes(role)) return jsonResponse({ error: "Invalid role" }, 400);
    const organizationId = optionalText(input, "organizationId", 160) ?? null;
    const profile = await database.prepare("SELECT id FROM profiles WHERE lower(email)=?").bind(email).first<{ id: string }>();
    if (!profile) return jsonResponse({ error: "The person must sign in once before a membership can be granted." }, 404);
    await database.prepare(`INSERT INTO memberships (id,profile_id,organization_id,role,status,granted_by) VALUES (?,?,?,?, 'active',?)
      ON CONFLICT(profile_id,organization_id,role) DO UPDATE SET status='active',granted_by=excluded.granted_by,granted_at=CURRENT_TIMESTAMP`)
      .bind(`membership_${crypto.randomUUID()}`, profile.id, organizationId, role, session.profileId).run();
    if (["staff", "contributor", "reviewer", "administrator"].includes(role)) {
      await database.prepare("INSERT OR IGNORE INTO staff_profiles (profile_id,home_university_id) VALUES (?,?)").bind(profile.id, organizationId).run();
    }
    await audit(database, session.profileId, "membership.granted", "profile", profile.id, { organizationId, role });
    return jsonResponse({ granted: true, profileId: profile.id, organizationId, role });
  } catch (error) { return handleApiError(error); }
}
