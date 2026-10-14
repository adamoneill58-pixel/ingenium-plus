import { audit } from "./repository";
import { sha256Hex, validateUploadMetadata } from "./upload-security";

export async function storeQuarantinedUpload(options: {
  database: D1Database;
  bucket: R2Bucket;
  profileId: string;
  organizationId?: string;
  recordId?: string;
  callId?: string;
  file: File;
}) {
  const buffer = await options.file.arrayBuffer();
  const metadata = validateUploadMetadata(options.file.name, options.file.type, buffer.byteLength, new Uint8Array(buffer));
  const digest = await sha256Hex(buffer);
  const duplicate = await options.database.prepare("SELECT id FROM documents WHERE sha256=? LIMIT 1").bind(digest).first<{ id: string }>();
  if (duplicate) {
    const error = new Error(`This file is already stored as document ${duplicate.id}`) as Error & { status: number };
    error.status = 409;
    throw error;
  }
  const documentId = `document_${crypto.randomUUID()}`;
  const storageKey = `quarantine/${new Date().toISOString().slice(0, 10)}/${documentId}/${metadata.filename}`;
  await options.bucket.put(storageKey, buffer, {
    httpMetadata: { contentType: metadata.mime, contentDisposition: `attachment; filename="${metadata.filename.replaceAll('"', "")}"` },
    customMetadata: { documentId, sha256: digest, scanStatus: "pending" },
  });
  try {
    const statements = [options.database.prepare(`INSERT INTO documents
        (id, uploaded_by, organization_id, record_id, call_id, storage_key, original_name, mime_type, byte_size, sha256, scan_status, review_status, visibility)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'private')`)
        .bind(documentId, options.profileId, options.organizationId ?? null, options.recordId ?? null, options.callId ?? null,
          storageKey, metadata.filename, metadata.mime, buffer.byteLength, digest),
      options.database.prepare("INSERT INTO document_versions (id,document_id,version_number,storage_key,sha256,byte_size) VALUES (?,?,1,?,?,?)")
        .bind(`document_version_${crypto.randomUUID()}`, documentId, storageKey, digest, buffer.byteLength),
      options.database.prepare("INSERT INTO ingestion_jobs (id,document_id,stage,status,last_error) VALUES (?,?,'scan','blocked','Approved malware scanner is not configured')")
        .bind(`ingestion_${crypto.randomUUID()}`, documentId),
    ];
    if (options.recordId) statements.push(options.database.prepare("INSERT INTO document_links (id,document_id,target_type,target_id,relationship) VALUES (?,?,'content_record',?,'supports')").bind(`document_link_${crypto.randomUUID()}`, documentId, options.recordId));
    if (options.callId) statements.push(options.database.prepare("INSERT INTO document_links (id,document_id,target_type,target_id,relationship) VALUES (?,?,'call',?,'supports')").bind(`document_link_${crypto.randomUUID()}`, documentId, options.callId));
    await options.database.batch(statements);
    await audit(options.database, options.profileId, "document.uploaded", "document", documentId, { scanStatus: "pending", byteSize: buffer.byteLength });
  } catch (error) {
    await options.bucket.delete(storageKey);
    throw error;
  }
  return { documentId, filename: metadata.filename, byteSize: buffer.byteLength, sha256: digest, scanStatus: "pending", reviewStatus: "pending", visibility: "private" };
}
