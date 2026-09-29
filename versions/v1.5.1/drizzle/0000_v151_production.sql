PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'university', country TEXT, official_url TEXT,
  active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY NOT NULL, auth_subject TEXT NOT NULL UNIQUE, email TEXT NOT NULL,
  display_name TEXT NOT NULL, mode TEXT NOT NULL DEFAULT 'student' CHECK(mode IN ('student','staff')),
  discoverable INTEGER NOT NULL DEFAULT 0, consent_version TEXT, consented_at TEXT, last_seen_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_discoverable_idx ON profiles(discoverable);
CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY NOT NULL, profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK(role IN ('student','staff','contributor','reviewer','administrator')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','revoked')),
  granted_by TEXT, granted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS memberships_profile_org_role_uq ON memberships(profile_id, organization_id, role);
CREATE INDEX IF NOT EXISTS memberships_profile_status_idx ON memberships(profile_id,status);
CREATE TABLE IF NOT EXISTS student_profiles (
  profile_id TEXT PRIMARY KEY NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  home_university_id TEXT REFERENCES organizations(id) ON DELETE SET NULL, programme TEXT, field_of_study TEXT,
  study_level TEXT, study_year TEXT, interests_json TEXT NOT NULL DEFAULT '[]', skills_json TEXT NOT NULL DEFAULT '[]', goals_json TEXT NOT NULL DEFAULT '[]',
  preferred_types_json TEXT NOT NULL DEFAULT '[]', preferred_delivery_json TEXT NOT NULL DEFAULT '[]',
  languages_json TEXT NOT NULL DEFAULT '[]', preferred_countries_json TEXT NOT NULL DEFAULT '[]', travel_willingness TEXT,
  preferred_semester TEXT, schedule_constraints_json TEXT NOT NULL DEFAULT '[]', desired_credits_min INTEGER, desired_credits_max INTEGER,
  accessibility_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS staff_profiles (
  profile_id TEXT PRIMARY KEY NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  home_university_id TEXT REFERENCES organizations(id) ON DELETE SET NULL, title TEXT, department TEXT,
  research_interests_json TEXT NOT NULL DEFAULT '[]', teaching_areas_json TEXT NOT NULL DEFAULT '[]', methods_json TEXT NOT NULL DEFAULT '[]',
  skills_offered_json TEXT NOT NULL DEFAULT '[]', skills_sought_json TEXT NOT NULL DEFAULT '[]',
  methods_offered_json TEXT NOT NULL DEFAULT '[]', methods_sought_json TEXT NOT NULL DEFAULT '[]',
  facilities_offered_json TEXT NOT NULL DEFAULT '[]', facilities_sought_json TEXT NOT NULL DEFAULT '[]',
  teaching_offered_json TEXT NOT NULL DEFAULT '[]', teaching_sought_json TEXT NOT NULL DEFAULT '[]', collaboration_formats_json TEXT NOT NULL DEFAULT '[]',
  collaboration_goals_json TEXT NOT NULL DEFAULT '[]', languages_json TEXT NOT NULL DEFAULT '[]', availability TEXT, contact_route TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS evidence_sources (
  id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, kind TEXT NOT NULL, url TEXT, publisher TEXT,
  published_at TEXT, verified_at TEXT, checksum TEXT, notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS content_records (
  id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL,
  status TEXT NOT NULL, classification TEXT NOT NULL DEFAULT 'verified' CHECK(classification IN ('verified','calculated','sample')),
  confidence TEXT NOT NULL DEFAULT 'Medium', owner_organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  source_id TEXT REFERENCES evidence_sources(id) ON DELETE SET NULL, official_url TEXT, published_version_id TEXT,
  is_published INTEGER NOT NULL DEFAULT 0, last_verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS content_records_type_status_idx ON content_records(type,status);
CREATE INDEX IF NOT EXISTS content_records_published_type_idx ON content_records(is_published,type);
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY NOT NULL, record_id TEXT NOT NULL REFERENCES content_records(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL, payload_json TEXT NOT NULL, change_summary TEXT,
  created_by TEXT REFERENCES profiles(id) ON DELETE SET NULL, source_id TEXT REFERENCES evidence_sources(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(record_id,version_number)
);
CREATE TABLE IF NOT EXISTS content_relationships (
  id TEXT PRIMARY KEY NOT NULL, source_record_id TEXT NOT NULL REFERENCES content_records(id) ON DELETE CASCADE,
  target_record_id TEXT NOT NULL REFERENCES content_records(id) ON DELETE CASCADE, type TEXT NOT NULL, label TEXT NOT NULL,
  explanation TEXT NOT NULL, classification TEXT NOT NULL DEFAULT 'verified',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS content_relationships_source_idx ON content_relationships(source_record_id);
CREATE INDEX IF NOT EXISTS content_relationships_target_idx ON content_relationships(target_record_id);
CREATE TABLE IF NOT EXISTS collaboration_calls (
  id TEXT PRIMARY KEY NOT NULL, owner_profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL, title TEXT NOT NULL, summary TEXT NOT NULL,
  description TEXT NOT NULL, call_type TEXT NOT NULL, disciplines_json TEXT NOT NULL DEFAULT '[]', methods_json TEXT NOT NULL DEFAULT '[]',
  skills_offered_json TEXT NOT NULL DEFAULT '[]', skills_sought_json TEXT NOT NULL DEFAULT '[]',
  methods_offered_json TEXT NOT NULL DEFAULT '[]', methods_sought_json TEXT NOT NULL DEFAULT '[]',
  facilities_offered_json TEXT NOT NULL DEFAULT '[]', facilities_sought_json TEXT NOT NULL DEFAULT '[]',
  needs_json TEXT NOT NULL DEFAULT '[]', eligibility_json TEXT NOT NULL DEFAULT '[]', languages_json TEXT NOT NULL DEFAULT '[]',
  countries_json TEXT NOT NULL DEFAULT '[]', delivery_mode TEXT, deadline TEXT, status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'alliance', source_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS collaboration_calls_status_deadline_idx ON collaboration_calls(status,deadline);
CREATE INDEX IF NOT EXISTS collaboration_calls_owner_status_idx ON collaboration_calls(owner_profile_id,status);
CREATE TABLE IF NOT EXISTS call_versions (
  id TEXT PRIMARY KEY NOT NULL, call_id TEXT NOT NULL REFERENCES collaboration_calls(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL, payload_json TEXT NOT NULL, created_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  is_published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(call_id,version_number)
);
CREATE TABLE IF NOT EXISTS expressions_of_interest (
  id TEXT PRIMARY KEY NOT NULL, call_id TEXT NOT NULL REFERENCES collaboration_calls(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(call_id,profile_id)
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY NOT NULL, uploaded_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL, record_id TEXT REFERENCES content_records(id) ON DELETE SET NULL,
  call_id TEXT REFERENCES collaboration_calls(id) ON DELETE SET NULL, storage_key TEXT NOT NULL UNIQUE, original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL, byte_size INTEGER NOT NULL, sha256 TEXT NOT NULL, scan_status TEXT NOT NULL DEFAULT 'pending',
  review_status TEXT NOT NULL DEFAULT 'pending', visibility TEXT NOT NULL DEFAULT 'private', extracted_text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(byte_size > 0), CHECK(visibility IN ('private','alliance','public'))
);
CREATE INDEX IF NOT EXISTS documents_review_idx ON documents(review_status,scan_status);
CREATE INDEX IF NOT EXISTS documents_uploader_idx ON documents(uploaded_by);
CREATE UNIQUE INDEX IF NOT EXISTS documents_sha256_uq ON documents(sha256);
CREATE TABLE IF NOT EXISTS document_versions (
  id TEXT PRIMARY KEY NOT NULL, document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL, storage_key TEXT NOT NULL UNIQUE, sha256 TEXT NOT NULL, byte_size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(document_id,version_number)
);
CREATE TABLE IF NOT EXISTS document_links (
  id TEXT PRIMARY KEY NOT NULL, document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, target_id TEXT NOT NULL, relationship TEXT NOT NULL DEFAULT 'supports',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(document_id,target_type,target_id)
);
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY NOT NULL, document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'scan', status TEXT NOT NULL DEFAULT 'blocked', attempts INTEGER NOT NULL DEFAULT 0,
  provider TEXT, model_version TEXT, last_error TEXT, next_attempt_at TEXT, started_at TEXT, completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id,stage)
);
CREATE INDEX IF NOT EXISTS ingestion_jobs_status_idx ON ingestion_jobs(status,next_attempt_at);
CREATE TABLE IF NOT EXISTS extraction_results (
  id TEXT PRIMARY KEY NOT NULL, document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ingestion_job_id TEXT REFERENCES ingestion_jobs(id) ON DELETE SET NULL, schema_version TEXT NOT NULL,
  provider TEXT NOT NULL, model_version TEXT, language TEXT, extracted_text TEXT,
  structured_json TEXT NOT NULL DEFAULT '{}', evidence_json TEXT NOT NULL DEFAULT '[]', confidence_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS extraction_results_document_idx ON extraction_results(document_id,created_at);
CREATE TABLE IF NOT EXISTS proposed_changes (
  id TEXT PRIMARY KEY NOT NULL, target_type TEXT NOT NULL, target_id TEXT,
  proposed_by TEXT REFERENCES profiles(id) ON DELETE SET NULL, source_id TEXT REFERENCES evidence_sources(id) ON DELETE SET NULL,
  payload_json TEXT NOT NULL, rationale TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, reviewed_at TEXT
);
CREATE TABLE IF NOT EXISTS review_decisions (
  id TEXT PRIMARY KEY NOT NULL, proposal_id TEXT NOT NULL REFERENCES proposed_changes(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT, decision TEXT NOT NULL CHECK(decision IN ('approved','rejected','changes_requested')),
  reason TEXT NOT NULL, decided_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS proposed_changes_status_submitted_idx ON proposed_changes(status,submitted_at);
CREATE INDEX IF NOT EXISTS proposed_changes_proposer_idx ON proposed_changes(proposed_by);
CREATE TABLE IF NOT EXISTS refresh_schedules (
  id TEXT PRIMARY KEY NOT NULL, source_id TEXT NOT NULL REFERENCES evidence_sources(id) ON DELETE CASCADE,
  cadence TEXT NOT NULL DEFAULT 'weekly', enabled INTEGER NOT NULL DEFAULT 1, next_run_at TEXT, last_success_at TEXT,
  failure_count INTEGER NOT NULL DEFAULT 0, last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS refresh_runs (
  id TEXT PRIMARY KEY NOT NULL, schedule_id TEXT REFERENCES refresh_schedules(id) ON DELETE SET NULL,
  source_id TEXT REFERENCES evidence_sources(id) ON DELETE SET NULL, status TEXT NOT NULL, http_status INTEGER,
  previous_checksum TEXT, observed_checksum TEXT, change_detected INTEGER NOT NULL DEFAULT 0, message TEXT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, completed_at TEXT
);
CREATE INDEX IF NOT EXISTS refresh_schedules_due_idx ON refresh_schedules(enabled,next_run_at);
CREATE TABLE IF NOT EXISTS source_snapshots (
  id TEXT PRIMARY KEY NOT NULL, source_id TEXT NOT NULL REFERENCES evidence_sources(id) ON DELETE CASCADE,
  refresh_run_id TEXT REFERENCES refresh_runs(id) ON DELETE SET NULL, checksum TEXT NOT NULL, byte_size INTEGER NOT NULL,
  etag TEXT, last_modified TEXT, captured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(source_id,checksum)
);
CREATE TABLE IF NOT EXISTS recommendation_runs (
  id TEXT PRIMARY KEY NOT NULL, profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, engine_version TEXT NOT NULL, input_hash TEXT NOT NULL UNIQUE, context_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS content_embeddings (
  id TEXT PRIMARY KEY NOT NULL, target_type TEXT NOT NULL, target_id TEXT NOT NULL,
  provider TEXT NOT NULL, model TEXT NOT NULL, dimensions INTEGER NOT NULL, input_hash TEXT NOT NULL,
  vector_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(target_type,target_id)
);
CREATE INDEX IF NOT EXISTS recommendation_runs_profile_type_idx ON recommendation_runs(profile_id,recommendation_type);
CREATE TABLE IF NOT EXISTS recommendation_results (
  id TEXT PRIMARY KEY NOT NULL, run_id TEXT NOT NULL REFERENCES recommendation_runs(id) ON DELETE CASCADE,
  candidate_type TEXT NOT NULL, candidate_id TEXT NOT NULL, rank INTEGER NOT NULL, score INTEGER NOT NULL,
  label TEXT NOT NULL, components_json TEXT NOT NULL, explanations_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(run_id,candidate_type,candidate_id), CHECK(score BETWEEN 0 AND 100)
);
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id TEXT PRIMARY KEY NOT NULL, result_id TEXT NOT NULL REFERENCES recommendation_results(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, signal TEXT NOT NULL, comment TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(result_id,profile_id)
);
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY NOT NULL, actor_profile_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT, metadata_json TEXT NOT NULL DEFAULT '{}',
  ip_hash TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS audit_events_resource_idx ON audit_events(resource_type,resource_id);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY NOT NULL, scope TEXT NOT NULL, subject TEXT NOT NULL, window_started_at TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rate_limits_window_idx ON rate_limits(window_started_at);
CREATE TABLE IF NOT EXISTS system_state (
  key TEXT PRIMARY KEY NOT NULL, value_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS audit_events_no_update BEFORE UPDATE ON audit_events
BEGIN SELECT RAISE(ABORT, 'audit events are immutable'); END;
CREATE TRIGGER IF NOT EXISTS audit_events_no_delete BEFORE DELETE ON audit_events
BEGIN SELECT RAISE(ABORT, 'audit events are immutable'); END;

PRAGMA optimize;
