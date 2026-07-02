"use client";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

// Also install this npm i --save-dev @types/react-lottie
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

import { cn } from "@/lib/utils";


import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import animationData from "@/data/confetti.json";
import MagicButton from "../MagicButton";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // change gap-4 to gap-8, change grid-cols-3 to grid-cols-5, remove md:auto-rows-[18rem], add responsive code
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  //   remove unecessary things here
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ["ReactJS", "Express", "Typescript"];
  const rightLists = ["Turborepo", "NextJS", "Postgres"];

  const [copied, setCopied] = useState(false);

  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCopy = () => {
  if (typeof navigator !== "undefined") {
    const text = "mailmeatankitx@gmail.com";
    navigator.clipboard.writeText(text);
    setCopied(true);
  }
};

  return (
    <div
      className={cn(
        // glass panel: 1px gradient hairline via .glass-panel, violet glow on hover
        "glass-panel row-span-1 relative overflow-hidden !rounded-3xl group/bento transition-shadow duration-500 hover:shadow-[0_0_60px_-18px_rgba(139,92,246,0.4)] justify-between flex flex-col space-y-4",
        className
      )}
      style={
        id === 1
          ? {
              // card 1 is a window: the page's real starfield + smoke show
              // through crystal-clear glass (no blur — stars stay sharp)
              background: "rgba(13, 10, 22, 0.35)",
              backdropFilter: "saturate(140%)",
              WebkitBackdropFilter: "saturate(140%)",
            }
          : {
              // violet-black fill matching the page's light language
              background: "linear-gradient(120deg, #0d0a16 0%, #130d20 100%)",
            }
      }
    >
      {/* add img divs */}
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        <div className="w-full h-full absolute">
          {/* card 1: the laptop mockup clashed with the glass language —
              replaced with a violet nebula + orbiting light rings */}
          {img && id !== 1 && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center ")}
            />
          )}
        </div>
        {id === 1 && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* nebula tint, same family as the hero aurora */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 60% at 70% 25%, rgba(124,58,237,0.22), transparent 65%), radial-gradient(ellipse 55% 50% at 15% 80%, rgba(88,28,135,0.18), transparent 70%)",
              }}
            />
            {/* two star layers drifting at different speeds */}
            <div className="star-layer opacity-90" />
            <div
              className="star-layer opacity-60"
              style={{
                animationDuration: "140s",
                animationDirection: "reverse",
                backgroundSize: "38% 38%",
              }}
            />
            {/* constellation: scattered "what ifs" joined into a path that
                ascends to the north star — "what's next" */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              <path
                className="constellation-path"
                d="M70,310 L170,260 L150,180 L260,150 L330,190 L420,110 L500,60"
                stroke="rgba(203,172,249,0.4)"
                strokeWidth="1"
                pathLength={1}
              />
              {[
                [70, 310],
                [170, 260],
                [150, 180],
                [260, 150],
                [330, 190],
                [420, 110],
              ].map(([cx, cy], i) => (
                <g
                  key={`${cx}-${cy}`}
                  className="constellation-node"
                  style={{ animationDelay: `${i * 0.55}s` }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill="rgba(203,172,249,0.18)"
                  />
                  <circle cx={cx} cy={cy} r="2" fill="#cbacf9" />
                </g>
              ))}
              {/* the north star */}
              <g className="north-star">
                <line
                  x1="500"
                  y1="28"
                  x2="500"
                  y2="92"
                  stroke="rgba(203,172,249,0.55)"
                  strokeWidth="1"
                />
                <line
                  x1="468"
                  y1="60"
                  x2="532"
                  y2="60"
                  stroke="rgba(203,172,249,0.55)"
                  strokeWidth="1"
                />
                <circle cx="500" cy="60" r="11" fill="rgba(203,172,249,0.22)" />
                <circle cx="500" cy="60" r="3.5" fill="#ffffff" />
              </g>
            </svg>

            {/* rim-lit planet rising out of the corner (kin of the globe card) */}
            <div
              className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full lg:h-96 lg:w-96"
              style={{
                background:
                  "radial-gradient(circle at 32% 30%, #2a1650, #0d0716 62%)",
                boxShadow:
                  "inset 8px 12px 28px rgba(203,172,249,0.22), inset -24px -24px 70px rgba(0,0,0,0.9), 0 0 70px -18px rgba(124,58,237,0.45)",
                animation: "planet-drift 14s ease-in-out infinite alternate",
              }}
            />
            {/* thin light arc grazing the planet's horizon */}
            <div
              className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full lg:h-96 lg:w-96"
              style={{
                background:
                  "radial-gradient(circle at 32% 30%, rgba(203,172,249,0.35), transparent 28%)",
                animation: "planet-drift 14s ease-in-out infinite alternate",
              }}
            />
            {/* occasional comets */}
            <div className="comet" style={{ top: "12%", right: "8%" }} />
            <div
              className="comet"
              style={{
                top: "30%",
                right: "35%",
                animationDelay: "4.5s",
                animationDuration: "13s",
              }}
            />
          </div>
        )}
        <div
          className={`absolute right-0 -bottom-5 ${id === 5 && "w-full opacity-80"
            } `}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              //   width={220}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
        {id === 6 && (
          // add background animation , remove the p tag
          <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(19, 10, 34)"
            gradientBackgroundEnd="rgb(8, 8, 9)"
            firstColor="124, 58, 237"
            secondColor="167, 139, 250"
            thirdColor="88, 28, 135"
            fourthColor="76, 29, 149"
            fifthColor="139, 92, 246"
            pointerColor="167, 139, 250"
          />
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          {/* change the order of the title and des, font-extralight, remove text-xs text-neutral-600 dark:text-neutral-300 , change the text-color */}
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>
          {/* add text-3xl max-w-96 , remove text-neutral-600 dark:text-neutral-300*/}
          {/* remove mb-2 mt-2 */}
          <div
            className={`font-display text-lg lg:text-3xl max-w-96 font-bold z-10`}
          >
            {title}
          </div>

          {/* for the github 3d globe */}
          {id === 2 && <GridGlobe />}

          {/* Tech stack list div */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              {/* tech stack lists */}
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center border border-purple/10 bg-[#130f22]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center border border-purple/10 bg-[#130f22]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center border border-purple/10 bg-[#130f22]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center border border-purple/10 bg-[#130f22]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              {/* button border magic from tailwind css buttons  */}
              {/* add rounded-md h-8 md:h-8, remove rounded-full */}
              {/* remove focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 */}
              {/* add handleCopy() for the copy the text */}
              <div
                className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"
                  }`}
              >
                {/* <img src="/confetti.gif" alt="confetti" /> */}
                {copied && (
                  <Lottie options={defaultOptions} height={200} width={400} />
                )}
              </div>

              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
