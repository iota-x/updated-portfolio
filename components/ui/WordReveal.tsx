"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// headline reveal: each word clips up from a masked line, staggered
const WordReveal = ({
  words,
  className,
  delay = 0,
  accent,
  active,
}: {
  words: string;
  className?: string;
  delay?: number;
  /** substring of `words` rendered in the accent color */
  accent?: string;
  /** when provided, plays on `true` instead of on scroll into view */
  active?: boolean;
}) => {
  const reduced = useReducedMotion();
  const accentSet = new Set(accent?.split(" ") ?? []);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  };

  const word: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
      }
    : {
        hidden: { y: "115%", clipPath: "inset(0 0 100% 0)" },
        visible: {
          y: "0%",
          clipPath: "inset(-20% -10% -20% -10%)",
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.h1
      aria-label={words}
      className={cn("font-display font-bold leading-[1.15]", className)}
      variants={container}
      initial="hidden"
      {...(active === undefined
        ? {
            whileInView: "visible" as const,
            viewport: { once: true, margin: "-80px" },
          }
        : { animate: active ? ("visible" as const) : ("hidden" as const) })}
    >
      {words.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] last:mr-0"
        >
          <motion.span
            variants={word}
            className={cn(
              "inline-block will-change-transform",
              accentSet.has(w) && "text-purple"
            )}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
};

export default WordReveal;
