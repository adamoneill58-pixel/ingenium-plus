import { headers } from "next/headers";
import { getRuntimeBindings } from "../v151/bindings";
import { verifyAccessToken } from "./identity";
export async function requirePilotTeam(request?: Request, admin = false) {
  const env = getRuntimeBindings();
  const h = request?.headers ?? (await headers());
  const identity = await verifyAccessToken(
    h.get("Cf-Access-Jwt-Assertion"),
    env,
  );
  if (!identity)
    throw Object.assign(new Error("Verified team sign-in is required"), {
      status: 401,
    });
  if (!env.DB)
    throw Object.assign(new Error("Database is not configured"), {
      status: 503,
    });
  const member = await env.DB.prepare(
    "SELECT role FROM pilot_team_memberships WHERE subject=?",
  )
    .bind(identity.userId)
    .first<{ role: string }>();
  if (!member || (admin && member.role !== "administrator"))
    throw Object.assign(new Error("Team permission is required"), {
      status: 403,
    });
  return { database: env.DB, identity, role: member.role };
}
