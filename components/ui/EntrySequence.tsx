"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// module-level store so the scene + hero can sync to the curtain lift
let enteredGlobal = false;
const listeners = new Set<() => void>();

export const isEntered = () => enteredGlobal;

const markEntered = () => {
  if (enteredGlobal) return;
  enteredGlobal = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
};

// components (hero copy, blob) gate their intro animations on this
export const useEntered = () => {
  const [entered, setEntered] = useState(enteredGlobal);
  useEffect(() => {
    if (enteredGlobal) {
      setEntered(true);
      return;
    }
    const cb = () => setEntered(true);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return entered;
};

const DURATION = 1500;

// entry curtain: counter runs 0 -> 100, then the black curtain clips upward
// into the hero. reduced-motion users skip it entirely.
const EntrySequence = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    // hot-reload / re-mount after already entering
    if (enteredGlobal) {
      setDone(true);
      setSkip(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markEntered();
      setDone(true);
      setSkip(true);
      return;
    }
    setSkip(false);

    // lock scrolling while the curtain is down
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    const stopLenis = setTimeout(() => window.__lenis?.stop(), 0);

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        markEntered();
        document.documentElement.style.overflow = "";
        window.__lenis?.start();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stopLenis);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (skip) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9500] flex flex-col items-center justify-center bg-[#080809]"
        >
          <span className="font-display text-6xl font-bold text-white md:text-7xl">
            {progress}
            <span className="text-purple">%</span>
          </span>
          <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
            <div
              className="h-full bg-purple/80"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntrySequence;
