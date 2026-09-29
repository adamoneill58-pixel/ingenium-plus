import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { entities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events | INGENIUM+",
  description: "Explore INGENIUM events, BIPs and short- or long-term mobility routes.",
};

const mobilityRouteIds = new Set(["opportunity-short-mobility", "opportunity-long-mobility"]);
const eventEntities = entities.filter(
  (entity) => entity.type === "event" || entity.type === "bip" || mobilityRouteIds.has(entity.id),
);

export default function EventsPage() {
  return (
    <DirectoryPage
      eyebrow="Meet the alliance"
      title="Meet INGENIUM in motion"
      introduction="Explore upcoming BIPs, recurring mobility routes and completed alliance experiences. Historical events remain visible as evidence and inspiration; current applications always continue through the official route."
      entities={eventEntities}
    />
  );
}
