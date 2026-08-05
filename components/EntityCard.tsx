"use client";

import { ArrowUpRight, Bookmark, BookmarkCheck, Building2, CalendarDays, MapPin } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Entity } from "@/lib/data";
import { entityById, typeLabels } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

const SAVED_KEY = "ingenium-plus-v14-saved";

function parseSaved(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function savedSnapshot() {
  return typeof window === "undefined" ? "[]" : window.localStorage.getItem(SAVED_KEY) ?? "[]";
}

function subscribeSaved(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ingenium-saved-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ingenium-saved-change", callback);
  };
}

export function EntityCard({ entity, compact = false }: { entity: Entity; compact?: boolean }) {
  const saved = parseSaved(useSyncExternalStore(subscribeSaved, savedSnapshot, () => "[]")).includes(entity.id);
  const host = entity.hostUniversityId ? entityById.get(entity.hostUniversityId) : undefined;

  const toggleSaved = () => {
    const current = new Set(parseSaved(savedSnapshot()));
    if (current.has(entity.id)) current.delete(entity.id);
    else current.add(entity.id);
    window.localStorage.setItem(SAVED_KEY, JSON.stringify([...current]));
    window.dispatchEvent(new CustomEvent("ingenium-saved-change"));
  };

  const graphMode = entity.type === "university"
    ? "alliance"
    : ["programme", "pathway", "framework", "bip"].includes(entity.type)
      ? "programmes"
      : entity.type === "event" || entity.type === "opportunity"
        ? "mobility"
        : entity.type === "community" || entity.type === "platform"
          ? "communities"
          : entity.themes.includes("Sustainability")
            ? "sustainability"
            : "innovation";

  return (
    <article className={`entity-card entity-card--${entity.type} ${compact ? "entity-card--compact" : ""}`}>
      <div className="entity-card__meta">
        <span>{entity.subtype ?? typeLabels[entity.type]}</span>
        <StatusBadge status={entity.status} />
      </div>
      <h3>{entity.title}</h3>
      <p>{entity.studentSummary}</p>
      {!compact && (
        <div className="entity-card__facts">
          {host && (
            <span>
              <Building2 aria-hidden="true" /> {host.shortTitle ?? host.title}
            </span>
          )}
          {entity.city && (
            <span>
              <MapPin aria-hidden="true" /> {entity.city}
            </span>
          )}
          {entity.dateLabel && (
            <span>
              <CalendarDays aria-hidden="true" /> {entity.dateLabel}
            </span>
          )}
          {entity.ects && <span className="fact-chip">{entity.ects} ECTS</span>}
        </div>
      )}
      <div className="entity-card__themes" aria-label="Themes">
        {entity.themes.slice(0, compact ? 2 : 3).map((theme) => (
          <span key={theme}>{theme}</span>
        ))}
      </div>
      <div className="entity-card__actions">
        <a className="text-link" href={`/?mode=${graphMode}&node=${encodeURIComponent(entity.id)}`}>
          Explore in graph <ArrowUpRight aria-hidden="true" />
        </a>
        <button type="button" className="save-button" aria-pressed={saved} onClick={toggleSaved}>
          {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}
