import { audit } from "./repository";

type ScanResult = {
  status: "clean" | "infected" | "error";
  provider: string;
  providerVersion?: string;
  details?: string;
};

type ExtractionResult = {
  provider: string;
  modelVersion?: string;
  schemaVersion: string;
  language?: string;
  extractedText?: string;
  structured: Record<string, unknown>;
  evidence: Array<{ field: string; page?: number; section?: string; excerpt?: string }>;
  confidence?: Record<string, number>;
};

/** Trusted worker boundary for an approved malware scanner. No browser route calls this directly. */
export async function recordDocumentScan(database: D1Database, documentId: string, result: ScanResult) {
  if (!result.provider.trim()) throw new Error("Scanner provider identity is required");
  const document = await database.prepare("SELECT id FROM documents WHERE id=?").bind(documentId).first();
  if (!document) throw new Error("Document not found");
  const nextJobStatus = result.status === "clean" ? "completed" : result.status === "infected" ? "failed" : "retry";
  await database.batch([
    database.prepare("UPDATE documents SET scan_status=? WHERE id=?").bind(result.status, documentId),
    database.prepare(`UPDATE ingestion_jobs SET status=?,provider=?,model_version=?,attempts=attempts+1,last_error=?,
      completed_at=CASE WHEN ?='completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,
      next_attempt_at=CASE WHEN ?='retry' THEN datetime('now','+1 hour') ELSE NULL END,updated_at=CURRENT_TIMESTAMP
      WHERE document_id=? AND stage='scan'`)
      .bind(nextJobStatus, result.provider, result.providerVersion ?? null, result.status === "clean" ? null : result.details ?? result.status,
        nextJobStatus, nextJobStatus, documentId),
  ]);
  await audit(database, null, "document.scan_recorded", "document", documentId, { ...result, details: result.details?.slice(0, 1_000) });
  return { documentId, scanStatus: result.status, nextJobStatus };
}

/** Trusted worker boundary for reviewed extraction providers. Extraction remains an unverified proposal. */
export async function recordDocumentExtraction(database: D1Database, documentId: string, result: ExtractionResult) {
  if (!result.provider.trim() || !result.schemaVersion.trim()) throw new Error("Extractor provider and schema version are required");
  if (!result.structured || Array.isArray(result.structured)) throw new Error("Structured extraction must be an object");
  if (!Array.isArray(result.evidence) || result.evidence.some((item) => !item.field?.trim())) throw new Error("Every extracted field requires an evidence entry");
  const document = await database.prepare("SELECT scan_status AS scanStatus FROM documents WHERE id=?").bind(documentId).first<{ scanStatus: string }>();
  if (!document) throw new Error("Document not found");
  if (document.scanStatus !== "clean") throw new Error("Extraction cannot run before an approved scanner marks the document clean");
  const jobId = `ingestion_${crypto.randomUUID()}`;
  const resultId = `extraction_${crypto.randomUUID()}`;
  const proposalId = `proposal_${crypto.randomUUID()}`;
  await database.batch([
    database.prepare("INSERT INTO ingestion_jobs (id,document_id,stage,status,attempts,provider,model_version,started_at,completed_at) VALUES (?,?,'extract','completed',1,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)")
      .bind(jobId, documentId, result.provider, result.modelVersion ?? null),
    database.prepare(`INSERT INTO extraction_results
      (id,document_id,ingestion_job_id,schema_version,provider,model_version,language,extracted_text,structured_json,evidence_json,confidence_json)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(resultId, documentId, jobId, result.schemaVersion, result.provider, result.modelVersion ?? null, result.language ?? null,
        result.extractedText ?? null, JSON.stringify(result.structured), JSON.stringify(result.evidence), JSON.stringify(result.confidence ?? {})),
    database.prepare("UPDATE documents SET extracted_text=? WHERE id=?").bind(result.extractedText ?? null, documentId),
    database.prepare(`INSERT INTO proposed_changes
      (id,target_type,target_id,payload_json,rationale,status) VALUES (?,'document_extraction',?,?,?,'pending')`)
      .bind(proposalId, documentId, JSON.stringify({ extractionResultId: resultId, structured: result.structured, evidence: result.evidence, confidence: result.confidence ?? {} }),
        "Machine-assisted extraction requires human verification before any publication"),
  ]);
  await audit(database, null, "document.extraction_proposed", "document", documentId, { resultId, proposalId, provider: result.provider, modelVersion: result.modelVersion });
  return { documentId, resultId, proposalId, status: "pending_review" as const };
}
