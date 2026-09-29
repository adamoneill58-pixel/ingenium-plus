import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | INGENIUM+",
  description: "Learn what INGENIUM+ is, how it uses evidence and what it does not replace.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero">
        <div>
          <span className="eyebrow">About INGENIUM+</span>
          <h1>A clearer way into your European campus</h1>
          <p>INGENIUM+ is a student-led platform that connects verified learning, mobility, research, projects, communities and people across the ten INGENIUM universities.</p>
        </div>
        <div className="page-hero__signal" aria-label="Ten partner universities">
          <strong>10</strong>
          <span>partner universities</span>
        </div>
      </section>

      <section className="card-grid" aria-label="How INGENIUM Plus works">
        <article className="entity-card entity-card--opportunity">
          <span className="eyebrow">Discover</span>
          <h2>One connected view</h2>
          <p>The graph makes relationships visible; focused directories help you compare the details and find a next step.</p>
          <div className="entity-card__actions">
            <Link className="text-link" href="/">Explore the network</Link>
          </div>
        </article>
        <article className="entity-card entity-card--framework">
          <span className="eyebrow">Verify</span>
          <h2>Evidence before excitement</h2>
          <p>Official pages and deliverables ground each record. Open, planned, developing and unconfirmed activity stay visibly distinct.</p>
          <div className="entity-card__actions">
            <Link className="text-link" href="/research">Read the evidence ledger</Link>
          </div>
        </article>
        <article className="entity-card entity-card--platform">
          <span className="eyebrow">Continue officially</span>
          <h2>A guide, not a registry</h2>
          <p>INGENIUM+ does not replace university systems. Applications, enrolment, eligibility and access continue through official channels.</p>
          <div className="entity-card__actions">
            <Link className="text-link" href="/platforms">Find the right platform</Link>
          </div>
        </article>
      </section>

      <section className="card-grid" aria-label="Project context and privacy">
        <article className="entity-card entity-card--project">
          <span className="eyebrow">Student-led origin</span>
          <h2>Built from a student need</h2>
          <p>
            The concept began through student collaboration involving MTU, TUIASI and Xamk and received Young Innovators recognition. Its 2026 Student Partnership proposal was supported to seek alternative funding; it was not one of the six directly funded projects.
          </p>
        </article>
        <article className="entity-card entity-card--community">
          <span className="eyebrow">Privacy boundary</span>
          <h2>Accounts with deliberate visibility</h2>
          <p>Student profiles are private by default. Staff can separately opt in to verified-academic discovery. Public sample profiles remain fictional and visibly labelled; no private student directory is exposed.</p>
        </article>
      </section>
    </main>
  );
}
