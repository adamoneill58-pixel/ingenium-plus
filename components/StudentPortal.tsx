"use client";

import { BookOpenCheck, Database, Network, Save, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type Recommendation = { id: string; candidateId: string; candidateTitle: string; score: number; label: string; explanations: string[]; components: Record<string, number> };
const split = (value: FormDataEntryValue | null) => String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);

export function StudentPortal() {
  const [state, setState] = useState<"loading" | "ready" | "signed-out" | "unavailable">("loading");
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => { void load(); }, []);
  async function load() {
    const response = await fetch("/api/v151/session", { cache: "no-store" });
    if (response.status === 401) return setState("signed-out");
    if (!response.ok) { setMessage((await response.json().catch(() => ({}))).error ?? "Persistent services are not available in this environment."); return setState("unavailable"); }
    setState("ready");
    const recommendationResponse = await fetch("/api/v151/recommendations?type=student_module", { cache: "no-store" });
    if (recommendationResponse.ok) setRecommendations((await recommendationResponse.json()).results ?? []);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("Saving…");
    const form = new FormData(event.currentTarget);
    const payload = { homeUniversityId: form.get("homeUniversityId"), programme: form.get("programme"), fieldOfStudy: form.get("fieldOfStudy"), studyLevel: form.get("studyLevel"), studyYear: form.get("studyYear"),
      interests: split(form.get("interests")), skills: split(form.get("skills")), goals: split(form.get("goals")), preferredTypes: split(form.get("preferredTypes")),
      preferredDelivery: split(form.get("preferredDelivery")), languages: split(form.get("languages")), preferredCountries: split(form.get("preferredCountries")),
      travelWillingness: form.get("travelWillingness"), preferredSemester: form.get("preferredSemester"), scheduleConstraints: split(form.get("scheduleConstraints")),
      desiredCreditsMin: form.get("desiredCreditsMin") ? Number(form.get("desiredCreditsMin")) : undefined,
      desiredCreditsMax: form.get("desiredCreditsMax") ? Number(form.get("desiredCreditsMax")) : undefined };
    const response = await fetch("/api/v151/student/profile", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Profile saved to the platform database." : body.error ?? "Profile could not be saved.");
    if (response.ok) await load();
  }

  async function sendFeedback(resultId: string, signal: "useful" | "saved" | "dismissed") {
    const response = await fetch("/api/v151/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resultId, signal }) });
    const body = await response.json().catch(() => ({}));
    setMessage(response.ok ? `Recommendation marked ${signal}.` : body.error ?? "Feedback could not be saved.");
    if (response.ok && signal === "dismissed") setRecommendations((items) => items.filter((item) => item.id !== resultId));
  }

  return (
    <>
      <section className="portal-hero portal-hero--student">
        <div><span className="eyebrow">Student mode · v1.5.1</span><h1>Your INGENIUM journey,<br /><span>connected.</span></h1><p>Create a persistent profile, discover modules across the ten universities and understand why each opportunity is recommended.</p></div>
        <div className="trust-stack"><span><Database aria-hidden="true" />Persistent account data</span><span><ShieldCheck aria-hidden="true" />Explicit evidence and eligibility</span><span><Network aria-hidden="true" />One shared campus graph</span></div>
      </section>

      {state === "signed-out" && <section className="portal-notice"><h2>Sign in to use Student mode</h2><p>Public discovery remains open. A persistent profile and feedback require an authenticated account.</p><a className="button button--primary" href="/signin-with-chatgpt?return_to=%2Fstudent" target="_top">Sign in with ChatGPT</a></section>}
      {state === "unavailable" && <section className="portal-notice portal-notice--warning"><h2>Persistent services are awaiting provisioning</h2><p>{message}</p><p>The public v1.5 graph remains available, but this environment has no connected D1 database yet.</p><Link className="button button--secondary" href="/explore">Continue with public discovery</Link></section>}
      {state === "loading" && <p className="portal-status" aria-live="polite">Checking your secure workspace…</p>}

      {state === "ready" && <section className="portal-grid" aria-label="Student workspace">
        <form className="portal-panel portal-form" onSubmit={saveProfile}>
          <span className="eyebrow">Recommendation profile</span><h2><BookOpenCheck aria-hidden="true" />What should the campus find for you?</h2>
          <div className="form-grid">
            <label><span>Home university ID</span><input name="homeUniversityId" placeholder="university-mtu" /></label>
            <label><span>Study level</span><select name="studyLevel"><option value="">Choose</option><option>Bachelor</option><option>Master</option><option>PhD</option></select></label>
            <label><span>Programme</span><input name="programme" placeholder="Software Development" /></label>
            <label><span>Study year</span><input name="studyYear" placeholder="3" /></label>
            <label className="form-grid__wide"><span>Field of study</span><input name="fieldOfStudy" placeholder="Computer science" /></label>
            <label className="form-grid__wide"><span>Interests <small>comma-separated</small></span><input name="interests" placeholder="artificial intelligence, sustainability" /></label>
            <label className="form-grid__wide"><span>Skills to develop</span><input name="skills" placeholder="data visualisation, project leadership" /></label>
            <label className="form-grid__wide"><span>Goals</span><input name="goals" placeholder="study abroad, build an international project" /></label>
            <label><span>Opportunity types</span><input name="preferredTypes" placeholder="module, BIP, project" /></label>
            <label><span>Delivery preferences</span><input name="preferredDelivery" placeholder="online, hybrid" /></label>
            <label><span>Languages</span><input name="languages" placeholder="English, French" /></label>
            <label><span>Preferred countries</span><input name="preferredCountries" placeholder="Finland, Germany" /></label>
            <label><span>Travel willingness</span><select name="travelWillingness"><option value="flexible">Flexible</option><option value="limited">Limited</option><option value="none">Online only</option></select></label>
            <label><span>Preferred semester</span><input name="preferredSemester" placeholder="Spring 2027" /></label>
            <label className="form-grid__wide"><span>Schedule constraints</span><input name="scheduleConstraints" placeholder="weekends, after 17:00" /></label>
            <label><span>Minimum ECTS</span><input name="desiredCreditsMin" type="number" min="0" max="60" /></label>
            <label><span>Maximum ECTS</span><input name="desiredCreditsMax" type="number" min="0" max="60" /></label>
          </div>
          <button className="button button--primary" type="submit"><Save aria-hidden="true" />Save and refresh matches</button>
          {message && <p className="form-message" aria-live="polite">{message}</p>}
        </form>

        <aside className="portal-panel recommendation-explainer"><span className="eyebrow">How matching works</span><h2><Sparkles aria-hidden="true" />Explainable by design</h2><p>Eligibility filters run before ranking. Subject fit, goals, language, mobility preference, graph proximity and freshness then produce a score.</p><ul><li>No protected or sensitive attributes</li><li>No hidden generative ranking</li><li>Every score stores its engine version and components</li><li>Your feedback becomes evaluation data, not automatic truth</li></ul></aside>
      </section>}

      {state === "ready" && <section className="portal-recommendations"><div className="section-heading"><div><span className="eyebrow">Your module matches</span><h2>Recommended across INGENIUM</h2></div><Link className="text-link" href="/learning">Browse the complete catalogue</Link></div>
        {recommendations.length ? <div className="match-grid">{recommendations.map((item) => <article key={item.id}><div className="match-score"><strong>{item.score}</strong><span>{item.label}</span></div><h3>{item.candidateTitle}</h3><ul>{item.explanations.map((reason) => <li key={reason}>{reason}</li>)}</ul><details><summary>Score breakdown</summary>{Object.entries(item.components).map(([name, score]) => <p key={name}><span>{name}</span><strong>{score}</strong></p>)}</details><div className="match-actions" aria-label={`Feedback for ${item.candidateTitle}`}><button type="button" onClick={() => sendFeedback(item.id, "useful")}>Useful</button><button type="button" onClick={() => sendFeedback(item.id, "saved")}>Save</button><button type="button" onClick={() => sendFeedback(item.id, "dismissed")}>Dismiss</button></div></article>)}</div> : <div className="empty-state"><h2>Complete your profile to generate matches</h2><p>The engine will only show candidates that pass eligibility and availability filters.</p></div>}
      </section>}
    </>
  );
}
