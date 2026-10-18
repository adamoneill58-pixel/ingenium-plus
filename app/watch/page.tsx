import { VideoShowcase } from "@/components/v2/VideoShowcase";
import { findFeatureVideo } from "@/lib/v2/feature-videos";
import styles from "@/components/v2/feature-videos.module.css";

export const metadata = {
  title: "See it in action",
  description: "Eight 15-second demos of exploring, learning and connecting across the INGENIUM+ prototype.",
};

export default async function WatchPage({ searchParams }: { searchParams: Promise<{ video?: string }> }) {
  const params = await searchParams;
  const video = findFeatureVideo(params.video);
  return (
    <main id="main-content" className={`campus-main inner-campus ${styles.watchPage}`}>
      <header className={styles.pageHero}>
        <div><span className="eyebrow">SEE INGENIUM+ IN ACTION</span><h1>Your campus.<br /><em>In motion.</em></h1></div>
        <p>Eight short ways to explore, connect and make the campus yours. Pick a demo, press play and find your next step.</p>
      </header>
      <VideoShowcase key={video.id} initialVideoId={video.id} />
    </main>
  );
}
