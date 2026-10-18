import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CirclePlay,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { CampusWorkspace } from "@/components/v2/CampusWorkspace";
import { getDiscoveryData } from "@/lib/v2/catalogue";
import { typeLabels } from "@/lib/labels";
import { PersonaWelcome } from "@/components/v2/PersonalCampus";
import { VideoSpotlight } from "@/components/v2/VideoSpotlight";

const featuredIds = [
  "opportunity-phd-mobility-2026",
  "initiative-accelerator",
  "course-sustainable-wellbeing",
];

export default async function Home() {
  const data = await getDiscoveryData();
  const featured = featuredIds
    .map((id) => data.records.find((record) => record.id === id))
    .filter((record): record is NonNullable<typeof record> => Boolean(record));
  return (
    <main id="main-content" className="campus-main">
      <section className="campus-hero campus-hero--map-first">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> TEN UNIVERSITIES · ONE EUROPEAN
            CAMPUS
          </span>
          <h1>
            Your European campus.
            <br />
            <em>Closer than you think.</em>
          </h1>
          <p>
            Move from the whole alliance to the course, project, event or
            community that fits you. Zoom in, follow the evidence, and take the
            next step on the official university page.
          </p>
        </div>
        <div className="hero-utility">
          <Link href="/calendar">
            <CalendarDays size={19} />
            <span><strong>Plan the year</strong>See dates across the alliance</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/learning">
            <BookOpen size={19} />
            <span><strong>Enter a learning space</strong>Courses, BIPs and programmes</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/community">
            <MessageCircle size={19} />
            <span><strong>Meet the community</strong>A clearly labelled social demo</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/#in-action">
            <CirclePlay size={19} />
            <span><strong>See it in action</strong>Eight 15-second feature demos</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <PersonaWelcome />
      <section id="discover" className="discovery-section discovery-section--map-first">
        <div className="section-kicker">
          <div>
            <span className="eyebrow">EXPLORE THE LIVING CAMPUS</span>
            <p>Search once. See the same real records as a map, network or list.</p>
          </div>
          <span className="dataset-state">
            {data.storage === "database"
              ? "Published database"
              : data.storage === "release-snapshot"
                ? "Source-backed release snapshot"
              : data.storage === "static-fallback"
                ? "Research snapshot · local preview"
                : "Database setup required"}
          </span>
        </div>
        <CampusWorkspace records={data.records} />
      </section>

      <VideoSpotlight />

      <section className="campus-life" aria-labelledby="campus-life-title">
        <header>
          <span className="eyebrow">MORE THAN A DIRECTORY</span>
          <h2 id="campus-life-title">See what is moving across the network.</h2>
          <p>
            Real opportunities lead into lightweight planning, learning and
            community spaces, so the campus feels active without hiding what is
            official and what is a prototype.
          </p>
        </header>
        <div className="campus-life-grid">
          <div className="real-activity-panel">
            <div className="panel-heading">
              <span><Sparkles size={16} />Source-backed highlights</span>
              <Link href="/explore">View all <ArrowUpRight size={14} /></Link>
            </div>
            {featured.map((record) => (
              <Link className="activity-row" href={`/records/${record.slug}`} key={record.id}>
                <span className="activity-type">{typeLabels[record.type]}</span>
                <span><strong>{record.title}</strong>{record.studentSummary}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
          <aside className="community-preview">
            <span className="demo-pill">DEMO COMMUNITY · SYNTHETIC PEOPLE</span>
            <h3>A campus with conversation.</h3>
            <p>
              Preview groups, discussions and messages around real INGENIUM
              topics. Every fictional person and interaction is marked as demo
              content.
            </p>
            <div className="preview-avatars" aria-hidden="true">
              <span>AK</span><span>LM</span><span>SR</span><span>+8</span>
            </div>
            <Link className="button button--primary" href="/community">
              Open community demo <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
