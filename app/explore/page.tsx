import type { Metadata } from "next";
import { ExploreWorkspace } from "@/components/ExploreWorkspace";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Explore",
  description: "Search and filter the complete INGENIUM+ evidence graph.",
};

export default async function ExplorePage() {
  const dataset = await getRuntimeDataset();
  return (
    <main id="main-content" className="page-shell page-shell--wide">
      <section className="page-hero page-hero--compact">
        <div><span className="eyebrow">One alliance · one dataset</span><h1>Explore all of INGENIUM</h1><p>Search learning, mobility, people, projects and universities, then switch between records and the same connected graph.</p></div>
      </section>
      <ExploreWorkspace records={dataset.records} relationships={dataset.relationships} sources={dataset.sources} />
    </main>
  );
}
