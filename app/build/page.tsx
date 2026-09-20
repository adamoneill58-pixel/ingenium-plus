import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Build | INGENIUM+",
  description: "Explore student projects, challenges and entrepreneurship routes across INGENIUM.",
};

const buildStoryIds = new Set(["event-sdg-hackathon-2024", "event-science-factory-2024"]);
export default async function BuildPage() {
  const buildEntities = (await getRuntimeDataset()).records.filter((entity) => entity.type === "project" || entity.type === "initiative" || buildStoryIds.has(entity.id));
  return (
    <DirectoryPage
      eyebrow="Ideas into action"
      title="Build something that travels"
      introduction="Find funded student projects, challenge outcomes and entrepreneurship routes that connect students across campuses. Proposals and developing initiatives are clearly distinguished from directly funded or completed work."
      entities={buildEntities}
    />
  );
}
