import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "Communities | INGENIUM+",
  description: "Find verified INGENIUM student communities and participation routes.",
};

export default async function CommunitiesPage() {
  const communityEntities = (await getRuntimeDataset()).records.filter((entity) => entity.type === "community");
  return (
    <DirectoryPage
      eyebrow="Belong across borders"
      title="Find your people"
      introduction="Discover verified student networks for representation, entrepreneurship and campus action. INGENIUM+ points to genuine participation routes—it does not publish private chats, member lists or personal contact data."
      entities={communityEntities}
      showTypeFilter={false}
    />
  );
}
