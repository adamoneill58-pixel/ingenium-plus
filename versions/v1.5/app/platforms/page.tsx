import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { records as entities } from "@/lib/v15-data";

export const metadata: Metadata = {
  title: "Platforms | INGENIUM+",
  description: "Understand the official digital platforms and application routes used across INGENIUM.",
};

const platformEntities = entities.filter(
  (entity) => entity.type === "platform" || entity.id === "opportunity-digital-applications",
);

export default function PlatformsPage() {
  return (
    <DirectoryPage
      eyebrow="Digital campus"
      title="Use the right official platform"
      introduction="See what each INGENIUM digital environment is for and whether access is public, institutional, restricted or still developing. Live official systems—not this guide—control accounts, applications and student records."
      entities={platformEntities}
    />
  );
}
