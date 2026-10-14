import { verifyAccessToken, type AccessConfig } from "./identity";
export const publicApi = new Map<string, string[]>([
  ["/api/v2/catalogue", ["GET", "HEAD"]],
  ["/api/v2/network", ["GET", "HEAD"]],
  ["/api/v2/calendar", ["GET", "HEAD"]],
  ["/api/v2/events", ["POST"]],
  ["/api/v2/survey", ["POST"]],
]);
export const teamApi = [
  "/api/v2/dashboard",
  "/api/v2/export",
  "/api/v2/refresh",
  "/api/v2/review",
];
export function classifyRoute(
  path: string,
  method: string,
): "public" | "team" | "paused" | "denied" {
  if (path.startsWith("/api/")) {
    if (publicApi.get(path)?.includes(method)) return "public";
    if (
      teamApi.includes(path) &&
      (method === "GET" ||
        ((path.endsWith("/refresh") || path.endsWith("/review")) &&
          method === "POST"))
    )
      return "team";
    return path.startsWith("/api/v151/") ? "paused" : "denied";
  }
  if (path === "/staff" || path === "/student") return "public";
  if (path.startsWith("/staff/")) return "paused";
  if (path === "/pilot-dashboard") return "team";
  return ["GET", "HEAD"].includes(method) ? "public" : "denied";
}
export async function checkRequestPolicy(
  request: Request,
  config: AccessConfig,
): Promise<Response | null> {
  const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  const kind = classifyRoute(path, request.method);
  if (kind === "paused")
    return Response.json(
      {
        error: "Private account workflows are paused during the public pilot.",
      },
      { status: 403, headers: { "cache-control": "no-store" } },
    );
  if (kind === "denied")
    return Response.json(
      { error: "Route or method is not enabled." },
      { status: 404, headers: { "cache-control": "no-store" } },
    );
  if (
    kind === "team" &&
    !(await verifyAccessToken(
      request.headers.get("Cf-Access-Jwt-Assertion"),
      config,
    ))
  )
    return Response.json(
      { error: "Verified team sign-in is required." },
      { status: 401, headers: { "cache-control": "private,no-store" } },
    );
  return null;
}
