"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Entity, EntityStatus, EntityType } from "@/lib/data";
import { typeLabels } from "@/lib/data";
import { EntityCard } from "./EntityCard";

interface DirectoryPageProps {
  eyebrow: string;
  title: string;
  introduction: string;
  entities: Entity[];
  showTypeFilter?: boolean;
}

export function DirectoryPage({ eyebrow, title, introduction, entities, showTypeFilter = true }: DirectoryPageProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<EntityType | "all">("all");
  const [status, setStatus] = useState<EntityStatus | "all">("all");
  const [theme, setTheme] = useState("all");

  const themes = useMemo(
    () => [...new Set(entities.flatMap((entity) => entity.themes))].sort((a, b) => a.localeCompare(b)),
    [entities],
  );
  const types = useMemo(() => [...new Set(entities.map((entity) => entity.type))], [entities]);
  const statuses = useMemo(() => [...new Set(entities.map((entity) => entity.status))], [entities]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entities.filter((entity) => {
      const haystack = [entity.title, entity.shortTitle, entity.studentSummary, entity.subtype, ...entity.themes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!needle || haystack.includes(needle)) &&
        (type === "all" || entity.type === type) &&
        (status === "all" || entity.status === status) &&
        (theme === "all" || entity.themes.includes(theme))
      );
    });
  }, [entities, query, status, theme, type]);

  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{introduction}</p>
        </div>
        <div className="page-hero__signal" aria-label={`${filtered.length} visible results`}>
          <strong>{filtered.length}</strong>
          <span>verified records</span>
        </div>
      </section>

      <section className="directory-toolbar" aria-label="Directory filters">
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Search this directory</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, theme or keyword" />
        </label>
        <span className="filter-label">
          <SlidersHorizontal aria-hidden="true" /> Refine
        </span>
        {showTypeFilter && types.length > 1 && (
          <label>
            <span className="sr-only">Type</span>
            <select value={type} onChange={(event) => setType(event.target.value as EntityType | "all")}>
              <option value="all">All types</option>
              {types.map((value) => (
                <option key={value} value={value}>{typeLabels[value]}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span className="sr-only">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as EntityStatus | "all")}>
            <option value="all">All statuses</option>
            {statuses.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Theme</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="all">All themes</option>
            {themes.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </section>

      <p className="results-summary" aria-live="polite">
        Showing {filtered.length} of {entities.length}
      </p>

      {filtered.length > 0 ? (
        <section className="card-grid" aria-label={`${title} results`}>
          {filtered.map((entity) => <EntityCard key={entity.id} entity={entity} />)}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No matching records</h2>
          <p>Try removing a filter or using a broader search term.</p>
          <button type="button" className="button button--secondary" onClick={() => { setQuery(""); setType("all"); setStatus("all"); setTheme("all"); }}>
            Clear filters
          </button>
        </section>
      )}
    </main>
  );
}
