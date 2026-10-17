export type EntityType =
  | "university"
  | "bip"
  | "programme"
  | "pathway"
  | "project"
  | "event"
  | "community"
  | "platform"
  | "opportunity"
  | "initiative"
  | "framework"
  | "module"
  | "course"
  | "microcredential"
  | "student"
  | "person"
  | "learning_resource"
  | "calendar_event";

export type EntityStatus =
  | "Open"
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Recurring"
  | "Planned"
  | "Under development"
  | "Archived"
  | "Access unverified"
  | "Verification required"
  | "Open now"
  | "Opens soon"
  | "Coming soon"
  | "Closed"
  | "Past"
  | "Historical"
  | "In development";

export type DataClassification = "verified" | "calculated" | "sample";

export type Confidence = "High" | "Medium" | "Low";

export interface Source {
  id: string;
  title: string;
  kind: string;
  url?: string;
  published?: string;
  publisher?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface Entity {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  type: EntityType;
  subtype?: string;
  studentSummary: string;
  fullDescription?: string;
  status: EntityStatus;
  availability?: string;
  availabilityStatus?: "open" | "closed" | "unknown";
  sourceConflict?: boolean;
  deadlineTimezone?: string;
  activityDatePrecision?: "day" | "approximate";
  lastChecked?: string;
  lastCheckError?: string;
  lastCheckAttempt?: string;
  universityIds: string[];
  hostUniversityId?: string;
  countries?: string[];
  city?: string;
  themes: string[];
  academicLevel?: string;
  deliveryMode?: string;
  mobilityType?: string;
  startDate?: string;
  endDate?: string;
  dateLabel?: string;
  applicationDeadline?: string;
  applicationOpenDate?: string;
  ects?: number;
  eqfLevel?: string;
  workload?: string;
  eligibility?: string;
  language?: string;
  capacity?: string;
  funding?: string;
  actionLabel?: string;
  officialUrl?: string;
  sourceId: string;
  lastVerified: string;
  confidence: Confidence;
  workPackage?: string;
  featured?: boolean;
  aliases?: string[];
  dataClassification?: DataClassification;
  sourceIds?: string[];
  statusOverride?: EntityStatus;
  recurrence?: "recurring";
  moduleCode?: string;
  studyLevels?: string[];
  languages?: string[];
  semester?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  assessment?: string;
  whyItMatters?: string;
  imageUrl?: string;
  imageAlt?: string;
  history?: { label: string; date?: string; note?: string }[];
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  explanation: string;
  sourceIds?: string[];
  dataClassification?: DataClassification;
  date?: string;
}

export interface Journey {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  nodeIds: string[];
  accent: "teal" | "cyan" | "lime" | "magenta";
}

import base from "../data/catalogue/legacy-base.json";
export const RESEARCH_DATE = "2026-08-05";
export const entities = base.entities as Entity[];
export const relationships = base.relationships as Relationship[];
export const sources = base.sources as Source[];
export const journeys = base.journeys as Journey[];
export const entityById = new Map(entities.map((e) => [e.id, e]));
export const sourceById = new Map(sources.map((s) => [s.id, s]));
export { typeLabels, typeColours } from "./labels";
