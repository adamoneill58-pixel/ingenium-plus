import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";

const server = await createServer({ configFile: false, cacheDir: ".vite-v151-security-cache", server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const authorization = await server.ssrLoadModule("/lib/v151/authorization.ts");
const uploads = await server.ssrLoadModule("/lib/v151/upload-security.ts");
after(async () => server.close());

test("role permissions prevent contributor self-publishing", () => {
  assert.equal(authorization.hasPermission(["contributor"], "proposal:create"), true);
  assert.equal(authorization.hasPermission(["contributor"], "proposal:review"), false);
  assert.equal(authorization.hasPermission(["reviewer"], "proposal:review"), true);
  assert.equal(authorization.canReviewOwnProposal("person-a", "person-a"), false);
  assert.equal(authorization.canReviewOwnProposal("person-a", "person-b"), true);
});

test("upload validation checks filename, declared type and signature", () => {
  const pdf = new TextEncoder().encode("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF");
  assert.deepEqual(uploads.validateUploadMetadata("call.pdf", "application/pdf", pdf.length, pdf), { filename: "call.pdf", mime: "application/pdf" });
  assert.throws(() => uploads.validateUploadMetadata("../call.pdf", "application/pdf", pdf.length, pdf), /traversal/i);
  assert.throws(() => uploads.validateUploadMetadata("call.exe", "application/pdf", pdf.length, pdf), /extension/i);
  assert.throws(() => uploads.validateUploadMetadata("call.pdf", "application/pdf", pdf.length, new Uint8Array([1, 2, 3])), /signature/i);
  assert.throws(() => uploads.validateUploadMetadata("call.pdf", "application/pdf", 8, new TextEncoder().encode("%PDF-bad")), /signature/i);
  assert.throws(() => uploads.validateUploadMetadata("call.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 4, new Uint8Array([0x50, 0x4b, 0x03, 0x04])), /signature/i);
  assert.throws(() => uploads.validateUploadMetadata("call.pdf", "application/pdf", uploads.MAX_UPLOAD_BYTES + 1, pdf), /must be between/i);
});
