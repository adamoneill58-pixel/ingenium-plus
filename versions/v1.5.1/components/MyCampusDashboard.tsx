"use client";

import { ArrowRight, Check, Circle, GraduationCap, LockKeyhole, Network, Plus, Save, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import type { LocalProfile } from "@/lib/v15-logic";
import type { StudentProfile } from "@/lib/v15-data";
import { recordById, records, sampleStudents } from "@/lib/v15-data";
import {
  CONNECTIONS_KEY,
  emptyProfile,
  JOINED_KEY,
  PROFILE_KEY,
  readJson,
  readProfile,
  readSemester,
  readStringList,
  RECENT_KEY,
  SAVED_KEY,
  storeSnapshot,
  subscribeStore,
  TASKS_KEY,
  writeJson,
} from "@/lib/local-store";
import { getMutualConnections, getProfileCompletion, getRecommendationsForProfile, getSharedContexts, getStudentDegree } from "@/lib/v15-logic";
import { EntityCard } from "./EntityCard";

interface LocalTask { id: string; label: string; done: boolean }

const splitValues = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export function MyCampusDashboard() {
  useSyncExternalStore(subscribeStore, storeSnapshot, () => "");
  const profile = readProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<LocalProfile>(profile ?? emptyProfile);
  const [taskLabel, setTaskLabel] = useState("");
  const saved = readStringList(SAVED_KEY).map((id) => recordById.get(id)).filter(Boolean);
  const joinedIds = readStringList(JOINED_KEY);
  const joined = joinedIds.map((id) => recordById.get(id)).filter(Boolean);
  const recent = readStringList(RECENT_KEY).map((id) => recordById.get(id)).filter(Boolean);
  const semester = readSemester().map((item) => recordById.get(item.entityId)).filter(Boolean);
  const connections = readStringList(CONNECTIONS_KEY);
  const taskValue = readJson<unknown>(TASKS_KEY, []);
  const tasks = Array.isArray(taskValue)
    ? taskValue.filter((task): task is LocalTask => Boolean(task) && typeof task === "object" && typeof (task as LocalTask).id === "string" && typeof (task as LocalTask).label === "string" && typeof (task as LocalTask).done === "boolean")
    : [];
  const universities = useMemo(() => records.filter((record) => record.type === "university"), []);
  const completion = profile ? getProfileCompletion(profile) : { percentage: 0, missing: [] };
  const recommendations = profile ? getRecommendationsForProfile(profile).slice(0, 6) : [];

  const localStudent: StudentProfile = {
    id: "student-you",
    displayName: profile?.displayName || "You",
    sample: false,
    universityId: profile?.universityId ?? "",
    studyLevel: profile?.studyLevel,
    interests: profile?.interests ?? [],
    goals: profile?.goals ?? [],
    languages: profile?.languages ?? [],
    joinedEntityIds: joinedIds,
    savedEntityIds: readStringList(SAVED_KEY),
    connectionIds: connections,
  };
  const networkPeople = sampleStudents.map((student) => ({
    student,
    degree: getStudentDegree(localStudent, student),
    shared: getSharedContexts(localStudent, student),
    mutual: getMutualConnections(localStudent, student),
  })).filter((item) => item.degree !== null || profile?.interests.some((interest) => item.student.interests.includes(interest))).slice(0, 6);

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    writeJson(PROFILE_KEY, draft);
    setEditing(false);
  };
  const toggleConnection = (id: string) => {
    const next = new Set(readStringList(CONNECTIONS_KEY));
    if (next.has(id)) next.delete(id); else next.add(id);
    writeJson(CONNECTIONS_KEY, [...next]);
  };
  const addTask = (event: FormEvent) => {
    event.preventDefault();
    if (!taskLabel.trim()) return;
    writeJson(TASKS_KEY, [...tasks, { id: crypto.randomUUID(), label: taskLabel.trim(), done: false }]);
    setTaskLabel("");
  };
  const toggleTask = (id: string) => writeJson(TASKS_KEY, tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  if (!profile || editing) {
    return (
      <section className="profile-setup" aria-labelledby="profile-title">
        <div><span className="eyebrow">Optional and private</span><h1 id="profile-title">Make the campus yours</h1><p>Create a browser-local profile to see explained recommendations and a sample network. Nothing is uploaded, and you can still use all discovery features without it.</p><p className="privacy-note"><LockKeyhole aria-hidden="true" /> Private to this browser · not an INGENIUM account</p></div>
        <form onSubmit={submitProfile}>
          <label><span>Display name</span><input required value={draft.displayName ?? ""} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} /></label>
          <label><span>Home university</span><select required value={draft.universityId ?? ""} onChange={(event) => setDraft({ ...draft, universityId: event.target.value })}><option value="">Choose university</option>{universities.map((item) => <option value={item.id} key={item.id}>{item.shortTitle} — {item.title}</option>)}</select></label>
          <label><span>Study level</span><select value={draft.studyLevel ?? ""} onChange={(event) => setDraft({ ...draft, studyLevel: event.target.value })}><option value="">Choose level</option><option>Bachelor</option><option>Master</option><option>PhD</option></select></label>
          <label><span>Programme or field</span><input value={draft.fieldOfStudy ?? ""} onChange={(event) => setDraft({ ...draft, fieldOfStudy: event.target.value })} placeholder="e.g. Software Development" /></label>
          <label><span>Interests <small>(comma-separated)</small></span><input value={draft.interests.join(", ")} onChange={(event) => setDraft({ ...draft, interests: splitValues(event.target.value) })} placeholder="AI, sustainability, languages" /></label>
          <label><span>Goals <small>(comma-separated)</small></span><input value={draft.goals.join(", ")} onChange={(event) => setDraft({ ...draft, goals: splitValues(event.target.value) })} placeholder="Study abroad, join a BIP" /></label>
          <label><span>Languages <small>(comma-separated)</small></span><input value={draft.languages.join(", ")} onChange={(event) => setDraft({ ...draft, languages: splitValues(event.target.value) })} placeholder="English, French" /></label>
          <label><span>Preferred destinations <small>(comma-separated)</small></span><input value={draft.preferredCountries.join(", ")} onChange={(event) => setDraft({ ...draft, preferredCountries: splitValues(event.target.value) })} placeholder="Finland, Germany" /></label>
          <div className="profile-form__actions"><button className="button button--primary" type="submit"><Save aria-hidden="true" />Save locally</button>{profile && <button className="button button--secondary" type="button" onClick={() => setEditing(false)}>Cancel</button>}</div>
        </form>
      </section>
    );
  }

  return (
    <>
      <section className="campus-dashboard__hero">
        <div><span className="eyebrow">My Campus</span><h1>Welcome, {profile?.displayName}</h1><p>Your private planning layer across one European campus.</p></div>
        <div className="profile-completion"><strong>{completion.percentage}%</strong><span>profile complete</span><div><i style={{ width: `${completion.percentage}%` }} /></div><button type="button" onClick={() => { setDraft(profile ?? emptyProfile); setEditing(true); }}>Edit profile</button></div>
      </section>
      {completion.percentage < 100 && <p className="completion-prompt">Add {completion.missing.slice(0, 2).join(" and ")} to sharpen your recommendations.</p>}

      <section className="campus-grid">
        <article className="campus-panel campus-panel--network">
          <span className="eyebrow">My Network</span><h2><Network aria-hidden="true" />You in the graph</h2><p>Connections below use clearly labelled sample profiles to demonstrate first-, second- and third-degree academic links.</p>
          <div className="you-network" aria-label="Your sample student network">
            <div className="you-node"><UserRound aria-hidden="true" /><strong>You</strong><span>{recordById.get(profile?.universityId ?? "")?.shortTitle}</span></div>
            <div className="network-people">{networkPeople.length ? networkPeople.map(({ student, degree, shared, mutual }) => <div className="network-person" key={student.id}><span className={`degree-chip degree-chip--${degree ?? "suggested"}`}>{degree ? `${degree}°` : "Match"}</span><Link href={`/records/${student.id}`}><strong>{student.displayName}</strong><small>Sample · {recordById.get(student.universityId)?.shortTitle}</small></Link><p>{degree === 1 ? "Direct local connection" : degree === 2 ? `Shared ${recordById.get(shared[0])?.shortTitle ?? recordById.get(shared[0])?.title ?? "activity"}` : degree === 3 ? `${mutual.length} mutual sample connection` : "Shared interest"}</p><button type="button" onClick={() => toggleConnection(student.id)}>{connections.includes(student.id) ? "Connected" : "Connect locally"}</button></div>) : <p className="privacy-note">Join a record or add interests to reveal contextual sample connections.</p>}</div>
          </div>
        </article>

        <article className="campus-panel">
          <span className="eyebrow">Action list</span><h2>Next steps</h2>
          <form className="task-form" onSubmit={addTask}><input value={taskLabel} onChange={(event) => setTaskLabel(event.target.value)} placeholder="Add a private task" aria-label="New task" /><button type="submit" aria-label="Add task"><Plus aria-hidden="true" /></button></form>
          <ul className="task-list">{tasks.map((task) => <li key={task.id}><button type="button" onClick={() => toggleTask(task.id)}>{task.done ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}</button><span className={task.done ? "is-done" : ""}>{task.label}</span></li>)}</ul>
          {!tasks.length && <p className="privacy-note">Add reminders for adviser checks, nominations or official applications.</p>}
        </article>

        <article className="campus-panel">
          <span className="eyebrow">Activity timeline</span><h2>My planning trail</h2>
          <ol className="activity-list">
            {joined.slice(0, 4).map((item) => item && <li key={`joined-${item.id}`}><Check aria-hidden="true" /><span>Marked joined</span><Link href={`/records/${item.slug}`}>{item.title}</Link></li>)}
            {semester.slice(0, 4).map((item) => item && <li key={`semester-${item.id}`}><GraduationCap aria-hidden="true" /><span>Added to semester</span><Link href={`/records/${item.slug}`}>{item.title}</Link></li>)}
            {recent.slice(0, 4).map((item) => item && <li key={`recent-${item.id}`}><ArrowRight aria-hidden="true" /><span>Viewed</span><Link href={`/records/${item.slug}`}>{item.title}</Link></li>)}
          </ol>
          {!joined.length && !semester.length && !recent.length && <p className="privacy-note">Viewed, joined and semester records will appear here.</p>}
        </article>
      </section>

      <section className="campus-recommendations">
        <div className="section-heading"><div><span className="eyebrow">Explainable matches</span><h2><Sparkles aria-hidden="true" />Recommended for you</h2></div><Link className="text-link" href="/explore">Explore everything <ArrowRight aria-hidden="true" /></Link></div>
        {recommendations.length ? <div className="recommendation-grid">{recommendations.map((item) => <article key={item.entity.id}><span>{item.score}% match</span><h3><Link href={`/records/${item.entity.slug}`}>{item.entity.title}</Link></h3><ul>{item.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><Link className="text-link" href={`/records/${item.entity.slug}`}>See why and act <ArrowRight aria-hidden="true" /></Link></article>)}</div> : <div className="empty-state"><h2>Add a little more context</h2><p>Interests, goals and destinations power transparent recommendation reasons.</p></div>}
      </section>

      {saved.length > 0 && <section className="campus-saved"><div className="section-heading"><div><span className="eyebrow">Saved</span><h2>Your shortlist</h2></div></div><div className="card-grid card-grid--three">{saved.slice(0, 6).map((item) => item && <EntityCard key={item.id} entity={item} compact />)}</div></section>}
    </>
  );
}
