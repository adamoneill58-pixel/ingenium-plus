import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { entities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Communities | INGENIUM+",
  description: "Find verified INGENIUM student communities and participation routes.",
};

const communityEntities = entities.filter((entity) => entity.type === "community");

export default function CommunitiesPage() {
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
