import Link from "next/link";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { featureVideos } from "@/lib/v2/feature-videos";
import { FeatureVideoPlayer } from "./FeatureVideoPlayer";
import styles from "./feature-videos.module.css";

export function VideoSpotlight() {
  const video = featureVideos[0];
  return (
    <section id="in-action" className={styles.spotlight} aria-labelledby="in-action-title">
      <div className={styles.spotlightHeading}><div><span className="eyebrow">SEE IT IN ACTION</span><h2 id="in-action-title">A little curiosity.<br />A wider campus.</h2></div><Link className={styles.allVideos} href="/watch">Watch all eight demos <ArrowUpRight size={17} /></Link></div>
      <div className={styles.spotlightGrid}>
        <FeatureVideoPlayer video={video} />
        <div className={styles.spotlightCopy}>
          <span className={styles.timePill}><CirclePlay size={16} /> 15 SECONDS TO GET STARTED</span>
          <h3>Build your own campus.</h3>
          <p>Choose an interest, discover an opportunity and keep it in your personal shortlist. See the real steps, then try it yourself.</p>
          <Link className="button button--primary" href="/my-campus?mode=student">Make the campus yours <ArrowUpRight size={16} /></Link>
          <Link className={styles.secondaryLink} href="/watch">Explore the full video collection <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

export function VideoGuideLink({ videoId, children = "Watch a 15-second demo" }: { videoId: string; children?: React.ReactNode }) {
  return <Link className={styles.guideLink} href={`/watch?video=${videoId}`}><CirclePlay size={18} aria-hidden="true" />{children}<ArrowUpRight size={15} aria-hidden="true" /></Link>;
}
