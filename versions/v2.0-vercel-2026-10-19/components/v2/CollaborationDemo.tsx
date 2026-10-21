"use client";
import { useMemo, useState } from "react";
const academics = [
  {
    id: "sample-a",
    name: "Fictional academic A",
    area: "Urban planning",
    expertise: ["cities", "planning", "sustainability"],
    methods: ["urban fieldwork", "stakeholder workshops"],
    discoverable: true,
  },
  {
    id: "sample-b",
    name: "Fictional academic B",
    area: "Environmental assessment",
    expertise: ["climate", "environment", "sustainability"],
    methods: ["impact assessment", "life-cycle analysis"],
    discoverable: true,
  },
  {
    id: "sample-c",
    name: "Fictional academic C",
    area: "Data science",
    expertise: ["ai", "data", "machine learning"],
    methods: ["data modelling", "algorithm evaluation"],
    discoverable: true,
  },
];
export function CollaborationDemo() {
  const [title, setTitle] = useState("AI and sustainable cities");
  const [outcomes, setOutcomes] = useState(
    "Use AI and data to understand urban sustainability challenges.",
  );
  const [needs, setNeeds] = useState<string[]>(["planning", "environment"]);
  const [language, setLanguage] = useState("English");
  const [timing, setTiming] = useState("Spring semester");
  const [reviewed, setReviewed] = useState(false);
  const [draft, setDraft] = useState("");
  const tags = useMemo(
    () =>
      [
        "ai",
        "data",
        "cities",
        "planning",
        "sustainability",
        "environment",
        "climate",
      ].filter((t) => `${title} ${outcomes}`.toLowerCase().includes(t)),
    [title, outcomes],
  );
  const matches = academics
    .filter((a) => a.discoverable)
    .map((a) => ({
      academic: a,
      shared: tags.filter((t) => a.expertise.includes(t)),
      complement: needs.filter((t) => a.expertise.includes(t)),
    }))
    .filter((m) => m.complement.length || m.shared.length)
    .sort(
      (a, b) =>
        b.complement.length - a.complement.length ||
        b.shared.length - a.shared.length,
    );
  return (
    <>
      <div className="workspace-banner">
        <strong>
          Fictional demonstration · real academic profiles are not enabled.
        </strong>
        <p>
          This workflow illustrates course-to-colleague matching. Nobody is
          contacted and no course or profile is published.
        </p>
      </div>
      <div className="collaboration-layout">
        <form
          className="collaboration-form"
          onSubmit={(e) => {
            e.preventDefault();
            setReviewed(true);
          }}
        >
          <span className="eyebrow">01 · Describe your course</span>
          <label>
            Course title
            <input
              value={title}
              maxLength={180}
              onChange={(e) => {
                setTitle(e.target.value);
                setReviewed(false);
              }}
              required
            />
          </label>
          <label>
            Learning outcomes / expertise offered
            <textarea
              value={outcomes}
              maxLength={1000}
              onChange={(e) => {
                setOutcomes(e.target.value);
                setReviewed(false);
              }}
              rows={4}
              required
            />
          </label>
          <label>
            Working language
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </label>
          <label>
            Availability
            <input value={timing} onChange={(e) => setTiming(e.target.value)} />
          </label>
          <fieldset>
            <legend>Complementary expertise sought</legend>
            {["planning", "environment", "data", "climate", "ai"].map((n) => (
              <label className="checkbox-label" key={n}>
                <input
                  type="checkbox"
                  checked={needs.includes(n)}
                  onChange={() => {
                    setNeeds((old) =>
                      old.includes(n)
                        ? old.filter((v) => v !== n)
                        : [...old, n],
                    );
                    setReviewed(false);
                  }}
                />
                {n}
              </label>
            ))}
          </fieldset>
          <div className="suggested-tags">
            <span className="eyebrow">02 · Review suggested topics</span>
            <div className="topic-chips">
              {tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <p>
              These tags come from your course text. Review them before
              generating suggestions.
            </p>
          </div>
          <button
            className="button button--primary"
            disabled={!title.trim() || !tags.length}
            type="submit"
          >
            Confirm topics & find connections
          </button>
          <p className="muted">
            Manual entry works without uploads. Private file extraction remains
            unavailable until approved scanning and processing are configured.
          </p>
        </form>
        <section aria-live="polite">
          <span className="eyebrow">03 · Explore complementary expertise</span>
          <h2>A course can begin a connection.</h2>
          {!reviewed ? (
            <p>Review your course topics to reveal fictional suggestions.</p>
          ) : matches.length ? (
            matches.map((m) => (
              <article className="academic-card" key={m.academic.id}>
                <span className="sample-label">
                  Fictional academic · opted in within this sample
                </span>
                <h3>{m.academic.name}</h3>
                <strong>{m.academic.area}</strong>
                <p>
                  {m.complement.length
                    ? `Could complement your course with ${m.complement.join(", ")}.`
                    : `Shares your interest in ${m.shared.join(", ")}.`}
                </p>
                <p>Methods offered: {m.academic.methods.join("; ")}</p>
                <small>
                  Language: {language || "not confirmed"} · Timing:{" "}
                  {timing || "not confirmed"} are your preferences;
                  compatibility needs checking.
                </small>
                <button
                  className="text-link"
                  onClick={() =>
                    setDraft(
                      `Fictional draft — not sent\n\nI am developing “${title}” and looking for support in ${needs.join(", ")}. Your sample expertise in ${m.academic.area.toLowerCase()} could complement the course. Would you be interested in discussing a possible collaboration?\n\nPreferred language: ${language}. Proposed timing: ${timing}.`,
                    )
                  }
                >
                  Prepare an interest draft →
                </button>
              </article>
            ))
          ) : (
            <p>
              No sample colleague matches those needs. No constraint was
              relaxed.
            </p>
          )}
          {draft && (
            <div className="interest-draft">
              <h3>Draft only · nothing sent</h3>
              <textarea
                value={draft}
                rows={8}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button className="text-link" onClick={() => setDraft("")}>
                Discard draft
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
