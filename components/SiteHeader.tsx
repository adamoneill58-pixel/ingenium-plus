"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ModeSwitcher } from "./ModeSwitcher";
import { useSimulation } from "./v2/SimulationContext";
const links = [
  ["/explore", "Discover"],
  ["/learning", "Learn"],
  ["/community", "Community"],
  ["/calendar", "Calendar"],
  ["/my-campus", "My Campus"],
  ["/messages", "Messages"],
  ["/collaborate", "Collaborate"],
  ["/watch", "Watch"],
];
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const {state,persona}=useSimulation();
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
        <ModeSwitcher />
        <Link href={`/campus?mode=${state.mode}`} className="header-persona" aria-label={`Open ${persona.name}'s demo campus`}>
          <span>{persona.initials}</span><strong>{persona.firstName}<small>Demo campus <ArrowUpRight size={11}/></small></strong>
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
