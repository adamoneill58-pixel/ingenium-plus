import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Network, ShieldCheck } from "lucide-react";
import { EntityCard } from "@/components/EntityCard";
import { GraphExplorer } from "@/components/GraphExplorer";
import { networkRelationships as relationships, records as entities, V15_RESEARCH_DATE } from "@/lib/v15-data";
import { getActionableRecords, getComputedStatus } from "@/lib/v15-logic";

export const metadata: Metadata = {
  title: { absolute: "INGENIUM+ | Your European campus, made visible" },
  description: "Explore verified programmes, mobility, projects, communities and opportunities across the ten INGENIUM universities.",
};

const spotlightIds = ["course-sustainable-wellbeing", "initiative-bmc", "bip-clarity-ai"];
const spotlights = spotlightIds.map((id) => entities.find((entity) => entity.id === id)).filter(Boolean);
const actionable = getActionableRecords().slice(0, 3);
const openCount = entities.filter((entity) => getComputedStatus(entity) === "Open now").length;
const verifiedCount = entities.filter((entity) => entity.confidence === "High").length;

export default function Home() {
  return (
    <main id="main-content" className="home-shell">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="eyebrow">INGENIUM+ · student discovery layer</span>
          <h1>Your European campus,<br /><span>made visible.</span></h1>
          <p>Follow real connections between study, mobility, projects and people across ten universities—then continue through the right official route.</p>
          <div className="home-hero__actions">
            <a className="button button--primary" href="#network">Explore the network <ArrowRight aria-hidden="true" /></a>
            <Link className="button button--secondary" href="/my-campus">Set up My Campus</Link>
          </div>
          <p className="trust-line"><ShieldCheck aria-hidden="true" /> Official evidence attached · current refresh {V15_RESEARCH_DATE}</p>
        </div>

        <aside className="now-panel" aria-labelledby="now-title">
          <div className="now-panel__heading">
            <span className="live-pulse" aria-hidden="true" />
            <div><span className="eyebrow">Actionable now</span><h2 id="now-title">Three places to start</h2></div>
          </div>
          {actionable.map((entity, index) => <Link key={entity.id} href={`/records/${entity.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{entity.title}</strong><small>{getComputedStatus(entity)}{entity.applicationDeadline ? ` · deadline ${entity.applicationDeadline}` : entity.dateLabel ? ` · ${entity.dateLabel}` : " · check the official route"}</small></div><ArrowRight aria-hidden="true" /></Link>)}
          <p>Status is calculated from explicit dates where available. Always confirm on the official page.</p>
        </aside>
      </section>

      <section id="network" className="network-stage" aria-labelledby="explorer-title">
        <div className="network-stage__heading">
          <div>
            <span className="eyebrow">The European Campus graph</span>
            <h2 id="explorer-title">Geography or network. One connected truth.</h2>
            <p>Search, filter and switch layout without changing the underlying evidence. Select nodes and lines to understand what connects—and why.</p>
          </div>
          <div className="network-stage__metrics" aria-label="Network evidence counts">
            <span><strong>{entities.length}</strong> records</span>
            <span><strong>{relationships.length}</strong> relationships</span>
            <span><strong>{verifiedCount}</strong> high confidence</span>
          </div>
        </div>
        <GraphExplorer />
      </section>

      <section className="home-spotlight" aria-labelledby="spotlight-title">
        <div className="section-heading">
          <div><span className="eyebrow">Beyond the graph</span><h2 id="spotlight-title">Useful next steps, without the noise</h2></div>
          <Link className="text-link" href="/explore">Explore all records <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="card-grid card-grid--three">
          {spotlights.map((entity) => entity && <EntityCard key={entity.id} entity={entity} />)}
        </div>
      </section>

      <section className="how-it-works" aria-labelledby="how-title">
        <div>
          <span className="eyebrow">Built for clarity</span>
          <h2 id="how-title">A map you can trust,<br />not another inbox.</h2>
        </div>
        <ol>
          <li><Compass aria-hidden="true" /><div><strong>Discover</strong><p>Start from a goal, not an organisational chart.</p></div></li>
          <li><Network aria-hidden="true" /><div><strong>Understand</strong><p>See hosts, partners, sequences and official routes.</p></div></li>
          <li><CheckCircle2 aria-hidden="true" /><div><strong>Act carefully</strong><p>Save a plan, then verify it in the authoritative system.</p></div></li>
        </ol>
        <div className="how-it-works__fact"><strong>{openCount}</strong><span>records calculated open now</span></div>
      </section>
    </main>
  );
}
