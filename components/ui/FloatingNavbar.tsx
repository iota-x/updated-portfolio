"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";
import { useEntered } from "./EntrySequence";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const entered = useEntered();

  // visible in the hero; hides on scroll down, returns on scroll up
  const [visible, setVisible] = useState(true);
  // sliding hover pill + scrollspy state
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  // scrollspy: light up the link of the section currently in view
  useEffect(() => {
    const sections = navItems
      .map((n) => n.link)
      .filter((l) => l.startsWith("#"))
      .map((l) => document.getElementById(l.slice(1)))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navItems]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: entered && visible ? 0 : -100,
        opacity: entered && visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        // glass pill with a violet gradient hairline, matches the glass-panel language
        "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-4 py-2.5 rounded-full items-center justify-center space-x-1 shadow-[0_8px_32px_rgba(8,8,9,0.6)]",
        className
      )}
      style={{
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        backgroundColor: "rgba(12, 9, 18, 0.55)",
        border: "1px solid rgba(203, 172, 249, 0.14)",
      }}
    >
      {navItems.map((navItem: any, idx: number) => {
        const isActive = active === navItem.link;
        return (
          <Magnetic key={`link=${idx}`} strength={0.3}>
            <Link
              href={navItem.link}
              onMouseEnter={() => setHovered(idx)}
              className={cn(
                "relative flex items-center space-x-1 rounded-full px-4 py-2 transition-colors duration-300",
                isActive ? "text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              {/* sliding hover pill (shared layout between links) */}
              {hovered === idx && (
                <motion.span
                  layoutId="nav-hover"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-white/[0.07]"
                />
              )}
              {/* glowing dot under the section currently in view */}
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple shadow-[0_0_10px_2px_rgba(203,172,249,0.8)]"
                />
              )}
              <span className="relative z-10 block sm:hidden">
                {navItem.icon}
              </span>
              <span className="relative z-10 text-sm">{navItem.name}</span>
            </Link>
          </Magnetic>
        );
      })}
    </motion.div>
  );
};
