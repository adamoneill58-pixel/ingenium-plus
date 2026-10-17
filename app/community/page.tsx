import { CommunityWorkspace } from "@/components/v2/CommunityWorkspace";
import { OfficialPulse } from "@/components/v2/OfficialPulse";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { CampusActivityFeed, PeopleDirectory } from "@/components/v2/PersonalCampus";
import { SimulationNotice } from "@/components/v2/SimulationContext";

export const metadata = {
  title: "Community",
  description:
    "A clearly labelled prototype of social discovery around real INGENIUM records.",
};

export default async function CommunityPage() {
  const data = await getDiscoveryData();
  const realCommunities = data.records.filter(
    (record) => record.type === "community",
  );
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero inner-hero--community">
        <span className="eyebrow">PEOPLE MAKE THE CAMPUS REAL</span>
        <h1>Find the work. Then find your people.</h1>
        <p>
          This prototype combines source-backed INGENIUM communities with a
          fully labelled social sandbox. It shows how profiles, groups, a feed
          and messages could connect people without pretending that a live
          community already exists.
        </p>
      </header>
      <SimulationNotice />
      <div className="community-personal-layout"><CampusActivityFeed/><aside><PeopleDirectory/></aside></div>
      <details className="legacy-demo-section"><summary>General community sandbox & official community directory</summary><CommunityWorkspace realCommunities={realCommunities} /></details>
      <OfficialPulse />
    </main>
  );
}
