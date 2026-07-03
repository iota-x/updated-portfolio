"use client";

import { useQualityTier } from "@/lib/quality";

// full-page film grain (mix-blend overlay, styled in globals.css).
// blend-mode compositing over live canvases is costly, so low-tier
// machines skip it entirely.
const GrainOverlay = () => {
  const tier = useQualityTier();
  if (tier === "low") return null;
  return <div aria-hidden className="grain-overlay" />;
};

export default GrainOverlay;
