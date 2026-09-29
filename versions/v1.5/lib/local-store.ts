import type { LocalProfile, SemesterItem } from "./v15-logic";

export const PROFILE_KEY = "ingenium-plus-v15-profile";
export const SEMESTER_KEY = "ingenium-plus-v15-semester";
export const SAVED_KEY = "ingenium-plus-v15-saved";
export const JOINED_KEY = "ingenium-plus-v15-joined";
export const TASKS_KEY = "ingenium-plus-v15-tasks";
export const RECENT_KEY = "ingenium-plus-v15-recent";
export const REPORTS_KEY = "ingenium-plus-v15-outdated-reports";
export const CONNECTIONS_KEY = "ingenium-plus-v15-connections";
export const STORE_EVENT = "ingenium-v15-store-change";

export const emptyProfile: LocalProfile = {
  interests: [],
  goals: [],
  languages: [],
  preferredCountries: [],
};

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return value === null ? fallback : value as T;
  } catch {
    return fallback;
  }
}

export function readProfile(): LocalProfile | null {
  const value = readJson<LocalProfile | null>(PROFILE_KEY, null);
  if (!value || typeof value !== "object") return null;
  return {
    ...emptyProfile,
    ...value,
    interests: Array.isArray(value.interests) ? value.interests : [],
    goals: Array.isArray(value.goals) ? value.goals : [],
    languages: Array.isArray(value.languages) ? value.languages : [],
    preferredCountries: Array.isArray(value.preferredCountries) ? value.preferredCountries : [],
  };
}

export function readStringList(key: string): string[] {
  const value = readJson<unknown>(key, []);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function readSemester(): SemesterItem[] {
  const value = readJson<unknown>(SEMESTER_KEY, []);
  return Array.isArray(value)
    ? value.filter((item): item is SemesterItem => Boolean(item) && typeof item === "object" && typeof (item as SemesterItem).entityId === "string")
    : [];
}

export function writeJson(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

export function subscribeStore(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(STORE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORE_EVENT, callback);
  };
}

export function storeSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  return [PROFILE_KEY, SEMESTER_KEY, SAVED_KEY, JOINED_KEY, TASKS_KEY, RECENT_KEY, REPORTS_KEY, CONNECTIONS_KEY]
    .map((key) => window.localStorage.getItem(key) ?? "")
    .join("|");
}
