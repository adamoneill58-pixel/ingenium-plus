import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("university"),
  country: text("country"),
  officialUrl: text("official_url"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  authSubject: text("auth_subject").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  mode: text("mode").notNull().default("student"),
  discoverable: integer("discoverable", { mode: "boolean" }).notNull().default(false),
  consentVersion: text("consent_version"),
  consentedAt: text("consented_at"),
  lastSeenAt: text("last_seen_at"),
  ...timestamps,
}, (table) => [index("profiles_email_idx").on(table.email), index("profiles_discoverable_idx").on(table.discoverable)]);

export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  role: text("role").notNull(),
  status: text("status").notNull().default("active"),
  grantedBy: text("granted_by"),
  grantedAt: text("granted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("memberships_profile_org_role_uq").on(table.profileId, table.organizationId, table.role), index("memberships_profile_status_idx").on(table.profileId, table.status)]);

export const studentProfiles = sqliteTable("student_profiles", {
  profileId: text("profile_id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  homeUniversityId: text("home_university_id").references(() => organizations.id, { onDelete: "set null" }),
  programme: text("programme"),
  fieldOfStudy: text("field_of_study"),
  studyLevel: text("study_level"),
  studyYear: text("study_year"),
  interestsJson: text("interests_json").notNull().default("[]"),
  skillsJson: text("skills_json").notNull().default("[]"),
  goalsJson: text("goals_json").notNull().default("[]"),
  preferredTypesJson: text("preferred_types_json").notNull().default("[]"),
  preferredDeliveryJson: text("preferred_delivery_json").notNull().default("[]"),
  languagesJson: text("languages_json").notNull().default("[]"),
  preferredCountriesJson: text("preferred_countries_json").notNull().default("[]"),
  travelWillingness: text("travel_willingness"),
  preferredSemester: text("preferred_semester"),
  scheduleConstraintsJson: text("schedule_constraints_json").notNull().default("[]"),
  desiredCreditsMin: integer("desired_credits_min"),
  desiredCreditsMax: integer("desired_credits_max"),
  accessibilityJson: text("accessibility_json").notNull().default("[]"),
  ...timestamps,
});

export const staffProfiles = sqliteTable("staff_profiles", {
  profileId: text("profile_id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  homeUniversityId: text("home_university_id").references(() => organizations.id, { onDelete: "set null" }),
  title: text("title"),
  department: text("department"),
  researchInterestsJson: text("research_interests_json").notNull().default("[]"),
  teachingAreasJson: text("teaching_areas_json").notNull().default("[]"),
  methodsJson: text("methods_json").notNull().default("[]"),
  skillsOfferedJson: text("skills_offered_json").notNull().default("[]"),
  skillsSoughtJson: text("skills_sought_json").notNull().default("[]"),
  methodsOfferedJson: text("methods_offered_json").notNull().default("[]"),
  methodsSoughtJson: text("methods_sought_json").notNull().default("[]"),
  facilitiesOfferedJson: text("facilities_offered_json").notNull().default("[]"),
  facilitiesSoughtJson: text("facilities_sought_json").notNull().default("[]"),
  teachingOfferedJson: text("teaching_offered_json").notNull().default("[]"),
  teachingSoughtJson: text("teaching_sought_json").notNull().default("[]"),
  collaborationFormatsJson: text("collaboration_formats_json").notNull().default("[]"),
  collaborationGoalsJson: text("collaboration_goals_json").notNull().default("[]"),
  languagesJson: text("languages_json").notNull().default("[]"),
  availability: text("availability"),
  contactRoute: text("contact_route"),
  ...timestamps,
});

export const evidenceSources = sqliteTable("evidence_sources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  url: text("url"),
  publisher: text("publisher"),
  publishedAt: text("published_at"),
  verifiedAt: text("verified_at"),
  checksum: text("checksum"),
  notes: text("notes"),
  ...timestamps,
});

export const contentRecords = sqliteTable("content_records", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  status: text("status").notNull(),
  classification: text("classification").notNull().default("verified"),
  confidence: text("confidence").notNull().default("Medium"),
  ownerOrganizationId: text("owner_organization_id").references(() => organizations.id, { onDelete: "set null" }),
  sourceId: text("source_id").references(() => evidenceSources.id, { onDelete: "set null" }),
  officialUrl: text("official_url"),
  publishedVersionId: text("published_version_id"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  lastVerifiedAt: text("last_verified_at"),
  ...timestamps,
}, (table) => [index("content_records_type_status_idx").on(table.type, table.status), index("content_records_published_type_idx").on(table.isPublished, table.type)]);

export const contentVersions = sqliteTable("content_versions", {
  id: text("id").primaryKey(),
  recordId: text("record_id").notNull().references(() => contentRecords.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  payloadJson: text("payload_json").notNull(),
  changeSummary: text("change_summary"),
  createdBy: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  sourceId: text("source_id").references(() => evidenceSources.id, { onDelete: "set null" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("content_versions_record_number_uq").on(table.recordId, table.versionNumber)]);

export const contentRelationships = sqliteTable("content_relationships", {
  id: text("id").primaryKey(),
  sourceRecordId: text("source_record_id").notNull().references(() => contentRecords.id, { onDelete: "cascade" }),
  targetRecordId: text("target_record_id").notNull().references(() => contentRecords.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  label: text("label").notNull(),
  explanation: text("explanation").notNull(),
  classification: text("classification").notNull().default("verified"),
  ...timestamps,
}, (table) => [index("content_relationships_source_idx").on(table.sourceRecordId), index("content_relationships_target_idx").on(table.targetRecordId)]);

export const collaborationCalls = sqliteTable("collaboration_calls", {
  id: text("id").primaryKey(),
  ownerProfileId: text("owner_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  callType: text("call_type").notNull(),
  disciplinesJson: text("disciplines_json").notNull().default("[]"),
  methodsJson: text("methods_json").notNull().default("[]"),
  skillsOfferedJson: text("skills_offered_json").notNull().default("[]"),
  skillsSoughtJson: text("skills_sought_json").notNull().default("[]"),
  methodsOfferedJson: text("methods_offered_json").notNull().default("[]"),
  methodsSoughtJson: text("methods_sought_json").notNull().default("[]"),
  facilitiesOfferedJson: text("facilities_offered_json").notNull().default("[]"),
  facilitiesSoughtJson: text("facilities_sought_json").notNull().default("[]"),
  needsJson: text("needs_json").notNull().default("[]"),
  eligibilityJson: text("eligibility_json").notNull().default("[]"),
  languagesJson: text("languages_json").notNull().default("[]"),
  countriesJson: text("countries_json").notNull().default("[]"),
  deliveryMode: text("delivery_mode"),
  deadline: text("deadline"),
  status: text("status").notNull().default("draft"),
  visibility: text("visibility").notNull().default("alliance"),
  sourceUrl: text("source_url"),
  ...timestamps,
}, (table) => [index("collaboration_calls_status_deadline_idx").on(table.status, table.deadline), index("collaboration_calls_owner_status_idx").on(table.ownerProfileId, table.status)]);

export const callVersions = sqliteTable("call_versions", {
  id: text("id").primaryKey(),
  callId: text("call_id").notNull().references(() => collaborationCalls.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdBy: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("call_versions_call_number_uq").on(table.callId, table.versionNumber)]);

export const expressionsOfInterest = sqliteTable("expressions_of_interest", {
  id: text("id").primaryKey(),
  callId: text("call_id").notNull().references(() => collaborationCalls.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  status: text("status").notNull().default("submitted"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("expressions_call_profile_uq").on(table.callId, table.profileId)]);

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  uploadedBy: text("uploaded_by").notNull().references(() => profiles.id, { onDelete: "restrict" }),
  organizationId: text("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  recordId: text("record_id").references(() => contentRecords.id, { onDelete: "set null" }),
  callId: text("call_id").references(() => collaborationCalls.id, { onDelete: "set null" }),
  storageKey: text("storage_key").notNull().unique(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  sha256: text("sha256").notNull(),
  scanStatus: text("scan_status").notNull().default("pending"),
  reviewStatus: text("review_status").notNull().default("pending"),
  visibility: text("visibility").notNull().default("private"),
  extractedText: text("extracted_text"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("documents_sha256_uq").on(table.sha256), index("documents_review_idx").on(table.reviewStatus, table.scanStatus), index("documents_uploader_idx").on(table.uploadedBy)]);

export const documentVersions = sqliteTable("document_versions", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  sha256: text("sha256").notNull(),
  byteSize: integer("byte_size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("document_versions_document_number_uq").on(table.documentId, table.versionNumber)]);

export const documentLinks = sqliteTable("document_links", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  relationship: text("relationship").notNull().default("supports"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("document_links_target_uq").on(table.documentId, table.targetType, table.targetId)]);

export const ingestionJobs = sqliteTable("ingestion_jobs", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  stage: text("stage").notNull().default("scan"),
  status: text("status").notNull().default("blocked"),
  attempts: integer("attempts").notNull().default(0),
  provider: text("provider"),
  modelVersion: text("model_version"),
  lastError: text("last_error"),
  nextAttemptAt: text("next_attempt_at"),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  ...timestamps,
}, (table) => [uniqueIndex("ingestion_jobs_document_stage_uq").on(table.documentId, table.stage), index("ingestion_jobs_status_idx").on(table.status, table.nextAttemptAt)]);

export const extractionResults = sqliteTable("extraction_results", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  ingestionJobId: text("ingestion_job_id").references(() => ingestionJobs.id, { onDelete: "set null" }),
  schemaVersion: text("schema_version").notNull(),
  provider: text("provider").notNull(),
  modelVersion: text("model_version"),
  language: text("language"),
  extractedText: text("extracted_text"),
  structuredJson: text("structured_json").notNull().default("{}"),
  evidenceJson: text("evidence_json").notNull().default("[]"),
  confidenceJson: text("confidence_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("extraction_results_document_idx").on(table.documentId, table.createdAt)]);

export const proposedChanges = sqliteTable("proposed_changes", {
  id: text("id").primaryKey(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  proposedBy: text("proposed_by").references(() => profiles.id, { onDelete: "set null" }),
  sourceId: text("source_id").references(() => evidenceSources.id, { onDelete: "set null" }),
  payloadJson: text("payload_json").notNull(),
  rationale: text("rationale").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewedAt: text("reviewed_at"),
}, (table) => [index("proposed_changes_status_submitted_idx").on(table.status, table.submittedAt), index("proposed_changes_proposer_idx").on(table.proposedBy)]);

export const reviewDecisions = sqliteTable("review_decisions", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").notNull().references(() => proposedChanges.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id").notNull().references(() => profiles.id, { onDelete: "restrict" }),
  decision: text("decision").notNull(),
  reason: text("reason").notNull(),
  decidedAt: text("decided_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const refreshSchedules = sqliteTable("refresh_schedules", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => evidenceSources.id, { onDelete: "cascade" }),
  cadence: text("cadence").notNull().default("weekly"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  nextRunAt: text("next_run_at"),
  lastSuccessAt: text("last_success_at"),
  failureCount: integer("failure_count").notNull().default(0),
  lastError: text("last_error"),
  ...timestamps,
}, (table) => [index("refresh_schedules_due_idx").on(table.enabled, table.nextRunAt)]);

export const refreshRuns = sqliteTable("refresh_runs", {
  id: text("id").primaryKey(),
  scheduleId: text("schedule_id").references(() => refreshSchedules.id, { onDelete: "set null" }),
  sourceId: text("source_id").references(() => evidenceSources.id, { onDelete: "set null" }),
  status: text("status").notNull(),
  httpStatus: integer("http_status"),
  previousChecksum: text("previous_checksum"),
  observedChecksum: text("observed_checksum"),
  changeDetected: integer("change_detected", { mode: "boolean" }).notNull().default(false),
  message: text("message"),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const sourceSnapshots = sqliteTable("source_snapshots", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => evidenceSources.id, { onDelete: "cascade" }),
  refreshRunId: text("refresh_run_id").references(() => refreshRuns.id, { onDelete: "set null" }),
  checksum: text("checksum").notNull(),
  byteSize: integer("byte_size").notNull(),
  etag: text("etag"),
  lastModified: text("last_modified"),
  capturedAt: text("captured_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("source_snapshots_source_checksum_uq").on(table.sourceId, table.checksum)]);

export const recommendationRuns = sqliteTable("recommendation_runs", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  recommendationType: text("recommendation_type").notNull(),
  engineVersion: text("engine_version").notNull(),
  inputHash: text("input_hash").notNull().unique(),
  contextJson: text("context_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("recommendation_runs_profile_type_idx").on(table.profileId, table.recommendationType)]);

export const contentEmbeddings = sqliteTable("content_embeddings", {
  id: text("id").primaryKey(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  dimensions: integer("dimensions").notNull(),
  inputHash: text("input_hash").notNull(),
  vectorJson: text("vector_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("content_embeddings_target_uq").on(table.targetType, table.targetId)]);

export const recommendationResults = sqliteTable("recommendation_results", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull().references(() => recommendationRuns.id, { onDelete: "cascade" }),
  candidateType: text("candidate_type").notNull(),
  candidateId: text("candidate_id").notNull(),
  rank: integer("rank").notNull(),
  score: integer("score").notNull(),
  label: text("label").notNull(),
  componentsJson: text("components_json").notNull(),
  explanationsJson: text("explanations_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("recommendation_results_run_candidate_uq").on(table.runId, table.candidateType, table.candidateId)]);

export const recommendationFeedback = sqliteTable("recommendation_feedback", {
  id: text("id").primaryKey(),
  resultId: text("result_id").notNull().references(() => recommendationResults.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  signal: text("signal").notNull(),
  comment: text("comment"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("recommendation_feedback_result_profile_uq").on(table.resultId, table.profileId)]);

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  actorProfileId: text("actor_profile_id").references(() => profiles.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  ipHash: text("ip_hash"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("audit_events_resource_idx").on(table.resourceType, table.resourceId)]);

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  scope: text("scope").notNull(),
  subject: text("subject").notNull(),
  windowStartedAt: text("window_started_at").notNull(),
  count: integer("count").notNull().default(1),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("rate_limits_window_idx").on(table.windowStartedAt)]);

export const systemState = sqliteTable("system_state", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type AppRole = "student" | "staff" | "contributor" | "reviewer" | "administrator";
