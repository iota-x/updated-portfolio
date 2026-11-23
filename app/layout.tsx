import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { ThemeProvider } from "./provider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import GrainOverlay from "@/components/ui/GrainOverlay";
import EntrySequence from "@/components/ui/EntrySequence";
import FluidTrail from "@/components/ui/FluidTrail";
import SoundToggle from "@/components/ui/SoundToggle";

// Fonts are self-hosted (latin subsets of Inter and Syne, copied from next/font/google's own output) so a build
// never depends on fonts.googleapis.com: on 2026-11-23 Vercel's build failed inside the Google font loader
// ("Cannot read properties of null (reading '1')") with no code change to the fonts.
const inter = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", display: "swap" });

// display face for headlines — otherworldly grotesk, body copy stays Inter
const syne = localFont({
  src: "./fonts/syne-latin.woff2",
  weight: "600 800",
  display: "swap",
  variable: "--font-display",
});

const title = "Ankit Pandey — Full-stack & Web3 Developer";
const description =
  "I build software that feels alive — on-chain automation, web apps, and interfaces with atmosphere. Next.js, Solana, Three.js.";

// Static export can't read env at request time, so default to the live domain
// (override with NEXT_PUBLIC_SITE_URL at build). This is what makes og:image and
// canonical URLs resolve absolutely, so link previews render everywhere.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-eiota.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Ankit Pandey" },
  description,
  applicationName: "Ankit Pandey",
  keywords: [
    "Ankit Pandey",
    "full-stack developer",
    "web3 developer",
    "Solana developer",
    "Next.js",
    "TypeScript",
    "Three.js",
    "React",
    "blockchain",
    "smart contracts",
    "portfolio",
  ],
  authors: [{ name: "Ankit Pandey", url: siteUrl }],
  creator: "Ankit Pandey",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "Ankit Pandey",
    locale: "en_US",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Ankit Pandey — Full-stack & Web3 Developer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@iota_xx",
    images: ["/og.png"],
  },
};

// Person structured data for richer search results.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ankit Pandey",
  url: siteUrl,
  jobTitle: "Full-stack & Web3 Developer",
  description,
  knowsAbout: ["Next.js", "TypeScript", "Solana", "Web3", "Three.js", "React"],
  sameAs: [
    "https://github.com/iota-x",
    "https://x.com/iota_xx",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${syne.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>{children}</SmoothScroll>
          <FluidTrail />
          <CustomCursor />
          <GrainOverlay />
          <SoundToggle />
          <EntrySequence />
        </ThemeProvider>
      </body>
    </html>
  );
}
