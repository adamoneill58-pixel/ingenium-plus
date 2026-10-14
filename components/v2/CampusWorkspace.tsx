"use client";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { Search, List, Network, Map, ArrowUpRight, X } from "lucide-react";
import type { Entity } from "@/lib/data";
import { discover, availability, type DiscoveryFilters } from "@/lib/v2/domain";
import { typeLabels } from "@/lib/labels";
import { OpportunityCard } from "./OpportunityCard";
import { usePilotEvent } from "./PilotContext";
const NetworkCanvas = lazy(() => import("./NetworkCanvas"));
const CampusMap = lazy(() => import("./CampusMap"));
type View = "list" | "network" | "map";
const EMPTY_FILTERS: DiscoveryFilters = {};
const keys = [
  "query",
  "type",
  "university",
  "delivery",
  "level",
  "language",
  "status",
  "theme",
  "funding",
  "deadline",
] as const;
export function CampusWorkspace({
  records,
  initialFilters = EMPTY_FILTERS,
}: {
  records: Entity[];
  initialFilters?: DiscoveryFilters;
}) {
  const [filters, setFilters] = useState<DiscoveryFilters>(initialFilters);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState("");
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(12);
  const send = usePilotEvent();
  useEffect(() => {
    const restore = () => {
      const p = new URLSearchParams(location.search);
      const f: DiscoveryFilters = { ...initialFilters };
      for (const k of keys) if (p.has(k)) f[k] = p.get(k) ?? "";
      if (p.has("q") && !p.has("query")) f.query = p.get("q") ?? "";
      setFilters(f);
      const v = p.get("view");
      setView(
        v === "network" || v === "map"
          ? v
          : p.get("layout") === "network"
            ? "network"
            : "list",
      );
      setSelected(p.get("node") ?? "");
      setReady(true);
    };
    queueMicrotask(restore);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [initialFilters]);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    for (const k of keys) if (filters[k]) p.set(k, filters[k]!);
    if (view !== "list") p.set("view", view);
    if (selected) p.set("node", selected);
    history.replaceState(
      null,
      "",
      `${location.pathname}${p.size ? `?${p}` : ""}`,
    );
  }, [filters, view, selected, ready]);
  const universities = useMemo(
    () => records.filter((r) => r.type === "university"),
    [records],
  );
  const themes = useMemo(
    () => [...new Set(records.flatMap((r) => r.themes))].sort(),
    [records],
  );
  const results = useMemo(() => discover(records, filters), [records, filters]);
  const networkRecords = useMemo(
    () => [...universities, ...results.filter((r) => r.type !== "university")],
    [universities, results],
  );
  const current = records.find((r) => r.id === selected);
  const select = useCallback((id: string) => setSelected(id), []);
  const change = (key: keyof DiscoveryFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setLimit(12);
  };
  useEffect(() => {
    if (!ready || !filters.query) return;
    const timer = setTimeout(
      () =>
        send(
          "search",
          results.length === 0
            ? "0"
            : results.length <= 10
              ? "1-10"
              : results.length <= 50
                ? "11-50"
                : "51+",
        ),
      800,
    );
    return () => clearTimeout(timer);
  }, [filters.query, results.length, ready, send]);
  return (
    <div className="discovery-workspace">
      <form className="discovery-search" onSubmit={(e) => e.preventDefault()}>
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="campus-search">
          Search opportunities
        </label>
        <input
          id="campus-search"
          placeholder="What would you like to explore? Try sustainability, AI or exchange…"
          value={filters.query ?? ""}
          onChange={(e) => change("query", e.target.value)}
        />
        <span className="search-count">{results.length} results</span>
      </form>
      <div className="discovery-filters">
        <label>
          University
          <select
            value={filters.university ?? ""}
            onChange={(e) => change("university", e.target.value)}
          >
            <option value="">All ten universities</option>
            {universities.map((u) => (
              <option value={u.id} key={u.id}>
                {u.shortTitle ?? u.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Opportunity
          <select
            value={filters.type ?? ""}
            onChange={(e) => change("type", e.target.value)}
          >
            <option value="">All types</option>
            {Object.entries(typeLabels)
              .filter(([k]) => k !== "student")
              .map(([k, v]) => (
                <option value={k} key={k}>
                  {v}
                </option>
              ))}
          </select>
        </label>
        <label>
          Format
          <select
            value={filters.delivery ?? ""}
            onChange={(e) => change("delivery", e.target.value)}
          >
            <option value="">Online & in person</option>
            <option value="online">Online / virtual</option>
            <option value="physical">In person / blended</option>
          </select>
        </label>
        <label>
          Applications
          <select
            value={filters.status ?? ""}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="">All availability</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="unknown">Status unknown</option>
          </select>
        </label>
        <details className="extra-filters">
          <summary>More filters</summary>
          <div>
            <label>
              Topic
              <select
                value={filters.theme ?? ""}
                onChange={(e) => change("theme", e.target.value)}
              >
                <option value="">All topics</option>
                {themes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Study level
              <select
                value={filters.level ?? ""}
                onChange={(e) => change("level", e.target.value)}
              >
                <option value="">Any level</option>
                {["Bachelor", "Master", "PhD"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <label>
              Language
              <input
                placeholder="e.g. English"
                value={filters.language ?? ""}
                onChange={(e) => change("language", e.target.value)}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(filters.funding)}
                onChange={(e) =>
                  change("funding", e.target.checked ? "yes" : "")
                }
              />
              Published funding information
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(filters.deadline)}
                onChange={(e) =>
                  change("deadline", e.target.checked ? "upcoming" : "")
                }
              />
              Upcoming application date
            </label>
          </div>
        </details>
        <button
          className="clear-filters"
          onClick={() => {
            setFilters({});
            setSelected("");
            setLimit(12);
          }}
        >
          Reset
        </button>
      </div>
      <div className="workspace-heading">
        <div>
          <h2>
            {filters.university
              ? `${universities.find((u) => u.id === filters.university)?.shortTitle ?? "Campus"} & beyond`
              : "Find your next connection"}
          </h2>
          <p aria-live="polite">
            {results.length} matching records · one shared dataset
          </p>
        </div>
        <div className="view-switch" aria-label="Discovery view">
          {(
            [
              ["list", List],
              ["network", Network],
              ["map", Map],
            ] as const
          ).map(([v, Icon]) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              <Icon size={17} />
              {v === "list" ? "List" : v === "map" ? "Map" : "Network"}
            </button>
          ))}
          <Link
            href={`/calendar?${new URLSearchParams({ ...Object.fromEntries(Object.entries(filters).filter(([, v]) => Boolean(v))), ...(selected ? { node: selected } : {}) })}`}
          >
            Calendar ↗
          </Link>
        </div>
      </div>
      {Object.values(filters).some(Boolean) && (
        <div className="applied-filters" aria-label="Applied filters">
          {keys
            .filter((k) => filters[k])
            .map((k) => (
              <button key={k} onClick={() => change(k, "")}>
                {k}: {filters[k]} <X size={12} />
              </button>
            ))}
        </div>
      )}
      <Suspense
        fallback={
          <div className="loading-state" role="status">
            Loading the {view} view. The list is available at any time.
          </div>
        }
      >
        {view === "network" ? (
          <NetworkCanvas
            records={networkRecords}
            selected={selected}
            onSelect={select}
          />
        ) : view === "map" ? (
          <CampusMap
            universities={universities}
            records={results}
            onCampus={(id) => {
              change("university", id);
              setView("list");
            }}
          />
        ) : null}
      </Suspense>
      {current && (
        <section className="selected-record" aria-labelledby="selected-title">
          <button
            className="close-selection"
            aria-label="Close selected record"
            onClick={() => setSelected("")}
          >
            <X />
          </button>
          <span className="eyebrow">
            Selected connection · {availability(current).label}
          </span>
          <h2 id="selected-title">{current.title}</h2>
          <p>{current.studentSummary}</p>
          <div className="selection-actions">
            <button
              className="button button--primary"
              onClick={() => setView("network")}
            >
              See connections
            </button>
            <Link className="text-link" href={`/records/${current.slug}`}>
              Read evidence & next steps <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      )}
      {view === "list" &&
        (results.length ? (
          <>
            <div className="opportunity-grid">
              {results.slice(0, limit).map((r) => (
                <OpportunityCard key={r.id} record={r} onSelect={select} />
              ))}
            </div>
            {limit < results.length && (
              <button
                className="button button--secondary load-more"
                onClick={() => setLimit((l) => l + 12)}
              >
                Show 12 more · {results.length - limit} remaining
              </button>
            )}
          </>
        ) : (
          <section className="empty-state">
            <h3>No opportunities match these choices yet.</h3>
            <p>
              Try removing a filter. Your constraints have not been changed
              automatically.
            </p>
            <button
              className="button button--primary"
              onClick={() => setFilters({})}
            >
              Clear filters
            </button>
          </section>
        ))}
      <p className="workspace-disclaimer">
        Always check the official university page before applying. Applications,
        enrolment and credit recognition stay with your university.
      </p>
    </div>
  );
}
