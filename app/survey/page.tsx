import { PilotSurvey } from "@/components/v2/PilotSurvey";
export const metadata = { title: "Pilot feedback" };
export default function SurveyPage() {
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">HELP SHAPE THE CAMPUS</span>
        <h1>What worked for you?</h1>
        <p>Five minutes of feedback can help us make discovery more useful.</p>
      </header>
      <PilotSurvey />
    </main>
  );
}
