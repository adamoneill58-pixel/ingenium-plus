import type { Metadata } from "next";
import { MyJourneyManager } from "@/components/MyJourneyManager";

export const metadata: Metadata = {
  title: "My journey | INGENIUM+",
  description: "Organise saved INGENIUM opportunities and next steps locally in your browser.",
};

export default function MyJourneyPage() {
  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero page-hero--compact">
        <div>
          <span className="eyebrow">Private workspace</span>
          <h1>Turn discovery into a plan</h1>
          <p>Order saved opportunities, record your next action and export a personal checklist. Your plan stays in this browser unless you export it.</p>
        </div>
        <div className="page-hero__signal" aria-label="Local only">
          <strong>Local</strong>
          <span>no account needed</span>
        </div>
      </section>
      <MyJourneyManager />
    </main>
  );
}
