"use client";
import { useEffect, useState } from "react";
interface Data {
  usage: { event_type: string; day: string; count: number; campus: string }[];
  survey: {
    question: number;
    option: string;
    iso_week: string;
    role: string;
    count: number;
  }[];
  health: {
    stale: number;
    conflicts: number;
    failed: number;
    pending: { count: number };
    storage: string;
    records: {
      id: string;
      slug: string;
      title: string;
      lastChecked?: string;
      lastVerified: string;
      conflict: boolean;
      failed: boolean;
    }[];
    coverage: { id: string; title: string; records: number; themes: number }[];
  };
  total: { count: number };
  respondents: { count: number };
  role: string;
  period: { start: string; end: string; reason: string };
  refresh: { summary: string; checkedAt: string } | null;
  detailLimit: number;
}
export function PilotDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [proposals, setProposals] = useState<
    { id: string; targetId: string; payload: string; rationale: string }[]
  >([]);
  const [reason, setReason] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/v2/dashboard", { signal: controller.signal })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, []);
  return (
    <>
      {error && <p role="alert">{error}</p>}
      {!data && !error && (
        <p role="status">Loading authorised pilot aggregates…</p>
      )}
      {data && (
        <>
          <p>
            {data.period.reason}.{" "}
            {data.period.start
              ? `Usage period: ${data.period.start} to ${data.period.end} (end exclusive; UTC dates).`
              : "Pilot dates have not been set."}{" "}
            Headline totals cover all matching rows; tables show at most{" "}
            {data.detailLimit} detail rows. Survey totals cover all stored pilot
            weeks.
          </p>
          <div className="dashboard-metrics">
            <article>
              <strong>{data.total.count}</strong>
              <span>Recorded events · not unique visitors</span>
            </article>
            <article>
              <strong>{data.respondents.count}</strong>
              <span>Role responses · repeat answers are possible</span>
            </article>
            <article>
              <strong>{data.health.stale}</strong>
              <span>Published records needing a source check</span>
            </article>
          </div>
          <section>
            <h2>Data health</h2>
            <p>
              {data.health.conflicts} source conflicts · {data.health.failed}{" "}
              failed checks · {data.health.pending.count} pending availability
              reviews. Coverage is catalogue content, not participation.
            </p>
            <div className="comparison-scroll">
              <table className="comparison-table">
                <caption>University and topic coverage</caption>
                <thead>
                  <tr>
                    <th>University</th>
                    <th>Connected records</th>
                    <th>Distinct topics</th>
                  </tr>
                </thead>
                <tbody>
                  {data.health.coverage.map((u) => (
                    <tr key={u.id}>
                      <td>{u.title}</td>
                      <td>{u.records}</td>
                      <td>{u.themes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details>
              <summary>Records needing attention (up to 100)</summary>
              {data.health.records.map((r) => (
                <p key={r.id}>
                  <a href={`/records/${r.slug}`}>{r.title}</a> ·{" "}
                  {r.conflict ? "Source conflict · " : ""}
                  {r.failed ? "Latest check failed · " : ""}Last source check:{" "}
                  {r.lastChecked ?? "none"}. Human verification:{" "}
                  {r.lastVerified}.
                </p>
              ))}
            </details>
          </section>
          {data.refresh && (
            <p>
              Latest source refresh: {data.refresh.checkedAt} ·{" "}
              {data.refresh.summary}
            </p>
          )}
          {data.role === "administrator" && (
            <section className="workspace-banner">
              <h2>Source review</h2>
              <button
                className="button button--secondary"
                onClick={async () => {
                  setReviewNotice(
                    "Checking the allow-listed official sources…",
                  );
                  const r = await fetch("/api/v2/refresh", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: "{}",
                  });
                  const d = await r.json();
                  setReviewNotice(
                    r.ok
                      ? "Source check completed. Reload the dashboard to inspect results and pending reviews."
                      : d.error,
                  );
                }}
              >
                Check official sources now
              </button>
              <button
                className="button button--secondary"
                onClick={async () => {
                  const r = await fetch("/api/v2/review");
                  const d = await r.json();
                  if (r.ok) setProposals(d.proposals);
                  else setReviewNotice(d.error);
                }}
              >
                Load pending availability observations
              </button>
              <label>
                Independent review reason
                <input
                  value={reason}
                  maxLength={500}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
              {proposals.map((p) => (
                <article key={p.id}>
                  <strong>{p.targetId}</strong>
                  <p>{p.payload}</p>
                  <small>{p.rationale}</small>
                  {["approved", "rejected"].map((decision) => (
                    <button
                      key={decision}
                      disabled={reason.trim().length < 5}
                      onClick={async () => {
                        const r = await fetch("/api/v2/review", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ id: p.id, decision, reason }),
                        });
                        const d = await r.json();
                        if (r.ok) {
                          setProposals((old) =>
                            old.filter((x) => x.id !== p.id),
                          );
                          setReviewNotice(
                            "Decision recorded. Published availability will follow the reviewed evidence.",
                          );
                        } else setReviewNotice(d.error);
                      }}
                    >
                      {decision === "approved" ? "Approve" : "Reject"}
                    </button>
                  ))}
                </article>
              ))}
              <p role="status">{reviewNotice}</p>
            </section>
          )}
          <a href="/api/v2/export" className="button button--primary">
            Export suppressed weekly CSV
          </a>
          <p>
            Exact counts are restricted to this team screen. Shared exports
            suppress small counts and complementary cells. No free-text answers
            are displayed.
          </p>
          <div className="comparison-scroll">
            <table className="comparison-table">
              <caption>Daily event counts</caption>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Event</th>
                  <th>Campus landing</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.usage.map((r, i) => (
                  <tr key={i}>
                    <td>{r.day}</td>
                    <td>{r.event_type}</td>
                    <td>{r.campus || "—"}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-scroll">
            <table className="comparison-table">
              <caption>Independent weekly survey totals</caption>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Question</th>
                  <th>Option</th>
                  <th>Role (where permitted)</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.survey.map((r, i) => (
                  <tr key={i}>
                    <td>{r.iso_week}</td>
                    <td>Q{r.question}</td>
                    <td>{r.option}</td>
                    <td>{r.role || "—"}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
