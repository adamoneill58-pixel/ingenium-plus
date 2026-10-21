import Link from "next/link";
import { PAUSED_MESSAGE } from "@/lib/v2/features";
export default function StaffPage(){return <main id="main-content" className="campus-main inner-campus"><h1>Staff accounts are paused.</h1><p>{PAUSED_MESSAGE}</p><Link href="/collaborate" className="button button--primary">Explore the fictional collaboration demonstration</Link></main>;}
