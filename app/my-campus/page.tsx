import type { Metadata } from "next";
import { MyCampusDashboard } from "@/components/MyCampusDashboard";
import { sampleStudents } from "@/lib/v15-data";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export const metadata: Metadata = {
  title: "My Campus",
  description: "A private, browser-local INGENIUM+ profile, network and planning dashboard.",
};

export default async function MyCampusPage() {
  const dataset = await getRuntimeDataset();
  return <main id="main-content" className="page-shell page-shell--wide campus-dashboard"><MyCampusDashboard records={dataset.records} sampleStudents={sampleStudents} /></main>;
}
