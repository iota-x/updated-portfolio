// tiny synthesized UI sounds (WebAudio, no audio files).
// everything is opt-in: silent until the user flips the sound toggle.

let ctx: AudioContext | null = null;
let enabled = false;

export const isSoundEnabled = () => enabled;

const ensureCtx = () => {
  if (!ctx) {
    ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

export const loadSoundPref = () => {
  try {
    enabled = localStorage.getItem("sound-enabled") === "1";
  } catch {}
  return enabled;
};

export const setSoundEnabled = (on: boolean) => {
  enabled = on;
  try {
    localStorage.setItem("sound-enabled", on ? "1" : "0");
  } catch {}
  if (on) ensureCtx(); // created inside the user gesture, so autoplay-safe
};

const blip = (
  freq: number,
  duration: number,
  peak: number,
  type: OscillatorType = "sine"
) => {
  if (!enabled) return;
  try {
    const c = ensureCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(peak, c.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration + 0.02);
  } catch {}
};

/** near-silent hover tick */
export const tick = () => blip(1300, 0.06, 0.035);

/** soft click confirmation */
export const clickSound = () => blip(660, 0.12, 0.05, "triangle");
