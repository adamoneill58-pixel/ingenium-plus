import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import type { Entity } from "@/lib/data";
import { typeLabels } from "@/lib/labels";
import { demoCourseSpaces } from "@/lib/v2/demo-community";

export function LearningHub({ records }: { records: Entity[] }) {
  const featured = records
    .filter((record) => record.type !== "university")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6);
  return (
    <>
      <section className="learning-dashboard" aria-labelledby="learning-spaces-title">
        <header>
          <div>
            <span className="eyebrow">CANVAS-INSPIRED PROTOTYPE</span>
            <h2 id="learning-spaces-title">Your learning spaces</h2>
            <p>
              Sample course shells demonstrate modules, tasks, progress and
              discussion. The opportunity facts they reference remain on the
              source-backed record pages.
            </p>
          </div>
          <div className="learning-stat"><strong>{records.length}</strong><span>real learning records to explore</span></div>
        </header>
        <div className="demo-boundary" role="note">
          <div><strong>Demo learning spaces · no enrolment, grades or Canvas data.</strong><p>These screens use synthetic activity around real catalogue records. Progress is local to this page and resets on refresh.</p></div>
        </div>
        <div className="course-space-grid">
          {demoCourseSpaces.map((space) => (
            <Link href={`/learn/${space.slug}`} className={`course-space-card course-space-card--${space.accent}`} key={space.id}>
              <div className="course-space-colour" />
              <div><span className="demo-content-label">DEMO SPACE</span><BookOpen size={22} /><h3>{space.title}</h3><p>{space.subtitle}</p><span>{space.campus}</span><div className="progress-track"><i style={{ width: `${space.progress}%` }} /></div><small>{space.progress}% sample progress</small></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="learning-catalogue">
        <header><div><span className="eyebrow">REAL CATALOGUE</span><h2>Find something worth learning.</h2></div><Link href="/explore?type=course&view=list">Browse every learning record <ArrowUpRight size={15} /></Link></header>
        <div className="learning-record-grid">
          {featured.map((record) => (
            <article key={record.id}>
              <div><span>{typeLabels[record.type]}</span><span>{record.ects ? `${record.ects} ECTS` : "Check credit"}</span></div>
              <h3><Link href={`/records/${record.slug}`}>{record.title}</Link></h3>
              <p>{record.studentSummary}</p>
              <footer><span><Clock3 size={13} />{record.deliveryMode ?? "Delivery on official page"}</span><Link href={`/records/${record.slug}`}>Check evidence <ArrowUpRight size={14} /></Link></footer>
            </article>
          ))}
        </div>
        <p className="learning-boundary"><CheckCircle2 size={15} />Course availability, enrolment, assessment and credit recognition must be confirmed with the responsible university.</p>
      </section>
    </>
  );
}
