/**
 * Pure record, status, semester and profile helpers.
 *
 * This module must not import any dataset values (`./data`, `./v15-data` or
 * `./research-*`). Client components import it, and a dataset import here
 * would ship the entire static catalogue to the browser even though pages
 * already pass the records they need as props. Dataset-defaulted wrappers live
 * in `./v15-logic` for server code and tests.
 */
import type { Entity, EntityStatus, Relationship } from "./data";

export interface StudentProfile {
  id: string;
  displayName: string;
  sample: boolean;
  universityId: string;
  programmeId?: string;
  studyLevel?: string;
  year?: string;
  interests: string[];
  goals: string[];
  languages: string[];
  joinedEntityIds: string[];
  savedEntityIds: string[];
  connectionIds: string[];
}

export interface LocalProfile {
  displayName?: string;
  universityId?: string;
  programme?: string;
  fieldOfStudy?: string;
  studyLevel?: string;
  year?: string;
  interests: string[];
  goals: string[];
  languages: string[];
  preferredCountries: string[];
}

export interface SemesterItem {
  entityId: string;
  addedAt: string;
}

export interface RecordFilters {
  query?: string;
  types?: string[];
  universityId?: string;
  country?: string;
  status?: EntityStatus | "all";
  theme?: string;
  studyLevel?: string;
  deliveryMode?: string;
  language?: string;
  minEcts?: number;
  maxEcts?: number;
}

const protectedStatuses = new Set<EntityStatus>([
  "Under development",
  "In development",
  "Planned",
  "Archived",
  "Access unverified",
  "Verification required",
]);

function dateOnly(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function getComputedStatus(entity: Entity, today: Date | string = new Date()): EntityStatus {
  if (entity.statusOverride) return entity.statusOverride;
  if (protectedStatuses.has(entity.status)) return entity.status;
  if (entity.recurrence === "recurring" || entity.status === "Recurring") return "Recurring";

  const current = dateOnly(today);
  const opens = entity.applicationOpenDate;
  const deadline = entity.applicationDeadline;
  const start = entity.startDate;
  const end = entity.endDate;

  if (opens && current < opens) return "Opens soon";
  if (deadline && current <= deadline && (!opens || current >= opens)) return "Open now";
  if (deadline && current > deadline) {
    if (start && current >= start && (!end || current <= end)) return "Ongoing";
    if (end && current > end) return "Past";
    return "Closed";
  }
  if (end && current > end) return "Past";
  if (start && current < start) return "Coming soon";
  if (start && current >= start && (!end || current <= end)) return "Ongoing";
  if (entity.status === "Completed") return "Historical";
  return entity.status;
}

export function getRelationshipsForEntity(id: string, source: Relationship[]): Relationship[] {
  return source.filter((relationship) => relationship.source === id || relationship.target === id);
}

export function getNeighbours(id: string, recordSource: Entity[], relationshipSource: Relationship[]): Entity[] {
  const ids = new Set(getRelationshipsForEntity(id, relationshipSource).map((relationship) => relationship.source === id ? relationship.target : relationship.source));
  return recordSource.filter((record) => ids.has(record.id));
}

export function getUniversitySubgraph(universityId: string, source: Entity[]): Entity[] {
  return source.filter((record) => record.id === universityId || record.universityIds.includes(universityId));
}

export function filterRecords(source: Entity[], filters: RecordFilters, today: Date | string = new Date()): Entity[] {
  const needle = filters.query?.trim().toLocaleLowerCase() ?? "";
  return source.filter((record) => {
    const status = getComputedStatus(record, today);
    const haystack = [
      record.title,
      record.shortTitle,
      record.moduleCode,
      record.studentSummary,
      record.fullDescription,
      record.city,
      record.academicLevel,
      record.deliveryMode,
      record.language,
      ...(record.aliases ?? []),
      ...(record.countries ?? []),
      ...record.themes,
    ].filter(Boolean).join(" ").toLocaleLowerCase();

    return (!needle || haystack.includes(needle))
      && (!filters.types?.length || filters.types.includes(record.type))
      && (!filters.universityId || filters.universityId === "all" || record.id === filters.universityId || record.universityIds.includes(filters.universityId))
      && (!filters.country || filters.country === "all" || record.countries?.includes(filters.country))
      && (!filters.status || filters.status === "all" || status === filters.status)
      && (!filters.theme || filters.theme === "all" || record.themes.includes(filters.theme))
      && (!filters.studyLevel || filters.studyLevel === "all" || record.studyLevels?.includes(filters.studyLevel) || record.academicLevel?.includes(filters.studyLevel))
      && (!filters.deliveryMode || filters.deliveryMode === "all" || record.deliveryMode?.toLocaleLowerCase().includes(filters.deliveryMode.toLocaleLowerCase()))
      && (!filters.language || filters.language === "all" || record.languages?.includes(filters.language) || record.language?.includes(filters.language))
      && (filters.minEcts === undefined || (record.ects ?? 0) >= filters.minEcts)
      && (filters.maxEcts === undefined || (record.ects ?? Number.POSITIVE_INFINITY) <= filters.maxEcts);
  });
}

export function getLearningOpportunities(source: Entity[]): Entity[] {
  return source.filter((record) => ["module", "course", "microcredential", "learning_resource", "bip", "programme", "pathway"].includes(record.type));
}

export function getActionableRecords(today: Date | string, source: Entity[]): Entity[] {
  return source
    .filter((record) => ["Open now", "Opens soon", "Coming soon", "Recurring"].includes(getComputedStatus(record, today)))
    .sort((left, right) => (left.applicationDeadline ?? left.startDate ?? "9999").localeCompare(right.applicationDeadline ?? right.startDate ?? "9999"));
}

export function getProfileCompletion(profile: LocalProfile): { percentage: number; missing: string[] } {
  const fields: { label: string; complete: boolean }[] = [
    { label: "your name", complete: Boolean(profile.displayName?.trim()) },
    { label: "your home university", complete: Boolean(profile.universityId) },
    { label: "your study level", complete: Boolean(profile.studyLevel) },
    { label: "your field of study", complete: Boolean(profile.fieldOfStudy?.trim()) },
    { label: "at least one interest", complete: profile.interests.length > 0 },
    { label: "at least one goal", complete: profile.goals.length > 0 },
    { label: "a language", complete: profile.languages.length > 0 },
    { label: "a mobility preference", complete: profile.preferredCountries.length > 0 },
  ];
  const complete = fields.filter((field) => field.complete).length;
  return { percentage: Math.round((complete / fields.length) * 100), missing: fields.filter((field) => !field.complete).map((field) => field.label) };
}

function normaliseSignals(values: string[]): string[] {
  return values.map((value) => value.toLocaleLowerCase());
}

export interface Recommendation {
  entity: Entity;
  score: number;
  reasons: string[];
}

export function getRecommendationsForProfile(profile: LocalProfile, source: Entity[]): Recommendation[] {
  const signals = normaliseSignals([profile.fieldOfStudy ?? "", ...profile.interests, ...profile.goals]);
  return source
    .filter((record) => record.type !== "student" && record.id !== profile.universityId)
    .map((entity) => {
      const reasons: string[] = [];
      const topics = normaliseSignals([entity.title, ...entity.themes]);
      const matches = signals.filter((signal) => signal && topics.some((topic) => topic.includes(signal) || signal.includes(topic)));
      if (matches.length) reasons.push(`Matches ${[...new Set(matches)].slice(0, 2).join(" and ")}`);
      if (profile.studyLevel && (entity.studyLevels?.includes(profile.studyLevel) || entity.academicLevel?.includes(profile.studyLevel))) reasons.push(`Available at ${profile.studyLevel} level`);
      if (profile.universityId && entity.universityIds.length > 0 && !entity.universityIds.includes(profile.universityId)) reasons.push("Outside your home university");
      if (profile.preferredCountries.some((country) => entity.countries?.includes(country))) reasons.push("Matches a preferred destination");
      const score = Math.min(96, 38 + matches.length * 14 + reasons.length * 8 + (entity.featured ? 5 : 0));
      return { entity, score, reasons };
    })
    .filter((item) => item.reasons.length > 0)
    .sort((left, right) => right.score - left.score || left.entity.title.localeCompare(right.entity.title));
}

export function getSharedContexts(left: StudentProfile, right: StudentProfile): string[] {
  const rightJoined = new Set(right.joinedEntityIds);
  return left.joinedEntityIds.filter((id) => rightJoined.has(id));
}

export function getMutualConnections(left: StudentProfile, right: StudentProfile): string[] {
  const rightConnections = new Set(right.connectionIds);
  return left.connectionIds.filter((id) => rightConnections.has(id));
}

export function getStudentDegree(left: StudentProfile, right: StudentProfile): 1 | 2 | 3 | null {
  const shared = getSharedContexts(left, right);
  const explicitlyConnected = left.connectionIds.includes(right.id) || right.connectionIds.includes(left.id);
  if (explicitlyConnected) return 1;
  if (!explicitlyConnected && shared.length > 0) return 2;
  if (getMutualConnections(left, right).length > 0) return 3;
  return null;
}

export function addSemesterItem(items: SemesterItem[], entityId: string, addedAt = new Date().toISOString()): SemesterItem[] {
  return items.some((item) => item.entityId === entityId) ? items : [...items, { entityId, addedAt }];
}

export function removeSemesterItem(items: SemesterItem[], entityId: string): SemesterItem[] {
  return items.filter((item) => item.entityId !== entityId);
}

export function getSemesterECTSTotal(items: SemesterItem[], source: Entity[]): number {
  return items.reduce((total, item) => total + (source.find((record) => record.id === item.entityId)?.ects ?? 0), 0);
}

export function getCompatibilityGuidance(entity: Entity, profile: LocalProfile): string[] {
  const guidance: string[] = [];
  if (profile.studyLevel && entity.academicLevel) {
    guidance.push(entity.academicLevel.toLocaleLowerCase().includes(profile.studyLevel.toLocaleLowerCase())
      ? "Potential level match for your profile."
      : `Check whether ${entity.academicLevel} is appropriate for your ${profile.studyLevel} studies.`);
  }
  if (entity.ects) guidance.push(`${entity.ects} ECTS would be added to your planned total.`);
  if (entity.language) guidance.push(`Teaching language: ${entity.language}.`);
  guidance.push("Recognition must be confirmed with your home university.");
  return guidance;
}

