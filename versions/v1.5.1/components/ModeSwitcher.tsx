"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ModeSwitcher() {
  const pathname = usePathname();
  const staff = pathname.startsWith("/staff");
  function remember(mode: "student" | "staff") {
    void fetch("/api/v151/session", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode }),
      keepalive: true,
    });
  }
  return (
    <div className="mode-switcher" aria-label="Platform mode">
      <Link className={!staff ? "is-active" : ""} href="/student" aria-current={!staff ? "page" : undefined} onClick={() => remember("student")}>Student</Link>
      <Link className={staff ? "is-active" : ""} href="/staff" aria-current={staff ? "page" : undefined} onClick={() => remember("staff")}>Staff</Link>
    </div>
  );
}
