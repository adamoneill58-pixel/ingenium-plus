"use client";

import cytoscape, { type Core, type ElementDefinition, type EventObject } from "cytoscape";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Focus,
  GitCompareArrows,
  List,
  Map,
  Minus,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  entities,
  entityById,
  journeys,
  relationships,
  sourceById,
  typeColours,
  typeLabels,
  type Entity,
  type EntityStatus,
  type EntityType,
  type Relationship,
} from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

const SAVED_KEY = "ingenium-plus-v14-saved";
const JOURNEY_KEY = "ingenium-plus-v14-journey";
const EUROPE_MAP_ID = "europe-map-layer";
const EUROPE_MAP_WIDTH = 1401.34;
const EUROPE_MAP_HEIGHT = 1198.34;

const campusCoordinates: Record<string, { latitude: number; longitude: number }> = {
  "university-uniovi": { latitude: 43.3614, longitude: -5.8494 },
  "university-mus": { latitude: 42.6838, longitude: 23.3117 },
  "university-uoc": { latitude: 35.3545, longitude: 24.4772 },
  "university-hka": { latitude: 49.0158, longitude: 8.3901 },
  "university-xamk": { latitude: 61.6884, longitude: 27.2727 },
  "university-uda": { latitude: 42.3699, longitude: 14.1492 },
  "university-hs": { latitude: 58.3912, longitude: 13.853 },
  "university-mtu": { latitude: 51.8856, longitude: -8.5353 },
  "university-urn": { latitude: 49.4607, longitude: 1.0684 },
  "university-tuiasi": { latitude: 47.1544, longitude: 27.5993 },
};

type ViewMode = "student" | "programmes" | "mobility" | "innovation" | "sustainability" | "communities" | "alliance";

const modes: { id: ViewMode; label: string }[] = [
  { id: "student", label: "Student opportunities" },
  { id: "programmes", label: "Programmes" },
  { id: "mobility", label: "Events & mobility" },
  { id: "innovation", label: "Innovation" },
  { id: "sustainability", label: "Sustainability" },
  { id: "communities", label: "Communities" },
  { id: "alliance", label: "Alliance ecosystem" },
];

const typeShapes: Record<EntityType, string> = {
  university: "ellipse",
  bip: "diamond",
  programme: "round-rectangle",
  pathway: "hexagon",
  project: "round-tag",
  event: "star",
  community: "octagon",
  platform: "barrel",
  opportunity: "vee",
  initiative: "pentagon",
  framework: "triangle",
};

function readStoredList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function hashNumber(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash;
}

function campusMapPosition(latitude: number, longitude: number): { x: number; y: number } {
  const radians = Math.PI / 180;
  const latitudeRadians = latitude * radians;
  const centreLatitudeRadians = 52 * radians;
  const longitudeOffsetRadians = (longitude - 10) * radians;
  const scale = Math.pow(
    (1
      + Math.sin(latitudeRadians) * Math.sin(centreLatitudeRadians)
      + Math.cos(latitudeRadians) * Math.cos(centreLatitudeRadians) * Math.cos(longitudeOffsetRadians)) * 0.5,
    -0.5,
  );
  const xPercent = 131.579 * Math.cos(latitudeRadians) * Math.sin(longitudeOffsetRadians) * scale + 36.388;
  const yPercent = 55.11
    - 153.61
      * (Math.cos(centreLatitudeRadians) * Math.sin(latitudeRadians)
        - Math.sin(centreLatitudeRadians) * Math.cos(latitudeRadians) * Math.cos(longitudeOffsetRadians))
      * scale;

  return {
    x: (xPercent / 100) * EUROPE_MAP_WIDTH,
    y: (yPercent / 100) * EUROPE_MAP_HEIGHT,
  };
}

function modeIncludes(entity: Entity, mode: ViewMode) {
  if (entity.type === "university") return true;
  if (mode === "alliance") return true;
  if (mode === "student") return entity.featured || ["bip", "opportunity", "project"].includes(entity.type);
  if (mode === "programmes") return ["bip", "programme", "pathway", "framework"].includes(entity.type);
  if (mode === "mobility") return ["bip", "event", "opportunity", "programme"].includes(entity.type);
  if (mode === "innovation") return entity.themes.some((theme) => ["Entrepreneurship", "Innovation", "Artificial intelligence", "Digital learning"].includes(theme)) || ["initiative", "project", "community"].includes(entity.type);
  if (mode === "sustainability") return entity.themes.some((theme) => ["Sustainability", "Waste management", "Circular economy", "Nature", "Mobility"].includes(theme));
  if (mode === "communities") return ["community", "project", "platform"].includes(entity.type);
  return true;
}

function visibleLabel(entity: Entity) {
  if (entity.type === "university") return entity.shortTitle ?? entity.title;
  if (entity.shortTitle) return entity.shortTitle;
  return entity.title.length > 28 ? `${entity.title.slice(0, 26)}…` : entity.title;
}

function graphPosition(entity: Entity, visible: Entity[]): { x: number; y: number } {
  if (entity.type === "university") {
    const coordinates = campusCoordinates[entity.id];
    if (coordinates) return campusMapPosition(coordinates.latitude, coordinates.longitude);
    return { x: EUROPE_MAP_WIDTH / 2, y: EUROPE_MAP_HEIGHT / 2 };
  }

  const university = entity.hostUniversityId ?? entity.universityIds[0];
  const anchor = visible.find((item) => item.id === university);
  if (anchor) {
    const anchorPosition: { x: number; y: number } = graphPosition(anchor, visible);
    const siblingIndex = visible
      .filter((item) => item.type !== "university" && (item.hostUniversityId ?? item.universityIds[0]) === university)
      .findIndex((item) => item.id === entity.id);
    const hash = hashNumber(entity.id);
    const angle = ((hash % 360) * Math.PI) / 180;
    const radius = 72 + (Math.max(siblingIndex, 0) % 3) * 42;
    return {
      x: Math.min(Math.max(anchorPosition.x + Math.cos(angle) * radius, 70), EUROPE_MAP_WIDTH - 70),
      y: Math.min(Math.max(anchorPosition.y + Math.sin(angle) * radius, 70), EUROPE_MAP_HEIGHT - 70),
    };
  }

  const hash = hashNumber(entity.id);
  const angle = ((hash % 360) * Math.PI) / 180;
  const radius = 80 + (hash % 4) * 48;
  return {
    x: EUROPE_MAP_WIDTH / 2 + Math.cos(angle) * radius,
    y: EUROPE_MAP_HEIGHT / 2 + Math.sin(angle) * radius,
  };
}

function makeIcs(entity: Entity) {
  if (!entity.startDate) return;
  const escape = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
  const day = (value: string) => value.replaceAll("-", "");
  const endDate = new Date(`${entity.endDate ?? entity.startDate}T00:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const end = endDate.toISOString().slice(0, 10);
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//INGENIUM+//Student Journey//EN",
    "BEGIN:VEVENT",
    `UID:${entity.id}@ingenium-plus`,
    `DTSTAMP:${new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART;VALUE=DATE:${day(entity.startDate)}`,
    `DTEND;VALUE=DATE:${day(end)}`,
    `SUMMARY:${escape(entity.title)}`,
    `DESCRIPTION:${escape(entity.studentSummary)}`,
    ...(entity.city ? [`LOCATION:${escape(entity.city)}`] : []),
    ...(entity.officialUrl ? [`URL:${escape(entity.officialUrl)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = `${entity.slug}.ics`;
  anchor.click();
  URL.revokeObjectURL(href);
}

export function GraphExplorer() {
  const graphRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const filterCloseButtonRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<ViewMode>("student");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntityType | "all">("all");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<EntityStatus | "all">("all");
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [listView, setListView] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [journeyExpanded, setJourneyExpanded] = useState(false);

  const themes = useMemo(() => [...new Set(entities.flatMap((entity) => entity.themes))].sort(), []);
  const universities = useMemo(() => entities.filter((entity) => entity.type === "university"), []);
  const activeJourney = journeyId ? journeys.find((journey) => journey.id === journeyId) : undefined;

  useEffect(() => {
    let cancelled = false;
    const restoredSavedIds = readStoredList(SAVED_KEY);
    const params = new URLSearchParams(window.location.search);
    const node = params.get("node");
    const journey = params.get("journey");
    const urlMode = params.get("mode") as ViewMode | null;
    const urlType = params.get("type") as EntityType | null;
    const urlStatus = params.get("status") as EntityStatus | null;
    queueMicrotask(() => {
      if (cancelled) return;
      setSavedIds(restoredSavedIds);
      if (node && entityById.has(node)) setSelectedId(node);
      if (journey && journeys.some((item) => item.id === journey)) setJourneyId(journey);
      if (urlMode && modes.some((item) => item.id === urlMode)) setMode(urlMode);
      if (params.get("q")) setQuery(params.get("q") ?? "");
      if (urlType && Object.hasOwn(typeLabels, urlType)) setTypeFilter(urlType);
      if (params.get("university") && entityById.has(params.get("university") ?? "")) setUniversityFilter(params.get("university") ?? "all");
      if (params.get("theme")) setThemeFilter(params.get("theme") ?? "all");
      if (urlStatus && entities.some((item) => item.status === urlStatus)) setStatusFilter(urlStatus);
      if (params.get("view") === "list") setListView(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const listener = () => setSavedIds(readStoredList(SAVED_KEY));
    window.addEventListener("ingenium-saved-change", listener);
    return () => window.removeEventListener("ingenium-saved-change", listener);
  }, []);

  const filteredEntities = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const journeySet = activeJourney ? new Set(activeJourney.nodeIds) : null;
    const journeyUniversityIds = activeJourney
      ? new Set(activeJourney.nodeIds.flatMap((id) => entityById.get(id)?.universityIds ?? []))
      : null;

    return entities.filter((entity) => {
      if (journeySet && entity.type !== "university" && !journeySet.has(entity.id)) return false;
      if (journeyUniversityIds && entity.type === "university" && !journeyUniversityIds.has(entity.id)) return false;
      if (!activeJourney && !modeIncludes(entity, mode)) return false;
      if (typeFilter !== "all" && entity.type !== typeFilter && entity.type !== "university") return false;
      if (universityFilter !== "all" && entity.type !== "university" && !entity.universityIds.includes(universityFilter)) return false;
      if (themeFilter !== "all" && entity.type !== "university" && !entity.themes.includes(themeFilter)) return false;
      if (statusFilter !== "all" && entity.type !== "university" && entity.status !== statusFilter) return false;

      if (needle) {
        const connectedUniversities = entity.universityIds.map((id) => entityById.get(id)?.title ?? "");
        const haystack = [
          entity.title,
          entity.shortTitle,
          entity.subtype,
          entity.studentSummary,
          ...entity.themes,
          ...entity.countries ?? [],
          ...connectedUniversities,
          ...entity.aliases ?? [],
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [activeJourney, mode, query, statusFilter, themeFilter, typeFilter, universityFilter]);

  const visibleIds = useMemo(() => new Set(filteredEntities.map((entity) => entity.id)), [filteredEntities]);
  const visibleRelationships = useMemo(
    () => relationships.filter((relationship) => visibleIds.has(relationship.source) && visibleIds.has(relationship.target)),
    [visibleIds],
  );

  const graphElements = useMemo<ElementDefinition[]>(() => {
    const mapElement: ElementDefinition = {
      data: { id: EUROPE_MAP_ID, type: "map" },
      position: { x: EUROPE_MAP_WIDTH / 2, y: EUROPE_MAP_HEIGHT / 2 },
      locked: true,
      grabbable: false,
      selectable: false,
      classes: "map-layer",
    };
    const nodeElements: ElementDefinition[] = filteredEntities.map((entity) => ({
      data: {
        id: entity.id,
        label: visibleLabel(entity),
        fullLabel: entity.title,
        short: entity.shortTitle ?? "",
        type: entity.type,
        colour: typeColours[entity.type],
        shape: typeShapes[entity.type],
      },
      position: graphPosition(entity, filteredEntities),
    }));
    const edgeElements: ElementDefinition[] = visibleRelationships.map((relationship) => ({
      data: {
        id: relationship.id,
        source: relationship.source,
        target: relationship.target,
        label: relationship.label,
        relationshipType: relationship.type,
      },
    }));
    return [mapElement, ...nodeElements, ...edgeElements];
  }, [filteredEntities, visibleRelationships]);

  const selectEntity = useCallback((id: string | null) => {
    setSelectedId(id);
    setSelectedRelationship(null);
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    cyRef.current?.destroy();
    const cy = cytoscape({
      container: graphRef.current,
      elements: graphElements,
      layout: { name: "preset", fit: true, padding: 60 },
      minZoom: 0.35,
      maxZoom: 2.6,
      wheelSensitivity: 0.18,
      pixelRatio: "auto",
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(colour)",
            "border-color": "#ffffff",
            "border-width": 3,
            color: "#293133",
            label: "data(label)",
            "font-family": "Montserrat, Arial, sans-serif",
            "font-size": 10,
            "font-weight": 600,
            "text-wrap": "wrap",
            "text-max-width": "105px",
            "text-valign": "bottom",
            "text-margin-y": 8,
            "text-background-color": "#ffffff",
            "text-background-opacity": 0.86,
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle",
            width: 31,
            height: 31,
            shape: "data(shape)" as never,
            "overlay-opacity": 0,
            "transition-property": "width, height, border-color, border-width, opacity",
            "transition-duration": 160,
          },
        },
        {
          selector: 'node[type = "university"]',
          style: {
            width: 51,
            height: 51,
            "font-size": 11,
            "font-weight": 800,
            color: "#293133",
            "border-color": "#dce3e0",
            "border-width": 5,
          },
        },
        {
          selector: `node#${EUROPE_MAP_ID}`,
          style: {
            width: EUROPE_MAP_WIDTH,
            height: EUROPE_MAP_HEIGHT,
            shape: "rectangle",
            label: "",
            "background-color": "#f7fbfa",
            "background-image": "/assets/europe-map.svg",
            "background-fit": "contain",
            "background-repeat": "no-repeat",
            "background-image-opacity": 0.88,
            "border-width": 0,
            "overlay-opacity": 0,
            events: "no",
            "z-index": -10,
            "z-index-compare": "manual",
          },
        },
        {
          selector: "node:selected",
          style: {
            width: 44,
            height: 44,
            "border-color": "#e5007e",
            "border-width": 5,
            "z-index": 20,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.2,
            "line-color": "#cbd6d2",
            "target-arrow-color": "#cbd6d2",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            opacity: 0.58,
            "arrow-scale": 0.65,
            "overlay-opacity": 0,
          },
        },
        {
          selector: 'edge[relationshipType = "connected_to"]',
          style: {
            opacity: 0.14,
            width: 0.8,
          },
        },
        {
          selector: "edge.highlighted",
          style: {
            width: 2.4,
            "line-color": "#7ab9aa",
            "target-arrow-color": "#7ab9aa",
            opacity: 0.95,
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 3,
            "line-color": "#009878",
            "target-arrow-color": "#009878",
            opacity: 1,
            label: "data(label)",
            "font-family": "Montserrat, Arial, sans-serif",
            "font-size": 10,
            color: "#293133",
            "text-background-color": "#ffffff",
            "text-background-opacity": 1,
            "text-background-padding": "4px",
          },
        },
      ],
    });

    cy.on("tap", "node", (event: EventObject) => selectEntity(event.target.id()));
    cy.on("tap", "edge", (event: EventObject) => {
      const relationship = relationships.find((item) => item.id === event.target.id());
      setSelectedRelationship(relationship ?? null);
      setSelectedId(null);
    });
    cy.on("tap", (event: EventObject) => {
      if (event.target === cy) selectEntity(null);
    });

    cyRef.current = cy;
    return () => cy.destroy();
  }, [graphElements, selectEntity]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.edges().removeClass("highlighted");
    cy.nodes().unselect();
    if (!selectedId) return;
    const node = cy.getElementById(selectedId);
    if (node.nonempty()) {
      node.select();
      node.connectedEdges().addClass("highlighted");
    }
  }, [graphElements, selectedId]);

  useEffect(() => {
    if (selectedId || selectedRelationship) closeButtonRef.current?.focus();
  }, [selectedId, selectedRelationship]);

  const selected = selectedId ? entityById.get(selectedId) : undefined;
  const selectedSource = selected ? sourceById.get(selected.sourceId) : undefined;
  const activeFilterCount = [typeFilter, universityFilter, themeFilter, statusFilter].filter((value) => value !== "all").length;
  const visibleResultCount = filteredEntities.filter((entity) => entity.type !== "university").length;
  const visibleUniversityCount = filteredEntities.length - visibleResultCount;

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (selectedId) params.set("node", selectedId);
    if (journeyId) params.set("journey", journeyId);
    if (query) params.set("q", query);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (universityFilter !== "all") params.set("university", universityFilter);
    if (themeFilter !== "all") params.set("theme", themeFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (listView) params.set("view", "list");
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [journeyId, listView, mode, query, selectedId, statusFilter, themeFilter, typeFilter, universityFilter]);

  useEffect(() => {
    if (filtersOpen) filterCloseButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (filtersOpen) setFiltersOpen(false);
      else if (selectedId || selectedRelationship) {
        selectEntity(null);
        setSelectedRelationship(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filtersOpen, selectEntity, selectedId, selectedRelationship]);

  const setJourney = (id: string | null) => {
    setJourneyId(id);
    setJourneyExpanded(false);
    setSelectedId(null);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setUniversityFilter("all");
    setThemeFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  const toggleSaved = (id: string) => {
    const next = new Set(savedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const values = [...next];
    setSavedIds(values);
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(values));
    window.dispatchEvent(new CustomEvent("ingenium-saved-change"));
    setToast(next.has(id) ? "Saved to My journey" : "Removed from My journey");
  };

  const addJourneyStep = (id: string) => {
    const current = readStoredList(JOURNEY_KEY);
    if (!current.includes(id)) current.push(id);
    window.localStorage.setItem(JOURNEY_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("ingenium-journey-change"));
    setToast("Added as a journey step");
  };

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  };

  const shareView = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Graph link copied");
    } catch {
      setToast("Copy the URL from your browser to share this view");
    }
  };

  return (
    <section className="explorer" aria-labelledby="explorer-title">
      <div className="explorer__topbar">
        <label className="graph-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search the INGENIUM network</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programmes, universities, themes…"
            list="network-search-suggestions"
          />
          <datalist id="network-search-suggestions">
            {entities.slice(0, 80).map((entity) => <option key={entity.id} value={entity.title} />)}
          </datalist>
        </label>
        <label className="mode-select">
          <span className="sr-only">Graph mode</span>
          <select value={mode} onChange={(event) => { setMode(event.target.value as ViewMode); setJourney(null); }}>
            {modes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <button className="button button--dark" type="button" onClick={() => setJourney(journeyId ? null : "find-a-bip")}>
          <Sparkles aria-hidden="true" /> {journeyId ? "Exit journey" : "Explore a journey"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal aria-hidden="true" /> Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>
        <button className="icon-button" type="button" aria-label="Copy a link to this graph view" onClick={shareView}>
          <Copy aria-hidden="true" />
        </button>
      </div>

      {activeJourney && (
        <div className={`active-journey active-journey--${activeJourney.accent}`}>
          <div>
            <span className="eyebrow">{activeJourney.eyebrow}</span>
            <h2>{activeJourney.title}</h2>
            <p>{activeJourney.summary}</p>
          </div>
          <ol aria-label="Journey steps">
            {activeJourney.nodeIds.slice(0, journeyExpanded ? activeJourney.nodeIds.length : 6).map((id, index) => {
              const entity = entityById.get(id);
              if (!entity) return null;
              return (
                <li key={id}>
                  <button type="button" onClick={() => selectEntity(id)}>
                    <span>{index + 1}</span>{entity.shortTitle ?? entity.title}<ChevronRight aria-hidden="true" />
                  </button>
                </li>
              );
            })}
            {activeJourney.nodeIds.length > 6 && (
              <li className="journey-more">
                <button type="button" onClick={() => setJourneyExpanded((value) => !value)}>
                  <span>{journeyExpanded ? "−" : "+"}</span>
                  {journeyExpanded ? "Show fewer steps" : `Show ${activeJourney.nodeIds.length - 6} more routes`}
                </button>
              </li>
            )}
          </ol>
        </div>
      )}

      <div className="explorer__view-tabs" role="tablist" aria-label="Network representation">
        <button id="graph-tab" type="button" role="tab" aria-selected={!listView} aria-controls="network-graph-panel" tabIndex={listView ? -1 : 0} onClick={() => setListView(false)}>
          <Map aria-hidden="true" /> Graph
        </button>
        <button id="list-tab" type="button" role="tab" aria-selected={listView} aria-controls="network-list-panel" tabIndex={listView ? 0 : -1} onClick={() => setListView(true)}>
          <List aria-hidden="true" /> Accessible list
        </button>
        <span>{visibleResultCount} results · {visibleUniversityCount} campus anchors · {visibleRelationships.length} relationships</span>
      </div>

      <div className="graph-boundary">
        {!listView ? (
          <>
            <div
              id="network-graph-panel"
              ref={graphRef}
              className="graph-canvas"
              role="tabpanel"
              aria-labelledby="graph-tab"
              tabIndex={0}
              aria-label="Interactive network of verified INGENIUM programmes, universities and student opportunities. Use the accessible list for a text alternative."
            />
            <div className="graph-controls" aria-label="Graph controls">
              <button type="button" aria-label="Zoom in" onClick={() => cyRef.current?.zoom({ level: Math.min((cyRef.current?.zoom() ?? 1) * 1.25, 2.6), renderedPosition: { x: 550, y: 360 } })}><Plus aria-hidden="true" /></button>
              <button type="button" aria-label="Zoom out" onClick={() => cyRef.current?.zoom({ level: Math.max((cyRef.current?.zoom() ?? 1) / 1.25, 0.35), renderedPosition: { x: 550, y: 360 } })}><Minus aria-hidden="true" /></button>
              <button type="button" aria-label="Fit visible network" onClick={() => cyRef.current?.fit(undefined, 60)}><Focus aria-hidden="true" /></button>
              <button type="button" aria-label="Reset network view" onClick={() => { cyRef.current?.reset(); cyRef.current?.fit(undefined, 60); }}><RotateCcw aria-hidden="true" /></button>
            </div>
            <div className="graph-legend" aria-label="Node type legend">
              {["university", "bip", "programme", "pathway", "project", "event", "community", "platform"]
                .filter((type) => filteredEntities.some((entity) => entity.type === type))
                .map((type) => (
                  <span key={type}>
                    <i style={{ background: typeColours[type as EntityType] }} />
                    {typeLabels[type as EntityType]}
                  </span>
                ))}
            </div>
            <p className="graph-help">Drag to move · scroll or pinch to zoom · select nodes and connecting lines to understand the network</p>
            <a
              className="graph-map-credit"
              href="https://commons.wikimedia.org/wiki/File:Europe_blank_laea_location_map.svg"
              target="_blank"
              rel="noreferrer"
            >
              Map: Alexrk2 / Wikimedia Commons · CC BY-SA 3.0
            </a>
          </>
        ) : (
          <div id="network-list-panel" className="network-list" role="tabpanel" aria-labelledby="list-tab" tabIndex={0}>
            {filteredEntities.map((entity) => (
              <button key={entity.id} type="button" className="network-list__item" onClick={() => selectEntity(entity.id)}>
                <span className="network-list__marker" style={{ background: typeColours[entity.type] }}>{entity.shortTitle?.slice(0, 2) ?? typeLabels[entity.type].slice(0, 1)}</span>
                <span>
                  <small>{entity.subtype ?? typeLabels[entity.type]}</small>
                  <strong>{entity.title}</strong>
                  <span>{entity.studentSummary}</span>
                </span>
                <StatusBadge status={entity.status} />
                <ChevronRight aria-hidden="true" />
              </button>
            ))}
            {visibleRelationships.length > 0 && (
              <section className="network-list__relationships" aria-labelledby="relationship-list-title">
                <h3 id="relationship-list-title">Visible relationships</h3>
                {visibleRelationships.map((relationship) => (
                  <button key={relationship.id} type="button" onClick={() => { setSelectedRelationship(relationship); setSelectedId(null); }}>
                    <strong>{entityById.get(relationship.source)?.shortTitle ?? entityById.get(relationship.source)?.title}</strong>
                    <span>{relationship.label}</span>
                    <strong>{entityById.get(relationship.target)?.shortTitle ?? entityById.get(relationship.target)?.title}</strong>
                    <small>{relationship.explanation}</small>
                  </button>
                ))}
              </section>
            )}
          </div>
        )}
      </div>

      <div className="journey-picker" aria-labelledby="journey-picker-title">
        <div>
          <span className="eyebrow">Guided discovery</span>
          <h2 id="journey-picker-title">Start with what you want to do</h2>
        </div>
        <div className="journey-picker__grid">
          {journeys.map((journey) => (
            <button key={journey.id} type="button" className={`journey-card journey-card--${journey.accent}`} onClick={() => setJourney(journey.id)}>
              <span>{journey.eyebrow}</span>
              <strong>{journey.title}</strong>
              <p>{journey.summary}</p>
              <em>Open journey <ArrowRight aria-hidden="true" /></em>
            </button>
          ))}
        </div>
      </div>

      {filtersOpen && (
        <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFiltersOpen(false); }}>
          <aside className="filter-drawer" role="dialog" aria-modal="true" aria-labelledby="filter-title">
            <div className="drawer-heading">
              <div><span className="eyebrow">Refine the network</span><h2 id="filter-title">Filters</h2></div>
              <button ref={filterCloseButtonRef} className="icon-button" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X aria-hidden="true" /></button>
            </div>
            <label>Type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as EntityType | "all")}><option value="all">All types</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>University<select value={universityFilter} onChange={(event) => setUniversityFilter(event.target.value)}><option value="all">All universities</option>{universities.map((university) => <option key={university.id} value={university.id}>{university.shortTitle} — {university.title}</option>)}</select></label>
            <label>Theme<select value={themeFilter} onChange={(event) => setThemeFilter(event.target.value)}><option value="all">All themes</option>{themes.map((theme) => <option key={theme} value={theme}>{theme}</option>)}</select></label>
            <label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as EntityStatus | "all")}><option value="all">All statuses</option>{[...new Set(entities.map((entity) => entity.status))].map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            <div className="filter-drawer__actions">
              <button className="button button--secondary" type="button" onClick={clearFilters}>Clear all</button>
              <button className="button button--primary" type="button" onClick={() => setFiltersOpen(false)}>Show {filteredEntities.length} nodes</button>
            </div>
          </aside>
        </div>
      )}

      {(selected || selectedRelationship) && (
        <aside className="detail-drawer" role="dialog" aria-modal="false" aria-labelledby="detail-title">
          <button ref={closeButtonRef} className="detail-drawer__close" type="button" aria-label="Close details" onClick={() => { selectEntity(null); setSelectedRelationship(null); }}><X aria-hidden="true" /></button>
          {selectedRelationship ? (
            <div className="relationship-detail">
              <span className="eyebrow">Relationship</span>
              <h2 id="detail-title">{selectedRelationship.label}</h2>
              <p>{selectedRelationship.explanation}</p>
              <div className="relationship-pair">
                <button type="button" onClick={() => selectEntity(selectedRelationship.source)}>{entityById.get(selectedRelationship.source)?.title}<ChevronRight aria-hidden="true" /></button>
                <button type="button" onClick={() => selectEntity(selectedRelationship.target)}>{entityById.get(selectedRelationship.target)?.title}<ChevronRight aria-hidden="true" /></button>
              </div>
            </div>
          ) : selected ? (
            <>
              <div className="detail-drawer__meta"><span>{selected.subtype ?? typeLabels[selected.type]}</span><StatusBadge status={selected.status} /></div>
              <h2 id="detail-title">{selected.title}</h2>
              <p className="detail-drawer__lead">{selected.studentSummary}</p>
              {selected.fullDescription && <p>{selected.fullDescription}</p>}
              <dl className="detail-facts">
                {selected.availability && <><dt>Availability</dt><dd>{selected.availability}</dd></>}
                {selected.dateLabel && <><dt>Timing</dt><dd>{selected.dateLabel}</dd></>}
                {selected.applicationDeadline && <><dt>Deadline</dt><dd>{selected.applicationDeadline}</dd></>}
                {selected.academicLevel && <><dt>Level</dt><dd>{selected.academicLevel}</dd></>}
                {selected.deliveryMode && <><dt>Delivery</dt><dd>{selected.deliveryMode}</dd></>}
                {selected.mobilityType && <><dt>Mobility</dt><dd>{selected.mobilityType}</dd></>}
                {selected.ects && <><dt>Credit</dt><dd>{selected.ects} ECTS</dd></>}
                {selected.workload && <><dt>Workload</dt><dd>{selected.workload}</dd></>}
                {selected.eligibility && <><dt>Eligibility</dt><dd>{selected.eligibility}</dd></>}
                {selected.language && <><dt>Language</dt><dd>{selected.language}</dd></>}
                {selected.funding && <><dt>Funding</dt><dd>{selected.funding}</dd></>}
              </dl>
              <div className="detail-themes">{selected.themes.map((theme) => <span key={theme}>{theme}</span>)}</div>
              <div className="detail-actions">
                {selected.officialUrl && <a className="button button--primary" href={selected.officialUrl} target="_blank" rel="noreferrer">{selected.actionLabel ?? "View official source"}<ArrowRight aria-hidden="true" /></a>}
                {!selected.officialUrl && selectedSource?.url && <a className="button button--primary" href={selectedSource.url} target="_blank" rel="noreferrer">View official evidence<ArrowRight aria-hidden="true" /></a>}
                <button className="button button--secondary" type="button" onClick={() => toggleSaved(selected.id)}>{savedIds.includes(selected.id) ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}{savedIds.includes(selected.id) ? "Saved" : "Save"}</button>
                <button className="button button--secondary" type="button" onClick={() => addJourneyStep(selected.id)}><Check aria-hidden="true" />Add step</button>
                <button className="button button--secondary" type="button" aria-pressed={compareIds.includes(selected.id)} onClick={() => toggleCompare(selected.id)}><GitCompareArrows aria-hidden="true" />Compare</button>
                {selected.startDate && <button className="button button--secondary" type="button" onClick={() => makeIcs(selected)}><CalendarPlus aria-hidden="true" />Calendar</button>}
              </div>
              <div className="source-card">
                <CircleHelp aria-hidden="true" />
                <div><span>Evidence</span><strong>{selectedSource?.title ?? "Official INGENIUM evidence"}</strong><small>{selected.confidence} confidence · checked {selected.lastVerified}</small>{selectedSource?.url && <a href={selectedSource.url} target="_blank" rel="noreferrer">Open source</a>}</div>
              </div>
            </>
          ) : null}
        </aside>
      )}

      {compareIds.length > 0 && (
        <div className="compare-tray" aria-label="Comparison tray">
          <span><GitCompareArrows aria-hidden="true" /> Compare</span>
          {compareIds.map((id) => (
            <div key={id} className="compare-token">
              <button type="button" onClick={() => selectEntity(id)}>{entityById.get(id)?.shortTitle ?? entityById.get(id)?.title}</button>
              <button type="button" aria-label={`Remove ${entityById.get(id)?.title ?? "item"} from comparison`} onClick={() => toggleCompare(id)}><X aria-hidden="true" /></button>
            </div>
          ))}
          {compareIds.length === 2 && (
            <div className="compare-tray__summary">
              <span>{entityById.get(compareIds[0])?.status}{entityById.get(compareIds[0])?.ects ? ` · ${entityById.get(compareIds[0])?.ects} ECTS` : ""}</span>
              <ArrowRight aria-hidden="true" />
              <span>{entityById.get(compareIds[1])?.status}{entityById.get(compareIds[1])?.ects ? ` · ${entityById.get(compareIds[1])?.ects} ECTS` : ""}</span>
            </div>
          )}
          <button className="icon-button" type="button" aria-label="Clear comparison" onClick={() => setCompareIds([])}><X aria-hidden="true" /></button>
        </div>
      )}

      {toast && <div className="toast" role="status" onAnimationEnd={() => setToast(null)}>{toast}</div>}
    </section>
  );
}
