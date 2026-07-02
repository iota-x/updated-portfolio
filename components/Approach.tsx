"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";
import WordReveal from "./ui/WordReveal";
import Elastic from "./ui/Elastic";

const phases = [
  {
    order: "Phase 1",
    title: "Planning & Strategy",
    des: "We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements.",
    colors: [[203, 172, 249]],
    speed: 5.1,
  },
  {
    order: "Phase 2",
    title: "Development & Progress Update",
    des: "Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way.",
    colors: [
      [167, 139, 250],
      [221, 214, 254],
    ],
    speed: 3,
  },
  {
    order: "Phase 3",
    title: "Launch",
    des: "This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up.",
    colors: [[139, 92, 246]],
    speed: 3,
  },
];

// scroll-driven phases: the stage pins for 3 viewport-heights and the active
// phase crossfades (copy + dot-matrix canvas) as you scroll through.
// mobile and reduced-motion users get the phases stacked in plain flow.
const Approach = () => {
  const reduced = useReducedMotion();

  return (
    <section id="approach" className="w-full py-20">
      <Elastic strength={12}>
        <WordReveal
          words="How ideas become real"
          accent="real"
          className="heading"
        />
      </Elastic>

      {reduced ? (
        <StaticPhases />
      ) : (
        <>
          <div className="md:hidden">
            <StaticPhases />
          </div>
          <div className="hidden md:block">
            <PinnedPhases />
          </div>
        </>
      )}
    </section>
  );
};

export default Approach;

const PinnedPhases = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(
      Math.max(0, Math.min(phases.length - 1, Math.floor(v * phases.length)))
    );
  });

  const phase = phases[active];

  return (
    <div ref={ref} className="relative mt-10 h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="glass-panel relative h-[62vh] w-full max-w-4xl overflow-hidden !rounded-[1.5rem]">
          {/* dot-matrix light field, retinted per phase */}
          <AnimatePresence>
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <CanvasRevealEffect
                animationSpeed={phase.speed}
                containerClassName="bg-[#0b0812]"
                colors={phase.colors}
                dotSize={2}
              />
            </motion.div>
          </AnimatePresence>

          {/* darken toward the edges so the copy stays legible */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(8,8,9,0.3), rgba(8,8,9,0.88))",
            }}
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-w-2xl flex-col items-center"
              >
                <span className="glass-panel !rounded-full px-5 py-2 text-xl font-bold text-purple">
                  {phase.order}
                </span>
                <h2 className="mt-6 font-display text-3xl font-bold text-white lg:text-4xl">
                  {phase.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white-100 lg:text-lg">
                  {phase.des}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* progress rail — each segment fills as its phase scrolls by */}
            <div className="absolute bottom-8 flex items-center gap-2">
              {phases.map((p, i) => (
                <RailSegment
                  key={p.order}
                  progress={scrollYProgress}
                  index={i}
                  total={phases.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RailSegment = ({
  progress,
  index,
  total,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
}) => {
  const seg = 1 / total;
  const width = useTransform(
    progress,
    [index * seg, (index + 1) * seg],
    ["0%", "100%"]
  );

  return (
    <div className="h-1 w-14 overflow-hidden rounded-full bg-white/10">
      <motion.div style={{ width }} className="h-full bg-purple/80" />
    </div>
  );
};

// plain-flow fallback: same copy, glass cards, gentle opacity reveal only
const StaticPhases = () => {
  return (
    <div className="mt-14 flex flex-col items-center gap-6">
      {phases.map((phase) => (
        <motion.div
          key={phase.order}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="glass-panel w-full max-w-2xl p-8 text-center"
        >
          <span className="glass-panel inline-block !rounded-full px-4 py-1.5 text-base font-bold text-purple">
            {phase.order}
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">
            {phase.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white-100 sm:text-base">
            {phase.des}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
