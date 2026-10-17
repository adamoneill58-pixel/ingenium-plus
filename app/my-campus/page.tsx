import { MyCampusWorkspace } from "@/components/v2/MyCampusWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { PersonalCampus } from "@/components/v2/PersonalCampus";
export const metadata={title:"My Campus"};
export default async function MyCampusPage(){const d=await getDiscoveryData();return <main id="main-content" className="campus-main inner-campus"><PersonalCampus/><details className="legacy-demo-section"><summary>Make the campus yours · catalogue shortlist & semester planner</summary><MyCampusWorkspace records={d.records}/></details></main>;}
