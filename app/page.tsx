import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, CheckCircle2, Compass, Network, ShieldCheck } from "lucide-react";
import { EntityCard } from "@/components/EntityCard";
import { GraphExplorer } from "@/components/GraphExplorer";
import { entities, relationships, RESEARCH_DATE } from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "INGENIUM+ | Your European campus, made visible" },
  description: "Explore verified programmes, mobility, projects, communities and opportunities across the ten INGENIUM universities.",
};

const spotlightIds = ["programme-cbpt", "initiative-bmc", "community-sustainability-hub"];
const spotlights = spotlightIds.map((id) => entities.find((entity) => entity.id === id)).filter(Boolean);
const openCount = entities.filter((entity) => entity.status === "Open").length;
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
            <Link className="button button--secondary" href="/my-journey"><Bookmark aria-hidden="true" /> My journey</Link>
          </div>
          <p className="trust-line"><ShieldCheck aria-hidden="true" /> Official evidence attached · status checked {RESEARCH_DATE}</p>
        </div>

        <aside className="now-panel" aria-labelledby="now-title">
          <div className="now-panel__heading">
            <span className="live-pulse" aria-hidden="true" />
            <div><span className="eyebrow">Actionable now</span><h2 id="now-title">Three places to start</h2></div>
          </div>
          <Link href="/?mode=programmes&node=programme-cbpt">
            <span>01</span><div><strong>Apply for the CBPT Joint Master’s</strong><small>Deadline 6 September 2026 · EU applicants</small></div><ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/?mode=programmes&node=programme-human-centred-ai-doctorate">
            <span>02</span><div><strong>Explore the Human-Centred AI doctorate</strong><small>Live call · deadline 21 August 2026</small></div><ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/?mode=innovation&node=initiative-bmc">
            <span>03</span><div><strong>Take the Business Model Canvas course</strong><small>Live · self-directed · digital badge</small></div><ArrowRight aria-hidden="true" />
          </Link>
          <p>Deadlines are frozen to the research date. Always confirm on the official page.</p>
        </aside>
      </section>

      <section id="network" className="network-stage" aria-labelledby="explorer-title">
        <div className="network-stage__heading">
          <div>
            <span className="eyebrow">The European Campus map</span>
            <h2 id="explorer-title">See the opportunity. Understand the route.</h2>
            <p>The graph is the centre of INGENIUM+: zoom, search, filter, open a guided journey and select the lines—not just the nodes—to learn why things connect.</p>
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
          <Link className="text-link" href="/opportunities">See all opportunities <ArrowRight aria-hidden="true" /></Link>
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
        <div className="how-it-works__fact"><strong>{openCount}</strong><span>records currently labelled open</span></div>
      </section>
    </main>
  );
}
