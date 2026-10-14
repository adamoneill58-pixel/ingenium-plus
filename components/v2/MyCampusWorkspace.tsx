"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Entity } from "@/lib/data";
import { fit, availability } from "@/lib/v2/domain";
import { memoryRead, memoryWrite, memorySnapshot } from "@/lib/v2/memory-store";
import { OpportunityCard } from "./OpportunityCard";
import { usePilotEvent } from "./PilotContext";
function subscribe(cb: () => void) {
  window.addEventListener("ingenium-saved-change", cb);
  return () => window.removeEventListener("ingenium-saved-change", cb);
}
export function MyCampusWorkspace({ records }: { records: Entity[] }) {
  const revision = useSyncExternalStore(subscribe, memorySnapshot, () => "0");
  const [interests, setInterests] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const send = usePilotEvent();
  const saved = useMemo(() => {
    void revision;
    return records.filter((r) =>
      memoryRead<string[]>("ingenium-plus-v15-saved", []).includes(r.id),
    );
  }, [records, revision]);
  const topics = [
    "Sustainability",
    "Artificial intelligence",
    "Entrepreneurship",
    "Health",
    "Mobility",
    "Languages",
    "Innovation",
    "Digital learning",
  ];
  const matches = useMemo(
    () =>
      records
        .map((r) => fit(r, interests))
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6),
    [records, interests],
  );
  function exportPlan() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "ingenium-plan-v2",
            exportedAt: new Date().toISOString(),
            advisory: true,
            items: saved.map((r) => ({
              id: r.id,
              title: r.title,
              ects: r.ects,
              applicationDate: r.applicationDeadline,
              availability: availability(r).label,
              officialUrl: r.officialUrl,
            })),
            note: "Personal plan only. Universities decide enrolment and credit recognition.",
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ingenium-campus-plan.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(
      "Plan exported. Keep this file: the pilot does not save your plan between visits.",
    );
  }
  return (
    <>
      <div className="workspace-banner">
        <strong>Your choices stay in this tab.</strong>
        <p>
          No account or persistent browser storage is used. Export your plan
          before closing or refreshing. Existing plans from older versions are
          left untouched.
        </p>
      </div>
      <section className="interest-section">
        <span className="eyebrow">Find your fit</span>
        <h2>What would you like to explore?</h2>
        <p>
          Choose a few interests for explained suggestions. Your selections are
          not sent to analytics.
        </p>
        <div className="interest-options">
          {topics.map((t) => (
            <button
              key={t}
              aria-pressed={interests.includes(t)}
              onClick={() =>
                setInterests((old) =>
                  old.includes(t) ? old.filter((x) => x !== t) : [...old, t],
                )
              }
            >
              {t}
            </button>
          ))}
        </div>
        {!interests.length && (
          <p className="muted">
            Choose an interest to see relevant connections.
          </p>
        )}
        <div className="opportunity-grid">
          {matches.map((m) => (
            <div key={m.record.id}>
              <div className="match-reasons">
                <strong>Why this may fit</strong>
                {m.reasons.map((r) => (
                  <p key={r}>{r}</p>
                ))}
                {m.checks.map((c) => (
                  <small key={c}>{c}</small>
                ))}
                <Link
                  href={`/records/${m.record.slug}`}
                  onClick={() => send("recommendation_click", m.record.id)}
                >
                  Review this suggestion ↗
                </Link>
              </div>
              <OpportunityCard record={m.record} />
            </div>
          ))}
        </div>
        {interests.length > 0 && !matches.length && (
          <p>
            No matches found for these interests. Try Discover; your choices
            have not been changed.
          </p>
        )}
      </section>
      <section>
        <span className="eyebrow">Plan your next step</span>
        <h2>Upcoming actions</h2>
        {saved
          .filter(
            (r) =>
              r.applicationDeadline &&
              r.applicationDeadline >= new Date().toISOString().slice(0, 10),
          )
          .sort((a, b) =>
            a.applicationDeadline!.localeCompare(b.applicationDeadline!),
          )
          .map((r) => (
            <article className="calendar-entry" key={r.id}>
              <div>
                <strong>{r.applicationDeadline}</strong>
                <h3>{r.title}</h3>
                <p>
                  {availability(r).conflict
                    ? "Confirm the conflicting date with the programme before planning an application."
                    : "Check eligibility, funding and your home-university procedure before applying."}
                </p>
                <Link href={`/records/${r.slug}`}>
                  Review requirements and official next step ↗
                </Link>
              </div>
            </article>
          ))}
        {!saved.some(
          (r) =>
            r.applicationDeadline &&
            r.applicationDeadline >= new Date().toISOString().slice(0, 10),
        ) && (
          <p>
            No upcoming application dates in your shortlist. Explore the
            calendar to find your next activity.
          </p>
        )}
      </section>
      <section>
        <div className="workspace-heading">
          <div>
            <span className="eyebrow">Your temporary plan</span>
            <h2>Saved opportunities</h2>
            <p>
              {saved.length} saved ·{" "}
              {saved.reduce((n, r) => n + (r.ects ?? 0), 0)} known ECTS ·
              advisory only
            </p>
          </div>
          <div className="selection-actions">
            <button
              className="button button--primary"
              disabled={!saved.length}
              onClick={exportPlan}
            >
              Export plan
            </button>
            <button
              className="button button--secondary"
              disabled={!saved.length}
              onClick={() => {
                memoryWrite("ingenium-plus-v15-saved", []);
                setCompare([]);
              }}
            >
              Clear this tab’s plan
            </button>
          </div>
        </div>
        {notice && <p role="status">{notice}</p>}
        {saved.length ? (
          <>
            <div className="compare-picks">
              {saved.map((r) => (
                <label key={r.id}>
                  <input
                    type="checkbox"
                    checked={compare.includes(r.id)}
                    disabled={!compare.includes(r.id) && compare.length >= 3}
                    onChange={() =>
                      setCompare((c) =>
                        c.includes(r.id)
                          ? c.filter((id) => id !== r.id)
                          : [...c, r.id],
                      )
                    }
                  />
                  Compare {r.shortTitle ?? r.title}
                </label>
              ))}
            </div>
            {compare.length > 0 && (
              <div className="comparison-scroll">
                <table className="comparison-table">
                  <caption>
                    Compare up to three opportunities. Missing facts remain
                    unknown.
                  </caption>
                  <thead>
                    <tr>
                      <th>Practical detail</th>
                      {compare.map((id) => (
                        <th key={id}>
                          {records.find((r) => r.id === id)?.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["Delivery", "deliveryMode"],
                        ["Language", "language"],
                        ["Credit", "ects"],
                        ["Funding", "funding"],
                        ["Eligibility", "eligibility"],
                        ["Application date", "applicationDeadline"],
                      ] as const
                    ).map(([label, key]) => (
                      <tr key={key}>
                        <th>{label}</th>
                        {compare.map((id) => (
                          <td key={id}>
                            {records.find((r) => r.id === id)?.[key] ??
                              "Not confirmed"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="opportunity-grid">
              {saved.map((r) => (
                <OpportunityCard key={r.id} record={r} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h3>Start with something that interests you.</h3>
            <p>
              Save opportunities from Discover to compare them and build a
              temporary plan.
            </p>
            <Link className="button button--primary" href="/explore">
              Explore opportunities
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
