"use client";

import { motion, type Variants } from "framer-motion";
import { contributions, maintained } from "@/data";
import WordReveal from "./ui/WordReveal";
import Elastic from "./ui/Elastic";

const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

// merged upstream work first (the part reviewed to someone else's standard),
// then the projects I keep open myself
const OpenSource = () => (
  <section id="open-source" className="relative py-20">
    <Elastic strength={12}>
      <WordReveal words="Merged upstream" accent="upstream" className="heading" />
    </Elastic>
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-400"
    >
      Code in projects other people depend on, reviewed to someone else&apos;s standard.
    </motion.p>

    <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-5">
      {contributions.map((c, i) => (
        <motion.a
          key={c.link}
          href={c.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          custom={i}
          variants={rise}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="glass-panel group block p-6 transition-shadow duration-500 hover:shadow-[0_0_40px_-10px_#8957e5] md:p-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8957e5] px-3 py-1 text-xs font-semibold text-white">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
              </svg>
              Merged · {c.merged}
            </span>
            <span className="text-sm text-zinc-400">
              <span className="font-semibold text-white">{c.project}</span> by {c.org} — {c.blurb}
            </span>
          </div>

          <h3 className="mt-4 font-display text-xl font-bold text-white md:text-2xl">{c.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">{c.des}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-mono text-purple">{c.pr}</span>
            <span className="font-mono">
              <span className="text-emerald-400">{c.diff.split(" ")[0]}</span>{" "}
              <span className="text-rose-400">{c.diff.split(" ")[1]}</span>
            </span>
            <span className="flex gap-2">
              {c.tech.map((t) => (
                <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400">
                  {t}
                </span>
              ))}
            </span>
            <span className="ml-auto text-zinc-500 transition-colors group-hover:text-white">View PR ↗</span>
          </div>
        </motion.a>
      ))}

      <motion.div
        variants={rise}
        custom={contributions.length}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <span className="text-sm uppercase tracking-wide text-zinc-500 sm:mr-2">I also maintain</span>
        {maintained.map((m) => (
          <a
            key={m.name}
            href={m.link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="glass-panel flex items-center gap-2 !rounded-full px-4 py-2 text-sm transition-colors hover:text-white"
          >
            <span className="font-semibold text-white">{m.name}</span>
            <span className="text-zinc-400">{m.des}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300">{m.license}</span>
          </a>
        ))}
      </motion.div>
    </div>
  </section>
);

export default OpenSource;
