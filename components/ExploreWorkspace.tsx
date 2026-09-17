"use client";

import { Grid2X2, Network, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { EntityStatus, EntityType } from "@/lib/data";
import { typeLabels } from "@/lib/data";
import { records } from "@/lib/v15-data";
import { filterRecords, getComputedStatus } from "@/lib/v15-logic";
import { EntityCard } from "./EntityCard";
import { GraphExplorer } from "./GraphExplorer";

type Representation = "cards" | "graph";

export function ExploreWorkspace() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<EntityType | "all">("all");
  const [universityId, setUniversityId] = useState("all");
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState<EntityStatus | "all">("all");
  const [theme, setTheme] = useState("all");
  const [representation, setRepresentation] = useState<Representation>("cards");

  const universities = useMemo(() => records.filter((record) => record.type === "university"), []);
  const countries = useMemo(() => [...new Set(records.flatMap((record) => record.countries ?? []))].sort(), []);
  const themes = useMemo(() => [...new Set(records.flatMap((record) => record.themes))].sort(), []);
  const statuses = useMemo(() => [...new Set(records.map((record) => getComputedStatus(record)))].sort(), []);
  const filtered = useMemo(() => filterRecords(records, {
    query,
    types: type === "all" ? undefined : [type],
    universityId,
    country,
    status,
    theme,
  }), [country, query, status, theme, type, universityId]);
  const hasFilters = Boolean(query || type !== "all" || universityId !== "all" || country !== "all" || status !== "all" || theme !== "all");

  const clear = () => {
    setQuery("");
    setType("all");
    setUniversityId("all");
    setCountry("all");
    setStatus("all");
    setTheme("all");
  };

  return (
    <>
      <section className="workspace-toolbar" aria-label="Explore filters">
        <label className="search-field workspace-toolbar__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search every INGENIUM record</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, people, universities, projects…" />
        </label>
        <span className="filter-label"><SlidersHorizontal aria-hidden="true" /> Refine</span>
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value as EntityType | "all")}><option value="all">All types</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>University</span><select value={universityId} onChange={(event) => setUniversityId(event.target.value)}><option value="all">All universities</option>{universities.map((item) => <option key={item.id} value={item.id}>{item.shortTitle ?? item.title}</option>)}</select></label>
        <label><span>Country</span><select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">All countries</option>{countries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as EntityStatus | "all")}><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Theme</span><select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All themes</option>{themes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        {hasFilters && <button className="button button--secondary" type="button" onClick={clear}><X aria-hidden="true" />Clear</button>}
      </section>

      <div className="workspace-results">
        <p aria-live="polite"><strong>{filtered.length}</strong> of {records.length} records</p>
        <div className="segmented-control" aria-label="Result representation">
          <button type="button" aria-pressed={representation === "cards"} onClick={() => setRepresentation("cards")}><Grid2X2 aria-hidden="true" /> Cards</button>
          <button type="button" aria-pressed={representation === "graph"} onClick={() => setRepresentation("graph")}><Network aria-hidden="true" /> Graph</button>
        </div>
      </div>

      {representation === "graph" ? (
        <section className="explore-graph" aria-label="Filtered graph results">
          <GraphExplorer allowedEntityIds={filtered.map((record) => record.id)} initialMode="alliance" showJourneyPicker={false} />
        </section>
      ) : filtered.length > 0 ? (
        <section className="card-grid" aria-label="Explore results">
          {filtered.map((record) => <EntityCard key={record.id} entity={record} />)}
        </section>
      ) : (
        <section className="empty-state"><h2>No matching records</h2><p>Try a broader term or remove one of the filters.</p><button className="button button--secondary" type="button" onClick={clear}>Clear filters</button></section>
      )}
    </>
  );
}
