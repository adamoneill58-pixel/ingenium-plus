export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const allowedUploads = {
  "application/pdf": ["pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "text/csv": ["csv"],
} as const;

const normaliseFilename = (value: string) => value.normalize("NFKC").replace(/[\\/\u0000-\u001f\u007f]/g, "_").replace(/\s+/g, " ").trim().slice(0, 180);

export function safeFilename(value: string): string {
  if (value.includes("..") || value.includes("/") || value.includes("\\")) throw new Error("Filename traversal is not allowed");
  const cleaned = normaliseFilename(value);
  if (!cleaned || cleaned.startsWith(".")) throw new Error("A safe filename is required");
  return cleaned;
}

function extension(filename: string) {
  return filename.split(".").pop()?.toLocaleLowerCase() ?? "";
}

function includesAscii(bytes: Uint8Array, value: string): boolean {
  const expected = new TextEncoder().encode(value);
  outer: for (let offset = 0; offset <= bytes.length - expected.length; offset += 1) {
    for (let index = 0; index < expected.length; index += 1) if (bytes[offset + index] !== expected[index]) continue outer;
    return true;
  }
  return false;
}

function hasSignature(bytes: Uint8Array, mime: keyof typeof allowedUploads): boolean {
  if (mime === "application/pdf") return includesAscii(bytes.slice(0, 5), "%PDF-") && includesAscii(bytes.slice(Math.max(0, bytes.length - 2_048)), "%%EOF");
  if (mime === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    && includesAscii(bytes.slice(Math.max(0, bytes.length - 32)), "IEND");
  if (mime === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  if (mime.includes("openxmlformats")) return bytes[0] === 0x50 && bytes[1] === 0x4b && includesAscii(bytes, "[Content_Types].xml");
  if (mime === "text/csv") {
    if (bytes.slice(0, 512).some((byte) => byte === 0)) return false;
    try { new TextDecoder("utf-8", { fatal: true }).decode(bytes); return true; } catch { return false; }
  }
  return false;
}

export function validateUploadMetadata(filename: string, mime: string, byteSize: number, headerBytes: Uint8Array) {
  const name = safeFilename(filename);
  if (byteSize < 1 || byteSize > MAX_UPLOAD_BYTES) throw new Error(`Files must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes`);
  if (!(mime in allowedUploads)) throw new Error("Unsupported file type");
  const typedMime = mime as keyof typeof allowedUploads;
  if (!(allowedUploads[typedMime] as readonly string[]).includes(extension(name))) throw new Error("Filename extension does not match the declared file type");
  if (!hasSignature(headerBytes, typedMime)) throw new Error("File signature does not match the declared file type");
  return { filename: name, mime: typedMime };
}

export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}
