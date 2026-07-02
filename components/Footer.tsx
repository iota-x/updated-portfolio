"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Magnetic from "./ui/Magnetic";
import WordReveal from "./ui/WordReveal";
import Elastic from "./ui/Elastic";

const Footer = () => {
  return (
    <footer className="relative w-full pb-10 mb-[100px] md:mb-5" id="contact">
      {/* violet glow rising from the bottom of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55vh]"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 100%, rgba(124, 58, 237, 0.16), transparent 70%)",
        }}
      />

      <div className="flex flex-col items-center">
        <Elastic strength={12}>
          <WordReveal
            words="Always open to new ideas and collaborations."
            accent="new"
            className="heading lg:max-w-[45vw]"
          />
        </Elastic>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-white-200 md:mt-10 my-5 text-center"
        >
          Reach out to me and let&apos;s build something amazing.
        </motion.p>
        <Magnetic strength={0.25}>
          <a href="mailto:mailmeatankitx@gmail.com">
            <MagicButton
              title="Let's get in touch"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </Magnetic>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm font-light text-white-200 md:text-base md:font-normal">
          Ankit Pandey
        </p>

        <div className="flex items-center gap-4">
          {socialMedia.map((info) => (
            <Magnetic key={info.id} strength={0.4}>
              <a
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel flex h-10 w-10 items-center justify-center !rounded-xl
                  transition-shadow duration-500 hover:shadow-[0_0_26px_-4px_rgba(167,139,250,0.65)]"
              >
                <img src={info.img} alt="icons" width={20} height={20} />
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
