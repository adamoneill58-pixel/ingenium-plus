import type { Metadata } from "next";
import Link from "next/link";
import { ReviewQueue } from "@/components/ReviewQueue";

export const metadata: Metadata = { title: "Review queue" };
export default function ReviewPage() { return <main id="main-content" className="page-shell page-shell--wide production-portal"><section className="portal-page-heading"><div><span className="eyebrow">Staff mode · governance</span><h1>Review before publication</h1><p>Every submitted call, module and automated source change needs an accountable human decision.</p></div><Link className="button button--secondary" href="/staff">Back to Staff mode</Link></section><ReviewQueue /></main>; }
