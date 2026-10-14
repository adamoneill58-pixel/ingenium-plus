import type { Metadata } from "next";
import { LearningWorkspace } from "@/components/LearningWorkspace";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Learning",
  description: "Discover cross-university courses, modules, BIPs, pathways and programmes across INGENIUM.",
};

export default async function LearningPage() {
  const dataset = await getRuntimeDataset();
  return (
    <main id="main-content" className="page-shell page-shell--wide">
      <section className="page-hero page-hero--compact">
        <div><span className="eyebrow">Cross-university learning</span><h1>Build a European semester</h1><p>Discover current modules, courses, BIPs and programmes. Plan locally, understand likely fit and continue through the official delivery route.</p></div>
      </section>
      <LearningWorkspace records={dataset.records} />
    </main>
  );
}
