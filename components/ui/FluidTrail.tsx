"use client";

import { useEffect, useRef } from "react";
import type WebGLFluidEnhanced from "webgl-fluid-enhanced";

// real Navier-Stokes fluid simulation: the cursor drags violet smoke across
// the whole page. desktop fine-pointer only; reduced-motion users skip it.
const FluidTrail = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const el = ref.current;
    if (!fine || reduced || !el) return;

    let sim: WebGLFluidEnhanced | null = null;
    let disposed = false;

    const onMove = (e: PointerEvent) => {
      if (!sim) return;
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
        bloom: true,
        bloomIntensity: 0.45,
        bloomThreshold: 0.5,
        sunrays: false,
        simResolution: 128,
        dyeResolution: 1024,
      });
      sim.start();
      window.addEventListener("pointermove", onMove, { passive: true });
    });

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onMove);
      sim?.stop();
    };
  }, []);

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
