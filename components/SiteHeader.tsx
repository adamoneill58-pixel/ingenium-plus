"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Search, Globe, CalendarDays, CirclePlay } from "lucide-react";
import { ModeSwitcher } from "./ModeSwitcher";
import { useSimulation } from "./v2/SimulationContext";

const primaryLinks = [["/explore", "Discover"], ["/calendar", "Calendar"], ["/watch", "Watch"], ["/about", "About"]] as const;
const secondaryLinks = [["/learning", "Learning & degrees"], ["/universities", "The ten universities"], ["/build", "Projects & collaboration"], ["/community", "Community demo"], ["/messages", "Messages demo"], ["/campus?mode=staff", "Staff campus demo"]] as const;
const mobileLinks = [{ href: "/explore", label: "Discover", Icon: Search }, { href: "/universities", label: "Campuses", Icon: Globe }, { href: "/calendar", label: "Calendar", Icon: CalendarDays }, { href: "/watch", label: "Watch", Icon: CirclePlay }];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const { state, persona } = useSimulation();
  const inDemo = ["/campus", "/community", "/messages", "/learn/", "/collaborate"].some((prefix) => path.startsWith(prefix));
  return (
    <>
      <header className="site-header campus-header" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); menuRef.current?.focus(); } }}>
        <div className="site-header__inner">
          <Link className="brand-lockup" href="/" aria-label="INGENIUM+ home"><Image src="/assets/brand/ingenium-horizontal-colour.svg" width={166} height={66} alt="INGENIUM European University" priority /><span className="plus-wordmark">PLUS</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation">{primaryLinks.map(([href, label]) => <Link key={href} href={href} className={path.startsWith(href) ? "is-active" : ""} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}</nav>
          {inDemo ? <><ModeSwitcher /><Link href={`/campus?mode=${state.mode}`} className="header-persona" aria-label={`Open ${persona.name}'s demo campus`}><span>{persona.initials}</span><strong>{persona.firstName}<small>Demo campus <ArrowUpRight size={11} /></small></strong></Link></> : <Link className="public-header-demo" href="/campus?mode=student">Try the demo <ArrowUpRight size={14} /></Link>}
          <button ref={menuRef} className="menu-button" aria-expanded={open} aria-controls="campus-mobile-nav" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav id="campus-mobile-nav" className="mobile-nav" aria-label="Mobile navigation"><div>{primaryLinks.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</div><div className="mobile-nav-secondary">{secondaryLinks.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</div></nav>}
      </header>
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">{mobileLinks.map(({ href, label, Icon }) => <Link key={href} href={href} aria-current={path.startsWith(href) ? "page" : undefined}><Icon size={19} aria-hidden="true" /><span>{label}</span></Link>)}</nav>
    </>
  );
}
