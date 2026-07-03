// runtime adaptive quality: samples real FPS after load and steps the
// visual tier down on machines that can't hold the frame rate. consumers
// (scene, fluid, grain) subscribe and lighten themselves accordingly.

import { useEffect, useState } from "react";

export type Tier = "high" | "medium" | "low";

let tier: Tier = "high";
let started = false;
const listeners = new Set<(t: Tier) => void>();

export const getTier = () => tier;

const setTier = (t: Tier) => {
  if (t === tier) return;
  tier = t;
  try {
    sessionStorage.setItem("perf-tier", t);
  } catch {}
  listeners.forEach((cb) => cb(t));
};

const order: Tier[] = ["high", "medium", "low"];
const worst = (a: Tier, b: Tier) =>
  order[Math.max(order.indexOf(a), order.indexOf(b))];

export const startQualityWatch = () => {
  if (started || typeof window === "undefined") return;
  started = true;

  // remembered from earlier in this session — skip re-measuring the drop
  try {
    const saved = sessionStorage.getItem("perf-tier") as Tier | null;
    if (saved && order.includes(saved)) {
      setTier(saved);
      if (saved === "low") return;
    }
  } catch {}

  // cheap device heuristic before any measurement
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem =
    (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
  if (cores <= 4 || mem <= 4) setTier(worst(tier, "medium"));

  // sample FPS in 2s windows once the entry sequence has settled
  let frames = 0;
  let windowStart = 0;
  let checks = 0;

  const loop = (now: number) => {
    if (windowStart === 0) windowStart = now;
    frames++;
    const elapsed = now - windowStart;
    if (elapsed >= 2000) {
      const fps = (frames / elapsed) * 1000;
      checks++;
      if (fps < 32) setTier("low");
      else if (fps < 50) setTier(worst(tier, "medium"));
      frames = 0;
      windowStart = now;
      // stop once settled or fully degraded
      if (checks >= 3 || tier === "low") return;
    }
    requestAnimationFrame(loop);
  };
  setTimeout(() => requestAnimationFrame(loop), 3500);
};

export const useQualityTier = () => {
  const [t, setT] = useState<Tier>(tier);
  useEffect(() => {
    startQualityWatch();
    setT(getTier());
    const cb = (next: Tier) => setT(next);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return t;
};
