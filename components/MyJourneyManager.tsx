"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  Download,
  ExternalLink,
  MapPinned,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { entityById, sourceById, type Entity } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

const SAVED_KEY = "ingenium-plus-v14-saved";
const JOURNEY_KEY = "ingenium-plus-v14-journey";
const PLANNER_KEY = "ingenium-plus-v14-planner";
const STORE_EVENT = "ingenium-journey-change";

type StepState = "Considering" | "Ask local office" | "Applied" | "Booked" | "Completed";
type PlannerState = Record<string, { state?: StepState; notes?: string }>;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readPlanner(): PlannerState {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(PLANNER_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return "[]|[]|{}";
  return `${window.localStorage.getItem(JOURNEY_KEY) ?? "[]"}|${window.localStorage.getItem(SAVED_KEY) ?? "[]"}|${window.localStorage.getItem(PLANNER_KEY) ?? "{}"}`;
}

function subscribe(callback: () => void) {
  const listener = () => callback();
  window.addEventListener("storage", listener);
  window.addEventListener(STORE_EVENT, listener);
  window.addEventListener("ingenium-saved-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(STORE_EVENT, listener);
    window.removeEventListener("ingenium-saved-change", listener);
  };
}

function emitChange() {
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
  window.dispatchEvent(new CustomEvent("ingenium-saved-change"));
}

export function MyJourneyManager() {
  useSyncExternalStore(subscribe, getSnapshot, () => "[]|[]|{}");
  const journeyIds = readList(JOURNEY_KEY);
  const savedIds = readList(SAVED_KEY);
  const planner = readPlanner();

  const ids = [...new Set([...journeyIds, ...savedIds])];
  const items = ids.map((id) => entityById.get(id)).filter((entity): entity is Entity => Boolean(entity));

  const updatePlanner = (id: string, patch: Partial<PlannerState[string]>) => {
    const current = readPlanner();
    window.localStorage.setItem(PLANNER_KEY, JSON.stringify({ ...current, [id]: { ...current[id], ...patch } }));
    emitChange();
  };

  const move = (id: string, direction: -1 | 1) => {
    const ids = items.map((item) => item.id);
    const index = ids.indexOf(id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return;
    [ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
    window.localStorage.setItem(JOURNEY_KEY, JSON.stringify(ids));
    emitChange();
  };

  const remove = (id: string) => {
    window.localStorage.setItem(JOURNEY_KEY, JSON.stringify(readList(JOURNEY_KEY).filter((value) => value !== id)));
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(readList(SAVED_KEY).filter((value) => value !== id)));
    const nextPlanner = readPlanner();
    delete nextPlanner[id];
    window.localStorage.setItem(PLANNER_KEY, JSON.stringify(nextPlanner));
    emitChange();
  };

  const exportJourney = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      privacy: "Created locally in the browser; contains only the notes entered by the user.",
      steps: items.map((entity) => ({
        id: entity.id,
        title: entity.title,
        status: planner[entity.id]?.state ?? "Considering",
        notes: planner[entity.id]?.notes ?? "",
        officialUrl: entity.officialUrl,
        source: sourceById.get(entity.sourceId)?.title,
      })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-ingenium-journey.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) {
    return (
      <section className="journey-empty">
        <MapPinned aria-hidden="true" />
        <span className="eyebrow">Your plan is empty</span>
        <h2>Save an opportunity or add a graph step</h2>
        <p>Anything you save stays on this device. No account is created and nothing is sent to INGENIUM+.</p>
        <Link className="button button--primary" href="/">Explore the network</Link>
      </section>
    );
  }

  return (
    <section className="journey-workspace" aria-label="Saved INGENIUM journey">
      <div className="journey-workspace__toolbar">
        <p><strong>{items.length} steps</strong> · stored only in this browser</p>
        <button type="button" className="button button--secondary" onClick={exportJourney}>
          <Download aria-hidden="true" /> Export plan
        </button>
      </div>
      <ol className="journey-steps">
        {items.map((entity, index) => {
          const host = entity.hostUniversityId ? entityById.get(entity.hostUniversityId) : undefined;
          return (
            <li key={entity.id} className="journey-step">
              <div className="journey-step__rail" aria-hidden="true"><span>{index + 1}</span></div>
              <article>
                <div className="journey-step__heading">
                  <div>
                    <span className="eyebrow">{entity.subtype ?? entity.type}</span>
                    <h2>{entity.title}</h2>
                  </div>
                  <StatusBadge status={entity.status} />
                </div>
                <p>{entity.studentSummary}</p>
                <div className="journey-step__facts">
                  {host && <span>{host.shortTitle ?? host.title}</span>}
                  {entity.dateLabel && <span>{entity.dateLabel}</span>}
                  {entity.applicationDeadline && <span>Deadline {entity.applicationDeadline}</span>}
                  {entity.ects && <span>{entity.ects} ECTS</span>}
                </div>
                <div className="journey-step__planning">
                  <label>
                    My status
                    <select
                      value={planner[entity.id]?.state ?? "Considering"}
                      onChange={(event) => updatePlanner(entity.id, { state: event.target.value as StepState })}
                    >
                      {(["Considering", "Ask local office", "Applied", "Booked", "Completed"] as StepState[]).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </label>
                  <label className="journey-step__notes">
                    Private notes
                    <textarea
                      value={planner[entity.id]?.notes ?? ""}
                      onChange={(event) => updatePlanner(entity.id, { notes: event.target.value })}
                      placeholder="Questions, local deadline, contact or next action…"
                      rows={2}
                    />
                  </label>
                </div>
                <div className="journey-step__actions">
                  <a href={`/?mode=alliance&node=${encodeURIComponent(entity.id)}`}>Open in graph <MapPinned aria-hidden="true" /></a>
                  {entity.officialUrl && <a href={entity.officialUrl} target="_blank" rel="noreferrer">Official source <ExternalLink aria-hidden="true" /></a>}
                  <button type="button" aria-label={`Move ${entity.title} up`} disabled={index === 0} onClick={() => move(entity.id, -1)}><ArrowUp aria-hidden="true" /></button>
                  <button type="button" aria-label={`Move ${entity.title} down`} disabled={index === items.length - 1} onClick={() => move(entity.id, 1)}><ArrowDown aria-hidden="true" /></button>
                  <button type="button" aria-label={`Remove ${entity.title} from my journey`} onClick={() => remove(entity.id)}><Trash2 aria-hidden="true" /></button>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <aside className="journey-privacy-note">
        <CalendarCheck aria-hidden="true" />
        <div><strong>Before you act</strong><p>Deadlines and eligibility can change. Re-open each official source and confirm the local process with your home university.</p></div>
      </aside>
    </section>
  );
}
