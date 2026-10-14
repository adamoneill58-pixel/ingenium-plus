import { MyCampusWorkspace } from "@/components/v2/MyCampusWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
export const metadata={title:"My Campus"};
export default async function MyCampusPage(){const d=await getDiscoveryData();return <main id="main-content" className="campus-main inner-campus"><header className="inner-hero"><span className="eyebrow">YOUR INTERESTS · YOUR NEXT STEPS</span><h1>Make the campus yours.</h1><p>Find a fit, keep a shortlist and start shaping a European semester.</p></header><MyCampusWorkspace records={d.records}/></main>;}
