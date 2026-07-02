"use client";

import { CSSProperties, FC } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import WordReveal from "./ui/WordReveal";

interface TechItem {
  name: string;
  logo: string; // path
  color: string; // brand accent used for hover fill + glow
}

const techStack: TechItem[] = [
  { name: "React", logo: "/tech/react.svg", color: "#61DAFB" },
  { name: "Next.js", logo: "/tech/nextdotjs.svg", color: "#FFFFFF" },
  { name: "Tailwind CSS", logo: "/tech/tailwindcss.svg", color: "#38BDF8" },
  { name: "Node.js", logo: "/tech/node.svg", color: "#5FA04E" },
  { name: "TypeScript", logo: "/tech/typescript.svg", color: "#3178C6" },
  { name: "Github", logo: "/tech/git.svg", color: "#F05032" },
  { name: "Redux", logo: "/tech/redux.svg", color: "#A855F7" },
  { name: "MongoDB", logo: "/tech/mongodb.svg", color: "#47A248" },
  { name: "three.js", logo: "/tech/threejs.svg", color: "#FFFFFF" },
  { name: "Figma", logo: "/tech/figma.svg", color: "#F24E1E" },
  { name: "Docker", logo: "/tech/docker.svg", color: "#2496ED" },
  { name: "PostgreSQL", logo: "/tech/postgresql.svg", color: "#4169E1" },
  { name: "Rust", logo: "/tech/rust.svg", color: "#DEA584" },
  { name: "Turborepo", logo: "/tech/turborepo.svg", color: "#EF4444" },
  { name: "Solidity", logo: "/tech/solidity.svg", color: "#A5A5A5" },
  { name: "web3.js", logo: "/tech/web3dotjs.svg", color: "#F16822" },
  { name: "Vercel", logo: "/tech/vercel.svg", color: "#FFFFFF" },
  { name: "Kubernetes", logo: "/tech/kubernetes.svg", color: "#326CE5" },
  { name: "Redis", logo: "/tech/redis.svg", color: "#FF4438" },
  { name: "Kafka", logo: "/tech/kafka.svg", color: "#FFFFFF" },
];

const maskStyle = (logo: string): CSSProperties => ({
  maskImage: `url(${logo})`,
  WebkitMaskImage: `url(${logo})`,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
});

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.85, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// a drifting constellation of glass chips: staggered reveal on scroll, then
// each chip floats on its own slow cycle; brand color blooms on hover
const Technologies: FC = () => {
  const reduced = useReducedMotion();

  return (
    <section id="technologies" className="relative py-20">
      {/* violet atmosphere behind the field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(88, 28, 135, 0.15), transparent 70%)",
        }}
      />

      <div className="mb-16 text-center">
        <WordReveal
          words="Technologies I know"
          accent="know"
          className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-2xl text-lg text-gray-400"
        >
          A curated collection of tools, frameworks, and languages I use to
          build production-ready applications.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        {techStack.map((tech, i) => (
          <motion.div
            key={tech.name}
            variants={item}
            style={{ ["--tc" as string]: tech.color } as CSSProperties}
          >
            <motion.div
              animate={
                reduced ? undefined : { y: [0, -(6 + (i % 4) * 2.5), 0] }
              }
              transition={{
                duration: 4.5 + (i % 5) * 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 7) * 0.45,
              }}
              data-cursor="hover"
              className="glass-panel group flex items-center gap-2.5 !rounded-full px-4 py-2.5
                transition-shadow duration-500 hover:shadow-[0_0_32px_-6px_var(--tc)]"
            >
              {/* icon: white by default, brand color on hover (CSS mask fill) */}
              <span
                aria-hidden
                style={maskStyle(tech.logo)}
                className="block h-5 w-5 bg-white/80 transition-colors duration-500 group-hover:bg-[var(--tc)]"
              />
              <span className="text-sm font-medium text-zinc-400 transition-colors duration-500 group-hover:text-white">
                {tech.name}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Technologies;
