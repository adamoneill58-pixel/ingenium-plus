"use client";
import { useState } from "react";
import { questions, surveyIntro } from "@/lib/v2/survey";
import { usePilotEnabled } from "./PilotContext";
export function PilotSurvey() {
  const enabled = usePilotEnabled();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <form
      className="pilot-survey"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!enabled || busy || done) return;
        setBusy(true);
        try {
          const res = await fetch("/api/v2/survey", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(answers),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error ?? "Submission failed");
          setDone(true);
          setStatus(
            "Thank you. Your feedback has been added to the pilot’s aggregate results.",
          );
          setAnswers({});
        } catch (error) {
          setStatus(
            error instanceof Error
              ? error.message
              : "The survey could not be submitted.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <p>{surveyIntro}</p>
      {!enabled && (
        <div className="workspace-banner">
          <strong>Survey preview</strong>
          <p>
            Collection has not been activated in this environment. Answers are
            held only on this page and cannot be submitted.
          </p>
        </div>
      )}
      {!done &&
        questions
          .filter((q) => q.id !== 3 || answers["2"] === "Student")
          .map((q) => (
            <fieldset key={q.id}>
              <legend>
                {q.id}. {q.text}
              </legend>
              {q.options.length ? (
                <select
                  aria-label={q.text}
                  value={answers[String(q.id)] ?? ""}
                  required
                  onChange={(e) =>
                    setAnswers((a) => {
                      const next: Record<string, string> = {
                        ...a,
                        [q.id]: e.target.value,
                      };
                      if (q.id === 2 && e.target.value !== "Student")
                        delete next["3"];
                      return next;
                    })
                  }
                >
                  <option value="">Choose an answer</option>
                  {q.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <>
                  <p className="muted">
                    Please don’t include names, contact details or other
                    personal information. Optional; 500 characters maximum.
                  </p>
                  <textarea
                    aria-label={q.text}
                    rows={3}
                    maxLength={500}
                    value={answers[String(q.id)] ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                  />
                </>
              )}
            </fieldset>
          ))}
      <p role="status">{status}</p>
      <button
        className="button button--primary"
        disabled={!enabled || busy || done}
      >
        {busy ? "Submitting…" : done ? "Feedback received" : "Submit feedback"}
      </button>
    </form>
  );
}
