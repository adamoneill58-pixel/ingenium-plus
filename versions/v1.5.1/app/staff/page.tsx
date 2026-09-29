import type { Metadata } from "next";
import { StaffPortal } from "@/components/StaffPortal";

export const metadata: Metadata = { title: "Staff mode", description: "Publish collaboration calls and modules, upload evidence and receive explainable collaborator recommendations." };

export default function StaffPage() {
  return <main id="main-content" className="page-shell page-shell--wide production-portal"><StaffPortal /></main>;
}
