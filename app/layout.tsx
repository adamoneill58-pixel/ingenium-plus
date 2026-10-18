import { pilotWindow } from "@/lib/v2/window";
import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";
import "./v2.css";
import "./simulation.css";
import "./engagement.css";
import { SimulationProvider } from "@/components/v2/SimulationContext";
import { PilotContext } from "@/components/v2/PilotContext";
import { getRuntimeBindings } from "@/lib/v151/bindings";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "INGENIUM+ — Find your next connection",
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
    title: "INGENIUM+ — Find your next connection",
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
  const env=getRuntimeBindings();
  const pilotEnabled=pilotWindow(env).enabled;
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <PilotContext enabled={pilotEnabled}>
        <SimulationProvider>
        <SiteHeader />
        {children}
        <SiteFooter />
        </SimulationProvider>
        </PilotContext>
      </body>
    </html>
  );
}
