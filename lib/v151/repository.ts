import type { AppRole } from "@/db/schema";
import type { ChatGPTUser } from "@/app/chatgpt-auth";
import type { SessionContext } from "./types";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL, EMBEDDING_PROVIDER, embedText } from "./embeddings";
import { sha256Hex } from "./upload-security";
import { AuthorizationError } from "./authorization";
import { bootstrapPrivateOwner } from "./private-bootstrap";
import { getRuntimeBindings } from "./bindings";

const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
const json = (value: unknown) => JSON.stringify(value ?? null);

export async function getOrCreateSession(database: D1Database, user: ChatGPTUser): Promise<SessionContext> {
  let profile = await database.prepare("SELECT id, auth_subject AS authSubject, email, display_name AS displayName, mode FROM profiles WHERE auth_subject = ?")
    .bind(user.userId).first<{ id: string; authSubject: string; email: string; displayName: string; mode: "student" | "staff" }>();
  if (!profile) {
    const profileId = id("profile");
    await database.batch([
      database.prepare("INSERT INTO profiles (id, auth_subject, email, display_name, mode, last_seen_at) VALUES (?, ?, ?, ?, 'student', CURRENT_TIMESTAMP)")
        .bind(profileId, user.userId, user.email, user.displayName),
      database.prepare("INSERT INTO memberships (id, profile_id, organization_id, role, status) VALUES (?, ?, NULL, 'student', 'active')")
        .bind(id("membership"), profileId),
      database.prepare("INSERT INTO student_profiles (profile_id) VALUES (?)").bind(profileId),
      database.prepare("INSERT INTO audit_events (id, actor_profile_id, action, resource_type, resource_id, metadata_json) VALUES (?, ?, 'profile.created', 'profile', ?, ?)")
        .bind(id("audit"), profileId, profileId, json({ source: "chatgpt-auth" })),
    ]);
    profile = { id: profileId, authSubject: user.userId, email: user.email, displayName: user.displayName, mode: "student" };
  } else {
    await database.prepare("UPDATE profiles SET email = ?, display_name = ?, last_seen_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(user.email, user.displayName, profile.id).run();
  }
  await bootstrapPrivateOwner(database, user, profile.id, getRuntimeBindings().BOOTSTRAP_OWNER_EMAIL);
  const roleRows = await database.prepare("SELECT role FROM memberships WHERE profile_id = ? AND status = 'active'").bind(profile.id).all<{ role: AppRole }>();
  return { profileId: profile.id, authSubject: profile.authSubject, email: user.email, displayName: user.displayName, mode: profile.mode, roles: roleRows.results.map((row) => row.role) };
}

export async function saveMode(database: D1Database, profileId: string, mode: "student" | "staff") {
  await database.prepare("UPDATE profiles SET mode = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(mode, profileId).run();
}

export async function saveStudentProfile(database: D1Database, profileId: string, input: Record<string, unknown>) {
  await database.prepare(`INSERT INTO student_profiles
    (profile_id, home_university_id, programme, field_of_study, study_level, study_year, interests_json, skills_json, goals_json,
     preferred_types_json, preferred_delivery_json, languages_json, preferred_countries_json, travel_willingness, preferred_semester,
     schedule_constraints_json, desired_credits_min, desired_credits_max, accessibility_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(profile_id) DO UPDATE SET home_university_id=excluded.home_university_id, programme=excluded.programme,
    field_of_study=excluded.field_of_study, study_level=excluded.study_level, study_year=excluded.study_year,
    interests_json=excluded.interests_json, skills_json=excluded.skills_json, goals_json=excluded.goals_json,
    preferred_types_json=excluded.preferred_types_json, preferred_delivery_json=excluded.preferred_delivery_json,
    languages_json=excluded.languages_json, preferred_countries_json=excluded.preferred_countries_json,
    travel_willingness=excluded.travel_willingness, preferred_semester=excluded.preferred_semester,
    schedule_constraints_json=excluded.schedule_constraints_json, desired_credits_min=excluded.desired_credits_min,
    desired_credits_max=excluded.desired_credits_max, accessibility_json=excluded.accessibility_json, updated_at=CURRENT_TIMESTAMP`)
    .bind(profileId, input.homeUniversityId ?? null, input.programme ?? null, input.fieldOfStudy ?? null, input.studyLevel ?? null, input.studyYear ?? null,
      json(input.interests ?? []), json(input.skills ?? []), json(input.goals ?? []), json(input.preferredTypes ?? []), json(input.preferredDelivery ?? []),
      json(input.languages ?? []), json(input.preferredCountries ?? []), input.travelWillingness ?? null, input.preferredSemester ?? null,
      json(input.scheduleConstraints ?? []), input.desiredCreditsMin ?? null, input.desiredCreditsMax ?? null, json(input.accessibility ?? []))
    .run();
}

export async function saveStaffProfile(database: D1Database, profileId: string, input: Record<string, unknown>) {
  await database.prepare(`INSERT INTO staff_profiles
    (profile_id, home_university_id, title, department, research_interests_json, teaching_areas_json, methods_json,
     skills_offered_json, skills_sought_json, methods_offered_json, methods_sought_json, facilities_offered_json, facilities_sought_json,
     teaching_offered_json, teaching_sought_json, collaboration_formats_json, collaboration_goals_json, languages_json, availability, contact_route)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(profile_id) DO UPDATE SET home_university_id=excluded.home_university_id, title=excluded.title, department=excluded.department,
    research_interests_json=excluded.research_interests_json, teaching_areas_json=excluded.teaching_areas_json, methods_json=excluded.methods_json,
    skills_offered_json=excluded.skills_offered_json, skills_sought_json=excluded.skills_sought_json,
    methods_offered_json=excluded.methods_offered_json, methods_sought_json=excluded.methods_sought_json,
    facilities_offered_json=excluded.facilities_offered_json, facilities_sought_json=excluded.facilities_sought_json,
    teaching_offered_json=excluded.teaching_offered_json, teaching_sought_json=excluded.teaching_sought_json,
    collaboration_formats_json=excluded.collaboration_formats_json, collaboration_goals_json=excluded.collaboration_goals_json,
    languages_json=excluded.languages_json, availability=excluded.availability, contact_route=excluded.contact_route, updated_at=CURRENT_TIMESTAMP`)
    .bind(profileId, input.homeUniversityId ?? null, input.title ?? null, input.department ?? null, json(input.researchInterests ?? []),
      json(input.teachingAreas ?? []), json(input.methods ?? []), json(input.skillsOffered ?? []), json(input.skillsSought ?? []),
      json(input.methodsOffered ?? []), json(input.methodsSought ?? []), json(input.facilitiesOffered ?? []), json(input.facilitiesSought ?? []),
      json(input.teachingOffered ?? []), json(input.teachingSought ?? []), json(input.collaborationFormats ?? []),
      json(input.collaborationGoals ?? []), json(input.languages ?? []), input.availability ?? null, input.contactRoute ?? null).run();
  await database.prepare("UPDATE profiles SET discoverable = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(Boolean(input.discoverable), profileId).run();
}

export async function createCall(database: D1Database, profileId: string, input: Record<string, unknown>) {
  const callId = id("call");
  await database.batch([
    database.prepare(`INSERT INTO collaboration_calls
      (id, owner_profile_id, organization_id, title, summary, description, call_type, disciplines_json, methods_json,
       skills_offered_json, skills_sought_json, methods_offered_json, methods_sought_json, facilities_offered_json, facilities_sought_json,
       needs_json, eligibility_json, languages_json, countries_json, delivery_mode, deadline, status, source_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', ?)`)
      .bind(callId, profileId, input.organizationId ?? null, input.title, input.summary, input.description, input.callType ?? "collaboration",
        json(input.disciplines ?? []), json(input.methods ?? []), json(input.skillsOffered ?? []), json(input.skillsSought ?? []),
        json(input.methodsOffered ?? []), json(input.methodsSought ?? []), json(input.facilitiesOffered ?? []), json(input.facilitiesSought ?? []),
        json(input.needs ?? []), json(input.eligibility ?? []),
        json(input.languages ?? []), json(input.countries ?? []), input.deliveryMode ?? null, input.deadline ?? null, input.sourceUrl ?? null),
    database.prepare("INSERT INTO call_versions (id,call_id,version_number,payload_json,created_by,is_published) VALUES (?,?,1,?,?,0)")
      .bind(id("call_version"), callId, json(input), profileId),
    database.prepare("INSERT INTO proposed_changes (id, target_type, target_id, proposed_by, payload_json, rationale, status) VALUES (?, 'call', ?, ?, ?, ?, 'pending')")
      .bind(id("proposal"), callId, profileId, json(input), "New staff collaboration call submitted for review"),
    database.prepare("INSERT INTO audit_events (id, actor_profile_id, action, resource_type, resource_id, metadata_json) VALUES (?, ?, 'call.submitted', 'call', ?, '{}')")
      .bind(id("audit"), profileId, callId),
  ]);
  return callId;
}

export async function reviseCall(database: D1Database, profileId: string, callId: string, input: Record<string, unknown>) {
  const call = await database.prepare("SELECT owner_profile_id AS ownerProfileId FROM collaboration_calls WHERE id=?").bind(callId).first<{ ownerProfileId: string }>();
  if (!call) throw new Error("Call not found");
  if (call.ownerProfileId !== profileId) throw new AuthorizationError("Only the call owner can submit a revision");
  const version = await database.prepare("SELECT COALESCE(MAX(version_number),0)+1 AS nextVersion FROM call_versions WHERE call_id=?").bind(callId).first<{ nextVersion: number }>();
  const proposalId = id("proposal");
  await database.batch([
    database.prepare("INSERT INTO call_versions (id,call_id,version_number,payload_json,created_by,is_published) VALUES (?,?,?,?,?,0)")
      .bind(id("call_version"), callId, version?.nextVersion ?? 1, json(input), profileId),
    database.prepare("UPDATE collaboration_calls SET status='pending_review',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(callId),
    database.prepare("INSERT INTO proposed_changes (id,target_type,target_id,proposed_by,payload_json,rationale,status) VALUES (?,'call',?,?,?,?,'pending')")
      .bind(proposalId, callId, profileId, json(input), `Revision ${version?.nextVersion ?? 1} submitted for review`),
    database.prepare("INSERT INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,'call.revision_submitted','call',?,?)")
      .bind(id("audit"), profileId, callId, json({ version: version?.nextVersion ?? 1 })),
  ]);
  return { callId, proposalId, version: version?.nextVersion ?? 1 };
}

export async function createModuleProposal(database: D1Database, profileId: string, input: Record<string, unknown>) {
  const recordId = id("module");
  const proposalId = id("proposal");
  const slug = String(input.slug ?? input.title ?? recordId).toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const payload = { ...input, id: recordId, slug, type: "module", dataClassification: "verified", confidence: "Medium" };
  await database.batch([
    database.prepare("INSERT INTO content_records (id, slug, type, title, summary, status, classification, confidence, owner_organization_id, official_url, is_published) VALUES (?, ?, 'module', ?, ?, 'Under review', 'verified', 'Medium', ?, ?, 0)")
      .bind(recordId, slug, input.title, input.summary, input.organizationId ?? null, input.officialUrl ?? null),
    database.prepare("INSERT INTO proposed_changes (id, target_type, target_id, proposed_by, payload_json, rationale, status) VALUES (?, 'content_record', ?, ?, ?, ?, 'pending')")
      .bind(proposalId, recordId, profileId, json(payload), "New module submitted for review"),
    database.prepare("INSERT INTO audit_events (id, actor_profile_id, action, resource_type, resource_id, metadata_json) VALUES (?, ?, 'module.submitted', 'content_record', ?, '{}')")
      .bind(id("audit"), profileId, recordId),
  ]);
  return { recordId, proposalId };
}

export async function reviseModuleProposal(database: D1Database, profileId: string, recordId: string, input: Record<string, unknown>) {
  const record = await database.prepare(`SELECT cr.id,cr.is_published AS isPublished,
    EXISTS(SELECT 1 FROM proposed_changes pc WHERE pc.target_type='content_record' AND pc.target_id=cr.id AND pc.proposed_by=?) AS owned
    FROM content_records cr WHERE cr.id=?`).bind(profileId, recordId).first<{ id: string; isPublished: number; owned: number }>();
  if (!record) throw new Error("Module or learning record not found");
  if (!record.owned) throw new AuthorizationError("Only the original contributor can submit this revision");
  const current = await database.prepare("SELECT slug,type,classification,confidence FROM content_records WHERE id=?").bind(recordId)
    .first<{ slug: string; type: string; classification: string; confidence: string }>();
  const payload = { ...input, id: recordId, slug: current?.slug, type: current?.type ?? "module", dataClassification: current?.classification ?? "verified", confidence: current?.confidence ?? "Medium" };
  const proposalId = id("proposal");
  await database.batch([
    database.prepare("INSERT INTO proposed_changes (id,target_type,target_id,proposed_by,payload_json,rationale,status) VALUES (?,'content_record',?,?,?,?,'pending')")
      .bind(proposalId, recordId, profileId, json(payload), "Published module revision submitted for independent review"),
    database.prepare("INSERT INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?,'module.revision_submitted','content_record',?,?)")
      .bind(id("audit"), profileId, recordId, json({ remainsPublishedDuringReview: Boolean(record.isPublished) })),
  ]);
  return { recordId, proposalId };
}

export async function reviewProposal(database: D1Database, reviewerId: string, proposalId: string, decision: "approved" | "rejected" | "changes_requested", reason: string) {
  const proposal = await database.prepare("SELECT proposed_by AS proposedBy, target_type AS targetType, target_id AS targetId, payload_json AS payloadJson, status FROM proposed_changes WHERE id = ?")
    .bind(proposalId).first<{ proposedBy: string | null; targetType: string; targetId: string | null; payloadJson: string; status: string }>();
  if (!proposal || proposal.status !== "pending") throw new Error("Pending proposal not found");
  if (proposal.proposedBy === reviewerId) throw new Error("Reviewers cannot approve their own proposal");
  const statements = [
    database.prepare("UPDATE proposed_changes SET status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(decision, proposalId),
    database.prepare("INSERT INTO review_decisions (id, proposal_id, reviewer_id, decision, reason) VALUES (?, ?, ?, ?, ?)").bind(id("decision"), proposalId, reviewerId, decision, reason),
    database.prepare("INSERT INTO audit_events (id, actor_profile_id, action, resource_type, resource_id, metadata_json) VALUES (?, ?, ?, 'proposal', ?, ?)")
      .bind(id("audit"), reviewerId, `proposal.${decision}`, proposalId, json({ reason })),
  ];
  if (decision === "approved" && proposal.targetId && ["call", "content_record"].includes(proposal.targetType)) {
    const bytes = new TextEncoder().encode(proposal.payloadJson);
    const inputHash = await sha256Hex(bytes.buffer as ArrayBuffer);
    statements.push(database.prepare(`INSERT INTO content_embeddings (id,target_type,target_id,provider,model,dimensions,input_hash,vector_json)
      VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(target_type,target_id) DO UPDATE SET provider=excluded.provider,model=excluded.model,dimensions=excluded.dimensions,input_hash=excluded.input_hash,vector_json=excluded.vector_json,updated_at=CURRENT_TIMESTAMP`)
      .bind(`embedding_${crypto.randomUUID()}`, proposal.targetType, proposal.targetId, EMBEDDING_PROVIDER, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS, inputHash, JSON.stringify(embedText(proposal.payloadJson))));
  }
  if (proposal.targetType === "call" && proposal.targetId) {
    const published = await database.prepare("SELECT 1 AS yes FROM call_versions WHERE call_id=? AND is_published=1 LIMIT 1").bind(proposal.targetId).first<{ yes: number }>();
    if (decision === "approved") {
      const payload = JSON.parse(proposal.payloadJson) as Record<string, unknown>;
      statements.push(database.prepare(`UPDATE collaboration_calls SET title=?,summary=?,description=?,call_type=?,organization_id=?,disciplines_json=?,methods_json=?,
        skills_offered_json=?,skills_sought_json=?,methods_offered_json=?,methods_sought_json=?,facilities_offered_json=?,facilities_sought_json=?,
        needs_json=?,eligibility_json=?,languages_json=?,countries_json=?,delivery_mode=?,deadline=?,source_url=?,status='published',updated_at=CURRENT_TIMESTAMP WHERE id=?`)
        .bind(payload.title, payload.summary, payload.description, payload.callType ?? "collaboration", payload.organizationId ?? null,
          json(payload.disciplines ?? []), json(payload.methods ?? []), json(payload.skillsOffered ?? []), json(payload.skillsSought ?? []),
          json(payload.methodsOffered ?? []), json(payload.methodsSought ?? []), json(payload.facilitiesOffered ?? []), json(payload.facilitiesSought ?? []),
          json(payload.needs ?? []), json(payload.eligibility ?? []), json(payload.languages ?? []), json(payload.countries ?? []),
          payload.deliveryMode ?? null, payload.deadline ?? null, payload.sourceUrl ?? null, proposal.targetId));
      statements.push(database.prepare("UPDATE call_versions SET is_published=CASE WHEN version_number=(SELECT MAX(version_number) FROM call_versions WHERE call_id=?) THEN 1 ELSE 0 END WHERE call_id=?").bind(proposal.targetId, proposal.targetId));
    } else {
      statements.push(database.prepare("UPDATE collaboration_calls SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(published ? "published" : decision === "rejected" ? "rejected" : "changes_requested", proposal.targetId));
    }
  }
  if (proposal.targetType === "content_record" && proposal.targetId) {
    const existing = await database.prepare("SELECT is_published AS isPublished FROM content_records WHERE id=?").bind(proposal.targetId).first<{ isPublished: number }>();
    if (decision === "approved") {
      const payload = JSON.parse(proposal.payloadJson) as Record<string, unknown>;
      const versionId = id("version");
      statements.push(database.prepare(`INSERT INTO content_versions (id,record_id,version_number,payload_json,change_summary,created_by)
        VALUES (?, ?, (SELECT COALESCE(MAX(version_number),0)+1 FROM content_versions WHERE record_id=?), ?, 'Reviewed publication', ?)`)
        .bind(versionId, proposal.targetId, proposal.targetId, proposal.payloadJson, reviewerId));
      statements.push(database.prepare(`UPDATE content_records SET published_version_id=?,title=?,summary=?,status='Open',classification=?,confidence=?,
        owner_organization_id=?,official_url=?,is_published=1,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
        .bind(versionId, payload.title ?? "Untitled", payload.summary ?? payload.studentSummary ?? "", payload.dataClassification ?? "verified",
          payload.confidence ?? "Medium", payload.organizationId ?? null, payload.officialUrl ?? null, proposal.targetId));
    } else if (!existing?.isPublished) {
      statements.push(database.prepare("UPDATE content_records SET status = ?, is_published = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(decision === "rejected" ? "Archived" : "Changes requested", proposal.targetId));
    }
  }
  await database.batch(statements);
  return { proposalId, decision };
}

export async function audit(database: D1Database, actorProfileId: string | null, action: string, resourceType: string, resourceId: string | null, metadata: unknown = {}) {
  await database.prepare("INSERT INTO audit_events (id, actor_profile_id, action, resource_type, resource_id, metadata_json) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id("audit"), actorProfileId, action, resourceType, resourceId, json(metadata)).run();
}
