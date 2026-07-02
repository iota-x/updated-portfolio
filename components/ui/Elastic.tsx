"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

// elastic field: the element is softly pushed away as the cursor nears it
// and wobbles back on an underdamped spring — content floating in the same
// fluid as the smoke. complement to Magnetic (which attracts on contact).
const Elastic = ({
  children,
  className,
  radius = 200,
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  /** reach of the field beyond the element's edge, px */
  radius?: number;
  /** max displacement, px */
  strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // low damping = liquid wobble on release
  const sx = useSpring(x, { stiffness: 110, damping: 9, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 110, damping: 9, mass: 0.7 });

  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;

    let rect: DOMRect | null = null;
    const invalidate = () => {
      rect = null;
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = ref.current?.getBoundingClientRect() ?? null;
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = radius + Math.max(rect.width, rect.height) / 2;
      if (dist < reach) {
        const f = 1 - dist / reach;
        x.set((-dx / dist) * f * strength);
        y.set((-dy / dist) * f * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [radius, strength, reduced, x, y]);

  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy }}>
      {children}
    </motion.div>
  );
};

export default Elastic;
