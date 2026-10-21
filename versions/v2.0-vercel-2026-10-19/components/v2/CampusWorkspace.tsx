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
import { useSimulation } from "./SimulationContext";
import { simulationEntities, simulationHref, simSpaces, spaceEntityId } from "@/lib/v2/campus-simulation";
import { connectionInfo, prioritiseConnections } from "@/lib/v2/simulation-state";
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
  publicEntry = false,
}: {
  records: Entity[];
  initialFilters?: DiscoveryFilters;
  publicEntry?: boolean;
}) {
  const [filters, setFilters] = useState<DiscoveryFilters>(initialFilters);
  const [view, setView] = useState<View>("map");
  const [selected, setSelected] = useState("");
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(12);
  const [degree,setDegree]=useState("all");
  const [showPeople,setShowPeople]=useState(!publicEntry);
  const {state,persona,personal}=useSimulation();
  const allRecords=useMemo(()=>publicEntry?records:[...records,...simulationEntities(state.mode).filter((record)=>showPeople||record.type!=="person")],[records,state.mode,showPeople,publicEntry]);
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
        v === "network" || v === "map" || v === "list"
          ? v
          : p.get("layout") === "network"
            ? "network"
            : p.get("layout") === "list"
              ? "list"
              : "map",
      );
      setSelected(p.get("node") ?? "");
      const d=p.get("degree");setDegree(d&&["1","2","3+"].includes(d)?d:"all");
      setShowPeople(!publicEntry&&p.get("people")!=="hide");
      setReady(true);
    };
    queueMicrotask(restore);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [initialFilters, publicEntry]);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams(location.search);
    for(const key of [...keys,"q","view","node","layout","degree","people"])p.delete(key);
    for (const k of keys) if (filters[k]) p.set(k, filters[k]!);
    if (view !== "map") p.set("view", view);
    if (selected) p.set("node", selected);
    if(degree!=="all")p.set("degree",degree);
    if(!showPeople)p.set("people","hide");
    p.set("mode",state.mode);
    history.replaceState(
      null,
      "",
      `${location.pathname}${p.size ? `?${p}` : ""}`,
    );
  }, [filters, view, selected, ready,degree,showPeople,state.mode]);
  const universities = useMemo(
    () => records.filter((r) => r.type === "university"),
    [records],
  );
  const themes = useMemo(
    () => [...new Set(records.flatMap((r) => r.themes))].sort(),
    [records],
  );
  const results = useMemo(() => publicEntry?discover(allRecords, filters):prioritiseConnections(discover(allRecords, filters),state.mode,personal,degree), [allRecords, filters,state.mode,personal,degree,publicEntry]);
  const networkRecords = useMemo(
    () => [...universities, ...results.filter((r) => r.type !== "university")],
    [universities, results],
  );
  const current = allRecords.find((r) => r.id === selected);
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
      {!publicEntry&&<>
      <div className="connection-controls"><div><span className="sim-avatar sim-avatar--small">{persona.initials}</span><div><strong>{persona.firstName}’s connection degrees</strong><small>{state.mode==="student"?persona.course:"Teaching, work packages & research"} · participation and connections are simulated</small></div></div><label>Connection degree<select value={degree} onChange={(event)=>{setDegree(event.target.value);setSelected("");setLimit(12);}}><option value="all">All · closest connections first</option><option value="1">1st · joined activities & connected people</option><option value="2">2nd · course / degree / work related</option><option value="3+">3rd+ · through contacts & wider alliance</option></select></label><label className="connection-people-toggle"><input type="checkbox" checked={showPeople} onChange={(event)=>setShowPeople(event.target.checked)}/> Include demo people</label></div>
      <div className="connection-key"><span className="degree-badge degree-badge--1">1st · Joined / connected</span><span className="degree-badge degree-badge--2">2nd · Degree / work relevance</span><span className="degree-badge degree-badge--3">3rd · Through your network</span><span className="degree-badge degree-badge--4">4th+ · Wider alliance</span></div>
      </>}
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
            {results.length} matching records · {publicEntry?"source-backed catalogue":"real catalogue + labelled demo people · closest first"}
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
            publicEntry={publicEntry}
            records={networkRecords}
            selected={selected}
            onSelect={select}
          />
        ) : view === "map" ? (
          <CampusMap
            publicEntry={publicEntry}
            universities={universities}
            records={results}
            selected={selected}
            onSelect={select}
            onCampus={(id) => {
              change("university", id);
            }}
          />
        ) : null}
      </Suspense>
      {current && view !== "map" && (
        <section className="selected-record" aria-labelledby="selected-title">
          <button
            className="close-selection"
            aria-label="Close selected record"
            onClick={() => setSelected("")}
          >
            <X />
          </button>
          <span className="eyebrow">
            {!publicEntry&&`${connectionInfo(current,state.mode,personal).label} · `}{current.dataClassification==="sample"?"Synthetic demo":availability(current).label}
          </span>
          <h2 id="selected-title">{current.title}</h2>
          <p>{current.studentSummary}</p>
          {!publicEntry&&<p>{connectionInfo(current,state.mode,personal).reason}</p>}
          <div className="selection-actions">
            <button
              className="button button--primary"
              onClick={() => setView("network")}
            >
              See connections
            </button>
            <Link className="text-link" href={current.dataClassification==="sample"?simulationHref(current):`/records/${current.slug}`}>
              {current.type==="person"?"Open demo profile":"Read evidence & next steps"} <ArrowUpRight size={16} />
            </Link>
            {simSpaces.filter((space)=>space.mode===state.mode&&spaceEntityId(space)===current.id).map((space)=><Link key={space.id} className="sim-primary" href={`/campus/${space.id}?mode=${state.mode}`}>Open demo workspace →</Link>)}
          </div>
        </section>
      )}
      {view === "list" &&
        (results.length ? (
          <>
            <div className="opportunity-grid">
              {results.slice(0, limit).map((r) => (
                <div key={r.id} className="ranked-opportunity">{!publicEntry&&<span className={`degree-badge degree-badge--${connectionInfo(r,state.mode,personal).degree}`} title={connectionInfo(r,state.mode,personal).reason}>{connectionInfo(r,state.mode,personal).label}</span>}<OpportunityCard record={r} onSelect={select} /></div>
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
