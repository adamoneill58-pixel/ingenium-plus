import { CampusWorkspace } from "@/components/v2/CampusWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { VideoGuideLink } from "@/components/v2/VideoSpotlight";
export const metadata={title:"Discover"};
export default async function ExplorePage(){const d=await getDiscoveryData();return <main id="main-content" className="campus-main inner-campus"><header className="inner-hero"><span className="eyebrow">LEARNING · MOBILITY · PROJECTS · COMMUNITY</span><h1>Explore all of INGENIUM.</h1><p>Follow an interest. Find a new direction. See how your campus connects to nine more.</p><VideoGuideLink videoId="explore-degrees" /></header><CampusWorkspace records={d.records}/></main>;}
