"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    // exposed so overlays (e.g. project modal) can pause scrolling
    __lenis?: Lenis;
  }
}

// site-wide inertia scrolling; disabled entirely for reduced-motion users
const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      // intercept #anchor links so nav clicks glide instead of jumping
      anchors: { offset: -100 },
    });
    window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
