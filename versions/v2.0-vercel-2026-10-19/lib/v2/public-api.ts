import { pilotWindow } from "./window";
import { getRuntimeBindings } from "../v151/bindings";
export async function readPilotBody(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin !== new URL(request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw Object.assign(new Error("Same-origin requests only"), {
      status: 403,
    });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw Object.assign(new Error("JSON is required"), { status: 415 });
  const env = getRuntimeBindings();
  if (!pilotWindow(env).enabled)
    throw Object.assign(new Error("Pilot collection is not activated"), {
      status: 503,
    });
  if (!request.body) throw new Error("Missing body");
  const reader = request.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 8192) {
      await reader.cancel();
      throw Object.assign(new Error("Request too large"), { status: 413 });
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    all.set(c, at);
    at += c.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(all));
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}
export function apiFailure(error: unknown) {
  const status =
    typeof error === "object" && error && "status" in error
      ? Number(error.status)
      : 500;
  return Response.json(
    {
      error:
        status >= 500
          ? "Pilot service is unavailable or not configured."
          : error instanceof Error
            ? error.message
            : "Invalid request",
    },
    { status, headers: { "cache-control": "no-store" } },
  );
}
