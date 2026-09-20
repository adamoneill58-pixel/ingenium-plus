import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Universities | INGENIUM+",
  description: "Meet the ten partner universities that form the INGENIUM European University.",
};

export default async function UniversitiesPage() {
  const universityEntities = (await getRuntimeDataset()).records.filter((entity) => entity.type === "university");
  return (
    <DirectoryPage
      eyebrow="The alliance"
      title="Ten universities. One connected campus."
      introduction="Meet the partner universities behind INGENIUM. Begin with your home or prospective host university, then use the graph to see the programmes, projects and communities connecting it to the wider alliance."
      entities={universityEntities}
      showTypeFilter={false}
    />
  );
}
