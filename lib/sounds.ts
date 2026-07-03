// synthesized cosmic UI sounds (WebAudio, no audio files).
// everything runs through a synthetic "space" reverb so even tiny events
// feel like they happen in a vast place. silent until the user opts in.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wet: GainNode | null = null; // reverb send
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

// master bus + convolver reverb built from a 2.5s decaying noise impulse
const getBus = () => {
  const c = ensureCtx();
  if (!master || !wet) {
    master = c.createGain();
    master.gain.value = 0.9;
    master.connect(c.destination);

    const ir = c.createBuffer(2, Math.ceil(c.sampleRate * 2.5), c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.8);
      }
    }
    const conv = c.createConvolver();
    conv.buffer = ir;
    wet = c.createGain();
    wet.gain.value = 0.6;
    wet.connect(conv);
    conv.connect(master);
  }
  return { c, master, wet };
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

// a slightly detuned sine pair with an envelope, sent dry + into the reverb
const tone = (
  freq: number,
  duration: number,
  peak: number,
  attack = 0.01,
  send = 0.8
) => {
  if (!enabled) return;
  try {
    const { c, master: dry, wet: verb } = getBus();
    const t0 = c.currentTime + 0.02;
    const env = c.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    for (const cents of [-4, 4]) {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = cents;
      osc.connect(env);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    }

    env.connect(dry!);
    const sendGain = c.createGain();
    sendGain.gain.value = send;
    env.connect(sendGain);
    sendGain.connect(verb!);
  } catch {}
};

// airy filtered-noise breath (for whooshes and texture)
const breath = (
  duration: number,
  peak: number,
  from: number,
  to: number,
  send = 0.9
) => {
  if (!enabled) return;
  try {
    const { c, master: dry, wet: verb } = getBus();
    const t0 = c.currentTime + 0.02;
    const len = Math.max(1, Math.ceil(c.sampleRate * duration));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;

    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(to, t0 + duration);

    const env = c.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + duration * 0.25);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter).connect(env);
    env.connect(dry!);
    const sendGain = c.createGain();
    sendGain.gain.value = send;
    env.connect(sendGain);
    sendGain.connect(verb!);
    src.start(t0);
  } catch {}
};

/** hover: a distant twinkle — mostly reverb tail, barely there */
export const tick = () => tone(2093, 0.5, 0.012, 0.02, 1.2);

/** click: a deep pulse rippling outward + a soft rising breath */
export const clickSound = () => {
  tone(82, 0.5, 0.12, 0.005, 0.5);
  breath(0.35, 0.015, 350, 1200);
};

/** blob poke: a deep sub-bass wobble with an airy ripple, like prodding
 *  something huge and gelatinous floating in space */
export const blobSound = () => {
  tone(55, 1.1, 0.18, 0.004, 0.9);
  tone(110, 0.8, 0.06, 0.015, 1.1);
  setTimeout(() => tone(82, 0.6, 0.05, 0.02, 1.2), 90);
  breath(0.55, 0.02, 180, 1600, 1.1);
};

/** enable: an ethereal two-note swell, like the scene breathing in */
export const chime = () => {
  tone(261.6, 1.6, 0.035, 0.18, 1.3);
  setTimeout(() => tone(392, 1.9, 0.035, 0.2, 1.3), 160);
  breath(1.2, 0.012, 250, 900);
};
