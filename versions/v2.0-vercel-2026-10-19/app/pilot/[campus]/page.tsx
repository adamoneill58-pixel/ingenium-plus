import { notFound } from "next/navigation";
import { PILOT_CAMPUSES } from "@/lib/v2/features";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { CampusWorkspace } from "@/components/v2/CampusWorkspace";
export const metadata = { title: "Explore the pilot" };
export default async function PilotLanding({
  params,
}: {
  params: Promise<{ campus: string }>;
}) {
  const { campus } = await params;
  if (!(PILOT_CAMPUSES as readonly string[]).includes(campus)) notFound();
  const d = await getDiscoveryData();
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">WELCOME TO THE EUROPEAN CAMPUS</span>
        <h1>A new connection starts here.</h1>
        <p>
          Explore freely, without an account. This campus entry route does not
          follow you around the site.
        </p>
      </header>
      <CampusWorkspace records={d.records} />
    </main>
  );
}
