/** No browser persistence: legacy saved data remains untouched. */
const memory = new Map<string, unknown>();
let revision = 0;
export function memoryRead<T>(key: string, fallback: T): T {
  const value = memory.has(key) ? memory.get(key) : fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
}
export function memoryWrite(key: string, value: unknown) {
  memory.set(key, value);
  revision++;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ingenium-v15-store-change"));
    window.dispatchEvent(new Event("ingenium-saved-change"));
  }
}
export function memorySnapshot() {
  return String(revision);
}

export function memoryString(key: string): string | null {
  const v = memory.get(key);
  return v === undefined ? null : typeof v === "string" ? v : JSON.stringify(v);
}
