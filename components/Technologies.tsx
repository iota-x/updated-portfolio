"use client";

import { CSSProperties, FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/Card";

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

const Technologies: FC = () => {
  return (
    <section id="technologies" className="py-20">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 opacity-30 bg-gradient-to-tr from-purple-900 via-zinc-900 to-black blur-3xl" />

      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Technologies I <span className="text-purple">know</span>
        </h2>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          A curated collection of tools, frameworks, and languages I use to
          build production-ready applications.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            // expose the brand color to the whole card via a CSS variable
            style={{ ["--tc" as string]: tech.color } as CSSProperties}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.05 }}
          >
            <Card className="group relative h-full rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-[var(--tc)] hover:shadow-[0_0_45px_-10px_var(--tc)] transition-all duration-500 overflow-hidden">
              {/* soft brand wash that fades in on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(120px 120px at 50% 35%, color-mix(in srgb, var(--tc) 22%, transparent), transparent 70%)",
                }}
              />

              <CardContent className="relative flex flex-col items-center justify-center p-8 space-y-4">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  className="relative flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800/40 ring-1 ring-white/5 transition-all duration-500 group-hover:ring-[color:var(--tc)]/40"
                >
                  {/* colored halo behind the icon */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ backgroundColor: "var(--tc)" }}
                  />
                  {/* the icon: white by default, brand color on hover (CSS mask fill) */}
                  <span
                    aria-hidden
                    style={maskStyle(tech.logo)}
                    className="relative block w-11 h-11 bg-white transition-colors duration-500 group-hover:bg-[var(--tc)]"
                  />
                </motion.div>

                {/* Name — always visible, brightens on hover */}
                <span className="text-base font-semibold text-zinc-400 group-hover:text-white transition-colors duration-500">
                  {tech.name}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Technologies;
