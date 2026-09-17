import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { records as entities } from "@/lib/v15-data";

export const metadata: Metadata = {
  title: "Universities | INGENIUM+",
  description: "Meet the ten partner universities that form the INGENIUM European University.",
};

const universityEntities = entities.filter((entity) => entity.type === "university");

export default function UniversitiesPage() {
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
