import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { type Entity, type EntityStatus } from "@/lib/data";
import { records as entities } from "@/lib/v15-data";
import { getComputedStatus } from "@/lib/v15-logic";

export const metadata: Metadata = {
  title: "Opportunities | INGENIUM+",
  description: "Verified routes to study, travel and take part across INGENIUM.",
};

const statusOrder: Partial<Record<EntityStatus, number>> = {
  "Open now": 0,
  Open: 0,
  "Opens soon": 1,
  "Coming soon": 2,
  Upcoming: 2,
  Recurring: 3,
  Ongoing: 4,
  "Access unverified": 4,
  "Under development": 5,
  Planned: 6,
  "Verification required": 7,
  Closed: 8,
  Past: 9,
  Historical: 10,
  Completed: 10,
  Archived: 11,
};

const opportunityEntities: Entity[] = entities
  .filter((entity) =>
    entity.type === "opportunity" ||
    entity.type === "bip" ||
    getComputedStatus(entity) === "Open now" ||
    ["initiative-bmc", "community-sustainability-hub"].includes(entity.id),
  )
  .sort((a, b) => (statusOrder[getComputedStatus(a)] ?? 99) - (statusOrder[getComputedStatus(b)] ?? 99) || a.title.localeCompare(b.title));

export default function OpportunitiesPage() {
  return (
    <DirectoryPage
      eyebrow="Start here"
      title="Choose your next move"
      introduction="Compare verified routes to study, travel, apply or begin exploring across INGENIUM. Calls and local deadlines can change, so the linked official systems remain authoritative."
      entities={opportunityEntities}
    />
  );
}
