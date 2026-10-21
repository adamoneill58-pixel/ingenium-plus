"use client";
import Link from "next/link";
import { useSimulation, SimulationNotice } from "./SimulationContext";
import { simSpaces } from "@/lib/v2/campus-simulation";
export function StaffCollaboration(){const {state}=useSimulation();return <section><SimulationNotice/><header className="sim-section-heading"><div><span className="eyebrow">PAUL’S STAFF EQUIVALENTS</span><h2>Give every collaboration a working space.</h2><p>Explore teaching co-design, delivery coordination and a proposed cross-alliance research project.</p></div></header><div className="personal-space-grid">{simSpaces.filter((space)=>space.mode==="staff").map((space)=><Link key={space.id} href={`/campus/${space.id}?mode=staff`} className={`personal-space-card personal-space-card--${space.cover}`}><span className="sim-label">Synthetic staff collaboration</span><h3>{space.title}</h3><p>{space.subtitle}</p><strong>{state.mode==="staff"?"Continue with Paul":"Enter Paul’s staff demo"} →</strong></Link>)}</div></section>;}
