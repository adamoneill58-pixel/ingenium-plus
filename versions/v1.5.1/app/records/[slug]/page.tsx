import type { Metadata } from "next";
import { ArrowRight, BookOpen, CalendarDays, ExternalLink, GraduationCap, MapPin, Network, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { EntityCard } from "@/components/EntityCard";
import { GraphExplorer } from "@/components/GraphExplorer";
import { RecordActions } from "@/components/RecordActions";
import { StatusBadge } from "@/components/StatusBadge";
import { typeLabels } from "@/lib/data";
import { records, sampleChats, sampleStudents } from "@/lib/v15-data";
import { getComputedStatus, getNeighbours, getRelationshipsForEntity, getUniversitySubgraph } from "@/lib/v15-logic";
import { getRuntimeDataset } from "@/lib/v151/runtime-data";

export function generateStaticParams() {
  return records.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await getRuntimeDataset();
  const entity = dataset.records.find((record) => record.slug === slug);
  return entity ? { title: entity.title, description: entity.studentSummary } : {};
}

export default async function RecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dataset = await getRuntimeDataset();
  const recordById = new Map(dataset.records.map((record) => [record.id, record]));
  const evidenceById = new Map(dataset.sources.map((source) => [source.id, source]));
  const entity = dataset.records.find((record) => record.slug === slug);
  if (!entity) notFound();

  const relationships = getRelationshipsForEntity(entity.id, dataset.relationships);
  const neighbours = getNeighbours(entity.id, dataset.records, dataset.relationships).filter((item) => item.type !== "university").slice(0, 6);
  const sources = [...new Set([entity.sourceId, ...(entity.sourceIds ?? [])])].map((id) => evidenceById.get(id)).filter(Boolean);
  const chat = sampleChats.find((item) => item.entityId === entity.id);
  const people = sampleStudents.filter((student) => student.joinedEntityIds.includes(entity.id));
  const universityGraph = entity.type === "university" ? getUniversitySubgraph(entity.id, dataset.records).map((item) => item.id) : null;
  const host = entity.hostUniversityId ? recordById.get(entity.hostUniversityId) : undefined;

  return (
    <main id="main-content" className="record-page">
      <header className="record-hero">
        <div className="record-hero__breadcrumbs"><Link href="/explore">Explore</Link><span>/</span><span>{typeLabels[entity.type]}</span></div>
        <div className="record-hero__meta"><span>{entity.subtype ?? typeLabels[entity.type]}</span><StatusBadge status={getComputedStatus(entity)} /><ClassificationBadge classification={entity.dataClassification} /></div>
        <h1>{entity.title}</h1>
        <p>{entity.studentSummary}</p>
        <RecordActions entity={entity} />
        {entity.officialUrl && <a className="button button--primary" href={entity.officialUrl} target="_blank" rel="noreferrer">{entity.actionLabel ?? "Continue to official source"}<ExternalLink aria-hidden="true" /></a>}
      </header>

      <div className="record-layout">
        <article className="record-content">
          {entity.fullDescription && <section><span className="eyebrow">Overview</span><h2>What this is</h2><p>{entity.fullDescription}</p></section>}
          <section><span className="eyebrow">At a glance</span><h2>Key details</h2><dl className="record-facts">
            {host && <><dt><GraduationCap aria-hidden="true" />Host</dt><dd><Link href={`/records/${host.slug}`}>{host.title}</Link></dd></>}
            {entity.countries?.length && <><dt><MapPin aria-hidden="true" />Location</dt><dd>{entity.countries.join(", ")}{entity.city ? ` · ${entity.city}` : ""}</dd></>}
            {entity.dateLabel && <><dt><CalendarDays aria-hidden="true" />Dates</dt><dd>{entity.dateLabel}</dd></>}
            {entity.applicationDeadline && <><dt><CalendarDays aria-hidden="true" />Application deadline</dt><dd>{entity.applicationDeadline}</dd></>}
            {entity.ects && <><dt><BookOpen aria-hidden="true" />Credit</dt><dd>{entity.ects} ECTS</dd></>}
            {entity.academicLevel && <><dt>Level</dt><dd>{entity.academicLevel}</dd></>}
            {entity.deliveryMode && <><dt>Delivery</dt><dd>{entity.deliveryMode}</dd></>}
            {entity.language && <><dt>Language</dt><dd>{entity.language}</dd></>}
            {entity.eligibility && <><dt>Eligibility</dt><dd>{entity.eligibility}</dd></>}
            {entity.prerequisites?.length && <><dt>Prerequisites</dt><dd>{entity.prerequisites.join("; ")}</dd></>}
            {entity.assessment && <><dt>Assessment</dt><dd>{entity.assessment}</dd></>}
          </dl></section>
          {entity.learningOutcomes?.length ? <section><span className="eyebrow">Learning</span><h2>What you will learn</h2><ul>{entity.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></section> : null}
          <section className="why-section"><span className="eyebrow">Student context</span><h2>Why this matters</h2><p>{entity.whyItMatters ?? `This record makes ${entity.title} visible within the wider INGENIUM network, including its hosts, routes and related opportunities.`}</p></section>
          {relationships.length > 0 && <section><span className="eyebrow">Network evidence</span><h2><Network aria-hidden="true" />Connections</h2><div className="connection-list">{relationships.slice(0, 12).map((relationship) => {
            const otherId = relationship.source === entity.id ? relationship.target : relationship.source;
            const other = recordById.get(otherId);
            return other && <Link key={relationship.id} href={`/records/${other.slug}`}><span>{relationship.label}</span><strong>{other.title}</strong><small>{relationship.explanation}</small><ArrowRight aria-hidden="true" /></Link>;
          })}</div></section>}
          {people.length > 0 && <section><span className="eyebrow">Illustrative people layer</span><h2><Users aria-hidden="true" />People here</h2><p>These are fictional sample profiles, never real participant records.</p><div className="people-row">{people.map((student) => <Link key={student.id} href={`/records/${student.id}`}><strong>{student.displayName}</strong><span>{recordById.get(student.universityId)?.shortTitle} · Sample</span></Link>)}</div></section>}
          {chat && <section className="sample-chat"><span className="eyebrow">Read-only prototype</span><h2>{chat.title}</h2><p className="sample-warning">Sample conversation · no messages are sent and no real people are shown.</p>{chat.messages.map((message) => { const student = sampleStudents.find((item) => item.id === message.studentId); const shared = message.sharedRecordId ? recordById.get(message.sharedRecordId) : undefined; return <div className="chat-message" key={message.id}><strong>{student?.displayName ?? "Sample student"}</strong><p>{message.body}</p>{shared && <Link href={`/records/${shared.slug}`}><BookOpen aria-hidden="true" /><span><small>Shared record</small>{shared.title}</span></Link>}</div>; })}</section>}
          {entity.history?.length ? <section><span className="eyebrow">History</span><h2>Record history</h2><ol className="record-history">{entity.history.map((item) => <li key={`${item.label}-${item.date}`}><strong>{item.label}</strong>{item.date && <time>{item.date}</time>}{item.note && <p>{item.note}</p>}</li>)}</ol></section> : null}
        </article>

        <aside className="record-evidence">
          <ShieldCheck aria-hidden="true" />
          <span className="eyebrow">Evidence and freshness</span>
          <h2>Check the source</h2>
          <p><strong>{entity.confidence} confidence</strong> · record checked {entity.lastVerified}</p>
          {sources.map((source) => source && <div className="evidence-item" key={source.id}><strong>{source.title}</strong><span>{source.publisher ?? source.kind}</span>{source.verifiedAt && <small>Verified {source.verifiedAt}</small>}{source.notes && <p>{source.notes}</p>}{source.url && <a href={source.url} target="_blank" rel="noreferrer">Open official evidence <ExternalLink aria-hidden="true" /></a>}</div>)}
          <p className="privacy-note">Official systems remain authoritative. Status is calculated from explicit dates when available.</p>
        </aside>
      </div>

      {universityGraph && <section className="record-subgraph" aria-labelledby="university-network-title"><span className="eyebrow">University hub</span><h2 id="university-network-title">Explore this campus subnetwork</h2><GraphExplorer allowedEntityIds={universityGraph} initialMode="alliance" showJourneyPicker={false} entities={dataset.records} relationships={dataset.relationships} sources={dataset.sources} /></section>}
      {neighbours.length > 0 && <section className="related-records"><div className="section-heading"><div><span className="eyebrow">Continue exploring</span><h2>Related records</h2></div></div><div className="card-grid card-grid--three">{neighbours.map((item) => <EntityCard key={item.id} entity={item} compact />)}</div></section>}
    </main>
  );
}
