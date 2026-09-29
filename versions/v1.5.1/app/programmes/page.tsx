import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Programmes | INGENIUM+",
  description: "Explore verified BIPs, joint programmes, pathways and learning frameworks across INGENIUM.",
};

const programmeTypes = new Set(["bip", "programme", "pathway", "framework"]);
export default async function ProgrammesPage() {
  const programmeEntities = (await getRuntimeDataset()).records.filter((entity) => programmeTypes.has(entity.type));
  return (
    <DirectoryPage
      eyebrow="Study across borders"
      title="Study across one European campus"
      introduction="Explore BIPs, joint and double degrees, pathway pilots and shorter-learning frameworks. Status labels separate opportunities that are open now from those still planned, developing or awaiting verification."
      entities={programmeEntities}
    />
  );
}
