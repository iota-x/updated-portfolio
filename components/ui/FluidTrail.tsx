"use client";

import { useEffect, useRef } from "react";
import type WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { useQualityTier } from "@/lib/quality";

// real Navier-Stokes fluid simulation: the cursor drags violet smoke across
// the whole page. desktop fine-pointer only; reduced-motion users skip it;
// low-tier machines never mount it. auto-pauses after 3s of cursor idle.
const FluidTrail = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useQualityTier();

  useEffect(() => {
    if (tier === "low") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const el = ref.current;
    if (!fine || reduced || !el) return;

    let sim: WebGLFluidEnhanced | null = null;
    let disposed = false;
    let paused = false;
    let lastMove = performance.now();

    const onMove = (e: PointerEvent) => {
      lastMove = performance.now();
      if (!sim) return;
      if (paused) {
        sim.togglePause();
        paused = false;
      }
      // velocity-scaled dye injection; skip micro-movements
      const dx = e.movementX * 6;
      const dy = e.movementY * 6;
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      // quirk: the lib divides x by the device-pixel buffer width but y by
      // CSS height — so x must be scaled up by the pixel ratio
      const canvas = el.querySelector("canvas");
      const scaleX =
        canvas && canvas.clientWidth > 0
          ? canvas.width / canvas.clientWidth
          : 1;
      sim.splatAtLocation(e.clientX * scaleX, e.clientY, dx, dy);
    };

    // stop stepping the sim once the smoke has fully dissolved
    const idleCheck = setInterval(() => {
      if (!sim || paused) return;
      if (performance.now() - lastMove > 3000) {
        sim.togglePause();
        paused = true;
      }
    }, 1000);

    // dynamic import keeps the sim out of the critical bundle
    import("webgl-fluid-enhanced").then(({ default: Fluid }) => {
      if (disposed) return;
      sim = new Fluid(el);
      sim.setConfig({
        transparent: true,
        hover: false, // canvas is pointer-events:none; we drive splats manually
        colorful: false,
        colorPalette: ["#7c3aed", "#a78bfa", "#5b21b6", "#c4b5fd"],
        brightness: 0.25,
        densityDissipation: 4, // dye fades fast
        velocityDissipation: 0.6, // motion settles instead of flooding the screen
        splatRadius: 0.13,
        splatForce: 4500,
        curl: 32, // swirly, but contained
        bloom: false, // the palette is bright enough; skip the extra passes
        sunrays: false,
        simResolution: tier === "high" ? 128 : 96,
        dyeResolution: tier === "high" ? 768 : 512,
      });
      sim.start();
      window.addEventListener("pointermove", onMove, { passive: true });
    });

    return () => {
      disposed = true;
      clearInterval(idleCheck);
      window.removeEventListener("pointermove", onMove);
      sim?.stop();
    };
  }, [tier]);

  if (tier === "low") return null;

  // the lib force-overwrites its container's position to `relative`, so the
  // fixed positioning lives on an outer wrapper it never touches
  return (
    <div
      aria-hidden
      className="fluid-layer pointer-events-none fixed inset-0 z-[5]"
    >
      <div ref={ref} className="h-full w-full" />
    </div>
  );
};

export default FluidTrail;
