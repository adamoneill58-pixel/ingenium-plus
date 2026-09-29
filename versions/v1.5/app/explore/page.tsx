import type { Metadata } from "next";
import { ExploreWorkspace } from "@/components/ExploreWorkspace";

export const metadata: Metadata = {
  title: "Explore",
  description: "Search and filter the complete INGENIUM+ evidence graph.",
};

export default function ExplorePage() {
  return (
    <main id="main-content" className="page-shell page-shell--wide">
      <section className="page-hero page-hero--compact">
        <div><span className="eyebrow">One alliance · one dataset</span><h1>Explore all of INGENIUM</h1><p>Search learning, mobility, people, projects and universities, then switch between records and the same connected graph.</p></div>
      </section>
      <ExploreWorkspace />
    </main>
  );
}
