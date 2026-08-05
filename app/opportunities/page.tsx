import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { entities, type Entity, type EntityStatus } from "@/lib/data";

export const metadata: Metadata = {
  title: "Opportunities | INGENIUM+",
  description: "Verified routes to study, travel and take part across INGENIUM.",
};

const statusOrder: Record<EntityStatus, number> = {
  Open: 0,
  Upcoming: 1,
  Recurring: 2,
  Ongoing: 3,
  "Access unverified": 4,
  "Under development": 5,
  Planned: 6,
  "Verification required": 7,
  Completed: 8,
  Archived: 9,
};

const opportunityEntities: Entity[] = entities
  .filter((entity) =>
    entity.type === "opportunity" ||
    entity.type === "bip" ||
    entity.status === "Open" ||
    ["initiative-bmc", "community-sustainability-hub"].includes(entity.id),
  )
  .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.title.localeCompare(b.title));

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
