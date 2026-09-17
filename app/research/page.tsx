import type { Metadata } from "next";
import { evidenceSources as sources, records as entities, V15_RESEARCH_DATE } from "@/lib/v15-data";

export const metadata: Metadata = {
  title: "Research & sources | INGENIUM+",
  description: "See the official evidence, confidence model and verification date behind INGENIUM+.",
};

const highConfidenceRecords = entities.filter((entity) => entity.confidence === "High").length;
const verificationRequiredRecords = entities.filter((entity) => entity.status === "Verification required").length;

export default function ResearchPage() {
  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Evidence ledger</span>
          <h1>See what the network is built on</h1>
          <p>
            Every INGENIUM+ record is tied to an official alliance page, programme page or deliverable. The current-data refresh was checked on {V15_RESEARCH_DATE}; retained historical sources keep their own dates.
          </p>
        </div>
        <div className="page-hero__signal" aria-label={`${sources.length} evidence sources`}>
          <strong>{sources.length}</strong>
          <span>evidence sources</span>
        </div>
      </section>

      <section className="card-grid" aria-label="Research principles">
        <article className="entity-card entity-card--opportunity">
          <span className="eyebrow">Confidence</span>
          <h2>{highConfidenceRecords} high-confidence records</h2>
          <p>High confidence means the key claim is supported directly by current official evidence.</p>
        </article>
        <article className="entity-card entity-card--framework">
          <span className="eyebrow">Caution by design</span>
          <h2>{verificationRequiredRecords} records need verification</h2>
          <p>Planned, developing and unconfirmed activity is never presented as a live opportunity.</p>
        </article>
        <article className="entity-card entity-card--platform">
          <span className="eyebrow">Authority</span>
          <h2>Official systems decide</h2>
          <p>Application status, eligibility, deadlines and access can change. Follow the official link before acting.</p>
        </article>
      </section>

      <section aria-labelledby="source-ledger-title">
        <div className="results-summary">
          <h2 id="source-ledger-title">Source ledger</h2>
          <p>{sources.length} official pages and deliverables used across the network.</p>
        </div>
        <div className="card-grid">
          {sources.map((source) => (
            <article key={source.id} className="entity-card entity-card--framework">
              <span className="eyebrow">{source.kind}</span>
              <h3>{source.title}</h3>
              <p>{source.published ? `Published or revised ${source.published}.` : source.verifiedAt ? `Verified ${source.verifiedAt}.` : "Official web or project-library source."}</p>
              {source.notes && <p>{source.notes}</p>}
              <div className="entity-card__actions">
                {source.url ? (
                  <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                    Open official source <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span>Deliverable held in the project evidence library</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
