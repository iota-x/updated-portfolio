"use client";

import { useEffect, useState } from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import {
  chime,
  clickSound,
  loadSoundPref,
  setSoundEnabled,
  tick,
} from "@/lib/sounds";
import Magnetic from "./Magnetic";

// glass chip bottom-right: toggles the synthesized UI sounds. while on,
// hovering any link/button ticks and clicks give a soft confirmation.
const SoundToggle = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(loadSoundPref());
  }, []);

  // delegated listeners so every interactive element sounds without wiring
  useEffect(() => {
    if (!on) return;
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest("a, button") ?? null;
      if (el && el !== last) tick();
      last = el;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest("a, button")) clickSound();
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [on]);

  const toggle = () => {
    const next = !on;
    setSoundEnabled(next);
    setOn(next);
    if (next) chime();
  };

  return (
    <div className="fixed bottom-7 right-7 z-[60]">
      <Magnetic strength={0.4}>
        <button
          onClick={toggle}
          aria-pressed={on}
          aria-label={on ? "Mute interface sounds" : "Enable interface sounds"}
          className="glass-panel flex h-11 w-11 items-center justify-center !rounded-full text-white/70
            transition-all duration-300 hover:text-white
            hover:shadow-[0_0_22px_-4px_rgba(167,139,250,0.6)]"
        >
          {on ? (
            <IoVolumeHighOutline size={18} className="text-purple" />
          ) : (
            <IoVolumeMuteOutline size={18} />
          )}
        </button>
      </Magnetic>
    </div>
  );
};

export default SoundToggle;
