import type { AppRole } from "@/db/schema";

const rolePermissions = {
  student: ["profile:student", "recommendations:read", "feedback:write", "interest:write"],
  staff: ["profile:staff", "recommendations:read", "feedback:write", "interest:write", "call:draft", "module:draft", "upload:create"],
  contributor: ["profile:staff", "recommendations:read", "feedback:write", "interest:write", "call:draft", "module:draft", "upload:create", "proposal:create"],
  reviewer: ["profile:staff", "recommendations:read", "feedback:write", "interest:write", "proposal:review", "document:review", "data-health:read"],
  administrator: ["profile:staff", "recommendations:read", "feedback:write", "interest:write", "proposal:review", "document:review", "data-health:read", "roles:grant", "refresh:run", "audit:read"],
} as const satisfies Record<AppRole, readonly string[]>;

export type Permission = (typeof rolePermissions)[AppRole][number];

export function hasPermission(roles: AppRole[], permission: Permission): boolean {
  return roles.some((role) => (rolePermissions[role] as readonly string[]).includes(permission));
}

export function requirePermission(roles: AppRole[], permission: Permission): void {
  if (!hasPermission(roles, permission)) throw new AuthorizationError(`Permission required: ${permission}`);
}

export function canReviewOwnProposal(proposedBy: string | null | undefined, reviewerProfileId: string): boolean {
  return !proposedBy || proposedBy !== reviewerProfileId;
}

export class AuthorizationError extends Error {
  status = 403;
}
