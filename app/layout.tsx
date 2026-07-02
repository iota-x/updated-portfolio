import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import GrainOverlay from "@/components/ui/GrainOverlay";
import EntrySequence from "@/components/ui/EntrySequence";
import FluidTrail from "@/components/ui/FluidTrail";

const inter = Inter({ subsets: ["latin"] });

// display face for headlines — otherworldly grotesk, body copy stays Inter
const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Ankit's Portfolio",
  description: "A portfolio website for showcasing my projects and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/jsm-logo.png" sizes="any" />
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
          <EntrySequence />
        </ThemeProvider>
      </body>
    </html>
  );
}
