import Link from "next/link";
import { ArrowUpRight, BookOpen, CirclePlay, Globe, Network, Plane, Search, Shapes, Users } from "lucide-react";
import { CampusWorkspace } from "@/components/v2/CampusWorkspace";
import { CampusConstellation } from "@/components/v2/CampusConstellation";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { VideoSpotlight } from "@/components/v2/VideoSpotlight";
import { OpportunityCard } from "@/components/v2/OpportunityCard";

const pathways = [
  { number: "01", title: "Learn across borders.", detail: "Degrees, courses & BIPs", href: "/learning", Icon: BookOpen, colour: "cyan" },
  { number: "02", title: "Find your next adventure.", detail: "Mobility & opportunities", href: "/opportunities", Icon: Plane, colour: "lime" },
  { number: "03", title: "Build something together.", detail: "Projects & collaboration", href: "/build", Icon: Shapes, colour: "teal" },
  { number: "04", title: "Find your people.", detail: "Explore the community demo", href: "/community", Icon: Users, colour: "pink" },
] as const;
const featuredIds = ["initiative-bmc", "course-sustainable-wellbeing", "initiative-linguistic-tandems-students"];

export default async function Home() {
  const data = await getDiscoveryData();
  const chosen = featuredIds.flatMap((id) => data.records.find((record) => record.id === id) ?? []);
  const featured = [...chosen, ...data.records.filter((record) => record.type === "course" && !chosen.some((item) => item.id === record.id))].slice(0, 3);
  return (
    <main id="main-content" className="campus-main public-home">
      <section className="discovery-hero" aria-labelledby="home-title">
        <div className="discovery-hero-copy">
          <span className="preview-label"><span className="status-dot" /> STUDENT-BUILT PREVIEW · NO SIGN-UP</span>
          <h1 id="home-title">Your European campus.<br /><em>Closer than you think.</em></h1>
          <p>Discover courses, projects and opportunities across ten European universities.</p>
          <form className="hero-search" action="/explore" method="get" role="search">
            <Search size={22} aria-hidden="true" /><label className="sr-only" htmlFor="hero-search">What would you like to explore?</label>
            <input id="hero-search" name="query" placeholder="An interest. A place. A possibility." />
            <input type="hidden" name="view" value="list" /><input type="hidden" name="people" value="hide" />
            <button type="submit" aria-label="Search opportunities"><ArrowUpRight size={22} /></button>
          </form>
          <div className="hero-suggestions" aria-label="Start exploring">
            <Link href="/explore?type=programme&view=list&people=hide">Explore degrees <ArrowUpRight size={13} /></Link>
            <Link href="/explore?query=sustainability&view=list&people=hide">Sustainability <ArrowUpRight size={13} /></Link>
            <Link href="/universities">Find a university <ArrowUpRight size={13} /></Link>
          </div>
          <div className="hero-footnote"><span className="brand-colour-dots" aria-hidden="true"><i /><i /><i /><i /></span>Ten universities. So many ways in.</div>
        </div>
        <CampusConstellation />
      </section>
      <section className="visual-pathways" aria-label="Choose your direction">
        {pathways.map(({ number, title, detail, href, Icon, colour }) => (
          <Link key={number} href={href} className={`pathway-tile pathway-tile--${colour}`}>
            <span className="pathway-number">{number} /</span><div className="pathway-art" aria-hidden="true"><span /><Icon size={42} strokeWidth={1.5} /></div>
            <h2>{title}</h2><span className="pathway-detail">{detail}</span><ArrowUpRight className="pathway-arrow" size={21} aria-hidden="true" />
          </Link>
        ))}
      </section>
      <section className="featured-discoveries" aria-labelledby="featured-title">
        <header className="visual-section-heading"><div><span className="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</span><h2 id="featured-title">Something to start with.</h2></div><Link href="/explore?view=list&people=hide">Explore the catalogue <ArrowUpRight size={17} /></Link></header>
        <div className="featured-discovery-grid">{featured.map((record) => <OpportunityCard key={record.id} record={record} />)}</div>
      </section>
      <section id="discover" className="discovery-section public-discovery" aria-labelledby="discovery-title">
        <header className="visual-section-heading"><div><span className="eyebrow">TEN CAMPUSES. ONE STARTING POINT.</span><h2 id="discovery-title">Follow what interests you.</h2></div><span className="dataset-state">{data.storage === "database" ? "Published database" : data.storage === "release-snapshot" ? "Source-backed release snapshot" : data.storage === "static-fallback" ? "Research snapshot · local preview" : "Database setup required"}</span></header>
        <CampusWorkspace records={data.records} publicEntry />
      </section>
      <VideoSpotlight />
      <section className="public-demo-section" aria-labelledby="demo-title">
        <div className="demo-section-art" aria-hidden="true"><span className="demo-art-centre"><Network size={48} strokeWidth={1.5} /></span><span className="demo-art-node demo-art-node--one"><BookOpen /></span><span className="demo-art-node demo-art-node--two"><Users /></span><span className="demo-art-node demo-art-node--three"><Globe /></span><span className="demo-art-node demo-art-node--four"><Shapes /></span></div>
        <div><span className="demo-pill">CAMPUS DEMO · SYNTHETIC ACTIVITY</span><h2 id="demo-title">Imagine your campus.<br /><em>Then take a look around.</em></h2><p>Try a sample student’s learning spaces, connections and conversations.</p><Link className="button button--primary" href="/campus?mode=student">Explore the campus demo <ArrowUpRight size={17} /></Link><Link className="demo-watch-link" href="/watch"><CirclePlay size={17} /> Watch a 15-second guide</Link><small>People, chats, participation and bookings are simulated. Demo changes stay in this browser tab.</small></div>
      </section>
    </main>
  );
}
