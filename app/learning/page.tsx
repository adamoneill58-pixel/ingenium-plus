import { CampusWorkspace } from "@/components/v2/CampusWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
const learning={};
export const metadata={title:"Learning"};
export default async function LearningPage(){const d=await getDiscoveryData();return <main id="main-content" className="campus-main inner-campus"><header className="inner-hero"><span className="eyebrow">LEARNING BEYOND YOUR HOME CAMPUS</span><h1>Build a European semester.</h1><p>Explore courses, BIPs and programmes. Save a shortlist in My Campus; universities decide enrolment and credit recognition.</p></header><CampusWorkspace records={d.records.filter(r=>["university","course","module","microcredential","bip","programme","pathway","learning_resource"].includes(r.type))} initialFilters={learning}/></main>;}
