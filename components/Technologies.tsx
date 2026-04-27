"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "./ui/Card";

interface TechItem {
  name: string;
  logo: string; // path
}

const techStack: TechItem[] = [
  { name: "React", logo: "/tech/react.svg" },
  { name: "Next.js", logo: "/tech/nextdotjs.svg" },
  { name: "Tailwind CSS", logo: "/tech/tailwindcss.svg" },
  { name: "Node.js", logo: "/tech/node.svg" },
  { name: "TypeScript", logo: "/tech/typescript.svg" },
  { name: "Github", logo: "/tech/git.svg" },
  { name: "Redux", logo: "/tech/redux.svg"},
  { name: "MongoDB", logo: "/tech/mongodb.svg"}, 
  { name: "three.js", logo: "/tech/threejs.svg"}, 
  { name: "Figma", logo: "/tech/figma.svg"}, 
  { name: "Docker", logo: "/tech/docker.svg"}, 
  { name: "PostgreSQL", logo: "/tech/postgresql.svg"}, 
  { name: "Rust", logo: "/tech/rust.svg"}, 
  { name: "Turborepo", logo: "/tech/turborepo.svg"}, 
  { name: "Solidity", logo: "/tech/solidity.svg"}, 
  { name: "web3.js", logo: "/tech/web3dotjs.svg"}, 
  { name: "Vercel", logo: "/tech/vercel.svg"},
  { name: "Kubernetes", logo: "/tech/kubernetes.svg"},
  { name: "Redis", logo: "/tech/redis.svg"},
  { name: "Kafka", logo: "/tech/kafka.svg"},


];

const Technologies: FC = () => {
  return (
    <section id="technologies" className="py-20">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 opacity-30 bg-gradient-to-tr from-purple-900 via-zinc-900 to-black blur-3xl" />

      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Technologies I{" "}
          <span className="text-purple">
            know
          </span>
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -6, scale: 1.05 }}
          >
            <Card className="group relative rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-purple-500/70 hover:shadow-[0_0_35px_-8px_rgba(216,112,249,0.7)] transition-all duration-500 overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="relative flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800/40 transition-all duration-500"
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]"
                  />
                </motion.div>

                {/* Name (Whitish Pink Gradient) */}
                <span
                    className="text-base font-semibold text-white-200 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
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
