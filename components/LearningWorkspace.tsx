"use client";

import { ArrowDown, ArrowUp, BookOpen, CalendarPlus, Check, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { EntityStatus } from "@/lib/data";
import { recordById, records } from "@/lib/v15-data";
import {
  addSemesterItem,
  filterRecords,
  getCompatibilityGuidance,
  getComputedStatus,
  getLearningOpportunities,
  getSemesterECTSTotal,
  removeSemesterItem,
} from "@/lib/v15-logic";
import { readProfile, readSemester, SEMESTER_KEY, storeSnapshot, subscribeStore, writeJson } from "@/lib/local-store";
import { ClassificationBadge } from "./ClassificationBadge";
import { StatusBadge } from "./StatusBadge";

export function LearningWorkspace() {
  useSyncExternalStore(subscribeStore, storeSnapshot, () => "");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [delivery, setDelivery] = useState("all");
  const [language, setLanguage] = useState("all");
  const [universityId, setUniversityId] = useState("all");
  const [status, setStatus] = useState<EntityStatus | "all">("all");
  const learning = useMemo(() => getLearningOpportunities(), []);
  const semester = readSemester();
  const profile = readProfile();

  const universities = useMemo(() => records.filter((record) => record.type === "university"), []);
  const statuses = useMemo(() => [...new Set(learning.map((record) => getComputedStatus(record)))].sort(), [learning]);
  const filtered = useMemo(() => filterRecords(learning, {
    query,
    studyLevel: level,
    deliveryMode: delivery,
    language,
    universityId,
    status,
  }), [delivery, language, learning, level, query, status, universityId]);

  const add = (entityId: string) => writeJson(SEMESTER_KEY, addSemesterItem(readSemester(), entityId));
  const remove = (entityId: string) => writeJson(SEMESTER_KEY, removeSemesterItem(readSemester(), entityId));
  const move = (index: number, offset: number) => {
    const next = [...readSemester()];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    writeJson(SEMESTER_KEY, next);
  };

  return (
    <div className="learning-layout">
      <section className="learning-catalogue" aria-labelledby="learning-results-title">
        <div className="workspace-toolbar workspace-toolbar--learning" aria-label="Learning filters">
          <label className="search-field workspace-toolbar__search"><Search aria-hidden="true" /><span className="sr-only">Search learning</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, themes, codes or outcomes" /></label>
          <label><span>Level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">All levels</option><option>Bachelor</option><option>Master</option><option>PhD</option></select></label>
          <label><span>Delivery</span><select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option value="all">Any delivery</option><option value="online">Online</option><option value="virtual">Virtual</option><option value="blended">Blended</option><option value="physical">Physical</option></select></label>
          <label><span>Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">Any language</option><option>English</option><option>Finnish</option><option>Swedish</option></select></label>
          <label><span>University</span><select value={universityId} onChange={(event) => setUniversityId(event.target.value)}><option value="all">All universities</option>{universities.map((item) => <option key={item.id} value={item.id}>{item.shortTitle ?? item.title}</option>)}</select></label>
          <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as EntityStatus | "all")}><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        <div className="workspace-results"><p id="learning-results-title" aria-live="polite"><strong>{filtered.length}</strong> learning routes</p></div>
        <div className="learning-grid">
          {filtered.map((entity) => {
            const planned = semester.some((item) => item.entityId === entity.id);
            const host = entity.hostUniversityId ? recordById.get(entity.hostUniversityId) : undefined;
            return (
              <article className="learning-card" key={entity.id}>
                <div className="entity-card__meta"><span>{entity.subtype ?? entity.type}</span><StatusBadge status={getComputedStatus(entity)} /></div>
                <ClassificationBadge classification={entity.dataClassification} />
                <h3><Link href={`/records/${entity.slug}`}>{entity.title}</Link></h3>
                <p>{entity.studentSummary}</p>
                <dl className="learning-card__facts">
                  {entity.ects && <><dt>Credit</dt><dd>{entity.ects} ECTS</dd></>}
                  {host && <><dt>Host</dt><dd>{host.shortTitle ?? host.title}</dd></>}
                  {entity.deliveryMode && <><dt>Delivery</dt><dd>{entity.deliveryMode}</dd></>}
                  {entity.academicLevel && <><dt>Level</dt><dd>{entity.academicLevel}</dd></>}
                  {entity.language && <><dt>Language</dt><dd>{entity.language}</dd></>}
                  {entity.dateLabel && <><dt>Dates</dt><dd>{entity.dateLabel}</dd></>}
                </dl>
                {profile && <p className="compatibility-note">{getCompatibilityGuidance(entity, profile)[0]}</p>}
                <div className="learning-card__actions">
                  <Link className="text-link" href={`/records/${entity.slug}`}>Full details</Link>
                  <button className={`button ${planned ? "button--secondary" : "button--primary"}`} type="button" onClick={() => planned ? remove(entity.id) : add(entity.id)}>{planned ? <Check aria-hidden="true" /> : <CalendarPlus aria-hidden="true" />}{planned ? "In semester" : "Add to semester"}</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="semester-builder" aria-labelledby="semester-title">
        <span className="eyebrow">Browser-local planner</span>
        <h2 id="semester-title">My semester</h2>
        <p>Build an advisory plan here, then confirm credit recognition and enrolment with your home university.</p>
        <div className="semester-total"><strong>{getSemesterECTSTotal(semester)}</strong><span>planned ECTS</span></div>
        {semester.length ? (
          <ol className="semester-list">
            {semester.map((item, index) => {
              const entity = recordById.get(item.entityId);
              if (!entity) return null;
              return (
                <li key={item.entityId}>
                  <BookOpen aria-hidden="true" />
                  <div><Link href={`/records/${entity.slug}`}>{entity.title}</Link><small>{entity.ects ? `${entity.ects} ECTS` : "ECTS not published"}</small></div>
                  <span className="semester-list__controls">
                    <button type="button" aria-label={`Move ${entity.title} up`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp aria-hidden="true" /></button>
                    <button type="button" aria-label={`Move ${entity.title} down`} disabled={index === semester.length - 1} onClick={() => move(index, 1)}><ArrowDown aria-hidden="true" /></button>
                    <button type="button" aria-label={`Remove ${entity.title}`} onClick={() => remove(entity.id)}><Trash2 aria-hidden="true" /></button>
                  </span>
                </li>
              );
            })}
          </ol>
        ) : <div className="semester-empty"><CalendarPlus aria-hidden="true" /><p>Add learning records to compare a possible semester.</p></div>}
        <p className="privacy-note">Stored only in this browser. INGENIUM+ does not enrol you or guarantee recognition.</p>
      </aside>
    </div>
  );
}
