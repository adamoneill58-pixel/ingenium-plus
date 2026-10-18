import Link from "next/link";
import { ArrowUpRight, Globe, Sparkles } from "lucide-react";

const campuses = [
  { id: "mtu", name: "MTU", country: "Ireland", x: 16, y: 28 },
  { id: "hs", name: "Skövde", country: "Sweden", x: 39, y: 10 },
  { id: "xamk", name: "Xamk", country: "Finland", x: 71, y: 16 },
  { id: "tuiasi", name: "TUIASI", country: "Romania", x: 88, y: 40 },
  { id: "mus", name: "Sofia", country: "Bulgaria", x: 81, y: 68 },
  { id: "uoc", name: "Crete", country: "Greece", x: 65, y: 88 },
  { id: "uda", name: "Ud’A", country: "Italy", x: 36, y: 89 },
  { id: "uniovi", name: "Oviedo", country: "Spain", x: 12, y: 72 },
  { id: "urn", name: "Rouen", country: "France", x: 9, y: 49 },
  { id: "hka", name: "HKA", country: "Germany", x: 48, y: 72 },
] as const;

/** An abstract alliance constellation, not a geographic or enrolment map. */
export function CampusConstellation() {
  return (
    <div className="campus-constellation" aria-label="Explore the ten INGENIUM universities">
      <div className="constellation-orbit orbit-one" aria-hidden="true" />
      <div className="constellation-orbit orbit-two" aria-hidden="true" />
      <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {campuses.map((campus) => <path key={campus.id} d={`M 50 44 Q ${campus.x} 44 ${campus.x} ${campus.y}`} />)}
      </svg>
      <Link className="constellation-centre" href="/universities">
        <Globe size={30} aria-hidden="true" /><strong>INGENIUM<span>+</span></strong>
        <small>One connected campus</small><ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      {campuses.map((campus, index) => (
        <Link key={campus.id} className={`constellation-campus constellation-campus--${index % 4}`}
          style={{ left: `${campus.x}%`, top: `${campus.y}%`, animationDelay: `${index * 45}ms` }}
          href={`/explore?university=university-${campus.id}&view=list&people=hide`}
          aria-label={`Explore ${campus.name}, ${campus.country}`}>
          <span className="campus-marker" aria-hidden="true" /><strong>{campus.name}</strong><small>{campus.country}</small>
        </Link>
      ))}
      <div className="constellation-note"><Sparkles size={15} aria-hidden="true" /> Pick a campus. See what connects.</div>
    </div>
  );
}
