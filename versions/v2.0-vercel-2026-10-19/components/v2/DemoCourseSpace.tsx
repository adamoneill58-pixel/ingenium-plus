"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Circle, MessageCircle, RotateCcw, Users } from "lucide-react";
import type { demoCourseSpaces } from "@/lib/v2/demo-community";

type Space = (typeof demoCourseSpaces)[number];
type Tab = "modules" | "discussion" | "people";

export function DemoCourseSpace({ space }: { space: Space }) {
  const [tab, setTab] = useState<Tab>("modules");
  const [complete, setComplete] = useState<string[]>([space.tasks[0]?.id].filter(Boolean));
  const [posts, setPosts] = useState([
    "Which official page should we use to confirm the application route?",
    "I compared the course themes with two campuses on the map.",
  ]);
  const [draft, setDraft] = useState("");
  const progress = Math.round((complete.length / Math.max(space.tasks.length, 1)) * 100);
  function reset() {
    setTab("modules");
    setComplete([space.tasks[0]?.id].filter(Boolean));
    setPosts([
      "Which official page should we use to confirm the application route?",
      "I compared the course themes with two campuses on the map.",
    ]);
    setDraft("");
  }
  return (
    <div className="course-room">
      <div className="demo-boundary" role="note"><div><strong>Demo course space · synthetic tasks, people and discussion.</strong><p>This is not an LMS or an enrolment. It demonstrates the experience while keeping the real opportunity record one click away.</p></div><button onClick={reset}><RotateCcw size={15} /> Reset demo</button></div>
      <div className="course-room-header"><div><span className="demo-content-label">DEMO LEARNING SPACE</span><h1>{space.title}</h1><p>{space.subtitle} · {space.campus}</p></div><Link href={`/records/${space.linkedRecordSlug}`}>Open the real INGENIUM record →</Link></div>
      <div className="course-room-progress"><span>Sample task progress</span><div className="progress-track"><i style={{width: `${progress}%`}} /></div><strong>{progress}%</strong></div>
      <div className="course-room-tabs" aria-label="Learning space views">{(["modules","discussion","people"] as const).map((value) => <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{value === "modules" ? "Modules & tasks" : value === "discussion" ? "Discussion" : "People"}</button>)}</div>
      {tab === "modules" && <div className="course-modules"><section>{space.modules.map((module, index) => <article key={module.title}><span>MODULE {index + 1}</span><h2>{module.title}</h2>{module.items.map((item) => <p key={item}><Circle size={12} />{item}</p>)}</article>)}</section><aside><span className="eyebrow">TO DO</span><h2>Your sample tasks</h2>{space.tasks.map((task) => {const done=complete.includes(task.id); return <button key={task.id} aria-pressed={done} onClick={() => setComplete((old) => done ? old.filter((id) => id !== task.id) : [...old, task.id])}>{done ? <Check size={15}/> : <Circle size={15}/>}<span><strong>{task.title}</strong><small>{task.due}</small></span></button>;})}<p>Task completion stays in page memory and does not represent academic progress.</p></aside></div>}
      {tab === "discussion" && <section className="course-discussion"><header><MessageCircle size={21}/><div><h2>Source-checking discussion</h2><p>Synthetic thread · no live classmates</p></div></header>{posts.map((post,index) => <article key={`${post}-${index}`}><span className="demo-avatar demo-avatar--small">{index < 2 ? ["AK","LM"][index] : "YO"}</span><div><strong>{index < 2 ? ["Ava K. · fictional","Leo M. · fictional"][index] : "You · local demo"}</strong><p>{post}</p><small>Synthetic contribution</small></div></article>)}<form onSubmit={(event) => {event.preventDefault(); const text=draft.trim(); if(!text)return; setPosts((old)=>[...old,text]); setDraft("");}}><label className="sr-only" htmlFor="course-discussion-draft">Add a local demo discussion post</label><textarea id="course-discussion-draft" value={draft} onChange={(event)=>setDraft(event.target.value)} maxLength={500} rows={3} placeholder="Add a local demo response…"/><button disabled={!draft.trim()}>Post to local demo</button></form></section>}
      {tab === "people" && <section className="course-people"><header><Users size={21}/><div><h2>Sample participants</h2><p>Fictional profiles used only to show the layout.</p></div></header>{[{n:"Ava K. · fictional",i:"AK",u:"MTU",r:"Student"},{n:"Leo M. · fictional",i:"LM",u:"UNIOVI",r:"Student"},{n:"Dr Sam N. · fictional",i:"SN",u:"Xamk",r:"Facilitator"}].map((person)=><article key={person.n}><span className="demo-avatar">{person.i}</span><div><strong>{person.n}</strong><p>{person.r} · {person.u}</p><small>DEMO PROFILE</small></div></article>)}</section>}
    </div>
  );
}
