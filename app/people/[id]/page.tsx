import { notFound } from "next/navigation";
import { personById } from "@/lib/v2/campus-simulation";
import { SimProfile } from "@/components/v2/SimProfile";
export default async function PersonPage({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!personById(id))notFound();return <main id="main-content" className="campus-main inner-campus"><SimProfile id={id}/></main>;}
