"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["/explore", "Discover"],
  ["/learning", "Learn"],
  ["/community", "Community"],
  ["/calendar", "Calendar"],
  ["/my-campus", "My Campus"],
  ["/collaborate", "Collaborate"],
];
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header campus-header">
      <div className="site-header__inner">
        <Link className="brand-lockup" href="/" aria-label="INGENIUM+ home">
          <Image
            src="/assets/brand/ingenium-horizontal-colour.svg"
            width={166}
            height={66}
            alt="INGENIUM European University"
            priority
          />
          <span className="plus-wordmark">PLUS</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={path.startsWith(href) ? "is-active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/explore" className="header-cta">
          Explore the campus <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-controls="campus-mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="campus-mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
