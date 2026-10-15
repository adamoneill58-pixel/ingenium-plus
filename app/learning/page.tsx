import { LearningHub } from "@/components/v2/LearningHub";
import { getDiscoveryData } from "@/lib/v2/catalogue";

export const metadata = { title: "Learning" };

const learningTypes = new Set([
  "course",
  "module",
  "microcredential",
  "bip",
  "programme",
  "pathway",
  "learning_resource",
]);

export default async function LearningPage() {
  const data = await getDiscoveryData();
  const records = data.records.filter((record) => learningTypes.has(record.type));
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">LEARNING BEYOND YOUR HOME CAMPUS</span>
        <h1>Build a European semester.</h1>
        <p>
          Explore real courses, BIPs and programmes, then step into a clearly
          labelled prototype of the learning experience around them.
        </p>
      </header>
      <LearningHub records={records} />
    </main>
  );
}
