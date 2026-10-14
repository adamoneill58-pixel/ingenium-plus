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
  return (globalThis as RuntimeGlobal)[BINDINGS_KEY] ?? {};
}
