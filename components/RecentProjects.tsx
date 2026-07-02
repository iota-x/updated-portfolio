"use client";

import { useEffect, useRef, useState } from "react";
import { FaLocationArrow, FaGithub } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { projects } from "@/data";
import { cn } from "@/lib/utils";
import WordReveal from "./ui/WordReveal";

type Project = (typeof projects)[number];

// maps each tech icon to its display name
const TECH_NAMES: Record<string, string> = {
  "/re.svg": "React",
  "/next.svg": "Next.js",
  "/ts.svg": "TypeScript",
  "/tail.svg": "Tailwind CSS",
  "/three.svg": "Three.js",
  "/fm.svg": "Framer Motion",
  "/gsap.svg": "GSAP",
  "/stream.svg": "Stream",
  "/c.svg": "Stream",
};

const techName = (icon: string) => TECH_NAMES[icon] ?? "";

const RecentProjects = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20">
      <WordReveal
        words="A small selection of recent projects"
        accent="recent projects"
        className="heading"
      />

      <div className="mt-10">
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={index}
            onOpen={() => setSelected(project)}
          />
        ))}
      </div>

      {/* rendered at section level so it isn't inside the panel's transform context */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecentProjects;

// each project pins briefly (sticky) while the panel passes through on the
// z-axis — scaling up toward the viewer with a slight perspective tilt.
// reduced-motion users get the panels in plain flow with no transforms.
const ProjectPanel = ({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { title, des, img, iconLists, link, github } = project;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.85, 1, 1, 0.92]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [9, 0, 0, -7]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0.25, 1, 1, 0.25]
  );
  // the screenshot drifts inside its window for a layered depth read
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const flip = index % 2 === 1;

  return (
    <div ref={ref} className="relative md:h-[145vh]">
      <div className="flex items-center justify-center py-10 md:sticky md:top-0 md:h-screen md:py-0">
        <motion.div
          onClick={onOpen}
          style={
            reduced
              ? undefined
              : { scale, rotateX, opacity, transformPerspective: 1100 }
          }
          className="glass-panel group w-full max-w-5xl cursor-pointer overflow-hidden !rounded-[1.5rem]
            transition-shadow duration-700 hover:shadow-[0_0_90px_-25px_rgba(139,92,246,0.55)]"
        >
          <div
            className={cn(
              "flex flex-col lg:flex-row",
              flip && "lg:flex-row-reverse"
            )}
          >
            {/* screenshot window */}
            <div className="relative overflow-hidden bg-[#0d0a16] lg:w-[55%]">
              <motion.div
                style={reduced ? undefined : { y: imgY }}
                className="h-full w-full"
              >
                <img
                  src={img}
                  alt={title}
                  className="h-64 w-full scale-[1.15] object-cover object-top transition-transform
                    duration-700 ease-out group-hover:scale-[1.19] sm:h-80 lg:h-full lg:min-h-[26rem]"
                />
              </motion.div>
              {/* violet light bleeding over the screenshot edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(124,58,237,0.16), transparent 45%)",
                }}
              />
            </div>

            {/* content */}
            <div className="relative flex flex-col justify-center p-7 sm:p-9 lg:w-[45%] lg:p-11">
              {/* ghost index numeral as a light layer, not content */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-4 select-none text-7xl font-bold
                  text-purple/[0.07] lg:text-8xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h1 className="line-clamp-2 text-base font-bold text-white md:text-xl lg:text-2xl">
                {title}
              </h1>

              <p className="mt-3 line-clamp-4 text-sm font-light text-white-100 lg:text-base">
                {des}
              </p>

              {/* read more opens the full details modal */}
              <button
                onClick={onOpen}
                className="mt-3 self-start text-sm font-medium text-purple transition-[text-shadow]
                  duration-300 hover:[text-shadow:0_0_16px_rgba(203,172,249,0.8)]"
              >
                Read more
              </button>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center">
                  {iconLists.map((icon, i) => (
                    <div
                      key={icon}
                      title={techName(icon)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border
                        border-purple/20 bg-[#0b0812]/90 backdrop-blur-sm lg:h-10 lg:w-10"
                      style={{ transform: `translateX(-${5 * i + 2}px)` }}
                    >
                      <img src={icon} alt={techName(icon)} className="p-2" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {github && (
                    <a
                      href={github}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${title} on GitHub`}
                      title="View source on GitHub"
                      className="flex items-center text-white/70 transition-colors hover:text-white"
                    >
                      <FaGithub className="text-xl lg:text-2xl" />
                    </a>
                  )}
                  <a
                    href={link.startsWith("http") ? link : `https://${link}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:underline"
                  >
                    <p className="flex text-sm text-purple md:text-xs lg:text-lg">
                      Check Live Site
                    </p>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  const { title, des, img, iconLists, link, github } = project;

  // close on Escape and lock background scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Lenis scrolls virtually, so overflow:hidden alone doesn't stop it
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080809]/80 p-4 backdrop-blur-md sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto !rounded-[1.5rem]"
        data-lenis-prevent
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full
            border border-purple/20 bg-[#080809]/60 text-white transition-colors hover:bg-[#080809]/90"
        >
          <IoClose size={20} />
        </button>

        <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-[#0d0a16] sm:h-72">
          <img
            src="/bg.png"
            alt="bg-img"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <img
            src={img}
            alt={title}
            className="relative z-10 max-h-full object-contain"
          />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>

          <p className="mt-4 text-base font-light leading-relaxed text-white-100 sm:text-lg">
            {des}
          </p>

          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/50">
              Built with
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {iconLists
                // dedupe techs that share a name (e.g. two Stream icons)
                .filter(
                  (icon, i, arr) =>
                    arr.findIndex((o) => techName(o) === techName(icon)) === i
                )
                .map((icon) => (
                  <span
                    key={icon}
                    className="inline-flex items-center gap-2 rounded-full border border-purple/20
                      bg-[#0b0812]/70 py-1.5 pl-1.5 pr-3.5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                      <img
                        src={icon}
                        alt={techName(icon)}
                        className="h-4 w-4 object-contain"
                      />
                    </span>
                    <span className="text-sm text-white/90">
                      {techName(icon)}
                    </span>
                  </span>
                ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={link.startsWith("http") ? link : `https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-purple/20 bg-[#0b0812]/90
                px-6 py-3 font-medium text-white transition-all duration-300
                hover:border-purple/50 hover:shadow-[0_0_30px_-8px_rgba(167,139,250,0.6)]"
            >
              Check Live Site
              <FaLocationArrow color="#CBACF9" />
            </a>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-purple/20 bg-transparent
                  px-6 py-3 font-medium text-white transition-all duration-300
                  hover:border-purple/50 hover:shadow-[0_0_30px_-8px_rgba(167,139,250,0.6)]"
              >
                <FaGithub className="text-xl" />
                View Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
