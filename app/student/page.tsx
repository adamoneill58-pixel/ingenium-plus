import type { Metadata } from "next";
import { StudentPortal } from "@/components/StudentPortal";

export const metadata: Metadata = { title: "Student mode", description: "Persistent student profile, planning and explainable learning recommendations across INGENIUM." };

export default function StudentPage() {
  return <main id="main-content" className="page-shell page-shell--wide production-portal"><StudentPortal /></main>;
}
