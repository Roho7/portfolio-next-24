import type { Metadata } from "next";
import {
  Space_Grotesk,
  DM_Sans,
  JetBrains_Mono,
  Bricolage_Grotesque,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CreepPeek } from "@/components/ui/creep-peek";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/lib/profile";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const heroFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
});

const serifFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s | Rohosen Bhattacharya",
  },
  description: site.description,
  keywords: [
    "Rohosen Bhattacharya",
    "Roho",
    "Full-Stack Developer",
    "Senior Full-Stack Engineer",
    "UI/UX Designer",
    "Human-Computer Interaction",
    "Payments Engineer",
    "AI Agents",
    "React",
    "Next.js",
    "TypeScript",
    "NestJS",
    "Web Development",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/llms.txt" },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} ${heroFont.variable} ${serifFont.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CreepPeek peek={0.65} schedule={{ firstAfter: [5000, 10000], gap: [20000, 45000], stay: 3000, }} />
      </body>
    </html>
  );
}
