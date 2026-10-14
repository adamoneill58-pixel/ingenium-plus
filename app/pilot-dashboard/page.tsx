import { PilotDashboard } from "@/components/v2/PilotDashboard";
export const metadata = { title: "Pilot team dashboard" };
export default function DashboardPage() {
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">RESTRICTED TEAM WORKSPACE</span>
        <h1>Pilot evidence.</h1>
        <p>
          Visits, interactions and independent survey totals. Content coverage
          is not adoption.
        </p>
      </header>
      <PilotDashboard />
    </main>
  );
}
