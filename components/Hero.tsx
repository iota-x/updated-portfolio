"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";

import MagicButton from "./MagicButton";
import Magnetic from "./ui/Magnetic";
import WordReveal from "./ui/WordReveal";
import Elastic from "./ui/Elastic";
import { useEntered } from "./ui/EntrySequence";

// the WebGL scene itself lives in SceneCanvas (fixed behind the whole page);
// the hero contributes the violet aurora wash and gates its copy on the
// entry curtain lifting
const Hero = () => {
  const entered = useEntered();

  return (
    <div className="relative pb-20 pt-36">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 h-screen w-screen -translate-x-1/2"
      >
        <div className="hero-aurora" />
      </div>

      {/* off-axis composition: copy anchored left, the blob owns the right */}
      <div className="relative z-10 my-20 flex justify-center md:justify-start">
        <div className="flex max-w-[89vw] flex-col items-center md:max-w-[42rem] md:items-start lg:max-w-[46vw]">
          <Elastic strength={10}>
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={
                entered ? { opacity: 1, letterSpacing: "0.3em" } : undefined
              }
              transition={{
                duration: 1.4,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-80 text-center text-xs uppercase tracking-[0.3em] text-purple/90 md:text-left"
            >
              Dynamic Web Magic with Next.js
            </motion.p>
          </Elastic>

          <Elastic strength={12}>
            <WordReveal
              words="Transforming Concepts into Seamless User Experiences"
              className="my-6 text-center text-[40px] leading-[1.05] text-white md:text-left md:text-6xl lg:text-7xl"
              delay={0.35}
              active={entered}
            />
          </Elastic>

          <Elastic strength={10}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={entered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 text-center text-sm text-white-100 md:text-left md:text-lg md:tracking-wider lg:text-xl"
            >
              Hi! I&apos;m Ankit, a full-stack Developer based in India.
            </motion.p>
          </Elastic>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={entered ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Magnetic strength={0.25}>
              <a href="#projects">
                <MagicButton
                  title="Show my work"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
