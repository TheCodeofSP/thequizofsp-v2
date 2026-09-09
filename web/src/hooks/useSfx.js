import { useCallback, useEffect, useState } from "react";

function readBool(key, fallback) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "true";
}

function writeBool(key, value) {
  localStorage.setItem(key, value ? "true" : "false");
}

// --- Singleton engine (important pour React StrictMode) ---
let ENGINE = null;

function createSfxEngine() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();

  const master = ctx.createGain();
  master.gain.value = 0.28;
  master.connect(ctx.destination);

  const now = () => ctx.currentTime;

  function beep({ freq = 440, type = "square", duration = 0.08, gain = 0.8 }) {
    const t0 = now();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(master);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function sequence(notes) {
    let t = now();
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = n.type || "square";
      osc.frequency.setValueAtTime(n.freq, t);

      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(n.gain ?? 0.75, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (n.dur ?? 0.08));

      osc.connect(g);
      g.connect(master);

      osc.start(t);
      osc.stop(t + (n.dur ?? 0.08) + 0.02);

      t += (n.dur ?? 0.08) + (n.gap ?? 0.03);
    }
  }

  const sfx = {
    coin: () =>
      sequence([
        { freq: 988, dur: 0.06, gain: 0.9 },
        { freq: 1318, dur: 0.07, gain: 0.9 },
      ]),
    click: () => beep({ freq: 880, duration: 0.045, gain: 0.65 }),
    select: () => beep({ freq: 740, duration: 0.04, gain: 0.55 }),
    lock: () => beep({ freq: 520, duration: 0.06, gain: 0.65 }),
    win: () =>
      sequence([
        { freq: 523, dur: 0.08 },
        { freq: 659, dur: 0.08 },
        { freq: 784, dur: 0.1 },
        { freq: 1046, dur: 0.12 },
      ]),
    correct: () =>
      sequence([
        { freq: 784, dur: 0.06, gain: 0.85 },
        { freq: 988, dur: 0.08, gain: 0.85 },
      ]),
    wrong: () =>
      sequence([
        { freq: 330, dur: 0.1, gain: 0.85, type: "sawtooth" },
        { freq: 220, dur: 0.12, gain: 0.85, type: "sawtooth" },
      ]),
    timeout: () =>
      sequence([
        { freq: 440, dur: 0.07, gain: 0.8 },
        { freq: 330, dur: 0.1, gain: 0.8 },
        { freq: 220, dur: 0.12, gain: 0.8 },
      ]),
    lose: () =>
      sequence([
        { freq: 220, dur: 0.12, gain: 0.9, type: "sawtooth" },
        { freq: 174, dur: 0.14, gain: 0.85, type: "sawtooth" },
        { freq: 130, dur: 0.18, gain: 0.8, type: "sawtooth" },
      ]),
  };

  async function ensureRunning() {
    if (ctx.state === "suspended") await ctx.resume();
  }

  function setVolume(v) {
    master.gain.value = Math.max(0, Math.min(1, v));
  }

  return { ensureRunning, setVolume, sfx };
}

function getEngine() {
  if (!ENGINE) ENGINE = createSfxEngine();
  return ENGINE;
}

export function useSfx() {
  const [enabled, setEnabled] = useState(() => readBool("sfxEnabled", true));

  useEffect(() => {
    const engine = getEngine();
    engine.setVolume(enabled ? 0.28 : 0);
    writeBool("sfxEnabled", enabled);
  }, [enabled]);

  const toggle = useCallback(async () => {
    const engine = getEngine();
    await engine.ensureRunning();
    setEnabled((v) => !v);
    engine.sfx.click();
  }, []);

  const play = useCallback(
    async (name) => {
      if (!enabled) return;
      const engine = getEngine();
      await engine.ensureRunning();
      engine.sfx[name]?.();
    },
    [enabled]
  );

  return { enabled, toggle, play };
}