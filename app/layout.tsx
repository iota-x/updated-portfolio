import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import GrainOverlay from "@/components/ui/GrainOverlay";
import EntrySequence from "@/components/ui/EntrySequence";
import FluidTrail from "@/components/ui/FluidTrail";
import SoundToggle from "@/components/ui/SoundToggle";

const inter = Inter({ subsets: ["latin"] });

// display face for headlines — otherworldly grotesk, body copy stays Inter
const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const title = "Ankit Pandey — Full-stack & Web3 Developer";
const description =
  "I build software that feels alive — on-chain automation, web apps, and interfaces with atmosphere. Next.js, Solana, Three.js.";

export const metadata: Metadata = {
  // TODO: set NEXT_PUBLIC_SITE_URL (or hardcode) to the deployed domain
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title,
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Ankit Pandey",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@iota_xx",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
