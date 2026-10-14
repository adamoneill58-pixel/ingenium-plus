"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  calendarDay,
  discover,
  type DiscoveryFilters,
  type CalendarEntry,
} from "@/lib/v2/domain";
import type { Entity } from "@/lib/data";
import { usePilotEvent } from "./PilotContext";
export function CalendarWorkspace({
  entries,
  samples,
  records,
}: {
  entries: CalendarEntry[];
  samples: CalendarEntry[];
  records: Entity[];
}) {
  const [mode, setMode] = useState<"agenda" | "month" | "deadlines">("agenda");
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [sample, setSample] = useState(false);
  const [year, setYear] = useState(
    () => new Date().getUTCFullYear() - (new Date().getUTCMonth() < 8 ? 1 : 0),
  );
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [selected, setSelected] = useState("");
  const [ready, setReady] = useState(false);
  const host = filters.university ?? "";
  const query = filters.query ?? "";
  const setHost = (v: string) => setFilters((f) => ({ ...f, university: v }));
  const setQuery = (v: string) => setFilters((f) => ({ ...f, query: v }));
  const [day, setDay] = useState("");
  const [alarm, setAlarm] = useState("");
  const send = usePilotEvent();
  const universities = records.filter((r) => r.type === "university");
  const all = useMemo(
    () => (sample ? [...entries, ...samples] : entries),
    [sample, entries, samples],
  );
  const today = new Date().toISOString().slice(0, 10);
  const matching = useMemo(
    () => new Set(discover(records, filters).map((r) => r.id)),
    [records, filters],
  );
  const stateQuery = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(filters).filter(([, v]) => Boolean(v)),
    ),
    ...(selected ? { node: selected } : {}),
  }).toString();
  useEffect(() => {
    const restore = () => {
      const p = new URLSearchParams(location.search);
      const f: DiscoveryFilters = {};
      for (const k of [
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
      ] as const)
        if (p.has(k)) f[k] = p.get(k) ?? "";
      setFilters(f);
      setSelected(p.get("node") ?? "");
      setReady(true);
    };
    queueMicrotask(restore);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    if (ready)
      history.replaceState(
        null,
        "",
        `/calendar${stateQuery ? `?${stateQuery}` : ""}`,
      );
  }, [stateQuery, ready]);
  const eligible = useMemo(
    () =>
      all.filter(
        (e) =>
          calendarDay(e, true) >= `${year}-09-01` &&
          calendarDay(e) <= `${year + 1}-08-31` &&
          (e.sample
            ? (!host || e.hostId === host) &&
              (!query || e.title.toLowerCase().includes(query.toLowerCase()))
            : matching.has(e.recordId)),
      ),
    [all, matching, host, query, year],
  );
  const filtered = useMemo(
    () =>
      eligible
        .filter(
          (e) =>
            true &&
            (mode !== "deadlines" ||
              (e.kind !== "activity" && calendarDay(e) >= today)) &&
            (mode !== "month" ||
              calendarDay(e).slice(0, 7) === month ||
              Boolean(
                e.end &&
                calendarDay(e) < month &&
                calendarDay(e, true).slice(0, 7) >= month,
              )) &&
            (!day || (calendarDay(e) <= day && calendarDay(e, true) >= day)),
        )
        .sort((a, b) => a.start.localeCompare(b.start)),
    [eligible, mode, month, today, day],
  );
  const days = useMemo(() => {
    const start = new Date(`${month}-01T00:00:00Z`);
    const offset = (start.getUTCDay() + 6) % 7;
    const count = new Date(
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      0,
    ).getDate();
    return Array.from({ length: offset + count }, (_, i) =>
      i < offset ? "" : `${month}-${String(i - offset + 1).padStart(2, "0")}`,
    );
  }, [month]);
  function move(delta: number) {
    const date = new Date(`${month}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + delta);
    setMonth(date.toISOString().slice(0, 7));
    setDay("");
  }
  return (
    <>
      <div className="selection-actions">
        <Link
          className="text-link"
          href={`/explore${stateQuery ? `?${stateQuery}` : ""}`}
        >
          ← Back to discovery with these filters
        </Link>
        {Object.entries(filters)
          .filter(([, v]) => Boolean(v))
          .map(([k, v]) => (
            <span key={k} className="eyebrow">
              {k}: {v}
            </span>
          ))}
        <button
          className="text-link"
          onClick={() => {
            setFilters({});
            setSelected("");
          }}
        >
          Clear filters
        </button>
      </div>
      <div className="calendar-toolbar">
        <div className="view-switch">
          {(["agenda", "month", "deadlines"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={mode === v}
              onClick={() => {
                setMode(v);
                setDay("");
              }}
            >
              {v === "agenda"
                ? "Agenda"
                : v === "month"
                  ? "Month"
                  : "Upcoming deadlines"}
            </button>
          ))}
        </div>
        <label>
          Academic year
          <select
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value);
              setYear(y);
              setMonth(`${y}-09`);
              setDay("");
            }}
          >
            {[year - 2, year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}/{y + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Host
          <select value={host} onChange={(e) => setHost(e.target.value)}>
            <option value="">All universities</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.shortTitle ?? u.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an activity"
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={sample}
            onChange={(e) => setSample(e.target.checked)}
          />
          Include fictional calendar examples
        </label>
      </div>
      <div className="calendar-note">
        <CalendarDays />
        <p>
          Activities and application dates are separate. Date-only deadlines do
          not confirm a closing time or timezone. Calendar downloads are
          snapshots and do not update automatically.
        </p>
      </div>
      {mode === "month" && (
        <section className="month-calendar" aria-label="Month calendar">
          <div className="month-heading">
            <button aria-label="Previous month" onClick={() => move(-1)}>
              <ChevronLeft />
            </button>
            <h2>
              {new Date(`${month}-15T12:00:00Z`).toLocaleDateString("en-IE", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </h2>
            <button aria-label="Next month" onClick={() => move(1)}>
              <ChevronRight />
            </button>
          </div>
          <div className="month-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <strong key={d}>{d}</strong>
            ))}
            {days.map((d, i) => {
              const count = d
                ? eligible.filter(
                    (e) =>
                      e.precision !== "approximate" &&
                      calendarDay(e) <= d &&
                      calendarDay(e, true) >= d,
                  ).length
                : 0;
              return d ? (
                <button
                  key={d}
                  aria-pressed={day === d}
                  aria-label={`${d}, ${count} entries`}
                  className={d === today ? "is-today" : ""}
                  onClick={() => setDay(day === d ? "" : d)}
                >
                  <span>{Number(d.slice(8))}</span>
                  {count > 0 && (
                    <small>
                      {count} {count === 1 ? "entry" : "entries"}
                    </small>
                  )}
                </button>
              ) : (
                <span key={`empty-${i}`} />
              );
            })}
          </div>
          {day && (
            <button className="text-link" onClick={() => setDay("")}>
              Show the whole month
            </button>
          )}
        </section>
      )}
      <div className="calendar-results">
        <h2>
          {mode === "deadlines"
            ? "Plan before the deadline"
            : day
              ? `On ${day}`
              : "Your academic year, connected"}
        </h2>
        <p aria-live="polite">
          {filtered.length} dated entries
          {sample
            ? " · fictional examples included"
            : " from the research catalogue"}
        </p>
        <label>
          Optional calendar reminder
          <select value={alarm} onChange={(e) => setAlarm(e.target.value)}>
            <option value="">No alarm</option>
            <option value="0">On the date</option>
            <option value="1">1 day before</option>
            <option value="7">7 days before</option>
          </select>
        </label>
      </div>
      <div className="calendar-agenda">
        {filtered.map((e) => {
          const record = records.find((r) => r.id === e.recordId);
          return (
            <article className="calendar-entry" key={e.id}>
              <div className="date-block">
                <small>
                  {e.precision === "approximate"
                    ? "WINDOW"
                    : calendarDay(e).slice(0, 7)}
                </small>
                <strong>
                  {e.precision === "approximate"
                    ? "~"
                    : calendarDay(e).slice(8, 10)}
                </strong>
              </div>
              <div className="calendar-entry-body">
                <span className="eyebrow">
                  {e.kind.replace(/_/g, " ")}
                  {e.sample ? " · FICTIONAL SAMPLE" : ""}
                </span>
                <h3>{e.title}</h3>
                <p>
                  {e.dateLabel ?? `${e.start}${e.end ? ` — ${e.end}` : ""}`}
                </p>
                {e.conflict && (
                  <p className="verification-note">
                    Conflicting dates need verification. Export is disabled.
                  </p>
                )}
                {e.precision === "approximate" && (
                  <p>
                    Approximate window — exact dates have not been supplied.
                  </p>
                )}
                <div className="selection-actions">
                  {record && (
                    <Link href={`/records/${record.slug}`}>
                      View opportunity & source ↗
                    </Link>
                  )}
                  {!e.sample && (
                    <a href={e.sourceUrl} target="_blank" rel="noreferrer">
                      Official source ↗
                    </a>
                  )}
                  {!e.conflict && e.precision !== "approximate" && (
                    <a
                      className="calendar-download"
                      href={`/api/v2/calendar?id=${encodeURIComponent(e.id)}${alarm !== "" ? `&alarm=${alarm}` : ""}`}
                      onClick={() => {
                        if (!e.sample) send("calendar_export", e.id);
                      }}
                    >
                      <Download size={15} />
                      Export .ics{e.sample ? " sample" : ""}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {!filtered.length && (
          <section className="empty-state">
            <h3>No confirmed dates match this view.</h3>
            <p>
              Try another month or include the clearly labelled fictional
              examples to preview the calendar workflow.
            </p>
          </section>
        )}
      </div>
    </>
  );
}
