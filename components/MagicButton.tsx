"use client";
import React from "react";

/**
 * glass pill with a 1px violet gradient border; the accent acts as a
 * light source — glow blooms on hover instead of a flat fill
 */
const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <button
      className="group relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none md:mt-10 md:w-60"
      onClick={handleClick}
    >
      {/* 1px gradient border */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg, rgba(203,172,249,0.55), rgba(124,58,237,0.15) 40%, rgba(203,172,249,0.06) 70%, rgba(203,172,249,0.45))",
        }}
      />

      <span
        className={`relative inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full
             bg-[#0b0812]/90 px-7 text-sm font-medium text-white backdrop-blur-xl transition-shadow duration-500
             group-hover:shadow-[0_0_45px_-8px_rgba(167,139,250,0.7)] ${otherClasses}`}
      >
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;
