-- Additive public-catalogue migration. Back up the target before applying.
ALTER TABLE content_records ADD COLUMN availability_status TEXT NOT NULL DEFAULT 'unknown' CHECK(availability_status IN ('open','closed','unknown'));
ALTER TABLE content_records ADD COLUMN deadline TEXT;
ALTER TABLE content_records ADD COLUMN last_checked TEXT;
ALTER TABLE content_records ADD COLUMN source_conflict INTEGER NOT NULL DEFAULT 0;
CREATE INDEX content_records_availability_idx ON content_records(availability_status,deadline);
CREATE TABLE calendar_events(id TEXT PRIMARY KEY,record_id TEXT NOT NULL REFERENCES content_records(id) ON DELETE CASCADE,kind TEXT NOT NULL DEFAULT 'activity',start_date TEXT NOT NULL,end_date TEXT,precision TEXT NOT NULL CHECK(precision IN ('day','instant','approximate')),timezone TEXT,source_url TEXT NOT NULL CHECK(source_url LIKE 'https://%'),date_label TEXT,CHECK(end_date IS NULL OR end_date >= start_date));
CREATE INDEX calendar_events_start_idx ON calendar_events(start_date);
CREATE TABLE usage_daily_counts(event_type TEXT NOT NULL CHECK(event_type IN ('page_view','search','node_open','recommendation_click','calendar_export','useful_yes','useful_no')),target_id TEXT NOT NULL DEFAULT '',day TEXT NOT NULL,campus TEXT NOT NULL DEFAULT '' CHECK(campus IN ('','mtu','xamk','tuiasi')),count INTEGER NOT NULL DEFAULT 0 CHECK(count>=0),PRIMARY KEY(event_type,target_id,day,campus),CHECK(campus='' OR (event_type='page_view' AND target_id='/pilot/'||campus)));
CREATE TABLE survey_answer_counts(question INTEGER NOT NULL CHECK(question BETWEEN 1 AND 11),option TEXT NOT NULL,iso_week TEXT NOT NULL,role TEXT NOT NULL DEFAULT '' CHECK(role IN ('','Student','Academic','Other staff')),count INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(question,option,iso_week,role),CHECK(question NOT IN (1,2) OR role=''));
CREATE TABLE survey_free_text(id TEXT PRIMARY KEY,question INTEGER NOT NULL CHECK(question IN (12,13)),iso_week TEXT NOT NULL,text TEXT NOT NULL,flagged INTEGER NOT NULL DEFAULT 1 CHECK(flagged IN (0,1)),reviewed INTEGER NOT NULL DEFAULT 0);
CREATE TABLE pilot_team_memberships(subject TEXT PRIMARY KEY,role TEXT NOT NULL CHECK(role IN ('pilot_team','administrator')),granted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE pilot_audit(id TEXT PRIMARY KEY,actor_subject TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE audit_events DROP COLUMN ip_hash;

CREATE TRIGGER v2_lock_student_insert BEFORE INSERT ON student_profiles BEGIN SELECT RAISE(ABORT,'Profile writes paused during pilot'); END;
CREATE TRIGGER v2_lock_student_update BEFORE UPDATE ON student_profiles BEGIN SELECT RAISE(ABORT,'Profile writes paused during pilot'); END;
CREATE TRIGGER v2_lock_staff_insert BEFORE INSERT ON staff_profiles BEGIN SELECT RAISE(ABORT,'Profile writes paused during pilot'); END;
CREATE TRIGGER v2_lock_staff_update BEFORE UPDATE ON staff_profiles BEGIN SELECT RAISE(ABORT,'Profile writes paused during pilot'); END;

CREATE TABLE pilot_review_decisions(id TEXT PRIMARY KEY,proposal_id TEXT NOT NULL UNIQUE REFERENCES proposed_changes(id),reviewer_subject TEXT NOT NULL,decision TEXT NOT NULL CHECK(decision IN ('approved','rejected')),reason TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);

ALTER TABLE content_records ADD COLUMN last_check_attempt TEXT;
ALTER TABLE content_records ADD COLUMN check_error TEXT;
