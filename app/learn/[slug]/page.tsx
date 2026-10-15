import { notFound } from "next/navigation";
import { DemoCourseSpace } from "@/components/v2/DemoCourseSpace";
import { demoCourseSpaces } from "@/lib/v2/demo-community";

export function generateStaticParams() {
  return demoCourseSpaces.map((space) => ({ slug: space.slug }));
}

export default async function LearnSpacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = demoCourseSpaces.find((item) => item.slug === slug);
  if (!space) notFound();
  return (
    <main id="main-content" className="campus-main inner-campus">
      <DemoCourseSpace space={space} />
    </main>
  );
}
