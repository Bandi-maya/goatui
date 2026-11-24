"use client";
import "./SliderFamily.css";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useAnimationFrame,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Heart,
  Bookmark,
  ChevronsRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* shared helpers                                                      */
/* ------------------------------------------------------------------ */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mod = (n: number, m: number) => ((n % m) + m) % m;
const pad2 = (n: number) => String(n).padStart(2, "0");

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 } as const;
const SOFT = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const;
const SNAPPY = { type: "spring", stiffness: 520, damping: 22, mass: 0.7 } as const;

/** Returns a spring transition, or an instant one when the user prefers reduced motion. */
function useSpringT(base: Record<string, unknown> = SPRING) {
  const reduce = useReducedMotion();
  return (reduce ? { duration: 0 } : base) as never;
}

/** Motion value that chases a number with spring physics (jumps when reduced motion). */
function useSmoothed(target: number, stiffness = 380, damping = 30) {
  const mv = useMotionValue(target);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    if (reduce) {
      mv.jump(target);
      return;
    }
    const c = animate(mv, target, { type: "spring", stiffness, damping, mass: 0.8 });
    return () => c.stop();
  }, [target, reduce, mv, stiffness, damping]);
  return mv;
}

/** Pointer scrubbing along one axis, reports a 0..1 position. */
function useScrub(
  axis: "x" | "y",
  onChange: (t: number, start: boolean) => void,
  onEnd?: () => void,
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const cb = React.useRef(onChange);
  const end = React.useRef(onEnd);
  React.useEffect(() => {
    cb.current = onChange;
    end.current = onEnd;
  });
  const down = React.useRef(false);
  const [active, setActive] = React.useState(false);
  const calc = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const t = axis === "y" ? 1 - (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
    return clamp(t, 0, 1);
  };
  const stop = (e: React.PointerEvent<HTMLElement>) => {
    if (!down.current) return;
    down.current = false;
    setActive(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    end.current?.();
  };
  const bind = {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down.current = true;
      setActive(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      cb.current(calc(e), true);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (down.current) cb.current(calc(e), false);
    },
    onPointerUp: stop,
    onPointerCancel: stop,
  };
  return { ref, active, bind };
}

/** Standard slider keyboard model. Returns true when handled. */
function keyStep(
  e: React.KeyboardEvent,
  v: number,
  min: number,
  max: number,
  step: number,
  set: (n: number) => void,
  vertical = false,
) {
  let n = v;
  switch (e.key) {
    case "ArrowRight":
    case "ArrowUp":
      n = v + step;
      break;
    case "ArrowLeft":
    case "ArrowDown":
      n = v - step;
      break;
    case "PageUp":
      n = v + step * 10;
      break;
    case "PageDown":
      n = v - step * 10;
      break;
    case "Home":
      n = min;
      break;
    case "End":
      n = max;
      break;
    default:
      return false;
  }
  void vertical;
  e.preventDefault();
  set(clamp(Math.round(n / step) * step, min, max));
  return true;
}

/* poster-style artwork so every slide has real imagery without assets */
const PAL = [
  ["#f2c98f", "#e07b53", "#fff1d0", "#8a4b43", "#3a2530"],
  ["#c6dbe0", "#6e9aa8", "#f6f1e4", "#3f6270", "#1d3541"],
  ["#e3e8c4", "#9fb17a", "#fbf4d3", "#58703f", "#26361f"],
  ["#f6dfb4", "#e9a86a", "#fff7e0", "#b5653d", "#6a3322"],
  ["#2b3a55", "#566a8c", "#e9e4cf", "#1f2a40", "#101722"],
  ["#f3d3cc", "#d9877f", "#fff0e6", "#a2514f", "#4a2327"],
  ["#d7e7ec", "#a9c6cf", "#ffffff", "#7d9aa6", "#41606d"],
  ["#efe3c3", "#cdb877", "#fffbe6", "#80773f", "#3a361b"],
];

function ridge(seed: number, base: number, amp: number) {
  let d = "M0 200 L0 " + base.toFixed(1);
  for (let x = 0; x <= 320; x += 16) {
    const y = base + amp * (Math.sin(x * 0.021 + seed) + 0.55 * Math.sin(x * 0.053 + seed * 2.1));
    d += " L" + x + " " + y.toFixed(1);
  }
  return d + " L320 200 Z";
}

function Art({ n, className, grey }: { n: number; className?: string; grey?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const p = PAL[mod(n, PAL.length)];
  const sx = 70 + mod(n * 83, 180);
  const sy = 56 + mod(n * 29, 40);
  return (
    <svg
      className={className}
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={grey ? { filter: "grayscale(1) contrast(.9) brightness(1.05)" } : undefined}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p[0]} />
          <stop offset="1" stopColor={p[1]} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id})`} />
      <circle cx={sx} cy={sy} r={22 + mod(n * 7, 10)} fill={p[2]} opacity=".92" />
      <path d={ridge(n + 1, 128, 14)} fill={p[3]} opacity=".78" />
      <path d={ridge(n * 2.3 + 4, 156, 11)} fill={p[4]} />
    </svg>
  );
}

const PLACES = [
  { title: "Lofoten", sub: "Norway", meta: "68.2°N" },
  { title: "Atacama", sub: "Chile", meta: "2,400 m" },
  { title: "Hokkaido", sub: "Japan", meta: "43.1°N" },
  { title: "Sossusvlei", sub: "Namibia", meta: "24.7°S" },
  { title: "Dolomites", sub: "Italy", meta: "3,343 m" },
  { title: "Wadi Rum", sub: "Jordan", meta: "29.6°N" },
  { title: "Svalbard", sub: "Norway", meta: "78.2°N" },
  { title: "Faroe Isles", sub: "Denmark", meta: "62.0°N" },
];

/* ================================================================== */
/* BATCH 1 · value sliders                                             */
/* ================================================================== */

/** 01 · Spring range: thumb trails the pointer on a spring, value bubble pops while held. */
export function SpringRange() {
  const [v, setV] = React.useState(64);
  const m = useSmoothed(v / 100);
  const left = useTransform(m, (x) => `${x * 100}%`);
  const { ref, active, bind } = useScrub("x", (t) => setV(Math.round(t * 100)));
  const T = useSpringT(SNAPPY);
  return (
    <div className="sf sf-card sf-v01">
      <div className="sf-head">
        <span className="sf-label">Brightness</span>
        <output className="sf-val">{v}%</output>
      </div>
      <div className="sf-rail-wrap" ref={ref} {...bind}>
        <div className="sf-rail" />
        <motion.div className="sf-fill" style={{ width: left }} />
        <motion.span
          className="sf-bubble"
          style={{ left }}
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8, scale: active ? 1 : 0.7 }}
          transition={T}
          aria-hidden="true"
        >
          {v}
        </motion.span>
        <motion.div
          className="sf-thumb"
          role="slider"
          tabIndex={0}
          aria-label="Brightness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={v}
          aria-valuetext={`${v} percent`}
          style={{ left }}
          animate={{ scale: active ? 1.18 : 1 }}
          transition={T}
          onKeyDown={(e) => keyStep(e, v, 0, 100, 1, setV)}
        />
      </div>
      <div className="sf-scale sf-num" aria-hidden="true">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

/** 02 · Dual range over a histogram: bars inside the window light up with a ripple. */
const HIST = [3, 5, 8, 6, 11, 14, 18, 16, 21, 24, 22, 26, 20, 17, 19, 13, 12, 9, 10, 7, 5, 6, 3, 2];
export function HistogramRange() {
  const MAX = 500;
  const [lo, setLo] = React.useState(120);
  const [hi, setHi] = React.useState(340);
  const which = React.useRef<"lo" | "hi">("lo");
  const mLo = useSmoothed(lo / MAX);
  const mHi = useSmoothed(hi / MAX);
  const leftLo = useTransform(mLo, (x) => `${x * 100}%`);
  const leftHi = useTransform(mHi, (x) => `${x * 100}%`);
  const fillW = useTransform([mLo, mHi], ([a, b]: number[]) => `${(b - a) * 100}%`);
  const T = useSpringT(SNAPPY);
  const { ref, active, bind } = useScrub("x", (t, start) => {
    const val = Math.round((t * MAX) / 10) * 10;
    if (start) which.current = Math.abs(val - lo) <= Math.abs(val - hi) ? (val > hi ? "hi" : "lo") : "hi";
    if (which.current === "lo") setLo(clamp(val, 0, hi - 20));
    else setHi(clamp(val, lo + 20, MAX));
  });
  const inside = (i: number) => {
    const c = ((i + 0.5) / HIST.length) * MAX;
    return c >= lo && c <= hi;
  };
  return (
    <div className="sf sf-card sf-v02">
      <div className="sf-head">
        <span className="sf-label">Nightly price</span>
        <output className="sf-val sf-val-sm">
          ${lo} <span className="sf-dash">to</span> ${hi}
        </output>
      </div>
      <div className="sf-hist" aria-hidden="true">
        {HIST.map((h, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scaleY: inside(i) ? 1 : 0.86, opacity: inside(i) ? 1 : 0.38 }}
            transition={{ ...(SOFT as object), delay: Math.abs(i - (which.current === "lo" ? lo : hi) / (MAX / HIST.length)) * 0.006 } as never}
            style={{ height: h * 3 + 4 }}
            className={inside(i) ? "on" : ""}
          />
        ))}
      </div>
      <div className="sf-rail-wrap" ref={ref} {...bind}>
        <div className="sf-rail" />
        <motion.div className="sf-fill" style={{ left: leftLo, width: fillW }} />
        {(["lo", "hi"] as const).map((k) => {
          const val = k === "lo" ? lo : hi;
          return (
            <motion.div
              key={k}
              className="sf-thumb"
              role="slider"
              tabIndex={0}
              aria-label={k === "lo" ? "Minimum price" : "Maximum price"}
              aria-valuemin={k === "lo" ? 0 : lo + 20}
              aria-valuemax={k === "lo" ? hi - 20 : MAX}
              aria-valuenow={val}
              aria-valuetext={`$${val}`}
              style={{ left: k === "lo" ? leftLo : leftHi, zIndex: which.current === k ? 2 : 1 }}
              animate={{ scale: active && which.current === k ? 1.18 : 1 }}
              transition={T}
              onFocus={() => (which.current = k)}
              onKeyDown={(e) =>
                k === "lo"
                  ? keyStep(e, lo, 0, hi - 20, 10, setLo)
                  : keyStep(e, hi, lo + 20, MAX, 10, setHi)
              }
            />
          );
        })}
      </div>
      <div className="sf-scale sf-num" aria-hidden="true">
        <span>$0</span>
        <span>$250</span>
        <span>$500+</span>
      </div>
    </div>
  );
}

/** 03 · Notched stepper: ticks swell as the thumb nears, release snaps with overshoot. */
const QUAL = ["480p", "720p", "1080p", "1440p", "4K"];
function Notch({ i, n, pos }: { i: number; n: number; pos: MotionValue<number> }) {
  const s = useTransform(pos, (x) => 1 + Math.max(0, 1 - Math.abs(x - i / (n - 1)) * 5) * 1.4);
  return <motion.i className="sf-notch" style={{ left: `${(i / (n - 1)) * 100}%`, scaleY: s }} />;
}
export function NotchedStepper() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(2);
  const pos = useMotionValue(0.5);
  const left = useTransform(pos, (x) => `${x * 100}%`);
  const fill = useTransform(pos, (x) => `${x * 100}%`);
  const last = React.useRef(2);
  const snap = (i: number) => {
    setIdx(i);
    if (reduce) pos.set(i / 4);
    else animate(pos, i / 4, { type: "spring", stiffness: 520, damping: 15, mass: 0.7 });
  };
  const { ref, active, bind } = useScrub(
    "x",
    (t) => {
      pos.stop();
      pos.set(t);
      const i = Math.round(t * 4);
      if (i !== last.current) {
        last.current = i;
        setIdx(i);
      }
    },
    () => snap(last.current),
  );
  return (
    <div className="sf sf-card sf-v03">
      <div className="sf-head">
        <span className="sf-label">Stream quality</span>
        <output className="sf-val">{QUAL[idx]}</output>
      </div>
      <div className="sf-rail-wrap sf-tall" ref={ref} {...bind}>
        <div className="sf-rail" />
        <motion.div className="sf-fill" style={{ width: fill }} />
        {QUAL.map((_, i) => (
          <Notch key={i} i={i} n={5} pos={pos} />
        ))}
        <motion.div
          className="sf-thumb"
          role="slider"
          tabIndex={0}
          aria-label="Stream quality"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={idx}
          aria-valuetext={QUAL[idx]}
          style={{ left }}
          animate={{ scale: active ? 1.12 : 1 }}
          onKeyDown={(e) => {
            if (keyStep(e, idx, 0, 4, 1, (n) => ((last.current = n), snap(n)))) return;
          }}
        />
      </div>
      <div className="sf-steps" aria-hidden="true">
        {QUAL.map((q, i) => (
          <span key={q} className={i === idx ? "on" : ""}>
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 04 · Radial dial: 270 degree arc, angle-driven drag, colour warms with the value. */
export function RadialDial() {
  const MIN = 16;
  const MAXV = 30;
  const [v, setV] = React.useState(21.5);
  const t = (v - MIN) / (MAXV - MIN);
  const m = useSmoothed(t, 300, 28);
  const off = useTransform(m, (x) => 1 - x);
  const rot = useTransform(m, (x) => x * 270 - 135);
  const col = useTransform(m, [0, 1], ["hsl(38 88% 54%)", "hsl(12 82% 50%)"]);
  const prev = React.useRef(t);
  const box = React.useRef<HTMLDivElement>(null);
  const down = React.useRef(false);
  const set = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    const a = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    let nt: number;
    if (Math.abs(a) > 135) nt = prev.current > 0.5 ? 1 : 0;
    else nt = (a + 135) / 270;
    prev.current = nt;
    setV(Math.round((MIN + nt * (MAXV - MIN)) * 2) / 2);
  };
  const pt = (a: number, r: number) => {
    const rad = (a * Math.PI) / 180;
    return `${(110 + r * Math.sin(rad)).toFixed(2)} ${(110 - r * Math.cos(rad)).toFixed(2)}`;
  };
  const arc = `M ${pt(-135, 84)} A 84 84 0 1 1 ${pt(135, 84)}`;
  return (
    <div className="sf sf-card sf-v04">
      <div
        className="sf-dial"
        ref={box}
        onPointerDown={(e) => {
          down.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e);
        }}
        onPointerMove={(e) => down.current && set(e)}
        onPointerUp={() => (down.current = false)}
        onPointerCancel={() => (down.current = false)}
      >
        <svg viewBox="0 0 220 220" aria-hidden="true">
          {Array.from({ length: 29 }, (_, i) => {
            const a = -135 + (i * 270) / 28;
            const big = i % 7 === 0;
            return (
              <line
                key={i}
                x1={pt(a, 96).split(" ")[0]}
                y1={pt(a, 96).split(" ")[1]}
                x2={pt(a, big ? 106 : 102).split(" ")[0]}
                y2={pt(a, big ? 106 : 102).split(" ")[1]}
                className={big ? "tk big" : "tk"}
              />
            );
          })}
          <path d={arc} className="sf-arc-bg" pathLength={1} />
          <motion.path d={arc} className="sf-arc" pathLength={1} style={{ strokeDashoffset: off, stroke: col }} />
        </svg>
        <motion.div className="sf-dial-hand" style={{ rotate: rot }} aria-hidden="true">
          <i />
        </motion.div>
        <div
          className="sf-dial-core"
          role="slider"
          tabIndex={0}
          aria-label="Target temperature"
          aria-valuemin={MIN}
          aria-valuemax={MAXV}
          aria-valuenow={v}
          aria-valuetext={`${v.toFixed(1)} degrees Celsius`}
          onKeyDown={(e) => keyStep(e, v, MIN, MAXV, 0.5, (n) => setV(Math.round(n * 2) / 2))}
        >
          <span className="sf-label">Heating</span>
          <output className="sf-dial-num">
            {v.toFixed(1)}
            <sup>°C</sup>
          </output>
        </div>
      </div>
    </div>
  );
}

/** 05 · Level bars: tap or drag across, bars rise and fall in a travelling wave. */
export function LevelBars() {
  const N = 20;
  const [lvl, setLvl] = React.useState(13);
  const [muted, setMuted] = React.useState(false);
  const eff = muted ? 0 : lvl;
  const T = SPRING;
  const reduce = useReducedMotion();
  const { ref, bind } = useScrub("x", (t) => {
    setMuted(false);
    setLvl(Math.round(t * N));
  });
  return (
    <div className="sf sf-card sf-v05">
      <div className="sf-head">
        <button type="button" className="sf-icon-btn" aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((x) => !x)}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <output className="sf-val">{Math.round((eff / N) * 100)}%</output>
      </div>
      <div
        className="sf-bars"
        ref={ref}
        {...bind}
        role="slider"
        tabIndex={0}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={N}
        aria-valuenow={eff}
        aria-valuetext={`${Math.round((eff / N) * 100)} percent`}
        onKeyDown={(e) => {
          if (e.key === "m" || e.key === "M") return setMuted((x) => !x);
          keyStep(e, lvl, 0, N, 1, (n) => (setMuted(false), setLvl(n)));
        }}
      >
        {Array.from({ length: N }, (_, i) => {
          const on = i < eff;
          return (
            <motion.span
              key={i}
              className={on ? "on" : ""}
              style={{ height: 16 + Math.round(Math.pow(i / (N - 1), 1.4) * 40) }}
              initial={false}
              animate={{ scaleY: on ? 1 : 0.55, y: on ? 0 : 2 }}
              transition={reduce ? { duration: 0 } : { ...T, delay: Math.abs(i - eff) * 0.012 }}
            />
          );
        })}
      </div>
    </div>
  );
}

/** 06 · Tick ruler: drag the scale under a fixed needle, inertia lands on the nearest half. */
export function TickRuler() {
  const MIN = 40;
  const MAXV = 120;
  const PX = 14;
  const STEP = PX / 2;
  const reduce = useReducedMotion();
  const x = useMotionValue(-(72 - MIN) * PX);
  const [v, setV] = React.useState(72);
  const toV = (px: number) => clamp(Math.round((MIN + -px / PX) * 2) / 2, MIN, MAXV);
  useMotionValueEvent(x, "change", (l) => setV(toV(l)));
  const goto = (nv: number) => {
    const target = -(nv - MIN) * PX;
    if (reduce) x.set(target);
    else animate(x, target, SPRING);
  };
  const count = (MAXV - MIN) * 2 + 1;
  return (
    <div className="sf sf-card sf-v06">
      <div className="sf-head">
        <span className="sf-label">Body weight</span>
        <output className="sf-val">
          {v.toFixed(1)}
          <small> kg</small>
        </output>
      </div>
      <div
        className="sf-ruler" data-allow-overflow
        role="slider"
        tabIndex={0}
        aria-label="Body weight"
        aria-valuemin={MIN}
        aria-valuemax={MAXV}
        aria-valuenow={v}
        aria-valuetext={`${v.toFixed(1)} kilograms`}
        onKeyDown={(e) => keyStep(e, v, MIN, MAXV, 0.5, goto)}
      >
        <motion.div
          className="sf-ruler-strip"
          style={{ x, width: (MAXV - MIN) * PX }}
          drag="x"
          dragConstraints={{ left: -(MAXV - MIN) * PX, right: 0 }}
          dragElastic={0.06}
          dragMomentum={!reduce}
          dragTransition={{ power: 0.28, timeConstant: 160, modifyTarget: (t: number) => Math.round(t / STEP) * STEP }}
          onDragEnd={() => reduce && x.set(Math.round(x.get() / STEP) * STEP)}
        >
          {Array.from({ length: count }, (_, i) => {
            const val = MIN + i / 2;
            const major = i % 10 === 0;
            const mid = i % 2 === 0;
            return (
              <i key={i} className={major ? "major" : mid ? "mid" : ""} style={{ left: i * STEP }}>
                {major && <b className="sf-num">{val}</b>}
              </i>
            );
          })}
        </motion.div>
        <span className="sf-needle" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ================================================================== */
/* BATCH 2 · reveal, confirm and morphing sliders                      */
/* ================================================================== */

/** 07 · Before/after reveal: clip-path wipe with a handle that settles on a spring. */
export function RevealCompare() {
  const reduce = useReducedMotion();
  const [t, setT] = React.useState(0.06);
  const m = useSmoothed(t, 200, 22);
  const left = useTransform(m, (x) => `${x * 100}%`);
  const clip = useTransform(m, (x) => `inset(0 ${(1 - x) * 100}% 0 0)`);
  React.useEffect(() => {
    const id = setTimeout(() => setT(0.5), reduce ? 0 : 350);
    return () => clearTimeout(id);
  }, [reduce]);
  const { ref, active, bind } = useScrub("x", (v) => setT(v));
  return (
    <div className="sf sf-v07">
      <div
        className="sf-cmp"
        ref={ref}
        {...bind}
        role="slider"
        tabIndex={0}
        aria-label="Reveal graded photo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(t * 100)}
        aria-valuetext={`${Math.round(t * 100)} percent graded`}
        onKeyDown={(e) => keyStep(e, Math.round(t * 100), 0, 100, 2, (n) => setT(n / 100))}
      >
        <Art n={3} className="sf-cmp-img" />
        <motion.div className="sf-cmp-top" style={{ clipPath: clip }}>
          <Art n={3} className="sf-cmp-img" grey />
        </motion.div>
        <span className="sf-cmp-tag l">Raw</span>
        <span className="sf-cmp-tag r">Graded</span>
        <motion.div className="sf-cmp-line" style={{ left }}>
          <motion.span animate={{ scale: active ? 1.14 : 1 }} transition={SNAPPY as never}>
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

/** 08 · Slide to confirm: drag past 85% to commit, anything less springs home. */
export function SlideConfirm() {
  const reduce = useReducedMotion();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [max, setMax] = React.useState(240);
  const [done, setDone] = React.useState(false);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + 56);
  const hint = useTransform(x, (v) => clamp(1 - v / (max * 0.55), 0, 1));
  const pct = useTransform(x, (v) => Math.round((v / max) * 100));
  const [p, setP] = React.useState(0);
  useMotionValueEvent(pct, "change", setP);
  React.useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const fit = () => setMax(Math.max(0, el.clientWidth - 56 - 8));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const to = (v: number) => (reduce ? x.set(v) : animate(x, v, SNAPPY));
  const commit = () => {
    to(max);
    setDone(true);
  };
  const release = () => (x.get() > max * 0.85 ? commit() : to(0));
  return (
    <div className="sf sf-card sf-v08">
      <div className="sf-head">
        <span className="sf-label">Transfer to Maya R.</span>
        <output className="sf-val sf-val-sm">₹4,200</output>
      </div>
      <div className={done ? "sf-slide done" : "sf-slide"} ref={trackRef}>
        <motion.div className="sf-slide-fill" style={{ width: fill }} />
        <motion.span className="sf-slide-hint" style={{ opacity: hint }} aria-hidden="true">
          Slide to send
        </motion.span>
        <span className="sf-slide-done" aria-live="polite">
          {done ? "Sent" : ""}
        </span>
        <motion.button
          type="button"
          className="sf-slide-thumb"
          role="slider"
          aria-label="Slide to send payment"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={p}
          aria-valuetext={done ? "Sent" : `${p} percent, press Enter to send`}
          style={{ x }}
          drag={done ? false : "x"}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={release}
          onKeyDown={(e) => {
            if (done) return;
            if (e.key === "Enter" || e.key === " " || e.key === "End") {
              e.preventDefault();
              commit();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              to(clamp(x.get() + max * 0.2, 0, max));
              if (x.get() + max * 0.2 > max * 0.85) commit();
            } else if (e.key === "ArrowLeft" || e.key === "Home") {
              e.preventDefault();
              to(clamp(x.get() - max * 0.2, 0, max));
            }
          }}
        >
          {done ? <Check size={20} /> : <ChevronsRight size={20} />}
        </motion.button>
      </div>
      <div className="sf-slide-foot">
        {done ? (
          <button
            type="button"
            className="sf-link"
            onClick={() => {
              setDone(false);
              to(0);
            }}
          >
            <RotateCcw size={14} /> Undo demo
          </button>
        ) : (
          <span className="sf-num">Arrives in 2 minutes</span>
        )}
      </div>
    </div>
  );
}

/** 09 · Hue palette: one hue rail, a whole harmony that follows with staggered springs. */
function hsl2hex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
export function HuePalette() {
  const [h, setH] = React.useState(22);
  const m = useSmoothed(h / 360, 340, 30);
  const left = useTransform(m, (x) => `${x * 100}%`);
  const T = useSpringT(SNAPPY);
  const reduceT = useReducedMotion();
  const { ref, active, bind } = useScrub("x", (t) => setH(Math.round(t * 360)));
  const stops = Array.from({ length: 13 }, (_, i) => `hsl(${i * 30} 72% 56%)`).join(",");
  const swatches = [-40, -20, 0, 20, 40].map((d) => mod(h + d, 360));
  return (
    <div className="sf sf-card sf-v09">
      <motion.div className="sf-hue-hero" style={{ backgroundColor: `hsl(${h} 72% 56%)` }}>
        <span className="sf-num">{hsl2hex(h, 72, 56)}</span>
        <small className="sf-num">{h}°</small>
      </motion.div>
      <div className="sf-rail-wrap" ref={ref} {...bind}>
        <div className="sf-rail sf-hue-rail" style={{ background: `linear-gradient(90deg,${stops})` }} />
        <motion.div
          className="sf-thumb"
          role="slider"
          tabIndex={0}
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={h}
          aria-valuetext={`${h} degrees, ${hsl2hex(h, 72, 56)}`}
          style={{ left, backgroundColor: `hsl(${h} 72% 56%)`, borderColor: "var(--sf-surf)" }}
          animate={{ scale: active ? 1.2 : 1 }}
          transition={T}
          onKeyDown={(e) => keyStep(e, h, 0, 360, 2, setH)}
        />
      </div>
      <div className="sf-sw" aria-hidden="true">
        {swatches.map((sh, i) => (
          <motion.i
            key={i}
            animate={{ backgroundColor: `hsl(${sh} 72% ${i === 2 ? 56 : 62}%)`, y: i === 2 ? -4 : 0 }}
            transition={reduceT ? { duration: 0 } : { type: "spring", stiffness: 260 - i * 20, damping: 24 }}
          />
        ))}
      </div>
    </div>
  );
}

/** 10 · Mood face: the mouth, brows and skin colour are all interpolated from one value. */
const MOODS = ["Rough", "Low", "Fine", "Good", "Great"];
export function MoodFace() {
  const [v, setV] = React.useState(7);
  const m = useSmoothed(v / 10, 260, 20);
  const left = useTransform(m, (x) => `${x * 100}%`);
  const skin = useTransform(m, [0, 0.5, 1], ["#d98a7a", "#f0c46c", "#9fc48a"]);
  const mouth = useTransform(m, (t) => `M 40 78 Q 60 ${(78 + (t - 0.5) * 2 * 20).toFixed(1)} 80 78`);
  const browL = useTransform(m, (t) => `M 36 ${(44 - (0.5 - t) * 8).toFixed(1)} L 50 ${(44 + (0.5 - t) * 8).toFixed(1)}`);
  const browR = useTransform(m, (t) => `M 70 ${(44 + (0.5 - t) * 8).toFixed(1)} L 84 ${(44 - (0.5 - t) * 8).toFixed(1)}`);
  const sq = useTransform(m, [0, 0.5, 1], [3.5, 5.5, 4.5]);
  const { ref, bind } = useScrub("x", (t) => setV(Math.round(t * 10)));
  const word = MOODS[Math.min(4, Math.floor((v / 10) * 5))];
  return (
    <div className="sf sf-card sf-v10">
      <div className="sf-face">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <motion.circle cx="60" cy="60" r="52" style={{ fill: skin }} />
          <motion.path d={browL} className="sf-stroke" />
          <motion.path d={browR} className="sf-stroke" />
          <motion.ellipse cx="46" cy="58" rx="4.5" style={{ ry: sq }} className="sf-eye" />
          <motion.ellipse cx="74" cy="58" rx="4.5" style={{ ry: sq }} className="sf-eye" />
          <motion.path d={mouth} className="sf-stroke thick" />
        </svg>
        <div>
          <span className="sf-label">How was today</span>
          <output className="sf-val">
            {word} <small className="sf-num">{v}/10</small>
          </output>
        </div>
      </div>
      <div className="sf-rail-wrap" ref={ref} {...bind}>
        <div className="sf-rail" />
        <motion.div className="sf-fill" style={{ width: left }} />
        <motion.div
          className="sf-thumb"
          role="slider"
          tabIndex={0}
          aria-label="Mood"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={v}
          aria-valuetext={`${word}, ${v} out of 10`}
          style={{ left }}
          onKeyDown={(e) => keyStep(e, v, 0, 10, 1, setV)}
        />
      </div>
    </div>
  );
}

/** 11 · Liquid tank: vertical fill with a travelling wave on the surface. */
export function LiquidTank() {
  const MAXML = 2500;
  const [ml, setMl] = React.useState(1700);
  const m = useSmoothed(ml / MAXML, 140, 14);
  const y = useTransform(m, (x) => `${(1 - x) * 100}%`);
  const { ref, bind } = useScrub("y", (t) => setMl(Math.round((t * MAXML) / 100) * 100));
  return (
    <div className="sf sf-card sf-v11">
      <div className="sf-tank-row">
        <div
          className="sf-tank"
          ref={ref}
          {...bind}
          role="slider"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="Water intake"
          aria-valuemin={0}
          aria-valuemax={MAXML}
          aria-valuenow={ml}
          aria-valuetext={`${ml} millilitres`}
          onKeyDown={(e) => keyStep(e, ml, 0, MAXML, 100, setMl, true)}
        >
          <motion.div className="sf-water" style={{ y }}>
            <svg className="sf-wave" viewBox="0 0 240 16" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 8 Q30 0 60 8 T120 8 T180 8 T240 8 V16 H0Z" />
            </svg>
            <svg className="sf-wave b" viewBox="0 0 240 16" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 8 Q30 16 60 8 T120 8 T180 8 T240 8 V16 H0Z" />
            </svg>
          </motion.div>
          {[0.25, 0.5, 0.75].map((g) => (
            <i key={g} style={{ bottom: `${g * 100}%` }} aria-hidden="true" />
          ))}
        </div>
        <div className="sf-tank-read">
          <span className="sf-label">Water today</span>
          <output className="sf-val sf-big">{ml.toLocaleString("en-US")}</output>
          <span className="sf-num sf-sub">
            of {MAXML.toLocaleString("en-US")} ml · {Math.round((ml / MAXML) * 100)}%
          </span>
          <div className="sf-pm">
            <button type="button" className="sf-icon-btn" aria-label="Less water" onClick={() => setMl((v) => clamp(v - 250, 0, MAXML))}>
              −
            </button>
            <button type="button" className="sf-icon-btn" aria-label="More water" onClick={() => setMl((v) => clamp(v + 250, 0, MAXML))}>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 12 · Stretch segments: leading edge of the pill races ahead, trailing edge lags. */
const PERIODS = ["Hour", "Day", "Week", "Month", "Year"];
export function StretchSegments() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(2);
  const prev = React.useRef(2);
  const L = useMotionValue(40);
  const R = useMotionValue(60);
  const right = useTransform(R, (r) => `${100 - r}%`);
  const left = useTransform(L, (l) => `${l}%`);
  const btns = React.useRef<(HTMLButtonElement | null)[]>([]);
  React.useEffect(() => {
    const fwd = idx > prev.current;
    prev.current = idx;
    const fast = { type: "spring", stiffness: 520, damping: 34 } as const;
    const slow = { type: "spring", stiffness: 160, damping: 22 } as const;
    if (reduce) {
      L.set(idx * 20);
      R.set((idx + 1) * 20);
      return;
    }
    animate(L, idx * 20, fwd ? slow : fast);
    animate(R, (idx + 1) * 20, fwd ? fast : slow);
  }, [idx, reduce, L, R]);
  const { ref, bind } = useScrub("x", (t) => setIdx(clamp(Math.floor(t * 5), 0, 4)));
  const go = (n: number) => {
    setIdx(n);
    btns.current[n]?.focus();
  };
  const demand = [18, 142, 912, 3840, 41200][idx];
  return (
    <div className="sf sf-card sf-v12">
      <div className="sf-head">
        <span className="sf-label">Report range</span>
        <output className="sf-val">{demand.toLocaleString("en-US")}</output>
      </div>
      <div
        className="sf-seg"
        ref={ref}
        {...bind}
        role="radiogroup"
        aria-label="Report range"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), go(Math.min(4, idx + 1)));
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), go(Math.max(0, idx - 1)));
          if (e.key === "Home") (e.preventDefault(), go(0));
          if (e.key === "End") (e.preventDefault(), go(4));
        }}
      >
        <span className="sf-seg-track" aria-hidden="true">
          <motion.span className="sf-seg-pill" style={{ left, right }} />
        </span>
        {PERIODS.map((p, i) => (
          <button
            key={p}
            ref={(el) => {
              btns.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={idx === i}
            tabIndex={idx === i ? 0 : -1}
            className={idx === i ? "on" : ""}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="sf-sub sf-num">events in the last {PERIODS[idx].toLowerCase()}</p>
    </div>
  );
}

/* ================================================================== */
/* BATCH 3 · carousels                                                 */
/* ================================================================== */

function NavBtn({ dir, onClick, disabled, label }: { dir: "prev" | "next"; onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button type="button" className="sf-nav" onClick={onClick} disabled={disabled} aria-label={label ?? (dir === "prev" ? "Previous slide" : "Next slide")}>
      {dir === "prev" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
    </button>
  );
}

function useCarouselKeys(count: number, idx: number, go: (n: number) => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), go(Math.min(count - 1, idx + 1)));
    else if (e.key === "ArrowLeft") (e.preventDefault(), go(Math.max(0, idx - 1)));
    else if (e.key === "Home") (e.preventDefault(), go(0));
    else if (e.key === "End") (e.preventDefault(), go(count - 1));
  };
}

/** 13 · Snap scroller: native scroll-snap, mouse drag, live progress rail, dimmed neighbours. */
export function SnapScroller() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [idx, setIdx] = React.useState(0);
  const [prog, setProg] = React.useState(0.12);
  const p = useSmoothed(prog, 300, 34);
  const scaleX = useTransform(p, (v) => clamp(v, 0, 1));
  const drag = React.useRef<{ x: number; s: number } | null>(null);
  const step = () => {
    const el = ref.current!;
    const a = el.children[0] as HTMLElement;
    const b = el.children[1] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(clamp(Math.round(el.scrollLeft / step()), 0, PLACES.length - 1));
    setProg((el.scrollLeft + el.clientWidth * 0.76) / el.scrollWidth);
  };
  const go = (n: number) => ref.current?.scrollTo({ left: n * step(), behavior: reduce ? "auto" : "smooth" });
  return (
    <div className="sf sf-v13">
      <div
        className="sf-snap" data-allow-overflow
        ref={ref}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Destinations"
        onScroll={onScroll}
        onKeyDown={useCarouselKeys(PLACES.length, idx, go)}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { x: e.clientX, s: ref.current!.scrollLeft };
          ref.current!.style.scrollSnapType = "none";
          ref.current!.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) ref.current!.scrollLeft = drag.current.s - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          const el = ref.current!;
          el.style.scrollSnapType = "";
          el.scrollTo({ left: Math.round(el.scrollLeft / step()) * step(), behavior: reduce ? "auto" : "smooth" });
        }}
      >
        {PLACES.map((pl, i) => (
          <figure key={pl.title} className="sf-snap-card" data-active={i === idx} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${PLACES.length}`}>
            <Art n={i} className="sf-snap-art" />
            <figcaption>
              <b>{pl.title}</b>
              <span>{pl.sub}</span>
              <em className="sf-num">{pl.meta}</em>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="sf-snap-bar">
        <div className="sf-progress" aria-hidden="true">
          <motion.i style={{ scaleX }} />
        </div>
        <span className="sf-num sf-sub">
          {pad2(idx + 1)} / {pad2(PLACES.length)}
        </span>
        <NavBtn dir="prev" onClick={() => go(idx - 1)} disabled={idx === 0} />
        <NavBtn dir="next" onClick={() => go(idx + 1)} disabled={idx === PLACES.length - 1} />
      </div>
    </div>
  );
}

/** 14 · Cover flow: neighbours pivot on the Y axis in real perspective. */
export function CoverFlow() {
  const [idx, setIdx] = React.useState(3);
  const [u, setU] = React.useState(1);
  const cf = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = cf.current!;
    const fit = () => setU(clamp(el.clientWidth / 340, 0.6, 1));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const T = useSpringT({ type: "spring", stiffness: 240, damping: 26, mass: 0.9 });
  const keys = useCarouselKeys(PLACES.length, idx, setIdx);
  return (
    <div className="sf sf-v14">
      <motion.div
        ref={cf}
        className="sf-cf" data-allow-overflow
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Cover flow"
        onKeyDown={keys}
        onPanEnd={(_, i: PanInfo) => {
          if (i.offset.x < -40 || i.velocity.x < -400) setIdx((v) => Math.min(PLACES.length - 1, v + 1));
          else if (i.offset.x > 40 || i.velocity.x > 400) setIdx((v) => Math.max(0, v - 1));
        }}
      >
        {PLACES.map((pl, i) => {
          const d = i - idx;
          const a = Math.abs(d);
          return (
            <motion.button
              key={pl.title}
              type="button"
              className="sf-cf-item"
              tabIndex={-1}
              aria-label={`${pl.title}, ${i + 1} of ${PLACES.length}`}
              aria-current={d === 0}
              onClick={() => setIdx(i)}
              initial={false}
              animate={{
                x: (d * 32 + Math.sign(d) * (a > 0 ? 48 : 0)) * u,
                rotateY: -clamp(d, -1, 1) * 54,
                scale: (d === 0 ? 1 : 0.84) * u,
                z: d === 0 ? 40 : -a * 40,
                opacity: a > 2 ? 0 : 1,
                filter: `brightness(${d === 0 ? 1 : 0.72})`,
              }}
              transition={T}
              style={{ zIndex: 10 - a }}
            >
              <Art n={i} className="sf-cf-art" />
            </motion.button>
          );
        })}
      </motion.div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={idx}
          className="sf-cf-cap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }}
          aria-live="polite"
        >
          <b>{PLACES[idx].title}</b>
          <span className="sf-num">
            {PLACES[idx].sub} · {PLACES[idx].meta}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** 15 · Swipe deck: fling the top card, the stack below rises into place. */
function DeckCard({ i, depth, dir, onFling }: { i: number; depth: number; dir: React.MutableRefObject<number>; onFling: (d: 1 | -1) => void }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const save = useTransform(x, [20, 110], [0, 1]);
  const skip = useTransform(x, [-110, -20], [1, 0]);
  const pl = PLACES[mod(i, PLACES.length)];
  void dir;
  return (
    <motion.article
      className="sf-deck-card"
      style={{ x: depth === 0 ? x : 0, rotate: depth === 0 ? rotate : 0, zIndex: 10 - depth }}
      initial={{ scale: 1 - (depth + 1) * 0.05, y: (depth + 1) * 14, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: 1 - depth * 0.18 }}
      variants={{
        out: (d: number) => ({ x: d * 420, rotate: d * 16, opacity: 0, transition: reduce ? { duration: 0.12 } : { duration: 0.32, ease: [0.3, 0.7, 0.3, 1] } }),
      }}
      exit="out"
      transition={reduce ? { duration: 0 } : SOFT}
      drag={depth === 0 ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onFling(info.offset.x > 0 ? 1 : -1);
      }}
      aria-hidden={depth !== 0}
    >
      <Art n={mod(i, PLACES.length) + 2} className="sf-deck-art" />
      <div className="sf-deck-meta">
        <b>{pl.title}</b>
        <span className="sf-num">
          {pl.sub} · {pl.meta}
        </span>
      </div>
      {depth === 0 && (
        <>
          <motion.span className="sf-stamp save" style={{ opacity: save }}>
            Save
          </motion.span>
          <motion.span className="sf-stamp skip" style={{ opacity: skip }}>
            Skip
          </motion.span>
        </>
      )}
    </motion.article>
  );
}
export function SwipeDeck() {
  const [n, setN] = React.useState(0);
  const [saved, setSaved] = React.useState(0);
  const dir = React.useRef(1);
  const fling = (d: 1 | -1) => {
    dir.current = d;
    if (d === 1) setSaved((s) => s + 1);
    setN((v) => v + 1);
  };
  return (
    <div
      className="sf sf-v15"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Swipe deck. Right arrow saves, left arrow skips."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), fling(1));
        if (e.key === "ArrowLeft") (e.preventDefault(), fling(-1));
      }}
    >
      <div className="sf-deck" data-allow-overflow>
        <AnimatePresence custom={dir.current}>
          {[2, 1, 0].map((depth) => (
            <DeckCard key={n + depth} i={n + depth} depth={depth} dir={dir} onFling={fling} />
          ))}
        </AnimatePresence>
      </div>
      <div className="sf-deck-actions">
        <button type="button" className="sf-round" aria-label="Skip" onClick={() => fling(-1)}>
          <X size={22} />
        </button>
        <span className="sf-num sf-sub" aria-live="polite">
          {saved} saved
        </span>
        <button type="button" className="sf-round hot" aria-label="Save" onClick={() => fling(1)}>
          <Heart size={22} />
        </button>
      </div>
    </div>
  );
}

/** 16 · Card fan: a hand of cards pivoting from a point below the stage. */
export function CardFan() {
  const N = 7;
  const [idx, setIdx] = React.useState(3);
  const T = useSpringT({ type: "spring", stiffness: 300, damping: 24, mass: 0.8 });
  const keys = useCarouselKeys(N, idx, setIdx);
  return (
    <div className="sf sf-card sf-v16">
      <div className="sf-fan" data-allow-overflow tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Card fan" onKeyDown={keys}>
        {Array.from({ length: N }, (_, i) => {
          const d = i - idx;
          const pl = PLACES[i];
          return (
            <motion.button
              key={pl.title}
              type="button"
              className="sf-fan-card"
              tabIndex={-1}
              aria-label={`${pl.title}, ${i + 1} of ${N}`}
              aria-current={d === 0}
              onClick={() => setIdx(i)}
              initial={false}
              animate={{ rotate: d === 0 ? 0 : d * 5 + Math.sign(d) * 4, y: d === 0 ? -32 : Math.abs(d) * 3, scale: d === 0 ? 1.1 : 1 }}
              whileHover={d === 0 ? undefined : { y: -12 }}
              transition={T}
              style={{ zIndex: 20 - Math.abs(d) }}
            >
              <Art n={i + 4} className="sf-fan-art" />
              <span className="sf-num">{pad2(i + 1)}</span>
              <b>{pl.title}</b>
            </motion.button>
          );
        })}
      </div>
      <p className="sf-fan-cap">
        <b>{PLACES[idx].title}</b> <span className="sf-num">{PLACES[idx].meta}</span>
      </p>
    </div>
  );
}

/** 17 · Filmstrip gallery: directional wipe on the stage, a sliding ring on the thumbnails. */
export function FilmstripGallery() {
  const [idx, setIdx] = React.useState(0);
  const dir = React.useRef(1);
  const strip = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const go = (n: number) => {
    const t = clamp(n, 0, PLACES.length - 1);
    dir.current = t >= idx ? 1 : -1;
    setIdx(t);
  };
  React.useEffect(() => {
    const s = strip.current;
    const b = s?.children[idx] as HTMLElement | undefined;
    if (s && b) s.scrollTo({ left: b.offsetLeft - (s.clientWidth - b.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [idx, reduce]);
  const keys = useCarouselKeys(PLACES.length, idx, go);
  return (
    <div className="sf sf-card sf-v17" onKeyDown={keys}>
      <div className="sf-film-stage" tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Gallery">
        <AnimatePresence initial={false} custom={dir.current}>
          <motion.div
            key={idx}
            className="sf-film-slide"
            custom={dir.current}
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", zIndex: 2 }),
              center: { clipPath: "inset(0 0 0 0)", zIndex: 2 },
              exit: (d: number) => ({ x: reduce ? 0 : d * -48, scale: reduce ? 1 : 0.96, opacity: 0.4, zIndex: 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <Art n={idx + 1} className="sf-film-art" />
            <div className="sf-film-title">
              <b>{PLACES[idx].title}</b>
              <span>{PLACES[idx].sub}</span>
            </div>
          </motion.div>
        </AnimatePresence>
        <span className="sf-film-count sf-num">
          {pad2(idx + 1)} / {pad2(PLACES.length)}
        </span>
        <div className="sf-film-arrows">
          <NavBtn dir="prev" onClick={() => go(idx - 1)} disabled={idx === 0} />
          <NavBtn dir="next" onClick={() => go(idx + 1)} disabled={idx === PLACES.length - 1} />
        </div>
      </div>
      <div className="sf-film-strip" data-allow-overflow ref={strip} role="tablist" aria-label="Thumbnails">
        {PLACES.map((pl, i) => (
          <button key={pl.title} type="button" role="tab" aria-selected={i === idx} aria-label={pl.title} tabIndex={i === idx ? 0 : -1} onClick={() => go(i)}>
            <Art n={i + 1} className="sf-film-thumb" />
            {i === idx && (
              <motion.span layoutId="sf17-ring" className="sf-film-ring" transition={reduce ? { duration: 0 } : SPRING} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 18 · Parallax track: art, type and slide all travel at different speeds while you drag. */
const PX_SLIDES = [
  { k: "Arrival", t: "Cold light, long shadows" },
  { k: "Ascent", t: "Above the cloud line" },
  { k: "Crossing", t: "Eleven kilometres of salt" },
  { k: "Stillness", t: "Nothing moves but you" },
  { k: "Return", t: "Warm rooms, slow tea" },
];
function PxSlide({ i, w, x }: { i: number; w: number; x: MotionValue<number> }) {
  const art = useTransform(x, (v) => (v + i * w) * -0.45);
  const txt = useTransform(x, (v) => (v + i * w) * 0.3);
  const fade = useTransform(x, (v) => 1 - clamp(Math.abs(v + i * w) / (w * 0.7), 0, 1));
  return (
    <div className="sf-px-slide" style={{ width: w }}>
      <motion.div className="sf-px-art" style={{ x: art }}>
        <Art n={i * 2 + 1} className="sf-px-img" />
      </motion.div>
      <motion.div className="sf-px-text" style={{ x: txt, opacity: fade }}>
        <span className="sf-num">{pad2(i + 1)}</span>
        <b>{PX_SLIDES[i].k}</b>
        <em>{PX_SLIDES[i].t}</em>
      </motion.div>
    </div>
  );
}
export function ParallaxTrack() {
  const reduce = useReducedMotion();
  const box = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(360);
  const [idx, setIdx] = React.useState(0);
  const x = useMotionValue(0);
  const N = PX_SLIDES.length;
  React.useLayoutEffect(() => {
    const el = box.current!;
    const fit = () => setW(el.clientWidth);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useEffect(() => {
    x.set(-idx * w);
  }, [w]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (n: number) => {
    const t = clamp(n, 0, N - 1);
    setIdx(t);
    if (reduce) x.set(-t * w);
    else animate(x, -t * w, { type: "spring", stiffness: 260, damping: 30 });
  };
  const keys = useCarouselKeys(N, idx, go);
  return (
    <div className="sf sf-v18">
      <div className="sf-px" data-allow-overflow ref={box} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Journey" onKeyDown={keys}>
        <motion.div
          className="sf-px-track"
          style={{ x, width: w * N }}
          drag="x"
          dragConstraints={{ left: -(N - 1) * w, right: 0 }}
          dragElastic={0.14}
          dragMomentum={false}
          onDragEnd={(_, info) => go(clamp(Math.round((-x.get() - info.velocity.x * 0.18) / w), 0, N - 1))}
        >
          {PX_SLIDES.map((_, i) => (
            <PxSlide key={i} i={i} w={w} x={x} />
          ))}
        </motion.div>
      </div>
      <div className="sf-px-bar">
        <div className="sf-segs" role="tablist" aria-label="Slides">
          {PX_SLIDES.map((s, i) => (
            <button key={s.k} type="button" role="tab" aria-selected={i === idx} aria-label={s.k} onClick={() => go(i)}>
              <motion.i animate={{ width: i === idx ? 32 : 12, opacity: i === idx ? 1 : 0.35 }} transition={reduce ? { duration: 0 } : SPRING} />
            </button>
          ))}
        </div>
        <span className="sf-num sf-sub">
          {pad2(idx + 1)} / {pad2(N)}
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* BATCH 4 · timed, wheel, loop and expanding carousels                */
/* ================================================================== */

/** 19 · Stories: segmented timers, hold to pause, tap edges to step, slow push-in on each frame. */
const STORY_MS = 4.2;
export function StoryProgress() {
  const reduce = useReducedMotion();
  const N = 5;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(!!reduce);
  const [held, setHeld] = React.useState(false);
  const p = useMotionValue(0);
  const down = React.useRef(0);
  const stopped = paused || held;
  const next = React.useCallback(() => {
    p.set(0);
    setIdx((v) => (v + 1) % N);
  }, [p]);
  React.useEffect(() => {
    if (stopped) return;
    const c = animate(p, 1, { duration: STORY_MS * (1 - p.get()), ease: "linear", onComplete: next });
    return () => c.stop();
  }, [stopped, idx, p, next]);
  const step = (d: number) => {
    p.set(0);
    setIdx((v) => mod(v + d, N));
  };
  return (
    <div
      className="sf sf-v19"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Stories"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), step(1));
        if (e.key === "ArrowLeft") (e.preventDefault(), step(-1));
        if (e.key === " ") (e.preventDefault(), setPaused((v) => !v));
      }}
    >
      <div
        className="sf-story" data-allow-overflow
        onPointerDown={(e) => {
          down.current = performance.now();
          setHeld(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          setHeld(false);
          if (performance.now() - down.current < 220) {
            const r = e.currentTarget.getBoundingClientRect();
            step(e.clientX - r.left < r.width * 0.35 ? -1 : 1);
          }
        }}
        onPointerCancel={() => setHeld(false)}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={idx}
            className="sf-story-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
          >
            <motion.div
              className="sf-story-art"
              initial={{ scale: 1 }}
              animate={{ scale: reduce ? 1 : 1.12 }}
              transition={{ duration: STORY_MS + 1.2, ease: "linear" }}
            >
              <Art n={idx * 3 + 2} className="sf-story-img" />
            </motion.div>
            <motion.div
              className="sf-story-text"
              initial={{ y: reduce ? 0 : 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={reduce ? { duration: 0 } : { ...(SOFT as object), delay: 0.12 } as never}
            >
              <span className="sf-num">Day {pad2(idx + 1)}</span>
              <b>{PLACES[idx].title}</b>
              <em>{PLACES[idx].sub}</em>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="sf-story-bars" aria-hidden="true">
          {Array.from({ length: N }, (_, i) => (
            <span key={i}>
              {i < idx ? <i style={{ transform: "scaleX(1)" }} /> : i === idx ? <motion.i style={{ scaleX: p }} /> : null}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="sf-story-pause"
          aria-label={paused ? "Play stories" : "Pause stories"}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
    </div>
  );
}

/** 20 · Time wheels: three drums with real 3D falloff, flick inertia and rubber-band ends. */
const ITEM = 36;
function WheelItem({ i, pos, label }: { i: number; pos: MotionValue<number>; label: string }) {
  const ang = useTransform(pos, (p) => clamp((i - p) * 0.5, -1.4, 1.4));
  const y = useTransform(ang, (a) => 72 * Math.sin(a));
  const rotateX = useTransform(ang, (a) => (-a * 180) / Math.PI);
  const opacity = useTransform(ang, (a) => Math.pow(Math.cos(a), 3));
  return (
    <motion.li className="sf-wheel-item sf-num" style={{ y, rotateX, opacity }}>
      {label}
    </motion.li>
  );
}
function Wheel({ items, value, onChange, label }: { items: string[]; value: number; onChange: (n: number) => void; label: string }) {
  const reduce = useReducedMotion();
  const pos = useMotionValue(value);
  const st = React.useRef<{ y: number; p: number; t: number; v: number } | null>(null);
  const lock = React.useRef(0);
  const n = items.length;
  const settle = (to: number) => {
    onChange(to);
    if (reduce) pos.set(to);
    else animate(pos, to, { type: "spring", stiffness: 300, damping: 26 });
  };
  React.useEffect(() => {
    if (!st.current) pos.jump(value);
  }, [value, pos]);
  return (
    <div className="sf-wheel-col">
      <span className="sf-label">{label}</span>
      <div
        className="sf-wheel"
        tabIndex={0}
        role="slider"
        aria-orientation="vertical"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={value}
        aria-valuetext={items[value]}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") (e.preventDefault(), settle(Math.max(0, value - 1)));
          if (e.key === "ArrowDown") (e.preventDefault(), settle(Math.min(n - 1, value + 1)));
          if (e.key === "Home") (e.preventDefault(), settle(0));
          if (e.key === "End") (e.preventDefault(), settle(n - 1));
        }}
        onWheel={(e) => {
          const now = performance.now();
          if (Math.abs(e.deltaY) < 8 || now - lock.current < 90) return;
          lock.current = now;
          settle(clamp(value + Math.sign(e.deltaY), 0, n - 1));
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pos.stop();
          st.current = { y: e.clientY, p: pos.get(), t: performance.now(), v: 0 };
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s) return;
          const np = clamp(s.p - (e.clientY - s.y) / ITEM, -0.45, n - 1 + 0.45);
          const now = performance.now();
          s.v = (np - pos.get()) / Math.max(1, now - s.t);
          s.t = now;
          pos.set(np);
        }}
        onPointerUp={() => {
          const s = st.current;
          st.current = null;
          if (s) settle(clamp(Math.round(pos.get() + s.v * 180), 0, n - 1));
        }}
        onPointerCancel={() => {
          st.current = null;
          settle(value);
        }}
      >
        <span className="sf-wheel-band" aria-hidden="true" />
        <ul aria-hidden="true">
          {items.map((it, i) => (
            <WheelItem key={it} i={i} pos={pos} label={it} />
          ))}
        </ul>
      </div>
    </div>
  );
}
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINS = Array.from({ length: 12 }, (_, i) => pad2(i * 5));
export function TimeWheels() {
  const [h, setH] = React.useState(6);
  const [mi, setMi] = React.useState(5);
  const [ap, setAp] = React.useState(1);
  return (
    <div className="sf sf-card sf-v20">
      <div className="sf-head">
        <span className="sf-label">Alarm</span>
        <output className="sf-val">
          {HOURS[h]}:{MINS[mi]} <small>{ap ? "PM" : "AM"}</small>
        </output>
      </div>
      <div className="sf-wheels">
        <Wheel label="Hour" items={HOURS} value={h} onChange={setH} />
        <Wheel label="Minute" items={MINS} value={mi} onChange={setMi} />
        <Wheel label="Period" items={["AM", "PM"]} value={ap} onChange={setAp} />
      </div>
    </div>
  );
}

/** 21 · Logo marquee: two counter-rotating rails, hover eases them to a crawl, drag to fling. */
const BRANDS = ["Northwind", "Halcyon", "Fieldnotes", "Parcel", "Tessel", "Orbit & Co", "Lumen", "Ashgrove"];
const GLYPH = [
  "circle(50% at 50% 50%)",
  "polygon(50% 0, 100% 100%, 0 100%)",
  "inset(8% round 30%)",
  "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
  "polygon(0 0, 100% 0, 100% 40%, 40% 40%, 40% 100%, 0 100%)",
  "polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  "polygon(0 50%, 50% 0, 100% 50%, 50% 100%)",
  "circle(50% at 50% 50%)",
];
function Chip({ i, off }: { i: number; off?: number }) {
  return (
    <li className="sf-chip">
      <i style={{ clipPath: GLYPH[(i + (off ?? 0)) % GLYPH.length] }} />
      {BRANDS[i]}
    </li>
  );
}
function MarqueeRow({ reverse, off, playing }: { reverse?: boolean; off: number; playing: boolean }) {
  const reduce = useReducedMotion();
  const set = React.useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const vel = React.useRef(1);
  const hover = React.useRef(false);
  const grab = React.useRef<{ x: number; px: number } | null>(null);
  useAnimationFrame((_, dt) => {
    if (reduce || grab.current) return;
    const W = set.current?.offsetWidth ?? 0;
    if (!W) return;
    const target = !playing ? 0 : hover.current ? 0.2 : 1;
    vel.current += (target - vel.current) * Math.min(1, dt / 220);
    let nx = x.get() + (reverse ? 1 : -1) * 48 * vel.current * (dt / 1000);
    if (nx <= -W) nx += W;
    if (nx > 0) nx -= W;
    x.set(nx);
  });
  return (
    <div
      className="sf-marq"
      data-allow-overflow
      style={reduce ? { overflowX: "auto" } : undefined}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      onPointerDown={(e) => {
        if (reduce) return;
        grab.current = { x: e.clientX, px: x.get() };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const g = grab.current;
        const W = set.current?.offsetWidth ?? 1;
        if (g) x.set((((g.px + e.clientX - g.x) % W) - W) % W);
      }}
      onPointerUp={() => (grab.current = null)}
      onPointerCancel={() => (grab.current = null)}
    >
      <motion.div className="sf-marq-track" style={{ x }}>
        <ul ref={set}>
          {BRANDS.map((_, i) => (
            <Chip key={i} i={i} off={off} />
          ))}
        </ul>
        <ul aria-hidden="true">
          {BRANDS.map((_, i) => (
            <Chip key={i} i={i} off={off} />
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
export function LogoMarquee() {
  const [playing, setPlaying] = React.useState(true);
  return (
    <div className="sf sf-card sf-v21" role="group" aria-label="Trusted by teams at">
      <div className="sf-head">
        <span className="sf-label">Trusted by 2,400 teams</span>
        <button type="button" className="sf-icon-btn" aria-pressed={!playing} aria-label={playing ? "Pause marquee" : "Play marquee"} onClick={() => setPlaying((v) => !v)}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
      <MarqueeRow playing={playing} off={0} />
      <MarqueeRow playing={playing} off={3} reverse />
    </div>
  );
}

/** 22 · Loop carousel: endless ring, the centre grows, items that wrap teleport unseen. */
const ALBUMS = ["Salt Flats", "Night Ferry", "Low Tide", "Paper Lanterns", "Slow Burn", "Glasshouse", "Ninth Street"];
function LoopItem({ i, d, u, onPick, T }: { i: number; d: number; u: number; onPick: () => void; T: never }) {
  const prev = React.useRef(d);
  const jump = Math.abs(d - prev.current) > 2;
  React.useEffect(() => {
    prev.current = d;
  });
  const a = Math.abs(d);
  return (
    <motion.button
      type="button"
      className="sf-loop-item"
      tabIndex={-1}
      aria-label={`${ALBUMS[i]}, ${i + 1} of ${ALBUMS.length}`}
      aria-current={d === 0}
      onClick={onPick}
      initial={false}
      animate={{
        x: d === 0 ? 0 : Math.sign(d) * (92 + (a - 1) * 56) * u,
        scale: (1 - a * 0.2) * u,
        opacity: a > 2 ? 0 : a === 2 ? 0.35 : 1 - a * 0.2,
      }}
      transition={jump ? { duration: 0 } : T}
      style={{ zIndex: 10 - a, pointerEvents: a > 2 ? "none" : "auto" }}
    >
      <Art n={i + 5} className="sf-loop-art" />
    </motion.button>
  );
}
export function LoopCarousel() {
  const N = ALBUMS.length;
  const [idx, setIdx] = React.useState(0);
  const [u, setU] = React.useState(1);
  const box = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = box.current!;
    const fit = () => setU(clamp(el.clientWidth / 340, 0.6, 1));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const T = useSpringT({ type: "spring", stiffness: 280, damping: 28, mass: 0.9 });
  const step = (d: number) => setIdx((v) => mod(v + d, N));
  return (
    <div className="sf sf-card sf-v22">
      <div
        className="sf-loop" data-allow-overflow
        ref={box}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Albums"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), step(1));
          if (e.key === "ArrowLeft") (e.preventDefault(), step(-1));
        }}
      >
        <motion.div
          className="sf-loop-stage"
          onPanEnd={(_, i) => {
            if (i.offset.x < -36) step(1);
            else if (i.offset.x > 36) step(-1);
          }}
        >
          {ALBUMS.map((_, i) => {
            let d = i - idx;
            if (d > N / 2) d -= N;
            if (d < -N / 2) d += N;
            return <LoopItem key={i} i={i} d={d} u={u} T={T} onPick={() => setIdx(i)} />;
          })}
        </motion.div>
      </div>
      <div className="sf-loop-foot">
        <NavBtn dir="prev" onClick={() => step(-1)} />
        <div className="sf-loop-cap" aria-live="polite">
          <b>{ALBUMS[idx]}</b>
          <span className="sf-num">
            Track {pad2(idx + 1)} of {pad2(N)}
          </span>
        </div>
        <NavBtn dir="next" onClick={() => step(1)} />
      </div>
    </div>
  );
}

/** 23 · Expanding panels: flex-grow on a spring, copy fades in once there is room. */
const PANELS = [
  { k: "Studio", d: "Light-filled floors with north windows and concrete benches." },
  { k: "Kiln", d: "Four electric kilns, fired twice a week by the same hands." },
  { k: "Garden", d: "Clay beds, olive trees and one very serious cat." },
  { k: "Library", d: "Glaze books, bound test tiles and a quiet table." },
  { k: "Shop", d: "Small runs, numbered underneath. Never restocked." },
];
export function ExpandPanels() {
  const [idx, setIdx] = React.useState(0);
  const T = useSpringT({ type: "spring", stiffness: 260, damping: 30 });
  const reduceM = useReducedMotion();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const go = (n: number) => {
    setIdx(n);
    refs.current[n]?.focus();
  };
  return (
    <div
      className="sf sf-v23"
      role="group"
      aria-label="Our spaces"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), go(Math.min(PANELS.length - 1, idx + 1)));
        if (e.key === "ArrowLeft") (e.preventDefault(), go(Math.max(0, idx - 1)));
      }}
    >
      <div className="sf-acc" data-allow-overflow>
        {PANELS.map((pn, i) => {
          const on = i === idx;
          return (
            <motion.button
              key={pn.k}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              className={on ? "sf-acc-p on" : "sf-acc-p"}
              aria-expanded={on}
              onClick={() => setIdx(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setIdx(i)}
              initial={false}
              animate={{ flexGrow: on ? 6 : 1 }}
              transition={T}
            >
              <Art n={i * 2 + 1} className="sf-acc-art" />
              <span className="sf-acc-shade" />
              <span className="sf-acc-vert">{pn.k}</span>
              <motion.span
                className="sf-acc-copy"
                animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
                transition={reduceM ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 26, delay: on ? 0.08 : 0 }}
              >
                <i className="sf-num">{pad2(i + 1)}</i>
                <b>{pn.k}</b>
                <small>{pn.d}</small>
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** 24 · Momentum shelf: free drag with elastic ends, the cards skew with your velocity. */
const SHELF = [
  { n: "Ridge mug", p: 28 },
  { n: "Salt cellar", p: 34 },
  { n: "Low bowl", p: 42 },
  { n: "Bud vase", p: 38 },
  { n: "Tall pitcher", p: 64 },
  { n: "Tea set", p: 96 },
  { n: "Dish, large", p: 58 },
];
export function MomentumShelf() {
  const reduce = useReducedMotion();
  const box = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const [lim, setLim] = React.useState(0);
  const [bag, setBag] = React.useState<number[]>([]);
  const x = useMotionValue(0);
  const v = useVelocity(x);
  const skewRaw = useTransform(v, [-2400, 0, 2400], [10, 0, -10]);
  const skew = useSpring(skewRaw, { stiffness: 260, damping: 26 });
  React.useLayoutEffect(() => {
    const fit = () => setLim(Math.max(0, track.current!.scrollWidth - box.current!.clientWidth));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box.current!);
    return () => ro.disconnect();
  }, []);
  const move = (d: number) => {
    const t = clamp(x.get() - d * 160, -lim, 0);
    if (reduce) x.set(t);
    else animate(x, t, SOFT);
  };
  return (
    <div className="sf sf-card sf-v24">
      <div className="sf-head">
        <span className="sf-label">New in ceramics</span>
        <output className="sf-num sf-sub">Bag · {bag.length}</output>
      </div>
      <div
        className="sf-shelf" data-allow-overflow
        ref={box}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Ceramics shelf"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), move(1));
          if (e.key === "ArrowLeft") (e.preventDefault(), move(-1));
        }}
      >
        <motion.div
          className="sf-shelf-track"
          ref={track}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -lim, right: 0 }}
          dragElastic={0.32}
          dragTransition={{ power: 0.32, timeConstant: 260, bounceStiffness: 340, bounceDamping: 30 }}
        >
          {SHELF.map((it, i) => {
            const inBag = bag.includes(i);
            return (
              <motion.article key={it.n} className="sf-shelf-card" style={{ skewX: reduce ? 0 : skew }}>
                <Art n={i + 2} className="sf-shelf-art" />
                <b>{it.n}</b>
                <div>
                  <span className="sf-num">${it.p}</span>
                  <button
                    type="button"
                    className={inBag ? "sf-add on" : "sf-add"}
                    aria-pressed={inBag}
                    aria-label={`${inBag ? "Remove" : "Add"} ${it.n}`}
                    onClick={() => setBag((b) => (b.includes(i) ? b.filter((q) => q !== i) : [...b, i]))}
                  >
                    {inBag ? <Check size={14} /> : <span aria-hidden="true">+</span>}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* BATCH 5 · narrative, 3D, morphing and playback                      */
/* ================================================================== */

/** 25 · Quote carousel: direction-aware slide, words resolve one by one out of a blur. */
const QUOTES = [
  { q: "We replaced three tools and two spreadsheets in a week. Nobody asked for the old ones back.", n: "Ines Duarte", r: "Head of Ops, Parcel", c: "#c8603c" },
  { q: "The handoff went from a forty minute call to a link. That alone paid for the quarter.", n: "Tomas Reyes", r: "Design lead, Halcyon", c: "#5d7048" },
  { q: "It feels built by people who have actually shipped on a Friday afternoon.", n: "Aiko Mori", r: "CTO, Tessel", c: "#3f5a72" },
  { q: "Our support queue halved. I stopped checking it before coffee.", n: "Rana Haddad", r: "Support, Northwind", c: "#a2514f" },
];
export function QuoteCarousel() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(0);
  const dir = React.useRef(1);
  const go = (n: number) => {
    const t = mod(n, QUOTES.length);
    dir.current = n > idx || (idx === QUOTES.length - 1 && t === 0) ? 1 : -1;
    setIdx(t);
  };
  const qd = QUOTES[idx];
  return (
    <div
      className="sf sf-card sf-v25"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer quotes"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), go(idx + 1));
        if (e.key === "ArrowLeft") (e.preventDefault(), go(idx - 1));
      }}
    >
      <div className="sf-quote-stage">
        <AnimatePresence mode="wait" initial={false} custom={dir.current}>
          <motion.figure
            key={idx}
            className="sf-quote"
            custom={dir.current}
            variants={{
              in: (d: number) => ({ x: reduce ? 0 : d * 40, opacity: 0 }),
              show: { x: 0, opacity: 1 },
              out: (d: number) => ({ x: reduce ? 0 : d * -40, opacity: 0 }),
            }}
            initial="in"
            animate="show"
            exit="out"
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.3, 0.7, 0.3, 1] }}
          >
            <blockquote>
              {qd.q.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                >
                  {w}{" "}
                </motion.span>
              ))}
            </blockquote>
            <figcaption>
              <b>{qd.n}</b>
              <span>{qd.r}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="sf-quote-foot">
        <div className="sf-avatars" role="tablist" aria-label="Quotes">
          {QUOTES.map((qq, i) => (
            <button key={qq.n} type="button" role="tab" aria-selected={i === idx} aria-label={qq.n} onClick={() => go(i)} style={{ background: qq.c }}>
              {qq.n
                .split(" ")
                .map((s) => s[0])
                .join("")}
              {i === idx && <motion.i layoutId="sf25-ring" className="sf-av-ring" transition={reduce ? { duration: 0 } : SPRING} />}
            </button>
          ))}
        </div>
        <div className="sf-pair">
          <NavBtn dir="prev" onClick={() => go(idx - 1)} />
          <NavBtn dir="next" onClick={() => go(idx + 1)} />
        </div>
      </div>
    </div>
  );
}

/** 26 · Timeline scrub: drag through uneven years, milestones pop as you pass, headcount counts up. */
const EVENTS = [
  { y: 2018, t: "Founded", s: "Two people and one borrowed garage.", n: 2 },
  { y: 2019, t: "First customer", s: "A bakery in Porto paid for a pilot.", n: 5 },
  { y: 2021, t: "Seed round", s: "Closed in nine days, never announced.", n: 14 },
  { y: 2022, t: "Moved to a studio", s: "Real chairs, finally.", n: 38 },
  { y: 2024, t: "Launched v2", s: "Rewritten from scratch in public.", n: 71 },
  { y: 2026, t: "Profitable", s: "Fourth quarter in a row.", n: 120 },
];
function Count({ to }: { to: number }) {
  const mv = useMotionValue(to);
  const reduce = useReducedMotion();
  const [v, setV] = React.useState(to);
  useMotionValueEvent(mv, "change", (l) => setV(Math.round(l)));
  React.useEffect(() => {
    if (reduce) mv.set(to);
    else {
      const c = animate(mv, to, { type: "spring", stiffness: 140, damping: 22 });
      return () => c.stop();
    }
  }, [to, reduce, mv]);
  return <>{v}</>;
}
export function TimelineScrub() {
  const Y0 = 2018;
  const Y1 = 2026;
  const [year, setYear] = React.useState(2021);
  const t = (year - Y0) / (Y1 - Y0);
  const m = useSmoothed(t, 360, 30);
  const left = useTransform(m, (x) => `${x * 100}%`);
  const fill = useTransform(m, (x) => `${x * 100}%`);
  const { ref, active, bind } = useScrub("x", (v) => setYear(Y0 + Math.round(v * (Y1 - Y0))));
  const ev = [...EVENTS].reverse().find((e) => e.y <= year) ?? EVENTS[0];
  const T = useSpringT(SNAPPY);
  return (
    <div className="sf sf-card sf-v26">
      <div className="sf-head">
        <span className="sf-label">Our story</span>
        <output className="sf-val">{year}</output>
      </div>
      <div className="sf-rail-wrap sf-tall" ref={ref} {...bind}>
        <div className="sf-rail" />
        <motion.div className="sf-fill" style={{ width: fill }} />
        {EVENTS.map((e) => (
          <motion.i
            key={e.y}
            className="sf-mile"
            style={{ left: `${((e.y - Y0) / (Y1 - Y0)) * 100}%` }}
            animate={{ scale: e.y <= year ? 1.5 : 1, backgroundColor: e.y <= year ? "var(--sf-hot)" : "var(--sf-line)" }}
            transition={T}
          />
        ))}
        <motion.div
          className="sf-thumb"
          role="slider"
          tabIndex={0}
          aria-label="Year"
          aria-valuemin={Y0}
          aria-valuemax={Y1}
          aria-valuenow={year}
          aria-valuetext={`${year}, ${ev.t}`}
          style={{ left }}
          animate={{ scale: active ? 1.14 : 1 }}
          transition={T}
          onKeyDown={(e) => keyStep(e, year, Y0, Y1, 1, setYear)}
        />
      </div>
      <div className="sf-years sf-num" aria-hidden="true">
        {Array.from({ length: Y1 - Y0 + 1 }, (_, i) => (
          <span key={i} className={Y0 + i === year ? "on" : ""}>
            {i % 2 === 0 ? String(Y0 + i).slice(2) : "·"}
          </span>
        ))}
      </div>
      <div className="sf-mile-card" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={ev.y} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <b>{ev.t}</b>
            <span>{ev.s}</span>
          </motion.div>
        </AnimatePresence>
        <div className="sf-mile-n">
          <strong className="sf-num">
            <Count to={ev.n} />
          </strong>
          <small>people</small>
        </div>
      </div>
    </div>
  );
}

/** 27 · Ring carousel: eight faces on a true 3D cylinder, drag spins it with inertia. */
const RING = 8;
function RingFace({ i, rot }: { i: number; rot: MotionValue<number> }) {
  const op = useTransform(rot, (r) => 0.55 + 0.45 * ((Math.cos(((i * 45 + r) * Math.PI) / 180) + 1) / 2));
  const pl = PLACES[i];
  return (
    <motion.div className="sf-ring-face" style={{ transform: `rotateY(${i * 45}deg) translateZ(136px)`, opacity: op }}>
      <Art n={i + 1} className="sf-ring-art" />
      <b>{pl.title}</b>
    </motion.div>
  );
}
export function RingCarousel() {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const [idx, setIdx] = React.useState(0);
  const st = React.useRef<{ x: number; r: number; t: number; v: number } | null>(null);
  useMotionValueEvent(rot, "change", (r) => setIdx(mod(Math.round(-r / 45), RING)));
  const to = (target: number) => {
    if (reduce) rot.set(target);
    else animate(rot, target, { type: "spring", stiffness: 120, damping: 20, mass: 0.9 });
  };
  const nearest = () => Math.round(rot.get() / 45) * 45;
  return (
    <div className="sf sf-card sf-v27">
      <div
        className="sf-ring" data-allow-overflow
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Ring carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), to(nearest() - 45));
          if (e.key === "ArrowLeft") (e.preventDefault(), to(nearest() + 45));
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          rot.stop();
          st.current = { x: e.clientX, r: rot.get(), t: performance.now(), v: 0 };
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s) return;
          const nr = s.r + (e.clientX - s.x) * 0.55;
          const now = performance.now();
          s.v = (nr - rot.get()) / Math.max(1, now - s.t);
          s.t = now;
          rot.set(nr);
        }}
        onPointerUp={() => {
          const s = st.current;
          st.current = null;
          if (s) to(Math.round((rot.get() + s.v * 220) / 45) * 45);
        }}
        onPointerCancel={() => {
          st.current = null;
          to(nearest());
        }}
      >
        <motion.div className="sf-ring-drum" style={{ rotateY: rot }}>
          {Array.from({ length: RING }, (_, i) => (
            <RingFace key={i} i={i} rot={rot} />
          ))}
        </motion.div>
      </div>
      <div className="sf-loop-foot">
        <NavBtn dir="prev" onClick={() => to(nearest() + 45)} />
        <div className="sf-loop-cap" aria-live="polite">
          <b>{PLACES[idx].title}</b>
          <span className="sf-num">
            {PLACES[idx].sub} · {pad2(idx + 1)} / {pad2(RING)}
          </span>
        </div>
        <NavBtn dir="next" onClick={() => to(nearest() - 45)} />
      </div>
    </div>
  );
}

/** 28 · Colourway: the room changes colour, the vase swaps in with a tilt, the price rolls like an odometer. */
const VASES = [
  { n: "Dune", bg: "#eadbc8", c: "#b05a3c", p: 48, d: "M60 20 C60 20 50 20 50 30 C50 45 30 55 30 85 C30 115 45 130 60 130 C75 130 90 115 90 85 C90 55 70 45 70 30 C70 20 60 20 60 20Z" },
  { n: "Moss", bg: "#d4dcc6", c: "#5d7048", p: 62, d: "M48 18 L72 18 L70 40 C88 52 94 70 94 90 C94 115 80 132 60 132 C40 132 26 115 26 90 C26 70 32 52 50 40Z" },
  { n: "Clay", bg: "#ecd0c8", c: "#a2514f", p: 54, d: "M54 16 L66 16 L66 34 C66 44 78 50 78 66 L78 96 C78 116 70 132 60 132 C50 132 42 116 42 96 L42 66 C42 50 54 44 54 34Z" },
  { n: "Tide", bg: "#cfd9e1", c: "#3f5a72", p: 71, d: "M44 20 L76 20 L72 44 C96 56 100 82 90 104 C84 120 74 130 60 130 C46 130 36 120 30 104 C20 82 24 56 48 44Z" },
];
function Digit({ d }: { d: number }) {
  const T = useSpringT({ type: "spring", stiffness: 200, damping: 22 });
  return (
    <span className="sf-odo-col">
      <motion.span initial={false} animate={{ y: -d * 40 }} transition={T}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i}>{i}</i>
        ))}
      </motion.span>
    </span>
  );
}
export function ColorwayShowcase() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(0);
  const dir = React.useRef(1);
  const go = (n: number) => {
    const t = mod(n, VASES.length);
    dir.current = n > idx ? 1 : -1;
    setIdx(t);
  };
  const v = VASES[idx];
  const digits = String(v.p).padStart(2, "0").split("").map(Number);
  return (
    <div
      className="sf sf-v28"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Vase colourways"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), go(idx + 1));
        if (e.key === "ArrowLeft") (e.preventDefault(), go(idx - 1));
      }}
    >
      <motion.div className="sf-color-stage" data-allow-overflow animate={{ backgroundColor: v.bg }} transition={reduce ? { duration: 0 } : { duration: 0.6 }}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
          <motion.svg
            key={idx}
            className="sf-vase"
            viewBox="0 0 120 150"
            aria-hidden="true"
            custom={dir.current}
            variants={{
              in: (d: number) => ({ x: reduce ? 0 : d * 120, rotate: reduce ? 0 : d * 14, opacity: 0, scale: 0.85 }),
              show: { x: 0, rotate: 0, opacity: 1, scale: 1 },
              out: (d: number) => ({ x: reduce ? 0 : d * -120, rotate: reduce ? 0 : d * -14, opacity: 0, scale: 0.85 }),
            }}
            initial="in"
            animate="show"
            exit="out"
            transition={reduce ? { duration: 0 } : SOFT}
          >
            <ellipse cx="60" cy="138" rx="34" ry="5" fill="hsl(25 30% 12% / .16)" />
            <path d={v.d} fill={v.c} />
            <path d={v.d} fill="url(#none)" />
            <path d="M44 62 C42 80 42 100 48 116" stroke="#fff" strokeOpacity=".28" strokeWidth="4" strokeLinecap="round" fill="none" />
          </motion.svg>
        </AnimatePresence>
        <div className="sf-color-arrows">
          <NavBtn dir="prev" onClick={() => go(idx - 1)} />
          <NavBtn dir="next" onClick={() => go(idx + 1)} />
        </div>
      </motion.div>
      <div className="sf-color-foot">
        <div>
          <b>{v.n}</b>
          <span className="sf-sub">Stoneware vase</span>
        </div>
        <div className="sf-odo" role="text" aria-label={`$${v.p}`}>
          <em>$</em>
          {digits.map((d, i) => (
            <Digit key={i} d={d} />
          ))}
        </div>
        <div className="sf-dots-c" role="tablist" aria-label="Colourway">
          {VASES.map((q, i) => (
            <button key={q.n} type="button" role="tab" aria-selected={i === idx} aria-label={q.n} onClick={() => go(i)} style={{ background: q.c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 29 · Gooey pager: two blobs on different springs stretch and merge between dots. */
const STEPS = [
  { k: "Capture", t: "Drop anything in", s: "Links, files and half-formed thoughts land in one inbox." },
  { k: "Shape", t: "Turn it into a plan", s: "Group, reorder and assign without leaving the page." },
  { k: "Share", t: "Send a living link", s: "Everyone sees the same thing, updated as you type." },
  { k: "Ship", t: "Close the loop", s: "Mark it done and the whole thread tidies itself away." },
];
export function GooeyPager() {
  const reduce = useReducedMotion();
  const gid = React.useId().replace(/:/g, "");
  const [idx, setIdx] = React.useState(0);
  const dir = React.useRef(1);
  const go = (n: number) => {
    const t = clamp(n, 0, STEPS.length - 1);
    dir.current = t >= idx ? 1 : -1;
    setIdx(t);
  };
  const lead = { type: "spring", stiffness: 420, damping: 30 } as const;
  const lag = { type: "spring", stiffness: 150, damping: 20 } as const;
  const s = STEPS[idx];
  return (
    <div
      className="sf sf-card sf-v29"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Onboarding"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), go(idx + 1));
        if (e.key === "ArrowLeft") (e.preventDefault(), go(idx - 1));
      }}
    >
      <motion.div
        className="sf-goo-stage"
        onPanEnd={(_, i) => {
          if (i.offset.x < -40) go(idx + 1);
          else if (i.offset.x > 40) go(idx - 1);
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={dir.current}>
          <motion.div
            key={idx}
            className="sf-goo-slide"
            custom={dir.current}
            variants={{
              in: (d: number) => ({ x: reduce ? 0 : d * 56, opacity: 0 }),
              show: { x: 0, opacity: 1 },
              out: (d: number) => ({ x: reduce ? 0 : d * -56, opacity: 0 }),
            }}
            initial="in"
            animate="show"
            exit="out"
            transition={reduce ? { duration: 0 } : { duration: 0.24 }}
          >
            <div className="sf-goo-art" aria-hidden="true">
              <Art n={idx * 2 + 3} className="sf-goo-img" />
              <span className="sf-num">{pad2(idx + 1)}</span>
            </div>
            <em>{s.k}</em>
            <b>{s.t}</b>
            <p>{s.s}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="sf-goo-foot">
        <div className="sf-goo" aria-hidden="true">
          <svg width="0" height="0" focusable="false" style={{ position: "absolute" }}>
            <defs>
              <filter id={gid}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
              </filter>
            </defs>
          </svg>
          {STEPS.map((_, i) => (
            <i key={i} className="sf-goo-dot" style={{ left: i * 20 }} />
          ))}
          <div className="sf-goo-blobs" style={{ filter: `url(#${gid})` }}>
            <motion.b animate={{ x: idx * 20 }} transition={reduce ? { duration: 0 } : lead} />
            <motion.b animate={{ x: idx * 20 }} transition={reduce ? { duration: 0 } : lag} />
          </div>
        </div>
        <button type="button" className="sf-cta" onClick={() => (idx === STEPS.length - 1 ? go(0) : go(idx + 1))}>
          {idx === STEPS.length - 1 ? "Start over" : "Next"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/** 30 · Waveform scrubber: bars swell around the playhead, hover previews the time you would land on. */
const WAVE_N = 60;
const WAVE = Array.from({ length: WAVE_N }, (_, i) => {
  const h = 0.22 + 0.5 * Math.abs(Math.sin(i * 0.43) * Math.cos(i * 0.17 + 1)) + 0.2 * ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 0.28;
  return Math.round(clamp(h, 0.16, 1) * 56);
});
const DUR = 222;
const fmt = (s: number) => `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`;
function Bars({ pos, boost }: { pos: MotionValue<number>; boost: boolean }) {
  return (
    <>
      {WAVE.map((h, i) => (
        <WaveBarItem key={i} i={i} h={h} pos={pos} boost={boost} />
      ))}
    </>
  );
}
function WaveBarItem({ i, h, pos, boost }: { i: number; h: number; pos: MotionValue<number>; boost: boolean }) {
  const s = useTransform(pos, (p) => (boost ? 1 + Math.max(0, 1 - Math.abs(i / WAVE_N - p) * 10) * 0.32 : 1));
  return <motion.i style={{ height: h, scaleY: s }} />;
}
export function WaveScrubber() {
  const reduce = useReducedMotion();
  const pos = useMotionValue(0.34);
  const [sec, setSec] = React.useState(Math.floor(0.34 * DUR));
  const [playing, setPlaying] = React.useState(false);
  const [hover, setHover] = React.useState<number | null>(null);
  const clip = useTransform(pos, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);
  const head = useTransform(pos, (p) => `${p * 100}%`);
  useMotionValueEvent(pos, "change", (p) => setSec(Math.floor(p * DUR)));
  useAnimationFrame((_, dt) => {
    if (!playing) return;
    const n = pos.get() + dt / 1000 / DUR;
    if (n >= 1) {
      pos.set(1);
      setPlaying(false);
    } else pos.set(n);
  });
  const { ref, bind } = useScrub("x", (t) => pos.set(t));
  const seek = (d: number) => pos.set(clamp(pos.get() + d / DUR, 0, 1));
  return (
    <div className="sf sf-card sf-v30">
      <div className="sf-head">
        <span className="sf-label">Voice memo · Standup</span>
        <output className="sf-num sf-sub">{fmt(DUR)}</output>
      </div>
      <div
        className="sf-wvf"
        ref={ref}
        {...bind}
        role="slider"
        tabIndex={0}
        aria-label="Playback position"
        aria-valuemin={0}
        aria-valuemax={DUR}
        aria-valuenow={sec}
        aria-valuetext={`${fmt(sec)} of ${fmt(DUR)}`}
        onPointerMove={(e) => {
          bind.onPointerMove(e);
          const r = e.currentTarget.getBoundingClientRect();
          setHover(clamp((e.clientX - r.left) / r.width, 0, 1));
        }}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === " ") (e.preventDefault(), setPlaying((v) => !v));
          else if (e.key === "ArrowRight") (e.preventDefault(), seek(5));
          else if (e.key === "ArrowLeft") (e.preventDefault(), seek(-5));
          else if (e.key === "Home") (e.preventDefault(), pos.set(0));
          else if (e.key === "End") (e.preventDefault(), pos.set(1));
        }}
      >
        <div className="sf-wvf-bars base">
          <Bars pos={pos} boost={!reduce} />
        </div>
        <motion.div className="sf-wvf-bars played" style={{ clipPath: clip }}>
          <Bars pos={pos} boost={!reduce} />
        </motion.div>
        <motion.span className="sf-wvf-head" style={{ left: head }} aria-hidden="true" />
        {hover !== null && (
          <span className="sf-wvf-ghost sf-num" style={{ left: `${hover * 100}%` }} aria-hidden="true">
            <b>{fmt(hover * DUR)}</b>
          </span>
        )}
      </div>
      <div className="sf-wvf-foot">
        <button type="button" className="sf-round" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((v) => !v)}>
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <output className="sf-val sf-val-sm">
          {fmt(sec)} <small>/ {fmt(DUR)}</small>
        </output>
        <button type="button" className="sf-icon-btn" aria-label="Back 5 seconds" onClick={() => seek(-5)}>
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}


/* registry for the preview route */
export const SLIDER_FAMILY = [
  { id: "v01", name: "SpringRange", Component: SpringRange },
  { id: "v02", name: "HistogramRange", Component: HistogramRange },
  { id: "v03", name: "NotchedStepper", Component: NotchedStepper },
  { id: "v04", name: "RadialDial", Component: RadialDial },
  { id: "v05", name: "LevelBars", Component: LevelBars },
  { id: "v06", name: "TickRuler", Component: TickRuler },
  { id: "v07", name: "RevealCompare", Component: RevealCompare },
  { id: "v08", name: "SlideConfirm", Component: SlideConfirm },
  { id: "v09", name: "HuePalette", Component: HuePalette },
  { id: "v10", name: "MoodFace", Component: MoodFace },
  { id: "v11", name: "LiquidTank", Component: LiquidTank },
  { id: "v12", name: "StretchSegments", Component: StretchSegments },
  { id: "v13", name: "SnapScroller", Component: SnapScroller },
  { id: "v14", name: "CoverFlow", Component: CoverFlow },
  { id: "v15", name: "SwipeDeck", Component: SwipeDeck },
  { id: "v16", name: "CardFan", Component: CardFan },
  { id: "v17", name: "FilmstripGallery", Component: FilmstripGallery },
  { id: "v18", name: "ParallaxTrack", Component: ParallaxTrack },
  { id: "v19", name: "StoryProgress", Component: StoryProgress },
  { id: "v20", name: "TimeWheels", Component: TimeWheels },
  { id: "v21", name: "LogoMarquee", Component: LogoMarquee },
  { id: "v22", name: "LoopCarousel", Component: LoopCarousel },
  { id: "v23", name: "ExpandPanels", Component: ExpandPanels },
  { id: "v24", name: "MomentumShelf", Component: MomentumShelf },
  { id: "v25", name: "QuoteCarousel", Component: QuoteCarousel },
  { id: "v26", name: "TimelineScrub", Component: TimelineScrub },
  { id: "v27", name: "RingCarousel", Component: RingCarousel },
  { id: "v28", name: "ColorwayShowcase", Component: ColorwayShowcase },
  { id: "v29", name: "GooeyPager", Component: GooeyPager },
  { id: "v30", name: "WaveScrubber", Component: WaveScrubber },
] as const;
