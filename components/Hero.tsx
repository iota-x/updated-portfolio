"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";

import MagicButton from "./MagicButton";
import Magnetic from "./ui/Magnetic";
import WordReveal from "./ui/WordReveal";
import HeroCanvas from "./ui/HeroCanvas";

const Hero = () => {
  return (
    <div className="relative pb-20 pt-36">
      {/* full-viewport WebGL particle field behind the hero copy */}
      <div className="absolute top-0 left-1/2 h-screen w-screen -translate-x-1/2">
        <HeroCanvas />
      </div>

      <div className="relative z-10 my-20 flex justify-center">
        <div className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[60vw]">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-80 text-center text-xs uppercase tracking-[0.3em] text-purple/90"
          >
            Dynamic Web Magic with Next.js
          </motion.p>

          <WordReveal
            words="Transforming Concepts into Seamless User Experiences"
            className="my-6 text-center text-[40px] text-white md:text-5xl lg:text-6xl"
            delay={0.35}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-center text-sm text-white-100 md:text-lg md:tracking-wider lg:text-2xl"
          >
            Hi! I&apos;m Ankit, a full-stack Developer based in India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
