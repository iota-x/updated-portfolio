"use client";

import { useEffect, useRef, useState } from "react";
import { FaLocationArrow, FaGithub } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import { projects } from "@/data";
import { cn } from "@/lib/utils";
import WordReveal from "./ui/WordReveal";
import DistortImage from "./ui/DistortImage";
import Elastic from "./ui/Elastic";
import Magnetic from "./ui/Magnetic";

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
      <Elastic strength={12}>
        <WordReveal
          words="Things I've actually shipped"
          accent="shipped"
          className="heading"
        />
      </Elastic>

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
  const video = "video" in project ? project.video : undefined;

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

  // perspective tilt toward the cursor, sprung so it settles softly
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const tiltX = useSpring(tx, { stiffness: 150, damping: 18 });
  const tiltY = useSpring(ty, { stiffness: 150, damping: 18 });

  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 5);
    ty.set(((e.clientX - rect.left) / rect.width - 0.5) * 7);
  };

  const resetTilt = () => {
    tx.set(0);
    ty.set(0);
  };

  const flip = index % 2 === 1;

  return (
    <div ref={ref} className="relative md:h-[145vh]">
      <div className="flex items-center justify-center py-10 md:sticky md:top-0 md:h-screen md:py-0">
        <motion.div
          style={
            reduced
              ? undefined
              : { scale, rotateX, opacity, transformPerspective: 1100 }
          }
          className="w-full max-w-5xl"
        >
          <motion.div
            onClick={onOpen}
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            }}
            onMouseMove={onTilt}
            onMouseLeave={resetTilt}
            style={
              reduced
                ? undefined
                : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }
            }
            className="glass-panel group cursor-pointer overflow-hidden !rounded-[1.5rem]
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
                {/* live demo clip when available; WebGL liquid ripple image otherwise */}
                {video ? (
                  <video
                    src={video}
                    poster={img}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${title} demo`}
                    className="h-64 w-full scale-[1.15] object-cover object-top transition-transform
                      duration-700 ease-out group-hover:scale-[1.19] sm:h-80 lg:h-full lg:min-h-[26rem]"
                  />
                ) : (
                  <DistortImage
                    src={img}
                    alt={title}
                    className="h-64 w-full scale-[1.15] object-cover object-top transition-transform
                      duration-700 ease-out group-hover:scale-[1.19] sm:h-80 lg:h-full lg:min-h-[26rem]"
                  />
                )}
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

              <h1 className="line-clamp-2 font-display text-base font-bold text-white md:text-xl lg:text-2xl">
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
  const video = "video" in project ? project.video : undefined;
  const closeRef = useRef<HTMLButtonElement>(null);

  // move keyboard focus into the dialog when it opens
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

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

  // full-screen editorial takeover — slides up like a page. no backdrop
  // blur, no filter animations: translate/opacity only, so it stays smooth
  // over the WebGL layers.
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[6000] overflow-y-auto overflow-x-hidden bg-[#0a0812]"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 75% 8%, rgba(124,58,237,0.18), transparent 65%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(88,28,135,0.14), transparent 70%)",
        }}
      />
      <div aria-hidden className="star-layer fixed opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-10">
        {/* top bar: ghost numeral + close */}
        <div className="flex items-start justify-between">
          <span
            aria-hidden
            className="select-none font-display text-7xl font-bold leading-none text-purple/[0.12] sm:text-9xl"
          >
            {String(project.id).padStart(2, "0")}
          </span>
          <Magnetic strength={0.4}>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-purple/25
                bg-[#0b0812]/80 text-white transition-all duration-300 hover:rotate-90
                hover:border-purple/60 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.7)]"
            >
              <IoClose size={22} />
            </button>
          </Magnetic>
        </div>

        {/* editorial headline */}
        <WordReveal
          words={title}
          className="-mt-6 max-w-4xl text-4xl text-white sm:-mt-10 sm:text-5xl lg:text-6xl"
          delay={0.5}
          active
        />

        {/* panoramic screenshot band with the liquid-hover treatment */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mt-10"
        >
          {/* no layoutId morph from the card: the card sits inside
              scale/rotateX/tilt transforms, which framer's layout projection
              can't measure through, so the morph always started misplaced */}
          <motion.div
            variants={item}
            className="glass-panel h-[38vh] overflow-hidden !rounded-[1.5rem] md:h-[48vh]"
          >
            {video ? (
              <video
                src={video}
                poster={img}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${title} demo`}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <DistortImage
                src={img}
                alt={title}
                className="h-full w-full object-cover object-top"
              />
            )}
            {/* vignette so light screenshots blend into the dark stage */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                boxShadow: "inset 0 0 90px rgba(8, 8, 9, 0.5)",
                background:
                  "linear-gradient(to top, rgba(10,8,18,0.4), transparent 28%)",
              }}
            />
          </motion.div>

          {/* description + meta */}
          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_320px]">
            <motion.p
              variants={item}
              className="text-base font-light leading-relaxed text-white-100 sm:text-lg"
            >
              {des}
            </motion.p>

            <div className="flex flex-col gap-8">
              <motion.div variants={item}>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/50">
                  Built with
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {iconLists
                    // dedupe techs that share a name (e.g. two Stream icons)
                    .filter(
                      (icon, i, arr) =>
                        arr.findIndex(
                          (o) => techName(o) === techName(icon)
                        ) === i
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
              </motion.div>

              <motion.div variants={item} className="flex flex-col gap-4">
                <Magnetic strength={0.25}>
                  <a
                    href={link.startsWith("http") ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex w-full items-center justify-between overflow-hidden
                      rounded-full border border-purple/30 bg-[#0b0812]/90 py-2 pl-6 pr-2 text-white
                      transition-all duration-500 hover:border-purple/70
                      hover:shadow-[0_0_45px_-10px_rgba(167,139,250,0.8)]"
                  >
                    {/* violet sweep fills the pill on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#2a1650] to-[#4c1d95]
                        transition-transform duration-500 ease-out group-hover:translate-x-0"
                    />
                    <span className="relative z-10 text-xs font-medium uppercase tracking-[0.25em]">
                      Check Live Site
                    </span>
                    <span
                      className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                        border border-purple/30 bg-purple/10 text-purple transition-all duration-500
                        group-hover:rotate-45 group-hover:bg-purple group-hover:text-[#0b0812]"
                    >
                      <FaLocationArrow size={13} />
                    </span>
                  </a>
                </Magnetic>
                {github && (
                  <Magnetic strength={0.25}>
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex w-full items-center justify-between overflow-hidden
                        rounded-full border border-purple/30 bg-transparent py-2 pl-6 pr-2 text-white
                        transition-all duration-500 hover:border-purple/70
                        hover:shadow-[0_0_45px_-10px_rgba(167,139,250,0.8)]"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#2a1650] to-[#4c1d95]
                          transition-transform duration-500 ease-out group-hover:translate-x-0"
                      />
                      <span className="relative z-10 text-xs font-medium uppercase tracking-[0.25em]">
                        View Code
                      </span>
                      <span
                        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                          border border-purple/30 bg-purple/10 text-purple transition-all duration-500
                          group-hover:scale-110 group-hover:bg-purple group-hover:text-[#0b0812]"
                      >
                        <FaGithub size={16} />
                      </span>
                    </a>
                  </Magnetic>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
