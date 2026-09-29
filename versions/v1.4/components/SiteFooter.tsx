import Link from "next/link";
import Image from "next/image";
import { RESEARCH_DATE } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div>
          <Image src="/assets/brand/ingenium-horizontal-white.svg" alt="INGENIUM European University" width={219} height={87} />
          <p>A student-led discovery layer for one European campus.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/programmes">Programmes</Link>
          <Link href="/events">Events & mobility</Link>
          <Link href="/platforms">Official platforms</Link>
          <Link href="/research">Sources</Link>
          <Link href="/about">About INGENIUM+</Link>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <span>INGENIUM+ v1.4 · Research checked {RESEARCH_DATE}</span>
        <span>Official systems remain authoritative · No private student data</span>
        <span>Co-funded by the European Union</span>
      </div>
    </footer>
  );
}
