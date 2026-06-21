"use client";

import { useEffect, useState } from "react";
import { FaLocationArrow, FaGithub } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";

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
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-10">
        {projects.map((project) => {
          const { id, title, des, img, iconLists, link, github } = project;
          return (
            <div
              className="sm:h-[41rem] h-[32rem] lg:min-h-[32.5rem] flex items-center justify-center sm:w-[570px] w-[80vw]"
              key={id}
            >
              <PinContainer title={title} href={link}>
                <div className="relative flex items-center justify-center sm:w-[570px] w-[80vw] overflow-hidden sm:h-[40vh] h-[30vh] mb-10">
                  <div
                    className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                    style={{ backgroundColor: "#13162D" }}
                  >
                    <img src="/bg.png" alt="bg-img" />
                  </div>
                  <img
                    src={img}
                    alt={title}
                    className="z-10 absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>

                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                  {title}
                </h1>

                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                  style={{
                    color: "#BEC1DD",
                    margin: "1vh 0",
                  }}
                >
                  {des}
                </p>

                {/* read more opens the full details modal */}
                <button
                  onClick={() => setSelected(project)}
                  className="text-sm font-medium text-purple hover:underline"
                >
                  Read more
                </button>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {iconLists.map((icon, index) => (
                      <div
                        key={icon}
                        title={techName(icon)}
                        className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        <img src={icon} alt={techName(icon)} className="p-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} on GitHub`}
                        title="View source on GitHub"
                        className="flex items-center text-white/80 hover:text-white transition-colors"
                      >
                        <FaGithub className="lg:text-2xl text-xl" />
                      </a>
                    )}
                    <a
                      href={link.startsWith("http") ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center hover:underline"
                    >
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        Check Live Site
                      </p>
                      <FaLocationArrow className="ms-3" color="#CBACF9" />
                    </a>
                  </div>
                </div>
              </PinContainer>
            </div>
          );
        })}
      </div>

      {/* rendered at section level so it isn't inside the pin's transform context */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecentProjects;

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
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.15]"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 border border-white/[0.15] text-white hover:bg-black/70 transition-colors"
        >
          <IoClose size={20} />
        </button>

        <div
          className="relative flex items-center justify-center w-full overflow-hidden h-56 sm:h-72"
          style={{ backgroundColor: "#13162D" }}
        >
          <img
            src="/bg.png"
            alt="bg-img"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <img
            src={img}
            alt={title}
            className="relative z-10 max-h-full object-contain"
          />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="font-bold text-2xl sm:text-3xl text-white">{title}</h2>

          <p
            className="mt-4 text-base sm:text-lg font-light leading-relaxed"
            style={{ color: "#BEC1DD" }}
          >
            {des}
          </p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
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
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/40 py-1.5 pl-1.5 pr-3.5"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black">
                      <img
                        src={icon}
                        alt={techName(icon)}
                        className="w-4 h-4 object-contain"
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
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-medium text-white bg-[#161A31] border border-white/[0.15] hover:border-purple transition-colors"
            >
              Check Live Site
              <FaLocationArrow color="#CBACF9" />
            </a>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-medium text-white bg-transparent border border-white/[0.15] hover:border-purple transition-colors"
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
