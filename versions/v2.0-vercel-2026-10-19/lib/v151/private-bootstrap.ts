/** Historical SQL utility retained for release restore tests. No request-triggered seed or email role grants. */
import type { ChatGPTUser } from "./chatgpt-user";
export function seedStatements(sql: string): string[] { return sql.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!/^(?:PRAGMA|BEGIN|COMMIT)/i.test(s)); }
export async function bootstrapPrivateOwner(_database: D1Database, _user: ChatGPTUser, _profileId: string, _email?: string): Promise<void> { void _database; void _user; void _profileId; void _email; }
