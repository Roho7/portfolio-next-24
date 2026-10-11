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
  title: {
    default: "Rohosen Bhattacharya | Full-Stack Developer & Designer",
    template: "%s | Rohosen Bhattacharya",
  },
  description:
    "Full-stack developer and designer crafting digital experiences that blend beautiful interfaces with powerful functionality.",
  keywords: [
    "Full-Stack Developer",
    "UI/UX Designer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Development",
  ],
  authors: [{ name: "Rohosen Bhattacharya" }],
  creator: "Rohosen Bhattacharya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://roho.live",
    title: "Rohosen Bhattacharya | Full-Stack Developer & Designer",
    description:
      "Full-stack developer and designer crafting digital experiences that blend beautiful interfaces with powerful functionality.",
    siteName: "Rohosen Bhattacharya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohosen Bhattacharya | Full-Stack Developer & Designer",
    description:
      "Full-stack developer and designer crafting digital experiences.",
    creator: "@Rohosen_",
  },
  robots: {
    index: true,
    follow: true,
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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CreepPeek peek={0.65} schedule={{ firstAfter: [5000, 10000], gap: [20000, 45000], stay: 3000, }} />
      </body>
    </html>
  );
}
