import { ExternalEmbed } from "./ExternalEmbed";
import { officialHighlights } from "@/lib/v2/official-highlights";

export function OfficialPulse() {
  return (
    <section className="official-pulse" aria-labelledby="official-pulse-title">
      <div>
        <span className="eyebrow">OFFICIAL EXTERNAL CONTENT</span>
        <h2 id="official-pulse-title">See the alliance in motion.</h2>
        <p>
          This is the upload stream from the YouTube channel linked by the
          official INGENIUM website. It loads only after you choose to connect
          to YouTube. LinkedIn page feeds and profiles are linked out because
          LinkedIn supports embeds for eligible individual public posts rather
          than a dependable full-page iframe.
        </p>
        <div className="official-news-links">{officialHighlights.map((item) => <a href={item.url} key={item.url} target="_blank" rel="noreferrer"><small>OFFICIAL NEWS{item.published ? ` · ${item.published}` : ""}</small><strong>{item.title} ↗</strong><span>{item.summary}</span></a>)}</div>
      </div>
      <ExternalEmbed
        config={{
          provider: "youtube-playlist",
          id: "UUsfhqVuimxspW0gku6Cq_rw",
          title: "Official INGENIUM European University YouTube uploads",
        }}
      />
    </section>
  );
}
