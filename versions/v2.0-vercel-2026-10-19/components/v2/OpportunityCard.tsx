"use client";
import Link from "next/link";
import type { Entity } from "@/lib/data";
import { availability } from "@/lib/v2/domain";
import { memoryRead, memoryWrite, memorySnapshot } from "@/lib/v2/memory-store";
import { useSyncExternalStore } from "react";
import { typeLabels } from "@/lib/labels";
import { universityShortNames } from "@/lib/university-names";
import { Bookmark, ArrowUpRight, CalendarDays } from "lucide-react";
import { Useful, usePilotEvent } from "./PilotContext";
import { simulationHref } from "@/lib/v2/campus-simulation";
export function OpportunityCard({
  record,
  onSelect,
}: {
  record: Entity;
  onSelect?: (id: string) => void;
}) {
  const rev = useSyncExternalStore(
    (cb) => {
      window.addEventListener("ingenium-saved-change", cb);
      return () => window.removeEventListener("ingenium-saved-change", cb);
    },
    memorySnapshot,
    () => "0",
  );
  void rev;
  const saved = memoryRead<string[]>("ingenium-plus-v15-saved", []).includes(
    record.id,
  );
  const a = availability(record);
  const synthetic=record.dataClassification==="sample";
  const href=synthetic?simulationHref(record):`/records/${record.slug}`;
  const send = usePilotEvent();
  function toggle() {
    const ids = new Set(memoryRead<string[]>("ingenium-plus-v15-saved", []));
    if (saved) ids.delete(record.id);
    else ids.add(record.id);
    memoryWrite("ingenium-plus-v15-saved", [...ids]);
  }
  return (
    <article className="opportunity-card">
      <div className="card-top">
        <span className="type-label">{typeLabels[record.type]}</span>
        <span
          className={`availability availability--${a.value}`}
          title={
            a.label === "Closing soon"
              ? "Confirmed deadline is within 14 days"
              : undefined
          }
        >
          {synthetic?"Synthetic demo":a.label}
        </span>
      </div>
      <h3>
        <Link
          href={href}
          onClick={() => !synthetic&&send("node_open", record.id)}
        >
          {record.title}
        </Link>
      </h3>
      <p>{record.studentSummary}</p>
      <div className="topic-chips">
        {record.themes.slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="card-details">
        <span>
          {record.hostUniversityId
            ? (universityShortNames[record.hostUniversityId] ??
              "Across the alliance")
            : "Across the alliance"}
        </span>
        <span>{record.deliveryMode ?? "Check delivery format"}</span>
        {record.ects !== undefined && <span>{record.ects} ECTS</span>}
      </div>
      {record.applicationDeadline && (
        <p className="deadline">
          <CalendarDays size={14} aria-hidden="true" /> Application date:{" "}
          {record.applicationDeadline}
        </p>
      )}
      {a.conflict && (
        <p className="verification-note">
          Conflicting information — verify with the official source.
        </p>
      )}
      {record.lastCheckError && (
        <p className="verification-note">{record.lastCheckError}</p>
      )}
      <small className="last-checked">
        {record.lastChecked
          ? `Last checked ${record.lastChecked.slice(0, 10)}`
          : `Last checked: not yet refreshed · Evidence ${record.lastVerified}`}
      </small>
      <div className="card-bottom">
        {onSelect ? (
          <button
            className="text-link"
            onClick={() => {
              onSelect(record.id);
              if(!synthetic)send("node_open", record.id);
            }}
          >
            View connections <ArrowUpRight size={16} />
          </button>
        ) : (
          <Link className="text-link" href={href}>
            Explore opportunity <ArrowUpRight size={16} />
          </Link>
        )}
        <button
          className="bookmark-action"
          aria-label={`${saved ? "Remove" : "Save"} ${record.title}`}
          aria-pressed={saved}
          onClick={toggle}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      {!synthetic&&<Useful id={record.id} />}
    </article>
  );
}
