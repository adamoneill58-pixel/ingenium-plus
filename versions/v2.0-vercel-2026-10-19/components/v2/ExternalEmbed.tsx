"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import {
  externalEmbedUrl,
  externalFallbackUrl,
  isValidExternalEmbed,
  providerLabel,
  type ExternalEmbedConfig,
} from "@/lib/v2/external-embeds";

export function ExternalEmbed({ config }: { config: ExternalEmbedConfig }) {
  const [loaded, setLoaded] = useState(false);
  if (!isValidExternalEmbed(config)) return null;
  const provider = providerLabel(config.provider);
  return (
    <div className="external-embed">
      {loaded ? (
        <iframe
          src={externalEmbedUrl(config)}
          title={config.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button className="embed-consent" onClick={() => setLoaded(true)}>
          <Play size={25} />
          <span><strong>Load {provider}</strong>This connects to the external provider only after you choose to load it.</span>
        </button>
      )}
      <footer><span>{provider} · official external content</span><a href={externalFallbackUrl(config)} target="_blank" rel="noreferrer">Open on provider <ExternalLink size={13} /></a></footer>
    </div>
  );
}
