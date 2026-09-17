import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { records as entities } from "@/lib/v15-data";

export const metadata: Metadata = {
  title: "Programmes | INGENIUM+",
  description: "Explore verified BIPs, joint programmes, pathways and learning frameworks across INGENIUM.",
};

const programmeTypes = new Set(["bip", "programme", "pathway", "framework"]);
const programmeEntities = entities.filter((entity) => programmeTypes.has(entity.type));

export default function ProgrammesPage() {
  return (
    <DirectoryPage
      eyebrow="Study across borders"
      title="Study across one European campus"
      introduction="Explore BIPs, joint and double degrees, pathway pilots and shorter-learning frameworks. Status labels separate opportunities that are open now from those still planned, developing or awaiting verification."
      entities={programmeEntities}
    />
  );
}
