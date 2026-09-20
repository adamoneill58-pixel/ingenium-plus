import { sha256Hex } from "./upload-security";

interface RefreshTarget {
  scheduleId: string;
  sourceId: string;
  url: string;
  checksum: string | null;
  etag: string | null;
  lastModified: string | null;
  failureCount: number;
}

function isAllowedSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "ingenium-university.eu" || url.hostname.endsWith(".ingenium-university.eu"));
  } catch {
    return false;
  }
}

export async function refreshSource(database: D1Database, target: RefreshTarget, fetcher: typeof fetch = fetch) {
  const runId = `refresh_${crypto.randomUUID()}`;
  await database.prepare("INSERT INTO refresh_runs (id, schedule_id, source_id, status, previous_checksum) VALUES (?, ?, ?, 'running', ?)")
    .bind(runId, target.scheduleId, target.sourceId, target.checksum).run();
  try {
    if (!isAllowedSourceUrl(target.url)) throw new Error("Refresh URL is outside the approved INGENIUM source host");
    const headers: Record<string, string> = { "user-agent": "INGENIUM-Plus-Refresh/1.5.1" };
    if (target.etag) headers["if-none-match"] = target.etag;
    if (target.lastModified) headers["if-modified-since"] = target.lastModified;
    const response = await fetcher(target.url, { headers, redirect: "error", signal: AbortSignal.timeout(15_000) });
    if (response.status === 304) {
      await database.batch([
        database.prepare("UPDATE refresh_runs SET status='completed',http_status=304,observed_checksum=?,change_detected=0,completed_at=CURRENT_TIMESTAMP,message='Source not modified' WHERE id=?").bind(target.checksum, runId),
        database.prepare("UPDATE evidence_sources SET verified_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(target.sourceId),
        database.prepare("UPDATE refresh_schedules SET last_success_at=CURRENT_TIMESTAMP,next_run_at=datetime('now','+7 days'),failure_count=0,last_error=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(target.scheduleId),
      ]);
      return { runId, sourceId: target.sourceId, changed: false, checksum: target.checksum, status: "completed" as const };
    }
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 10 * 1024 * 1024) throw new Error("Source response exceeds the 10 MB refresh limit");
    const checksum = await sha256Hex(bytes);
    const changed = Boolean(target.checksum && target.checksum !== checksum);
    const statements = [
      database.prepare("UPDATE refresh_runs SET status='completed', http_status=?, observed_checksum=?, change_detected=?, completed_at=CURRENT_TIMESTAMP, message=? WHERE id=?")
        .bind(response.status, checksum, changed, changed ? "Change detected; review proposal created" : "No material change detected", runId),
      database.prepare("UPDATE evidence_sources SET checksum=?, verified_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(checksum, target.sourceId),
      database.prepare("UPDATE refresh_schedules SET last_success_at=CURRENT_TIMESTAMP, next_run_at=datetime('now', '+7 days'), failure_count=0, last_error=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(target.scheduleId),
      database.prepare("INSERT OR IGNORE INTO source_snapshots (id,source_id,refresh_run_id,checksum,byte_size,etag,last_modified) VALUES (?,?,?,?,?,?,?)")
        .bind(`snapshot_${crypto.randomUUID()}`, target.sourceId, runId, checksum, bytes.byteLength, response.headers.get("etag"), response.headers.get("last-modified")),
    ];
    if (changed) {
      statements.push(database.prepare("INSERT INTO proposed_changes (id, target_type, target_id, source_id, payload_json, rationale, status) VALUES (?, 'evidence_source', ?, ?, ?, 'Automated refresh detected changed source content; human review required', 'pending')")
        .bind(`proposal_${crypto.randomUUID()}`, target.sourceId, target.sourceId, JSON.stringify({ previousChecksum: target.checksum, observedChecksum: checksum, refreshRunId: runId })));
    }
    await database.batch(statements);
    return { runId, sourceId: target.sourceId, changed, checksum, status: "completed" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown refresh error";
    const retryMinutes = Math.min(10_080, 15 * (2 ** Math.min(target.failureCount, 9)));
    await database.batch([
      database.prepare("UPDATE refresh_runs SET status='failed', message=?, completed_at=CURRENT_TIMESTAMP WHERE id=?").bind(message, runId),
      database.prepare("UPDATE refresh_schedules SET failure_count=failure_count+1,last_error=?,next_run_at=datetime('now',?),updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(message, `+${retryMinutes} minutes`, target.scheduleId),
    ]);
    return { runId, sourceId: target.sourceId, changed: false, status: "failed" as const, message };
  }
}

export async function runScheduledRefresh(database: D1Database, fetcher: typeof fetch = fetch) {
  const schedules = await database.prepare(`SELECT rs.id AS scheduleId, rs.source_id AS sourceId, es.url, es.checksum,
    rs.failure_count AS failureCount,
    (SELECT ss.etag FROM source_snapshots ss WHERE ss.source_id=es.id ORDER BY ss.captured_at DESC LIMIT 1) AS etag,
    (SELECT ss.last_modified FROM source_snapshots ss WHERE ss.source_id=es.id ORDER BY ss.captured_at DESC LIMIT 1) AS lastModified
    FROM refresh_schedules rs JOIN evidence_sources es ON es.id = rs.source_id
    WHERE rs.enabled = 1 AND es.url IS NOT NULL AND (rs.next_run_at IS NULL OR rs.next_run_at <= CURRENT_TIMESTAMP)
    ORDER BY COALESCE(rs.next_run_at, '1970-01-01') ASC LIMIT 20`).all<RefreshTarget>();
  const results = [];
  for (const target of schedules.results) results.push(await refreshSource(database, target, fetcher));
  return results;
}
