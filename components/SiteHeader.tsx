"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const primaryLinks = [
  { href: "/", label: "Network" },
  { href: "/explore", label: "Explore" },
  { href: "/learning", label: "Learning" },
  { href: "/my-campus", label: "My Campus" },
];

const secondaryLinks = [
  { href: "/build", label: "Build & innovate" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/programmes", label: "Programmes" },
  { href: "/events", label: "Events & mobility" },
  { href: "/communities", label: "Communities" },
  { href: "/platforms", label: "Platforms" },
  { href: "/universities", label: "Universities" },
  { href: "/my-journey", label: "My journey" },
  { href: "/research", label: "Research & sources" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-lockup" href="/" aria-label="INGENIUM+ home">
          {/* The image is an unmodified official INGENIUM media-kit asset. */}
          <Image src="/assets/brand/ingenium-horizontal-colour.svg" alt="INGENIUM European University" width={219} height={87} priority />
          <span className="version-chip">PLUS · 1.5</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <Link key={link.href} className={active(link.href) ? "is-active" : ""} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <details className="more-menu">
            <summary>More</summary>
            <div className="more-menu__panel">
              {secondaryLinks.map((link) => (
                <Link key={link.href} className={active(link.href) ? "is-active" : ""} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {[...primaryLinks, ...secondaryLinks].map((link) => (
            <Link key={link.href} className={active(link.href) ? "is-active" : ""} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
