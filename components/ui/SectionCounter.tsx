"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEntered } from "./EntrySequence";

const SECTIONS = [
  "home",
  "about",
  "projects",
  "technologies",
  "approach",
  "contact",
];

// fixed edge UI: current section index + a thin scroll-progress track.
// desktop only; appears after the entry curtain lifts.
const SectionCounter = () => {
  const entered = useEntered();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = SECTIONS.indexOf(e.target.id);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, x: 16 }}
      animate={entered ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-7 top-1/2 z-[50] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <span className="font-display text-sm font-bold text-purple">
        {String(active + 1).padStart(2, "0")}
      </span>
      <div className="relative h-28 w-px overflow-hidden bg-white/10">
        <motion.div
          style={{ scaleY: fill }}
          className="absolute inset-0 origin-top bg-purple/70"
        />
      </div>
      <span className="font-display text-sm font-bold text-white/25">
        {String(SECTIONS.length).padStart(2, "0")}
      </span>
    </motion.div>
  );
};

export default SectionCounter;
