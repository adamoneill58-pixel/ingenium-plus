"use client";

import { useState, type SyntheticEvent } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { featureVideoPoster, featureVideoSource, type FeatureVideo } from "@/lib/v2/feature-videos";
import styles from "./feature-videos.module.css";

function pauseOtherVideos(event: SyntheticEvent<HTMLVideoElement>) {
  document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    if (video !== event.currentTarget) video.pause();
  });
}

export function FeatureVideoPlayer({ video }: { video: FeatureVideo }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.player}>
      {failed ? (
        <div className={styles.playerError} role="status">
          <strong>This video could not load.</strong>
          <p>Try again, or open the video on its own.</p>
          <div>
            <button type="button" className="button button--secondary" onClick={() => setFailed(false)}><RotateCcw size={16} />Try again</button>
            <a className="button button--primary" href={featureVideoSource(video)} target="_blank" rel="noreferrer">Open video <ArrowUpRight size={16} /></a>
          </div>
        </div>
      ) : (
        <video
          key={video.id}
          controls
          playsInline
          preload="none"
          width={1920}
          height={1080}
          poster={featureVideoPoster(video)}
          aria-label={`${video.title} — 15-second feature demo with music`}
          onPlay={pauseOtherVideos}
          onError={() => setFailed(true)}
        >
          <source src={featureVideoSource(video)} type="video/mp4" />
          <track kind="captions" src={`/assets/video-guides/${video.number}.vtt`} srcLang="en" label="English action captions" />
          Your browser does not support video playback. <a href={featureVideoSource(video)}>Open the video</a>.
        </video>
      )}
    </div>
  );
}
