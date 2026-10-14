import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://ingenium-plus.pages.dev"),
  title: {
    default: "INGENIUM+ v1.5.1 — Find your path through one European campus",
    template: "%s — INGENIUM+",
  },
  description:
    "A student-first discovery layer for programmes, mobility, projects, communities and opportunities across the ten universities of INGENIUM.",
  applicationName: "INGENIUM+",
  icons: {
    icon: "/assets/brand/ingenium-main-colour.svg",
    shortcut: "/assets/brand/ingenium-main-colour.svg",
  },
  openGraph: {
    title: "INGENIUM+ v1.5.1 — Find your path through one European campus",
    description:
      "Explore verified programmes, mobility, projects, communities and student opportunities across INGENIUM.",
    type: "website",
    images: [
      {
        url: "/assets/og-network.png",
        width: 1672,
        height: 941,
        alt: "An abstract network of ten connected campus anchors in INGENIUM colours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INGENIUM+ — Find your path through one European campus",
    description: "Explore verified programmes, mobility, projects and student opportunities across INGENIUM.",
    images: ["/assets/og-network.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
