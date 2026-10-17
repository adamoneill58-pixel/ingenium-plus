import { notFound } from "next/navigation";
import { simSpaces } from "@/lib/v2/campus-simulation";
import { SimulationSpace } from "@/components/v2/SimulationSpace";
export default async function SpacePage({params,searchParams}:{params:Promise<{space:string}>;searchParams:Promise<{tab?:string}>}){const {space:id}=await params;const space=simSpaces.find((item)=>item.id===id);if(!space)notFound();const query=await searchParams;return <main id="main-content" className="campus-main inner-campus"><SimulationSpace space={space} initialTab={query.tab}/></main>;}
