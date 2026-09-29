import { requirePermission } from "@/lib/v151/authorization";
import { assertSameOrigin, enforceRateLimit, handleApiError, jsonResponse, readJson, requireSession } from "@/lib/v151/api";
import { audit } from "@/lib/v151/repository";
import { asObject, requiredText } from "@/lib/v151/validation";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { database, session } = await requireSession();
    await enforceRateLimit(database, "content_rollback", session.profileId, 20);
    requirePermission(session.roles, "roles:grant");
    const input = asObject(await readJson(request));
    const targetType = requiredText(input, "targetType", 40);
    const targetId = requiredText(input, "targetId", 180);
    const reason = requiredText(input, "reason", 2_000);
    const versionNumber = Number(input.versionNumber);
    if (!Number.isInteger(versionNumber) || versionNumber < 1) return jsonResponse({ error: "versionNumber must be a positive integer" }, 400);
    if (targetType === "content_record") {
      const version = await database.prepare("SELECT id,payload_json AS payloadJson FROM content_versions WHERE record_id=? AND version_number=?").bind(targetId, versionNumber).first<{ id: string; payloadJson: string }>();
      if (!version) return jsonResponse({ error: "Content version not found" }, 404);
      const payload = JSON.parse(version.payloadJson) as Record<string, unknown>;
      await database.batch([
        database.prepare("UPDATE content_records SET published_version_id=?,title=?,summary=?,status=?,official_url=?,is_published=1,updated_at=CURRENT_TIMESTAMP WHERE id=?")
          .bind(version.id, payload.title ?? "Untitled", payload.studentSummary ?? payload.summary ?? "", payload.status ?? "Open", payload.officialUrl ?? null, targetId),
        database.prepare("INSERT INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,'content.rollback','content_record',?,?)")
          .bind(`audit_${crypto.randomUUID()}`, session.profileId, targetId, JSON.stringify({ versionNumber, reason })),
      ]);
    } else if (targetType === "call") {
      const version = await database.prepare("SELECT payload_json AS payloadJson FROM call_versions WHERE call_id=? AND version_number=?").bind(targetId, versionNumber).first<{ payloadJson: string }>();
      if (!version) return jsonResponse({ error: "Call version not found" }, 404);
      const payload = JSON.parse(version.payloadJson) as Record<string, unknown>;
      await database.batch([
        database.prepare("UPDATE call_versions SET is_published=CASE WHEN version_number=? THEN 1 ELSE 0 END WHERE call_id=?").bind(versionNumber, targetId),
        database.prepare(`UPDATE collaboration_calls SET title=?,summary=?,description=?,disciplines_json=?,methods_json=?,skills_offered_json=?,skills_sought_json=?,
          methods_offered_json=?,methods_sought_json=?,facilities_offered_json=?,facilities_sought_json=?,needs_json=?,eligibility_json=?,languages_json=?,
          countries_json=?,delivery_mode=?,deadline=?,status='published',updated_at=CURRENT_TIMESTAMP WHERE id=?`)
          .bind(payload.title, payload.summary, payload.description, JSON.stringify(payload.disciplines ?? []), JSON.stringify(payload.methods ?? []),
            JSON.stringify(payload.skillsOffered ?? []), JSON.stringify(payload.skillsSought ?? []), JSON.stringify(payload.methodsOffered ?? []),
            JSON.stringify(payload.methodsSought ?? []), JSON.stringify(payload.facilitiesOffered ?? []), JSON.stringify(payload.facilitiesSought ?? []),
            JSON.stringify(payload.needs ?? []), JSON.stringify(payload.eligibility ?? []), JSON.stringify(payload.languages ?? []),
            JSON.stringify(payload.countries ?? []), payload.deliveryMode ?? null, payload.deadline ?? null, targetId),
        database.prepare("INSERT INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,'call.rollback','call',?,?)")
          .bind(`audit_${crypto.randomUUID()}`, session.profileId, targetId, JSON.stringify({ versionNumber, reason })),
      ]);
    } else return jsonResponse({ error: "targetType must be content_record or call" }, 400);
    await audit(database, session.profileId, "rollback.completed", targetType, targetId, { versionNumber, reason });
    return jsonResponse({ rolledBack: true, targetType, targetId, versionNumber });
  } catch (error) { return handleApiError(error); }
}
