"use client";
import type { Entity } from "@/lib/data";
const coordinates: Record<string, [number, number]> = {
  "university-uniovi": [43.3614, -5.8494],
  "university-mus": [42.6838, 23.3117],
  "university-uoc": [35.3545, 24.4772],
  "university-hka": [49.0158, 8.3901],
  "university-xamk": [61.6884, 27.2727],
  "university-uda": [42.3699, 14.1492],
  "university-hs": [58.3912, 13.853],
  "university-mtu": [51.8856, -8.5353],
  "university-urn": [49.4607, 1.0684],
  "university-tuiasi": [47.1544, 27.5993],
};
function point(lat: number, lon: number) {
  const rad = Math.PI / 180,
    l = lat * rad,
    c = 52 * rad,
    o = (lon - 10) * rad,
    k = Math.pow(
      (1 +
        Math.sin(l) * Math.sin(c) +
        Math.cos(l) * Math.cos(c) * Math.cos(o)) *
        0.5,
      -0.5,
    );
  return [
    ((131.579 * Math.cos(l) * Math.sin(o) * k + 36.388) / 100) * 1401.34,
    ((55.11 -
      153.61 *
        (Math.cos(c) * Math.sin(l) - Math.sin(c) * Math.cos(l) * Math.cos(o)) *
        k) /
      100) *
      1198.34,
  ];
}
export default function CampusMap({
  universities,
  records,
  onCampus,
}: {
  universities: Entity[];
  records: Entity[];
  onCampus: (id: string) => void;
}) {
  return (
    <div className="campus-map">
      <div className="map-visual">
        <svg
          viewBox="0 0 1401.34 1198.34"
          role="img"
          aria-label="INGENIUM campus locations in Europe"
        >
          <image
            href="/assets/europe-map.svg"
            width="1401.34"
            height="1198.34"
          />
          {universities.map((u) => {
            const c = coordinates[u.id];
            if (!c) return null;
            const [x, y] = point(...c);
            return (
              <g key={u.id} transform={`translate(${x},${y})`}>
                <circle r={15} fill="#007b65" stroke="white" strokeWidth={5} />
                <text
                  y={-25}
                  textAnchor="middle"
                  fontSize={23}
                  fill="#193c35"
                  fontWeight={700}
                >
                  {u.shortTitle ?? u.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="map-campus-list">
        <span className="eyebrow">Choose your campus</span>
        <h2>Ten places to begin.</h2>
        <p>
          These pins locate university campuses. Online opportunities are
          connected to their host, not assigned a physical venue.
        </p>
        {universities.map((u) => (
          <button key={u.id} onClick={() => onCampus(u.id)}>
            <strong>{u.shortTitle ?? u.title}</strong>
            <span>
              {u.countries?.[0]} ·{" "}
              {
                records.filter(
                  (r) =>
                    r.universityIds.includes(u.id) && r.type !== "university",
                ).length
              }{" "}
              connected records →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
