export interface IngeniumRuntimeBindings {
  DB?: D1Database;
  DOCUMENTS?: R2Bucket;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ALERT_WEBHOOK_URL?: string;
  ALLOW_STATIC_FALLBACK?: string;
  PILOT_ANALYTICS_ENABLED?: string;
  EDGE_RATE_LIMIT_READY?: string;
  PILOT_START_DATE?: string;
  PILOT_DURATION_DAYS?: string;
  RETENTION_APPROVED?: string;
  PUBLIC_BASE_URL?: string;
  PUBLIC_CATALOGUE_MODE?: string;
}

const BINDINGS_KEY = Symbol.for("ingenium.runtime.bindings");

type RuntimeGlobal = typeof globalThis & {
  [BINDINGS_KEY]?: IngeniumRuntimeBindings;
};

/**
 * The Worker entry point registers deployment bindings before handing a request
 * to vinext. Keeping only service bindings here (never request or user data)
 * makes server rendering portable to Node-based verification without leaking
 * one request's state into another.
 */
export function setRuntimeBindings(bindings: IngeniumRuntimeBindings): void {
  (globalThis as RuntimeGlobal)[BINDINGS_KEY] = bindings;
}

export function getRuntimeBindings(): IngeniumRuntimeBindings {
  const bindings = (globalThis as RuntimeGlobal)[BINDINGS_KEY];
  if (bindings) return bindings;

  // Vercel serves the same reviewed public catalogue as the Sites release.
  // Cloudflare service bindings and private workflows are never fabricated.
  if (process.env.INGENIUM_HOSTING_TARGET === "vercel") {
    return {
      PUBLIC_CATALOGUE_MODE: process.env.PUBLIC_CATALOGUE_MODE ?? "release-snapshot",
      PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
      ALLOW_STATIC_FALLBACK: "false",
    };
  }
  return {};
}
