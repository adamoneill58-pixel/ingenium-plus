export type ExternalEmbedConfig =
  | { provider: "youtube-video"; id: string; title: string }
  | { provider: "youtube-playlist"; id: string; title: string }
  | { provider: "linkedin-post"; id: string; title: string }
  | { provider: "google-calendar"; id: string; title: string };

const patterns = {
  "youtube-video": /^[A-Za-z0-9_-]{11}$/,
  "youtube-playlist": /^(?:PL|UU|OLAK5uy_)[A-Za-z0-9_-]{10,80}$/,
  "linkedin-post": /^urn:li:(?:share|activity):\d{10,24}$/,
  "google-calendar": /^[A-Za-z0-9_.%+@-]{3,180}$/,
} as const;

export function isValidExternalEmbed(config: ExternalEmbedConfig) {
  return Boolean(
    config.title.trim() && patterns[config.provider].test(config.id.trim()),
  );
}

export function externalEmbedUrl(config: ExternalEmbedConfig) {
  if (!isValidExternalEmbed(config)) throw new Error("Invalid embed identifier");
  switch (config.provider) {
    case "youtube-video":
      return `https://www.youtube-nocookie.com/embed/${config.id}`;
    case "youtube-playlist":
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${config.id}`;
    case "linkedin-post":
      return `https://www.linkedin.com/embed/feed/update/${config.id}`;
    case "google-calendar":
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(config.id)}&mode=AGENDA`;
  }
}

export function externalFallbackUrl(config: ExternalEmbedConfig) {
  if (!isValidExternalEmbed(config)) throw new Error("Invalid embed identifier");
  switch (config.provider) {
    case "youtube-video":
      return `https://www.youtube.com/watch?v=${config.id}`;
    case "youtube-playlist":
      return `https://www.youtube.com/playlist?list=${config.id}`;
    case "linkedin-post":
      return `https://www.linkedin.com/feed/update/${config.id}`;
    case "google-calendar":
      return `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(config.id)}`;
  }
}

export function providerLabel(provider: ExternalEmbedConfig["provider"]) {
  if (provider.startsWith("youtube")) return "YouTube";
  if (provider === "linkedin-post") return "LinkedIn public post";
  return "Google Calendar";
}
