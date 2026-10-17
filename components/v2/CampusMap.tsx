"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { ArrowUpRight, LocateFixed, Minus, Plus } from "lucide-react";
import type { Entity } from "@/lib/data";
import { typeLabels } from "@/lib/labels";
import { useSimulation } from "./SimulationContext";
import { connectionInfo } from "@/lib/v2/simulation-state";
import { simSpaces, spaceEntityId, simulationHref } from "@/lib/v2/campus-simulation";

import {campusCoordinates, recordCampusIds, recordCoordinate, worldPoint, longitudeLatitude, clusterPositions} from "@/lib/v2/map-geometry";

const MIN_ZOOM = 3;
const MAX_ZOOM = 10;
const TILE_SIZE = 256;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function recordColour(type: Entity["type"]) {
  if (["course", "module", "programme", "microcredential", "bip"].includes(type))
    return "map-marker--learning";
  if (["community", "project"].includes(type)) return "map-marker--people";
  if (["event", "calendar_event"].includes(type)) return "map-marker--event";
  return "map-marker--opportunity";
}

export default function CampusMap({
  universities,
  records,
  selected,
  onSelect,
  onCampus,
}: {
  universities: Entity[];
  records: Entity[];
  selected: string;
  onSelect: (id: string) => void;
  onCampus: (id: string) => void;
}) {
  const {state,personal,persona}=useSimulation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    center: [number, number];
  } | null>(null);
  const [size, setSize] = useState({ width: 760, height: 610 });
  const [center, setCenter] = useState<[number, number]>([9.8, 48.4]);
  const [zoom, setZoom] = useState(3);
  const [dragging, setDragging] = useState(false);
  const [activeCampus, setActiveCampus] = useState("");
  const [clusterRecords, setClusterRecords] = useState<Entity[]>([]);
  const selectedRecord = records.find((record) => record.id === selected);
  const matchingClusterRecords = records.filter((record) => clusterRecords.some((item) => item.id === record.id));
  const selectedUniversity = universities.find(
    (university) => university.id === activeCampus,
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({
        width: Math.max(320, entry.contentRect.width),
        height: Math.max(420, entry.contentRect.height),
      });
    });
    observer.observe(viewport);
    const wheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      setZoom((current) => clamp(current + (event.deltaY < 0 ? 1 : -1), MIN_ZOOM, MAX_ZOOM));
    };
    viewport.addEventListener("wheel", wheel, {passive:false});
    return () => {
      observer.disconnect();
      viewport.removeEventListener("wheel", wheel);
    };
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        universities.map((university) => [
          university.id,
          records.filter(
            (record) =>
              record.type !== "university" &&
              recordCampusIds(record).includes(university.id),
          ).length,
        ]),
      ),
    [records, universities],
  );

  const centerWorld = useMemo(() => worldPoint(center, zoom), [center, zoom]);
  const screenPoint = useCallback(
    (coordinate: [number, number]) => {
      const point = worldPoint(coordinate, zoom);
      return {
        left: point[0] - centerWorld[0] + size.width / 2,
        top: point[1] - centerWorld[1] + size.height / 2,
      };
    },
    [centerWorld, size, zoom],
  );

  const tiles = useMemo(() => {
    const count = 2 ** zoom;
    const firstX = Math.floor((centerWorld[0] - size.width / 2) / TILE_SIZE) - 1;
    const lastX = Math.floor((centerWorld[0] + size.width / 2) / TILE_SIZE) + 1;
    const firstY = Math.max(
      0,
      Math.floor((centerWorld[1] - size.height / 2) / TILE_SIZE) - 1,
    );
    const lastY = Math.min(
      count - 1,
      Math.floor((centerWorld[1] + size.height / 2) / TILE_SIZE) + 1,
    );
    const output: {
      key: string;
      url: string;
      left: number;
      top: number;
    }[] = [];
    for (let x = firstX; x <= lastX; x++) {
      const wrappedX = ((x % count) + count) % count;
      for (let y = firstY; y <= lastY; y++) {
        output.push({
          key: `${zoom}-${x}-${y}`,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - centerWorld[0] + size.width / 2,
          top: y * TILE_SIZE - centerWorld[1] + size.height / 2,
        });
      }
    }
    return output;
  }, [centerWorld, size, zoom]);

  const visibleRecords = useMemo(() => {
    if (zoom < 6) return [];
    return records.flatMap((record) => {
      if (record.type === "university") return [];
      return recordCampusIds(record).flatMap((campusId) => {
      const coordinate = recordCoordinate(record, campusId);
      if (!coordinate) return [];
      const point = screenPoint(coordinate);
      if (
        point.left < -30 ||
        point.left > size.width + 30 ||
        point.top < -30 ||
        point.top > size.height + 30
      )
        return [];
      return [{ record, point, coordinate, campusId }];
      });
    });
  }, [records, screenPoint, size, zoom]);
  const clusters = useMemo(() => clusterPositions(visibleRecords, zoom), [visibleRecords, zoom]);

  const changeZoom = useCallback((next: number) => {
    setZoom(clamp(Math.round(next), MIN_ZOOM, MAX_ZOOM));
  }, []);

  const panBy = useCallback(
    (x: number, y: number) => {
      const world = worldPoint(center, zoom);
      setCenter(longitudeLatitude([world[0] + x, world[1] + y], zoom));
    },
    [center, zoom],
  );

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      center: worldPoint(center, zoom),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setCenter(
      longitudeLatitude(
        [drag.center[0] - (event.clientX - drag.x), drag.center[1] - (event.clientY - drag.y)],
        zoom,
      ),
    );
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyMap(event: KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => panBy(-80, 0),
      ArrowRight: () => panBy(80, 0),
      ArrowUp: () => panBy(0, -80),
      ArrowDown: () => panBy(0, 80),
      "+": () => changeZoom(zoom + 1),
      "=": () => changeZoom(zoom + 1),
      "-": () => changeZoom(zoom - 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  function focusCampus(id: string) {
    const coordinate = campusCoordinates[id];
    if (!coordinate) return;
    setActiveCampus(id);
    setClusterRecords([]);
    onSelect("");
    setCenter(coordinate);
    setZoom(7);
  }

  return (
    <section className="campus-map" aria-label="Interactive INGENIUM map">
      <div
        ref={viewportRef}
        className={`map-visual ${dragging ? "is-dragging" : ""}`}
        role="application"
        aria-label="Pan and zoom map. Use arrow keys to move and plus or minus to zoom."
        tabIndex={0}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={keyMap}
      >
        <div className="map-tile-layer" aria-hidden="true">
          {tiles.map((tile) => (
            // Map tiles must remain ordinary fixed-size images; Next image
            // optimisation would proxy hundreds of provider tiles.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={tile.key}
              src={tile.url}
              alt=""
              draggable={false}
              style={{ left: tile.left, top: tile.top }}
            />
          ))}
        </div>
        <div className="map-marker-layer">
          {universities.map((university) => {
            const coordinate = campusCoordinates[university.id];
            if (!coordinate) return null;
            const point = screenPoint(coordinate);
            const count = counts[university.id] ?? 0;
            return (
              <button
                type="button"
                key={university.id}
                className={`map-campus-marker ${activeCampus === university.id ? "is-active" : ""}`}
                style={point}
                title={`${university.title}: ${count} matching records`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() =>
                  zoom < 6 ? focusCampus(university.id) : setActiveCampus(university.id)
                }
              >
                <i />
                <strong>{university.shortTitle ?? university.title}</strong>
                {zoom < 6 && <span>{count}</span>}
              </button>
            );
          })}
          {clusters.map((cluster) => cluster.members.length > 1 ? (
            <button type="button" key={cluster.key} className="map-record-cluster" style={cluster.point}
              aria-label={`Explore ${cluster.members.length} connected records`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => {
                setCenter(cluster.members[0].coordinate);
                setClusterRecords(cluster.members.map((item) => item.record));
                onSelect("");
                changeZoom(zoom + 1);
              }}>{cluster.members.length}</button>
          ) : cluster.members.map(({record, point, campusId}) => (
            <button
              type="button"
              key={`${record.id}-${campusId}`}
              className={`map-record-marker ${recordColour(record.type)} degree-marker--${connectionInfo(record,state.mode,personal).degree} ${record.type==="person"?"is-person":""} ${selected === record.id ? "is-selected" : ""}`}
              style={point}
              title={`${typeLabels[record.type]}: ${record.title}`}
              aria-label={`Open ${record.title}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onSelect(record.id)}
            >
              <i />
              {(zoom >= 9 || record.type==="person") && <span>{record.title}</span>}
            </button>
          )))}
        </div>
        <div className="map-controls" aria-label="Map controls">
          <button type="button" aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onPointerDown={(event) => event.stopPropagation()} onClick={() => changeZoom(zoom + 1)}><Plus size={17} /></button>
          <button type="button" aria-label="Zoom out" disabled={zoom <= MIN_ZOOM} onPointerDown={(event) => event.stopPropagation()} onClick={() => changeZoom(zoom - 1)}><Minus size={17} /></button>
          <button type="button" aria-label="Show all campuses" onPointerDown={(event) => event.stopPropagation()} onClick={() => {setCenter([9.8, 48.4]); setZoom(3); setActiveCampus("");}}><LocateFixed size={17} /></button>
        </div>
        <div className="map-instruction">Drag to move · scroll to zoom · level {zoom}</div>
        <div className="map-legend">
          <span><i className="map-dot map-dot--campus" />Campus cluster</span>
          <span><i className="map-dot map-dot--learning" />Learning</span>
          <span><i className="map-dot map-dot--people" />People & projects</span>
          <span><i className="map-dot map-dot--event" />Events</span>
        </div>
        <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" onPointerDown={(event) => event.stopPropagation()}>© OpenStreetMap contributors</a>
      </div>
      <aside className="map-detail" aria-live="polite">
        {selectedRecord ? (
          <>
            <span className="eyebrow">{typeLabels[selectedRecord.type]} · {selectedRecord.dataClassification==="sample"?"SYNTHETIC DEMO":"SOURCE-BACKED RECORD"}</span>
            <h2>{selectedRecord.title}</h2>
            <p>{selectedRecord.studentSummary}</p>
            <span className={`degree-badge degree-badge--${connectionInfo(selectedRecord,state.mode,personal).degree}`}>{connectionInfo(selectedRecord,state.mode,personal).label}</span><p>{connectionInfo(selectedRecord,state.mode,personal).reason}</p>
            <div className="topic-chips">{selectedRecord.themes.slice(0, 4).map((theme) => <span key={theme}>{theme}</span>)}</div>
            <dl className="map-facts">
              <div><dt>Host</dt><dd>{universities.find((university) => university.id === selectedRecord.hostUniversityId)?.shortTitle ?? "Alliance-wide"}</dd></div>
              {selectedRecord.type!=="person"&&<div><dt>Format</dt><dd>{selectedRecord.deliveryMode ?? "Check official details"}</dd></div>}
              <div><dt>{selectedRecord.type==="person"?"Profile":"Evidence checked"}</dt><dd>{selectedRecord.lastChecked?.slice(0, 10) ?? selectedRecord.lastVerified}</dd></div>
            </dl>
            <p className="map-location-note">{selectedRecord.type==="person"?"This fictional profile is grouped with its simulated university. The marker does not represent a person's location.":"The opportunity marker shows a published campus association. It is not a claimed venue."}</p>
            <Link className="button button--primary" href={selectedRecord.dataClassification==="sample"?simulationHref(selectedRecord):`/records/${selectedRecord.slug}`}>{selectedRecord.type==="person"?"Open demo profile":"Evidence & official next step"} <ArrowUpRight size={16} /></Link>
            {simSpaces.filter((space)=>space.mode===state.mode&&spaceEntityId(space)===selectedRecord.id).map((space)=><Link key={space.id} className="button button--secondary" href={`/campus/${space.id}?mode=${state.mode}`}>Open my demo workspace →</Link>)}
            <button className="map-back" onClick={() => onSelect("")}>Back to campuses</button>
          </>
        ) : matchingClusterRecords.length ? (
          <>
            <span className="eyebrow">CONNECTED RECORDS</span>
            <h2>{matchingClusterRecords.length} connections in this cluster.</h2>
            <p>Choose an item below or zoom further into the map.</p>
            <div className="map-cluster-list">{matchingClusterRecords.map((record) => <button key={record.id} onClick={() => onSelect(record.id)}><small>{typeLabels[record.type]}</small><strong>{record.title}</strong></button>)}</div>
            <button className="map-back" onClick={() => setClusterRecords([])}>Back to campuses</button>
          </>
        ) : selectedUniversity ? (
          <>
            <span className="eyebrow">CAMPUS VIEW</span>
            <h2>{selectedUniversity.title}</h2>
            <p>{selectedUniversity.studentSummary}</p>
            <strong className="map-campus-count">{counts[selectedUniversity.id] ?? 0} matching records around this campus</strong>
            <button className="button button--primary" onClick={() => onCampus(selectedUniversity.id)}>Filter to {selectedUniversity.shortTitle ?? "this campus"}</button>
            <button className="map-back" onClick={() => setActiveCampus("")}>Back to all campuses</button>
          </>
        ) : (
          <>
            <span className="eyebrow">EXPLORE ONE EUROPEAN CAMPUS</span>
            <h2>Zoom from ten campuses into 200+ connections.</h2>
            <p>Choose a campus cluster or zoom into the map. Source-backed courses, mobility, projects, communities and events appear as you move closer.</p>
            <div className="map-personal-priorities"><strong>{persona.firstName}’s closest connections</strong>{records.filter((record)=>record.type!=="university"&&record.id!==persona.id).slice(0,7).map((record)=><button key={record.id} onClick={()=>{onSelect(record.id);const id=record.hostUniversityId??record.universityIds[0];if(id&&campusCoordinates[id]){setCenter(campusCoordinates[id]);setZoom(7);}}}><span className={`degree-badge degree-badge--${connectionInfo(record,state.mode,personal).degree}`}>{connectionInfo(record,state.mode,personal).degree===1?"1st":"2nd+"}</span><span>{record.shortTitle??record.title}</span></button>)}</div>
            <p className="map-location-note">Campus pins are geographic. Opportunity points show published campus associations because many official pages do not publish a precise venue.</p>
            <div className="map-campus-grid">
              {universities.map((university) => <button key={university.id} onClick={() => focusCampus(university.id)}><strong>{university.shortTitle ?? university.title}</strong><span>{university.countries?.[0]} · {counts[university.id] ?? 0}</span></button>)}
            </div>
          </>
        )}
      </aside>
    </section>
  );
}
