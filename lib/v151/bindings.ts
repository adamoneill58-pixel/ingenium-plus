export interface IngeniumRuntimeBindings {
  DB?: D1Database;
  DOCUMENTS?: R2Bucket;
  BOOTSTRAP_OWNER_EMAIL?: string;
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
