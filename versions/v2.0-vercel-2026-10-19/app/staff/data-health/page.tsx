import type { Metadata } from "next";
import Link from "next/link";
import { DataHealthDashboard } from "@/components/DataHealthDashboard";

export const metadata: Metadata = { title: "Data health" };
export default function DataHealthPage() { return <main id="main-content" className="page-shell page-shell--wide production-portal"><section className="portal-page-heading"><div><span className="eyebrow">Staff mode · operations</span><h1>Data health and refresh</h1><p>Inspect coverage, pending review, upload state, refresh evidence and recommendation activity.</p></div><Link className="button button--secondary" href="/staff">Back to Staff mode</Link></section><DataHealthDashboard /></main>; }
