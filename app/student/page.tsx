import Link from "next/link";
import { PAUSED_MESSAGE } from "@/lib/v2/features";
export default function StudentPage(){return <main id="main-content" className="campus-main inner-campus"><h1>Personal accounts are paused.</h1><p>{PAUSED_MESSAGE}</p><Link href="/my-campus" className="button button--primary">Use the temporary My Campus workspace</Link></main>;}
