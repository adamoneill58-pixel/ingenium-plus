import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getRuntimeBindings } from "./bindings";
import { getOrCreateSession } from "./repository";
import type { SessionContext } from "./types";

export class ApiError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function requireDatabase(): D1Database {
  const database = getRuntimeBindings().DB;
  if (!database) throw new ApiError("The production database has not been provisioned for this environment.", 503);
  return database;
}

export function requireDocumentsBucket(): R2Bucket {
  const bucket = getRuntimeBindings().DOCUMENTS;
  if (!bucket) throw new ApiError("The document storage binding has not been provisioned for this environment.", 503);
  return bucket;
}

export async function requireSession(): Promise<{ database: D1Database; session: SessionContext }> {
  const user = await getChatGPTUser();
  if (!user) throw new ApiError("Sign in with ChatGPT to use this feature.", 401);
  const database = requireDatabase();
  return { database, session: await getOrCreateSession(database, user) };
}

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLocaleLowerCase().includes("application/json")) throw new ApiError("Content-Type must be application/json", 415);
  try { return await request.json(); } catch { throw new ApiError("Request body must be valid JSON", 400); }
}

export function assertSameOrigin(request: Request): void {
  const expected = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if ((origin && origin !== expected) || fetchSite === "cross-site") throw new ApiError("Cross-site mutation rejected", 403);
}

export async function enforceRateLimit(database: D1Database, scope: string, subject: string, limit: number, windowSeconds = 3_600): Promise<void> {
  const windowStart = Math.floor(Date.now() / (windowSeconds * 1_000)) * windowSeconds;
  const key = `${scope}:${subject}:${windowStart}`;
  await database.prepare(`INSERT INTO rate_limits (key,scope,subject,window_started_at,count) VALUES (?,?,?,?,1)
    ON CONFLICT(key) DO UPDATE SET count=count+1,updated_at=CURRENT_TIMESTAMP`)
    .bind(key, scope, subject, new Date(windowStart * 1_000).toISOString()).run();
  const row = await database.prepare("SELECT count FROM rate_limits WHERE key=?").bind(key).first<{ count: number }>();
  if ((row?.count ?? 0) > limit) throw new ApiError(`Too many ${scope.replaceAll("_", " ")} requests. Try again later.`, 429);
  if ((row?.count ?? 0) === 1) await database.prepare("DELETE FROM rate_limits WHERE window_started_at < datetime('now','-2 days')").run();
}

export function jsonResponse(value: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(value, { status, headers: { "cache-control": "no-store", ...headers } });
}

export function handleApiError(error: unknown) {
  const status = typeof error === "object" && error && "status" in error && typeof error.status === "number" ? error.status : 500;
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return jsonResponse({ error: message }, status);
}
