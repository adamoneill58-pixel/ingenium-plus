import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Platforms | INGENIUM+",
  description: "Understand the official digital platforms and application routes used across INGENIUM.",
};

export default async function PlatformsPage() {
  const platformEntities = (await getRuntimeDataset()).records.filter((entity) => entity.type === "platform" || entity.id === "opportunity-digital-applications");
  return (
    <DirectoryPage
      eyebrow="Digital campus"
      title="Use the right official platform"
      introduction="See what each INGENIUM digital environment is for and whether access is public, institutional, restricted or still developing. Live official systems—not this guide—control accounts, applications and student records."
      entities={platformEntities}
    />
  );
}
