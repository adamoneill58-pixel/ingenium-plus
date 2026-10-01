import type { ChatGPTUser } from "./chatgpt-user";
import seedSql from "../../db/seed/v151.sql?raw";

const SEED_BATCH_SIZE = 60;

export function seedStatements(sql: string): string[] {
  return sql
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !/^(?:PRAGMA\s+foreign_keys\s*=\s*ON|BEGIN\s+TRANSACTION|COMMIT);?$/i.test(line));
}

/**
 * A newly provisioned Site has an empty D1 database after its schema migration.
 * The configured Site owner initializes the checked-in verified dataset in
 * bounded batches and receives the roles needed to exercise Staff mode.
 * The owner email lives in the Sites environment, never in source control.
 */
export async function bootstrapPrivateOwner(
  database: D1Database,
  user: ChatGPTUser,
  profileId: string,
  configuredOwnerEmail?: string,
): Promise<void> {
  const ownerEmail = configuredOwnerEmail?.trim().toLocaleLowerCase();
  if (!ownerEmail || user.email.trim().toLocaleLowerCase() !== ownerEmail) return;

  const dataset = await database.prepare("SELECT value_json FROM system_state WHERE key='dataset_version'").first<{ value_json: string }>();
  if (!dataset) {
    const statements = seedStatements(seedSql);
    for (let offset = 0; offset < statements.length; offset += SEED_BATCH_SIZE) {
      await database.batch(statements.slice(offset, offset + SEED_BATCH_SIZE).map((statement) => database.prepare(statement)));
    }
  }

  await database.batch([
    database.prepare("INSERT OR IGNORE INTO memberships (id,profile_id,organization_id,role,status,granted_by) VALUES (?,?,NULL,'staff','active',?)")
      .bind(`membership_private_owner_staff_${profileId}`, profileId, profileId),
    database.prepare("INSERT OR IGNORE INTO memberships (id,profile_id,organization_id,role,status,granted_by) VALUES (?,?,NULL,'administrator','active',?)")
      .bind(`membership_private_owner_admin_${profileId}`, profileId, profileId),
    database.prepare("INSERT OR IGNORE INTO staff_profiles (profile_id) VALUES (?)").bind(profileId),
    database.prepare("UPDATE profiles SET mode='staff',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(profileId),
    database.prepare("INSERT OR IGNORE INTO audit_events (id,actor_profile_id,action,resource_type,resource_id,metadata_json) VALUES (?,?, 'private_owner.bootstrap', 'profile', ?, '{\"source\":\"sites-owner-allowlist\"}')")
      .bind(`audit_private_owner_${profileId}`, profileId, profileId),
  ]);
}
