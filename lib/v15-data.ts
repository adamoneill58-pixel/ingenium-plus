/** Historical API compatibility; the canonical import lives in versioned data files. */
import catalogue from "../data/catalogue/v151.json";
import samples from "../data/samples/legacy-people.json";
import type { Entity, Relationship, Source } from "./data";
import type { StudentProfile } from "./record-logic";
export type { StudentProfile };
export const V15_RESEARCH_DATE=catalogue.researchDate;
export const records=catalogue.records as Entity[];
export const networkRelationships=catalogue.relationships as Relationship[];
export const evidenceSources=catalogue.sources as Source[];
export const sampleStudents=samples.students as StudentProfile[];
export interface SampleChatMessage { id:string; studentId:string; body:string; sharedRecordId?:string }
export interface SampleChat { id:string; entityId:string; title:string; messages:SampleChatMessage[] }
export const sampleChats=samples.chats as SampleChat[];
export const recordById=new Map(records.map(r=>[r.id,r]));
export const recordBySlug=new Map(records.map(r=>[r.slug,r]));
export const evidenceById=new Map(evidenceSources.map(s=>[s.id,s]));
