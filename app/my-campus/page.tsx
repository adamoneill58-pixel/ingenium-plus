import type { Metadata } from "next";
import { MyCampusDashboard } from "@/components/MyCampusDashboard";

export const metadata: Metadata = {
  title: "My Campus",
  description: "A private, browser-local INGENIUM+ profile, network and planning dashboard.",
};

export default function MyCampusPage() {
  return <main id="main-content" className="page-shell page-shell--wide campus-dashboard"><MyCampusDashboard /></main>;
}
