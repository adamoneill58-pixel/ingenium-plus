/**
 * Dataset-defaulted wrappers around the pure helpers in `./record-logic`.
 *
 * Server pages, scripts and tests may import this module. Client components
 * must import `./record-logic` instead, because this module pulls in the full
 * static catalogue (`./v15-data`).
 */
import type { Entity, EntityStatus, Relationship } from "./data";
import { networkRelationships, records, sampleStudents, type StudentProfile } from "./v15-data";
import * as pure from "./record-logic";
import type { LocalProfile, Recommendation, SemesterItem } from "./record-logic";

export type { LocalProfile, Recommendation, RecordFilters, SemesterItem } from "./record-logic";
export {
  addSemesterItem,
  filterRecords,
  getCompatibilityGuidance,
  getComputedStatus,
  getMutualConnections,
  getProfileCompletion,
  getSharedContexts,
  getStudentDegree,
  removeSemesterItem,
} from "./record-logic";

export function getEntityById(id: string): Entity | undefined {
  return records.find((record) => record.id === id);
}

export function getRelationshipsForEntity(id: string, source: Relationship[] = networkRelationships): Relationship[] {
  return pure.getRelationshipsForEntity(id, source);
}

export function getNeighbours(id: string, recordSource: Entity[] = records, relationshipSource: Relationship[] = networkRelationships): Entity[] {
  return pure.getNeighbours(id, recordSource, relationshipSource);
}

export function getUniversitySubgraph(universityId: string, source: Entity[] = records): Entity[] {
  return pure.getUniversitySubgraph(universityId, source);
}

export function getEntitiesByStatus(status: EntityStatus, today: Date | string = new Date()): Entity[] {
  return records.filter((record) => pure.getComputedStatus(record, today) === status);
}

export function getLearningOpportunities(source: Entity[] = records): Entity[] {
  return pure.getLearningOpportunities(source);
}

export function getActionableRecords(today: Date | string = new Date(), source: Entity[] = records): Entity[] {
  return pure.getActionableRecords(today, source);
}

export function getRecommendationsForProfile(profile: LocalProfile, source = records): Recommendation[] {
  return pure.getRecommendationsForProfile(profile, source);
}

export function getStudentById(id: string): StudentProfile | undefined {
  return sampleStudents.find((student) => student.id === id);
}

export function getSemesterECTSTotal(items: SemesterItem[], source: Entity[] = records): number {
  return pure.getSemesterECTSTotal(items, source);
}
