"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CirclePlay, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { featureVideos, featureVideoPoster, findFeatureVideo } from "@/lib/v2/feature-videos";
import { FeatureVideoPlayer } from "./FeatureVideoPlayer";
import styles from "./feature-videos.module.css";

export function VideoShowcase({ initialVideoId }: { initialVideoId: string }) {
  const [selectedId, setSelectedId] = useState(initialVideoId);
  const playerPanel = useRef<HTMLElement>(null);
  const playerTitle = useRef<HTMLHeadingElement>(null);
  const active = findFeatureVideo(selectedId);

  function selectVideo(id: string) {
    if (id === selectedId) return;
    document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => video.pause());
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("video", id);
    window.history.replaceState(null, "", url);
    window.requestAnimationFrame(() => {
      playerTitle.current?.focus({ preventScroll: true });
      playerPanel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    });
  }

  return (
    <>
      <section id="selected-video-panel" ref={playerPanel} className={styles.featured} aria-labelledby="selected-video-title">
        <div className={styles.screen}>
          <FeatureVideoPlayer key={active.id} video={active} />
          <p className={styles.soundNote}><Volume2 size={15} aria-hidden="true" /> Music included. Press play when you’re ready.</p>
        </div>
        <div className={styles.featureInfo}>
          <div className={styles.episode}><span>EPISODE {active.number} / 08</span><span>15 seconds</span></div>
          <h2 id="selected-video-title" ref={playerTitle} tabIndex={-1}>{active.title}</h2>
          <p>{active.description}</p>
          <ol className={styles.steps}>{active.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <Link className="button button--primary" href={active.href}>{active.action} <ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className={styles.episodes} aria-labelledby="episodes-title">
        <div className={styles.episodeHeading}><div><span className="eyebrow">FIND YOUR NEXT STEP</span><h2 id="episodes-title">What would you like to try?</h2></div><p>Eight stories. Fifteen seconds each.</p></div>
        <div className={styles.episodeGrid}>
          {featureVideos.map((video) => (
            <button
              type="button"
              key={video.id}
              className={`${styles.episodeCard} ${active.id === video.id ? styles.selected : ""}`}
              onClick={() => selectVideo(video.id)}
              aria-pressed={active.id === video.id}
              aria-label={`Select ${video.title}, 15-second demo`}
              aria-controls="selected-video-panel"
            >
              <span className={styles.thumbnail}>
                <Image src={featureVideoPoster(video)} width={1920} height={1080} unoptimized alt="" />
                <span className={styles.playIcon}><CirclePlay size={32} aria-hidden="true" /></span>
                <span className={styles.duration}>0:15</span>
              </span>
              <span className={styles.cardBody}><span className={styles.cardNumber}>{video.number}</span><strong>{video.title}</strong><span className={styles.selectedLabel}>{active.id === video.id ? "Selected" : "View demo"}</span></span>
            </button>
          ))}
        </div>
        <p className={styles.boundary}>The clips show the current prototype. Social activity, learning progress and workshop bookings are labelled demos; programme status and advisory credits remain visible.</p>
      </section>
    </>
  );
}
