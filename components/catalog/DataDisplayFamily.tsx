"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Inbox,
  KeyRound,
  Lock,
  Mail,
  MessageSquare,
  Pause,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Star,
  TrendingUp,
  WifiOff,
  X,
} from "lucide-react";
import "./DataDisplayFamily.css";

/* ------------------------------------------------------------------ */
/* Shared physics + utilities                                          */
/* ------------------------------------------------------------------ */

export const springs = {
  snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.9 } as Transition,
  soft: { type: "spring", stiffness: 260, damping: 26 } as Transition,
  bouncy: { type: "spring", stiffness: 430, damping: 17 } as Transition,
  stiff: { type: "spring", stiffness: 700, damping: 35 } as Transition,
  gentle: { type: "spring", stiffness: 180, damping: 22 } as Transition,
};

function useInstant() {
  const rm = useReducedMotion();
  return rm ? ({ duration: 0.01 } as Transition) : null;
}

export interface VariantProps {
  demo?: boolean;
}

/* Count-up on mount / target change. */
function useCountUp(target: number, duration = 1.3, decimals = 0) {
  const [val, setVal] = useState(0);
  const rm = useReducedMotion();
  useEffect(() => {
    if (rm) {
      setVal(target);
      return;
    }
    const c = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
  }, [target, rm, duration]);
  return Number(val.toFixed(decimals)).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* Initials avatars in flat duotones (no external images). */
const AV_PAIRS: Array<[string, string]> = [
  ["#2f5fd0", "#e8efff"],
  ["#22633d", "#e3f1e8"],
  ["#b07d1e", "#f9efd8"],
  ["#c2540a", "#fcebdd"],
  ["#0f766e", "#e0f2ef"],
  ["#c23b2e", "#fbe8e6"],
  ["#3f4a5a", "#e8ecf2"],
  ["#6e5518", "#f4ecd9"],
];

interface Person {
  name: string;
  role: string;
  c: number;
}

const PEOPLE: Person[] = [
  { name: "Aya Konishi", role: "Product designer", c: 0 },
  { name: "Mateo Ruiz", role: "iOS engineer", c: 1 },
  { name: "Priya Nair", role: "Data lead", c: 2 },
  { name: "Tom Beckett", role: "Producer", c: 3 },
  { name: "Lena Vogt", role: "Motion designer", c: 4 },
  { name: "Chris Oduya", role: "Backend engineer", c: 5 },
  { name: "Sara Lindqvist", role: "Researcher", c: 6 },
  { name: "Devon Park", role: "QA engineer", c: 7 },
  { name: "Mira Shah", role: "Design engineer", c: 1 },
  { name: "Jonas Weber", role: "Ops", c: 3 },
  { name: "Ana Sousa", role: "Writer", c: 0 },
  { name: "Ken Watanabe", role: "Photographer", c: 5 },
];

function ini(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  person,
  size = 36,
  ring = false,
}: {
  person: Person;
  size?: number;
  ring?: boolean;
}) {
  const [bg, fg] = AV_PAIRS[person.c % AV_PAIRS.length];
  return (
    <span
      className={`dd-av${ring ? " dd-av-ring" : ""}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {ini(person.name)}
    </span>
  );
}

/* ================================================================== */
/* AVATAR GROUPS                                                       */
/* ================================================================== */

/* ================================================================== */
/* 1 — FanStack: overlapping pile that springs apart on hover          */
/* ================================================================== */

export function AvatarV01({ demo = false }: VariantProps) {
  const [spread, setSpread] = useState(false);
  const [active, setActive] = useState(-1);
  const instant = useInstant();
  const group = PEOPLE.slice(0, 8);

  useEffect(() => {
    if (!demo) return;
    const t1 = setTimeout(() => setSpread(true), 700);
    const t2 = setTimeout(() => setSpread(false), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [demo]);

  return (
    <div
      className="dd dd-v01"
      onMouseEnter={() => setSpread(true)}
      onMouseLeave={() => {
        setSpread(false);
        setActive(-1);
      }}
    >
      <div className="dd-v01-stack" role="group" aria-label="8 team members online">
        {group.map((p, i) => (
          <motion.span
            key={p.name}
            className="dd-v01-item"
            style={{ zIndex: active === i ? 30 : group.length - i }}
            initial={instant ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: spread ? i * 13 : 0 }}
            transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : i * 0.04 }}
          >
            <motion.button
              className="dd-v01-btn"
              aria-label={p.name}
              whileHover={instant ? undefined : { y: -8, scale: 1.14 }}
              whileTap={instant ? undefined : { scale: 0.92 }}
              transition={springs.stiff}
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(-1)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
            >
              <Avatar person={p} size={40} ring />
            </motion.button>
            <AnimatePresence>
              {active === i && (
                <motion.span
                  className="dd-v01-tip"
                  role="tooltip"
                  initial={instant ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={instant ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.94 }}
                  transition={instant ?? springs.snappy}
                >
                  {p.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        ))}
        <motion.span
          className="dd-v01-more"
          initial={instant ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, x: spread ? 104 : 0 }}
          transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 0.34 }}
        >
          +9
        </motion.span>
      </div>
      <p className="dd-v01-cap">
        <strong>17 people</strong> are on this project
      </p>
    </div>
  );
}

/* ================================================================== */
/* 2 — OrbitDial: team on a slowly rotating ring, pauses on hover      */
/* ================================================================== */

export function AvatarV02() {
  const group = PEOPLE.slice(0, 9);
  const R = 104;
  return (
    <div className="dd dd-v02" aria-label="9 members, 5 online now">
      <div className="dd-v02-stage">
        <div className="dd-v02-ring">
          {group.map((p, i) => {
            const a = (i / group.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * R;
            const y = Math.sin(a) * R;
            return (
              <span
                key={p.name}
                className="dd-v02-node"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <span className="dd-v02-counter">
                  <Avatar person={p} size={44} ring />
                  {i < 5 && <span className="dd-v02-dot" aria-label="online" />}
                </span>
              </span>
            );
          })}
        </div>
        <div className="dd-v02-hub">
          <strong>5</strong>
          <span>online now</span>
        </div>
      </div>
      <p className="dd-v02-cap">Field crew · hover to pause the orbit</p>
    </div>
  );
}

/* ================================================================== */
/* 3 — PresenceList: rows with live status and a typing indicator      */
/* ================================================================== */

const presence = [
  { p: PEOPLE[0], state: "online", note: "In Figma · Components" },
  { p: PEOPLE[1], state: "online", note: "Typing…" },
  { p: PEOPLE[2], state: "away", note: "Back at 2:30 PM" },
  { p: PEOPLE[3], state: "online", note: "Reviewing v12 cut" },
  { p: PEOPLE[4], state: "offline", note: "Last seen yesterday" },
];

export function AvatarV03() {
  const instant = useInstant();
  return (
    <div className="dd dd-v03">
      <header className="dd-v03-head">
        <h3>Studio team</h3>
        <span>3 online</span>
      </header>
      <ul className="dd-v03-list">
        {presence.map((row, i) => (
          <motion.li
            key={row.p.name}
            className="dd-v03-row"
            initial={instant ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.06 * i }}
          >
            <span className="dd-v03-avwrap">
              <Avatar person={row.p} size={38} />
              <span className={`dd-v03-dot dd-v03-${row.state}`} aria-label={row.state} />
            </span>
            <span className="dd-v03-meta">
              <strong>{row.p.name}</strong>
              {row.note === "Typing…" ? (
                <em className="dd-v03-typing">
                  Typing
                  <span className="dd-v03-td" />
                  <span className="dd-v03-td" />
                  <span className="dd-v03-td" />
                </em>
              ) : (
                <em>{row.note}</em>
              )}
            </span>
            <span className="dd-v03-role">{row.p.role}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */
/* 4 — Marquee: infinite contributor ribbon, pause on hover            */
/* ================================================================== */

export function AvatarV04() {
  const track = PEOPLE.slice(0, 10);
  const doubled = [...track, ...track];
  return (
    <div className="dd dd-v04" aria-label="Contributors">
      <div className="dd-v04-head">
        <h3>Contributors</h3>
        <span>128 this month</span>
      </div>
      <div className="dd-v04-mask">
        <div className="dd-v04-track">
          {doubled.map((p, i) => (
            <span className="dd-v04-chip" key={`${p.name}-${i}`} aria-hidden={i >= track.length}>
              <Avatar person={p} size={30} />
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="dd-v04-cap">Hover to pause · drag-free, pure CSS loop</p>
    </div>
  );
}

/* ================================================================== */
/* 5 — PileGrid: one tap morphs the pile into a grid (layout spring)   */
/* ================================================================== */

export function AvatarV05({ demo = false }: VariantProps) {
  const [grid, setGrid] = useState(false);
  const instant = useInstant();
  const group = PEOPLE.slice(0, 9);

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setGrid((g) => !g), 2400);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v05">
      <div className="dd-v05-bar">
        <h3>Wedding crew</h3>
        <motion.button
          className="dd-v05-toggle"
          onClick={() => setGrid((g) => !g)}
          whileTap={instant ? undefined : { scale: 0.92 }}
          transition={springs.stiff}
          aria-pressed={grid}
        >
          {grid ? "Pile view" : "Grid view"}
        </motion.button>
      </div>
      <div className={`dd-v05-stage${grid ? " is-grid" : ""}`}>
        {group.map((p, i) => (
          <motion.span
            key={p.name}
            layout
            transition={instant ?? { type: "spring", stiffness: 300, damping: 26, delay: instant ? 0 : i * 0.02 }}
            className="dd-v05-cell"
          >
            <Avatar person={p} size={grid ? 52 : 44} ring />
            {grid && <span className="dd-v05-name">{p.name.split(" ")[0]}</span>}
          </motion.span>
        ))}
      </div>
      <p className="dd-v05-cap">Same people, two arrangements, one spring between them</p>
    </div>
  );
}

/* ================================================================== */
/* PROGRESS INDICATORS                                                 */
/* ================================================================== */

/* ================================================================== */
/* 6 — SteppedProgress: click a step, the rail springs to it           */
/* ================================================================== */

const STEP_LABELS = ["Details", "Shipping", "Payment", "Review", "Done"];

export function ProgressV06({ demo = false }: VariantProps) {
  const [step, setStep] = useState(2);
  const instant = useInstant();
  const pct = (step / (STEP_LABELS.length - 1)) * 100;
  const count = useCountUp(pct, 0.7);

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STEP_LABELS.length), 1300);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v06">
      <div className="dd-v06-top">
        <h3>Order ORD-2291</h3>
        <span className="dd-v06-pct">{count}%</span>
      </div>
      <div className="dd-v06-rail" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="dd-v06-track" />
        <motion.div
          className="dd-v06-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={instant ?? springs.snappy}
        />
        {STEP_LABELS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "now" : "todo";
          return (
            <button
              key={label}
              className={`dd-v06-step dd-v06-${state}`}
              style={{ left: `${(i / (STEP_LABELS.length - 1)) * 100}%` }}
              onClick={() => setStep(i)}
              aria-label={`${label} (${state})`}
              aria-current={i === step ? "step" : undefined}
            >
              <motion.span
                className="dd-v06-dot"
                animate={state === "now" && !instant ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 1.4, repeat: state === "now" ? Infinity : 0, ease: "easeInOut" }}
              >
                {state === "done" && <Check size={11} strokeWidth={3} />}
              </motion.span>
              <span className="dd-v06-label">{label}</span>
            </button>
          );
        })}
      </div>
      <p className="dd-v06-cap">Click any step to jump the rail</p>
    </div>
  );
}

/* ================================================================== */
/* 7 — DialProgress: ring gauge with spring needle value               */
/* ================================================================== */

export function ProgressV07({ demo = false }: VariantProps) {
  const [target, setTarget] = useState(72);
  const instant = useInstant();
  const R = 56;
  const C = 2 * Math.PI * R;
  const shown = useCountUp(target, 0.9);

  useEffect(() => {
    if (!demo) return;
    const seq = [72, 34, 91, 58];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setTarget(seq[i]);
    }, 1700);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v07">
      <div className="dd-v07-dial" role="progressbar" aria-valuenow={target} aria-valuemin={0} aria-valuemax={100}>
        <svg viewBox="0 0 140 140" width="168" height="168">
          {Array.from({ length: 40 }).map((_, i) => {
            const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
            const inner = i % 5 === 0 ? 62 : 66;
            return (
              <line
                key={i}
                x1={70 + Math.cos(a) * inner}
                y1={70 + Math.sin(a) * inner}
                x2={70 + Math.cos(a) * 69}
                y2={70 + Math.sin(a) * 69}
                className={`dd-v07-tick${i % 5 === 0 ? " dd-v07-tick5" : ""}`}
              />
            );
          })}
          <circle cx="70" cy="70" r={R} className="dd-v07-track" />
          <motion.circle
            cx="70"
            cy="70"
            r={R}
            className="dd-v07-arc"
            strokeDasharray={C}
            initial={false}
            animate={{ strokeDashoffset: C - (C * target) / 100 }}
            transition={instant ?? springs.snappy}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="dd-v07-read">
          <strong>{shown}</strong>
          <span>of 100 uploads</span>
        </div>
      </div>
      <div className="dd-v07-actions">
        {[25, 50, 75, 100].map((v) => (
          <motion.button
            key={v}
            className={`dd-v07-chip${target === v ? " is-on" : ""}`}
            onClick={() => setTarget(v)}
            whileTap={instant ? undefined : { scale: 0.9 }}
            transition={springs.stiff}
          >
            {v}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 8 — WaveFill: a vessel filling with a rolling flat wave             */
/* ================================================================== */

export function ProgressV08({ demo = false }: VariantProps) {
  const [level, setLevel] = useState(64);
  const instant = useInstant();
  const shown = useCountUp(level, 0.9);

  useEffect(() => {
    if (!demo) return;
    const seq = [64, 28, 86, 50];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setLevel(seq[i]);
    }, 1800);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v08">
      <div className="dd-v08-vessel" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="dd-v08-water"
          initial={false}
          animate={{ height: `${level}%` }}
          transition={instant ?? springs.soft}
        >
          <svg className="dd-v08-wave dd-v08-w1" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden>
            <path d="M0 6 Q 15 0 30 6 T 60 6 T 90 6 T 120 6 V12 H0 Z" />
          </svg>
          <svg className="dd-v08-wave dd-v08-w2" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden>
            <path d="M0 6 Q 15 12 30 6 T 60 6 T 90 6 T 120 6 V12 H0 Z" />
          </svg>
        </motion.div>
        <div className="dd-v08-label">
          <strong>{shown}%</strong>
          <span>tank level</span>
        </div>
      </div>
      <div className="dd-v08-row">
        <span>Rainwater cistern</span>
        <button className="dd-v08-cycle" onClick={() => setLevel((l) => (l >= 90 ? 22 : l + 17))}>
          Cycle level
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 9 — MilestoneRail: dots pop as the delivery line reaches them       */
/* ================================================================== */

const MILES = [
  { label: "Ordered", date: "Nov 18" },
  { label: "Packed", date: "Nov 20" },
  { label: "Shipped", date: "Nov 22" },
  { label: "Delivered", date: "Nov 25" },
];

export function ProgressV09({ demo = false }: VariantProps) {
  const [reached, setReached] = useState(2);
  const instant = useInstant();
  const pct = (reached / (MILES.length - 1)) * 100;

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setReached((r) => (r + 1) % MILES.length), 1400);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v09">
      <div className="dd-v09-head">
        <h3>Package 8842-11</h3>
        <button className="dd-v09-btn" onClick={() => setReached((r) => (r + 1) % MILES.length)}>
          Advance
        </button>
      </div>
      <div className="dd-v09-rail">
        <div className="dd-v09-track" />
        <motion.div
          className="dd-v09-line"
          initial={false}
          animate={{ scaleX: reached / (MILES.length - 1) }}
          transition={instant ?? springs.soft}
        />
        {MILES.map((m, i) => {
          const hit = i <= reached;
          return (
            <div key={m.label} className="dd-v09-stop" style={{ left: `${(i / (MILES.length - 1)) * 100}%` }}>
              <motion.span
                className={`dd-v09-dot${hit ? " is-hit" : ""}`}
                animate={hit ? { scale: 1 } : { scale: 0.72 }}
                transition={instant ?? springs.bouncy}
              >
                {hit && (
                  <motion.span
                    initial={instant ? false : { scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={instant ?? springs.bouncy}
                    className="dd-v09-check"
                  >
                    <Check size={10} strokeWidth={3.2} />
                  </motion.span>
                )}
              </motion.span>
              <strong className={hit ? "" : "dd-dim"}>{m.label}</strong>
              <span className="dd-v09-date">{m.date}</span>
            </div>
          );
        })}
      </div>
      <p className="dd-v09-cap">Arriving Tuesday · left with the concierge</p>
    </div>
  );
}

/* ================================================================== */
/* 10 — DownloadLanes: three transfers, three honest states            */
/* ================================================================== */

const LANES = [
  { file: "goat-icons-v2.zip", size: "18.2 MB", pct: 100, state: "done" as const },
  { file: "brand-film-4k.mp4", size: "812 MB", pct: 61, state: "run" as const },
  { file: "invoice-batch.pdf", size: "2.4 MB", pct: 34, state: "pause" as const },
];

export function ProgressV10({ demo = false }: VariantProps) {
  const [tick, setTick] = useState(0);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v10">
      <div className="dd-v10-head">
        <h3>Transfers</h3>
        <span>3 files</span>
      </div>
      <ul className="dd-v10-list">
        {LANES.map((lane, i) => {
          const pct = lane.state === "run" ? Math.min(100, lane.pct + ((tick * 9) % 39)) : lane.pct;
          return (
            <motion.li
              key={lane.file}
              className="dd-v10-lane"
              initial={instant ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : i * 0.1 }}
            >
              <span className="dd-v10-icon">
                {lane.state === "done" ? <Check size={15} /> : lane.state === "pause" ? <Pause size={15} /> : <FileText size={15} />}
              </span>
              <div className="dd-v10-meta">
                <div className="dd-v10-row1">
                  <strong>{lane.file}</strong>
                  <span>{lane.state === "done" ? lane.size : `${pct}% · ${lane.size}`}</span>
                </div>
                <div className="dd-v10-track">
                  <motion.div
                    className={`dd-v10-fill dd-v10-${lane.state}`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={instant ?? springs.soft}
                  />
                </div>
              </div>
              <button className="dd-v10-act" aria-label={lane.state === "done" ? "Open file" : lane.state === "pause" ? "Resume" : "Pause"}>
                {lane.state === "done" ? <Download size={14} /> : lane.state === "pause" ? <ChevronRight size={14} /> : <Pause size={14} />}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ================================================================== */
/* EMPTY STATES                                                        */
/* ================================================================== */

/* ================================================================== */
/* 11 — InboxZero: line illustration that draws itself in              */
/* ================================================================== */

export function EmptyV11() {
  const instant = useInstant();
  const draw = (delay: number): Record<string, object | undefined> =>
    instant
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.1, delay, ease: "easeInOut" },
        };
  return (
    <div className="dd dd-v11">
      <svg viewBox="0 0 200 140" width="220" height="154" className="dd-v11-art" role="img" aria-label="Empty inbox illustration">
        <motion.path
          d="M28 88 L44 44 H156 L172 88 V112 a8 8 0 0 1 -8 8 H36 a8 8 0 0 1 -8 -8 Z"
          className="dd-v11-line"
          {...draw(0)}
        />
        <motion.path d="M28 88 H76 l10 14 h28 l10 -14 h48" className="dd-v11-line" {...draw(0.35)} />
        <motion.path d="M100 18 v26 M88 32 l12 12 12 -12" className="dd-v11-line dd-v11-arrow" {...draw(0.7)} />
        <motion.circle cx="164" cy="30" r="3" className="dd-v11-fill-dot" {...draw(1)} />
        <motion.circle cx="38" cy="24" r="2" className="dd-v11-fill-dot" {...draw(1.15)} />
      </svg>
      <h3>All caught up</h3>
      <p>Nothing waiting in the inbox. New messages land here the second they arrive.</p>
      <motion.button
        className="dd-v11-cta"
        whileHover={instant ? undefined : { y: -2 }}
        whileTap={instant ? undefined : { scale: 0.95 }}
        transition={springs.stiff}
      >
        <Mail size={15} /> Write a message
      </motion.button>
    </div>
  );
}

/* ================================================================== */
/* 12 — NoResults: swinging magnifier plus query suggestions           */
/* ================================================================== */

export function EmptyV12() {
  const instant = useInstant();
  return (
    <div className="dd dd-v12">
      <motion.div
        className="dd-v12-scope"
        animate={instant ? {} : { rotate: [0, -7, 7, -4, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut" }}
      >
        <Search size={30} strokeWidth={2.2} />
      </motion.div>
      <h3>No matches for “aurora”</h3>
      <p>Check the spelling, or try one of these instead:</p>
      <div className="dd-v12-chips">
        {["Aurora borealis", "Aurora UI kit", "Aurora docs"].map((c, i) => (
          <motion.button
            key={c}
            className="dd-v12-chip"
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.3 + i * 0.09 }}
            whileHover={instant ? undefined : { y: -3 }}
            whileTap={instant ? undefined : { scale: 0.94 }}
          >
            {c}
          </motion.button>
        ))}
      </div>
      <button className="dd-v12-clear">Clear search</button>
    </div>
  );
}

/* ================================================================== */
/* 13 — OfflinePlug: wiggling cable, honest retry with a shake         */
/* ================================================================== */

export function EmptyV13() {
  const [trying, setTrying] = useState(false);
  const [failed, setFailed] = useState(0);
  const instant = useInstant();

  const retry = () => {
    if (trying) return;
    setTrying(true);
    setTimeout(() => {
      setTrying(false);
      setFailed((f) => f + 1);
    }, 1400);
  };

  return (
    <motion.div
      className="dd dd-v13"
      key={failed}
      animate={failed > 0 && !instant ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="dd-v13-plug"
        animate={instant ? {} : { rotate: [0, 3, -3, 0], y: [0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <WifiOff size={30} strokeWidth={2} />
      </motion.div>
      <h3>You’re offline</h3>
      <p>The connection dropped. Anything you queued will send itself when you’re back.</p>
      <motion.button
        className="dd-v13-retry"
        onClick={retry}
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        disabled={trying}
      >
        {trying ? (
          <>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} style={{ display: "inline-flex" }}>
              <RotateCw size={15} />
            </motion.span>
            Checking…
          </>
        ) : (
          <>
            <RotateCw size={15} /> Try again
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

/* ================================================================== */
/* 14 — LockedFolder: request access, watch the key turn               */
/* ================================================================== */

export function EmptyV14({ demo = false }: VariantProps) {
  const [granted, setGranted] = useState(false);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    const t1 = setTimeout(() => setGranted(true), 1100);
    const t2 = setTimeout(() => setGranted(false), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [demo]);

  return (
    <div className="dd dd-v14">
      <div className="dd-v14-lockbox" aria-hidden>
        <motion.svg viewBox="0 0 64 64" width="72" height="72">
          <motion.path
            d="M20 30 V22 a12 12 0 0 1 24 0 v8"
            className="dd-v14-shackle"
            initial={false}
            animate={granted ? { y: -7, rotate: -18, opacity: 1 } : { y: 0, rotate: 0, opacity: 1 }}
            transition={instant ?? springs.bouncy}
            style={{ transformBox: "view-box", transformOrigin: "44px 30px" }}
          />
          <rect x="14" y="28" width="36" height="26" rx="6" className="dd-v14-body" />
          <circle cx="32" cy="39" r="3.4" className="dd-v14-keyhole" />
          <rect x="30.6" y="40" width="2.8" height="7" rx="1.4" className="dd-v14-keyhole" />
        </motion.svg>
        <AnimatePresence>
          {granted && (
            <motion.span
              className="dd-v14-key"
              initial={instant ? { opacity: 0 } : { opacity: 0, x: 34, rotate: 40 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={instant ?? { type: "spring", stiffness: 240, damping: 19, delay: instant ? 0 : 0.25 }}
            >
              <KeyRound size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {granted ? (
          <motion.div key="ok" className="dd-v14-msg" initial={instant ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={instant ?? springs.soft}>
            <h3>Access granted</h3>
            <p>Priya approved your request. The folder is unlocked for 7 days.</p>
            <button className="dd-v14-ghost" onClick={() => setGranted(false)}>Reset demo</button>
          </motion.div>
        ) : (
          <motion.div key="locked" className="dd-v14-msg" initial={instant ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={instant ?? springs.soft}>
            <h3>This folder is private</h3>
            <p>“Launch assets” is shared with the launch team only. Ask for access to see the 46 files inside.</p>
            <motion.button className="dd-v14-cta" onClick={() => setGranted(true)} whileTap={instant ? undefined : { scale: 0.95 }} transition={springs.stiff}>
              <Lock size={14} /> Request access
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 15 — FirstProject: marching-ants drop zone with a bouncing plus     */
/* ================================================================== */

export function EmptyV15() {
  const [hover, setHover] = useState(false);
  const instant = useInstant();
  return (
    <div className="dd dd-v15">
      <motion.div
        className={`dd-v15-zone${hover ? " is-hot" : ""}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        animate={instant ? {} : { scale: hover ? 1.015 : 1 }}
        transition={springs.soft}
        role="button"
        tabIndex={0}
        aria-label="Create your first project"
      >
        <svg className="dd-v15-ants" aria-hidden>
          <rect x="1.5" y="1.5" rx="17" className="dd-v15-dashrect" />
        </svg>
        <motion.span
          className="dd-v15-plus"
          animate={instant ? {} : { y: [0, -9, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plus size={22} strokeWidth={2.4} />
        </motion.span>
        <h3>Start your first project</h3>
        <p>Drop files here, or begin with a blank canvas. Templates are one click away.</p>
        <motion.button className="dd-v15-cta" whileTap={instant ? undefined : { scale: 0.95 }} transition={springs.stiff}>
          New project
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/* STAT CARDS                                                          */
/* ================================================================== */

/* ================================================================== */
/* 16 — SparkCounter: revenue card, count-up plus drawn sparkline      */
/* ================================================================== */

const SPARK = [8, 14, 11, 18, 15, 24, 20, 30, 26, 36, 31, 42];

export function StatV16() {
  const instant = useInstant();
  const total = useCountUp(48290, 1.5);
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 200},${60 - (v / 42) * 56}`).join(" ");
  return (
    <div className="dd dd-v16">
      <header>
        <span className="dd-v16-label">Revenue · November</span>
        <span className="dd-v16-delta">
          <TrendingUp size={13} /> +12.4%
        </span>
      </header>
      <strong className="dd-v16-big">${total}</strong>
      <svg viewBox="0 0 200 64" className="dd-v16-spark" preserveAspectRatio="none" aria-hidden>
        <motion.polyline
          points={pts}
          className="dd-v16-line"
          initial={instant ? undefined : ({ pathLength: 0 } as never)}
          animate={{ pathLength: 1 } as never}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="200"
          cy={60 - (SPARK[SPARK.length - 1] / 42) * 56}
          r="3.4"
          className="dd-v16-end"
          initial={instant ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 1.7 }}
        />
      </svg>
      <footer>vs $42,980 in October</footer>
    </div>
  );
}

/* ================================================================== */
/* 17 — TrendBars: seven bars grow in, each one hoverable              */
/* ================================================================== */

const WEEK = [
  { d: "Mon", v: 42 },
  { d: "Tue", v: 58 },
  { d: "Wed", v: 37 },
  { d: "Thu", v: 71 },
  { d: "Fri", v: 66 },
  { d: "Sat", v: 90 },
  { d: "Sun", v: 54 },
];

export function StatV17() {
  const [hot, setHot] = useState(-1);
  const instant = useInstant();
  const users = useCountUp(8412, 1.4);
  return (
    <div className="dd dd-v17">
      <header>
        <span className="dd-v17-label">Active users</span>
        <motion.span
          className="dd-v17-delta"
          initial={instant ? false : { opacity: 0, y: 8, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 0.9 }}
        >
          <ArrowUpRight size={13} /> 8.1%
        </motion.span>
      </header>
      <strong className="dd-v17-big">{users}</strong>
      <div className="dd-v17-bars" role="img" aria-label="Daily active users, highest on Saturday">
        {WEEK.map((d, i) => (
          <div key={d.d} className="dd-v17-col" onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(-1)}>
            <AnimatePresence>
              {hot === i && (
                <motion.span
                  className="dd-v17-tip"
                  initial={instant ? { opacity: 0 } : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={instant ?? springs.snappy}
                >
                  {d.v * 14}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              className={`dd-v17-bar${hot === i ? " is-hot" : ""}${i === 5 ? " is-max" : ""}`}
              initial={instant ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ height: `${(d.v / 90) * 100}%` }}
              transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 0.15 + i * 0.06 }}
            />
            <span className="dd-v17-day">{d.d[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 18 — GaugeCard: semicircle load gauge with a sprung needle          */
/* ================================================================== */

export function StatV18({ demo = false }: VariantProps) {
  const [val, setVal] = useState(62);
  const instant = useInstant();
  const angle = -90 + (val / 100) * 180;

  useEffect(() => {
    if (!demo) return;
    const seq = [62, 24, 88, 47];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setVal(seq[i]);
    }, 1800);
    return () => clearInterval(t);
  }, [demo]);

  const arc = (from: number, to: number, r: number) => {
    const p = (a: number) => {
      const rad = ((a - 90) * Math.PI) / 180;
      return `${100 + Math.cos(rad) * r} ${100 + Math.sin(rad) * r}`;
    };
    return `M ${p(from)} A ${r} ${r} 0 0 1 ${p(to)}`;
  };

  return (
    <div className="dd dd-v18" onClick={() => setVal((v) => (v + 23) % 101)} role="button" tabIndex={0} aria-label={`System load ${val} percent. Activate to change.`}>
      <svg viewBox="0 0 200 118" width="230" className="dd-v18-gauge">
        <path d={arc(-90, -12, 78)} className="dd-v18-zone dd-v18-ok" />
        <path d={arc(-12, 38, 78)} className="dd-v18-zone dd-v18-warn" />
        <path d={arc(38, 90, 78)} className="dd-v18-zone dd-v18-hot" />
        <motion.g
          initial={false}
          animate={{ rotate: angle }}
          transition={instant ?? { type: "spring", stiffness: 120, damping: 14 }}
          style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
        >
          <line x1="100" y1="100" x2="100" y2="34" className="dd-v18-needle" />
          <circle cx="100" cy="34" r="4" className="dd-v18-tip" />
        </motion.g>
        <circle cx="100" cy="100" r="9" className="dd-v18-hub" />
      </svg>
      <div className="dd-v18-read">
        <strong>{val}%</strong>
        <span>render farm load</span>
      </div>
      <p className="dd-v18-cap">Click the gauge to cycle the load</p>
    </div>
  );
}

/* ================================================================== */
/* 19 — FlipStat: click flips the card to its breakdown                */
/* ================================================================== */

export function StatV19({ demo = false }: VariantProps) {
  const [flip, setFlip] = useState(false);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setFlip((f) => !f), 2300);
    return () => clearInterval(t);
  }, [demo]);

  const rows = [
    ["Photos", "41.8 GB"],
    ["Project files", "22.1 GB"],
    ["Backups", "9.6 GB"],
    ["Other", "3.1 GB"],
  ];

  return (
    <div className="dd dd-v19">
      <button className="dd-v19-btn" onClick={() => setFlip((f) => !f)} aria-pressed={flip} aria-label="Flip the storage card">
        <motion.div
          className="dd-v19-card"
          initial={false}
          animate={{ rotateY: flip ? 180 : 0 }}
          transition={instant ?? { type: "spring", stiffness: 200, damping: 22 }}
        >
          <div className="dd-v19-face dd-v19-front">
            <span className="dd-v19-label">Storage</span>
            <svg viewBox="0 0 90 90" width="104" height="104">
              <circle cx="45" cy="45" r="36" className="dd-v19-track" />
              <motion.circle
                cx="45"
                cy="45"
                r="36"
                className="dd-v19-arc"
                strokeDasharray={2 * Math.PI * 36}
                initial={instant ? undefined : { strokeDashoffset: 2 * Math.PI * 36 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 36 * 0.22 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="50" className="dd-v19-pct" textAnchor="middle">78%</text>
            </svg>
            <strong>76.6 of 98 GB used</strong>
            <span className="dd-v19-hint">Click to see the breakdown</span>
          </div>
          <div className="dd-v19-face dd-v19-back">
            <span className="dd-v19-label">Where it went</span>
            <ul>
              {rows.map(([k, v], i) => (
                <motion.li
                  key={k}
                  initial={instant ? false : { opacity: 0, x: 12 }}
                  animate={flip ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : flip ? 0.25 + i * 0.07 : 0 }}
                >
                  <span>{k}</span>
                  <strong>{v}</strong>
                </motion.li>
              ))}
            </ul>
            <span className="dd-v19-hint">Click to flip back</span>
          </div>
        </motion.div>
      </button>
    </div>
  );
}

/* ================================================================== */
/* 20 — CompareColumns: two columns, three time ranges                 */
/* ================================================================== */

const RANGES: Record<string, { now: number; then: number; unit: string }> = {
  "7d": { now: 68, then: 45, unit: "hrs" },
  "30d": { now: 84, then: 71, unit: "hrs" },
  "90d": { now: 57, then: 63, unit: "hrs" },
};

export function StatV20({ demo = false }: VariantProps) {
  const [range, setRange] = useState<keyof typeof RANGES>("7d");
  const instant = useInstant();
  const data = RANGES[range];
  const nowV = useCountUp(data.now, 0.8);
  const thenV = useCountUp(data.then, 0.8);

  useEffect(() => {
    if (!demo) return;
    const keys = Object.keys(RANGES) as Array<keyof typeof RANGES>;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % keys.length;
      setRange(keys[i]);
    }, 1600);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v20">
      <header className="dd-v20-head">
        <h3>Focus time</h3>
        <div className="dd-v20-tabs" role="tablist">
          {(Object.keys(RANGES) as Array<keyof typeof RANGES>).map((k) => (
            <button key={k} role="tab" aria-selected={range === k} className={range === k ? "is-on" : ""} onClick={() => setRange(k)}>
              {k}
            </button>
          ))}
        </div>
      </header>
      <div className="dd-v20-stage">
        <div className="dd-v20-pair">
          <motion.span
            className="dd-v20-col dd-v20-now"
            initial={false}
            animate={{ height: `${(data.now / 90) * 100}%` }}
            transition={instant ?? springs.bouncy}
          />
          <strong>{nowV}</strong>
          <span className="dd-v20-which">This period</span>
        </div>
        <div className="dd-v20-pair">
          <motion.span
            className="dd-v20-col dd-v20-then"
            initial={false}
            animate={{ height: `${(data.then / 90) * 100}%` }}
            transition={instant ?? springs.bouncy}
          />
          <strong>{thenV}</strong>
          <span className="dd-v20-which">Previous</span>
        </div>
      </div>
      <p className="dd-v20-cap">
        {data.now >= data.then ? "Up" : "Down"} {Math.abs(data.now - data.then)} {data.unit} vs the previous {range}
      </p>
    </div>
  );
}

/* ================================================================== */
/* BADGES                                                              */
/* ================================================================== */

/* ================================================================== */
/* 21 — StatusPills: service health with a live pulsing dot            */
/* ================================================================== */

const SERVICES = [
  { name: "API", state: "ok", text: "Operational" },
  { name: "Rendering", state: "ok", text: "Operational" },
  { name: "Storage", state: "warn", text: "Degraded" },
  { name: "Email", state: "ok", text: "Operational" },
];

export function BadgeV21() {
  const instant = useInstant();
  return (
    <div className="dd dd-v21">
      <header className="dd-v21-head">
        <h3>System status</h3>
        <span className="dd-v21-updated">checked just now</span>
      </header>
      <ul className="dd-v21-list">
        {SERVICES.map((s, i) => (
          <motion.li
            key={s.name}
            className="dd-v21-row"
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : i * 0.07 }}
          >
            <span className="dd-v21-name">{s.name}</span>
            <span className={`dd-v21-pill dd-v21-${s.state}`}>
              <span className="dd-v21-dot" />
              {s.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */
/* 22 — CountChips: notification badges that pop when counts rise      */
/* ================================================================== */

export function BadgeV22({ demo = false }: VariantProps) {
  const [counts, setCounts] = useState([3, 12, 1]);
  const instant = useInstant();
  const icons = [Bell, Mail, MessageSquare];
  const labels = ["Notifications", "Mail", "Chat"];

  const bump = useCallback((i: number) => {
    setCounts((c) => c.map((v, j) => (j === i ? v + 1 : v)));
  }, []);

  useEffect(() => {
    if (!demo) return;
    let i = 0;
    const t = setInterval(() => {
      bump(i % 3);
      i += 1;
    }, 1200);
    return () => clearInterval(t);
  }, [demo, bump]);

  return (
    <div className="dd dd-v22">
      <div className="dd-v22-row">
        {icons.map((Icon, i) => (
          <motion.button
            key={labels[i]}
            className="dd-v22-btn"
            aria-label={`${labels[i]}, ${counts[i]} unread`}
            onClick={() => bump(i)}
            whileTap={instant ? undefined : { scale: 0.9, rotate: -3 }}
            transition={springs.stiff}
          >
            <Icon size={19} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={counts[i]}
                className="dd-v22-count"
                initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.3, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.3, y: 6 }}
                transition={instant ?? springs.bouncy}
              >
                {counts[i]}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <p className="dd-v22-cap">Click an icon to bump its count</p>
    </div>
  );
}

/* ================================================================== */
/* 23 — VerifiedBadge: identity row, check draws in, hover tooltip     */
/* ================================================================== */

export function BadgeV23() {
  const [tip, setTip] = useState(false);
  const instant = useInstant();
  return (
    <div className="dd dd-v23">
      <div className="dd-v23-row">
        <Avatar person={PEOPLE[6]} size={44} />
        <div className="dd-v23-meta">
          <strong>Sara Lindqvist</strong>
          <span>@sara.l · Product research</span>
        </div>
        <span
          className="dd-v23-pill"
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
        >
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
            <motion.path
              d="M3.4 8.6 L6.6 11.6 L12.8 4.6"
              className="dd-v23-check"
              initial={instant ? undefined : ({ pathLength: 0 } as never)}
              animate={{ pathLength: 1 } as never}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            />
          </svg>
          Verified
        </span>
        <AnimatePresence>
          {tip && (
            <motion.div
              className="dd-v23-tip"
              role="tooltip"
              initial={instant ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
              transition={instant ?? springs.snappy}
            >
              Identity confirmed Nov 2026
              <br />
              <span>Government ID + work email</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="dd-v23-flags">
        <span className="dd-v23-flag"><Star size={12} /> Top reviewer</span>
        <span className="dd-v23-flag"><TrendingUp size={12} /> 98% response</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 24 — TagSet: removable tags that collapse with a layout spring      */
/* ================================================================== */

const TAG_POOL = ["design", "motion", "react", "spring", "tokens", "docs", "a11y", "webgl"];

export function BadgeV24() {
  const [tags, setTags] = useState(TAG_POOL.slice(0, 6));
  const instant = useInstant();
  const remaining = TAG_POOL.filter((t) => !tags.includes(t));

  return (
    <div className="dd dd-v24">
      <div className="dd-v24-head">
        <h3>File tags</h3>
        <span>{tags.length} of {TAG_POOL.length}</span>
      </div>
      <motion.div className="dd-v24-cloud" layout transition={instant ?? springs.soft}>
        <AnimatePresence initial={false}>
          {tags.map((t) => (
            <motion.span
              key={t}
              className="dd-v24-tag"
              layout
              initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={instant ?? springs.bouncy}
            >
              {t}
              <button aria-label={`Remove tag ${t}`} onClick={() => setTags((ts) => ts.filter((x) => x !== t))}>
                <X size={11} strokeWidth={2.6} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {remaining.length > 0 && (
          <motion.button
            layout
            className="dd-v24-add"
            onClick={() => setTags((ts) => [...ts, remaining[0]])}
            whileTap={instant ? undefined : { scale: 0.9 }}
            transition={springs.stiff}
          >
            <Plus size={12} /> Add
          </motion.button>
        )}
      </motion.div>
      <p className="dd-v24-cap">Remove a tag and the cloud closes the gap</p>
    </div>
  );
}

/* ================================================================== */
/* 25 — MedalTier: a flat enamel tier badge with cursor tilt           */
/* ================================================================== */

export function BadgeV25() {
  const instant = useInstant();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div className="dd dd-v25">
      <motion.div
        className="dd-v25-medal"
        onMouseMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          setTilt({
            x: ((e.clientY - b.top) / b.height - 0.5) * -14,
            y: ((e.clientX - b.left) / b.width - 0.5) * 14,
          });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={instant ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
        transition={springs.soft}
      >
        <span className="dd-v25-sweep" aria-hidden />
        <svg viewBox="0 0 96 112" width="104" height="122" aria-hidden>
          <path d="M34 84 L26 110 L48 98 L70 110 L62 84" className="dd-v25-ribbon" />
          <path d="M48 6 L84 24 V60 C84 78 68 92 48 98 C28 92 12 78 12 60 V24 Z" className="dd-v25-shield" />
          <path d="M48 6 L84 24 V60 C84 78 68 92 48 98 C28 92 12 78 12 60 V24 Z" className="dd-v25-edge" />
          <path d="M48 30 l6.2 12.6 13.9 2 -10 9.8 2.4 13.8 -12.5 -6.6 -12.5 6.6 2.4 -13.8 -10 -9.8 13.9 -2 Z" className="dd-v25-star" />
        </svg>
        <strong>Gold contributor</strong>
        <span>Top 3% of reviewers this quarter</span>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/* TABLES                                                              */
/* ================================================================== */

/* ================================================================== */
/* 26 — SortableTable: headers sort, rows glide to their new places    */
/* ================================================================== */

interface RowV26 {
  name: string;
  role: string;
  projects: number;
  score: number;
}

const ROWS_V26: RowV26[] = [
  { name: "Aya Konishi", role: "Design", projects: 12, score: 94 },
  { name: "Mateo Ruiz", role: "iOS", projects: 7, score: 88 },
  { name: "Priya Nair", role: "Data", projects: 9, score: 91 },
  { name: "Tom Beckett", role: "Video", projects: 15, score: 76 },
  { name: "Lena Vogt", role: "Motion", projects: 6, score: 97 },
  { name: "Chris Oduya", role: "Backend", projects: 11, score: 83 },
];

type SortKey = keyof RowV26;

export function TableV26({ demo = false }: VariantProps) {
  const [key, setKey] = useState<SortKey>("score");
  const [dir, setDir] = useState<-1 | 1>(-1);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    const keys: SortKey[] = ["score", "projects", "name"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % keys.length;
      setKey(keys[i]);
      setDir(i % 2 === 0 ? -1 : 1);
    }, 1900);
    return () => clearInterval(t);
  }, [demo]);

  const rows = useMemo(
    () =>
      [...ROWS_V26].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
        return cmp * dir;
      }),
    [key, dir]
  );

  const Head = ({ id, label }: { id: SortKey; label: string }) => (
    <th>
      <button
        className={`dd-v26-hbtn${key === id ? " is-on" : ""}`}
        onClick={() => {
          if (key === id) setDir((d) => (d === 1 ? -1 : 1));
          else {
            setKey(id);
            setDir(-1);
          }
        }}
        aria-sort={key === id ? (dir === 1 ? "ascending" : "descending") : undefined}
      >
        {label}
        <motion.span
          className="dd-v26-arrow"
          animate={{ rotate: key === id ? (dir === 1 ? 180 : 0) : 0, opacity: key === id ? 1 : 0.3 }}
          transition={instant ?? springs.snappy}
        >
          <ChevronDown size={13} />
        </motion.span>
      </button>
    </th>
  );

  return (
    <div className="dd dd-v26">
      <table>
        <thead>
          <tr>
            <Head id="name" label="Name" />
            <Head id="role" label="Team" />
            <Head id="projects" label="Projects" />
            <Head id="score" label="Score" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <motion.tr key={r.name} layout transition={instant ?? { type: "spring", stiffness: 320, damping: 30 }}>
              <td className="dd-v26-name">
                <Avatar person={PEOPLE.find((p) => p.name === r.name) ?? PEOPLE[0]} size={26} />
                {r.name}
              </td>
              <td>{r.role}</td>
              <td className="dd-v26-num">{r.projects}</td>
              <td className="dd-v26-num">
                <span className={`dd-v26-score${r.score >= 90 ? " is-high" : ""}`}>{r.score}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="dd-v26-cap">Click a header to sort; rows glide, not jump</p>
    </div>
  );
}

/* ================================================================== */
/* 27 — ExpandableTable: rows open into an order detail panel          */
/* ================================================================== */

const ORDERS = [
  { id: "ORD-2291", who: "Mira Shah", total: "$128.00", items: ["Riso poster ×2", "Kraft mailer", "Tracking"] },
  { id: "ORD-2290", who: "Jonas Weber", total: "$64.00", items: ["Riso poster ×1"] },
  { id: "ORD-2289", who: "Ana Sousa", total: "$212.50", items: ["Zine bundle", "Sticker sheet ×4", "Tube mailer"] },
  { id: "ORD-2288", who: "Ken Watanabe", total: "$89.90", items: ["Photo print A3 ×2"] },
];

export function TableV27({ demo = false }: VariantProps) {
  const [open, setOpen] = useState(-1);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    let i = -1;
    const t = setInterval(() => {
      i = (i + 1) % ORDERS.length;
      setOpen(i);
    }, 1600);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v27">
      <ul className="dd-v27-list">
        {ORDERS.map((o, i) => {
          const isOpen = open === i;
          return (
            <li key={o.id} className={`dd-v27-item${isOpen ? " is-open" : ""}`}>
              <button className="dd-v27-row" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={instant ?? springs.snappy} className="dd-v27-chev">
                  <ChevronRight size={15} />
                </motion.span>
                <span className="dd-v27-id">{o.id}</span>
                <span className="dd-v27-who">{o.who}</span>
                <span className="dd-v27-total">{o.total}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="dd-v27-detail"
                    initial={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={instant ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={instant ?? { type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ul>
                      {o.items.map((it, j) => (
                        <motion.li
                          key={it}
                          initial={instant ? false : { opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.08 + j * 0.05 }}
                        >
                          {it}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <p className="dd-v27-cap">One order open at a time</p>
    </div>
  );
}

/* ================================================================== */
/* 28 — SelectTable: row selection summons a floating toolbar          */
/* ================================================================== */

const FILES_V28 = [
  { name: "launch-hero.fig", size: "18 MB", mod: "2h ago" },
  { name: "tokens.json", size: "12 KB", mod: "5h ago" },
  { name: "release-notes.md", size: "4 KB", mod: "Yesterday" },
  { name: "promo-cut-v9.mp4", size: "240 MB", mod: "Yesterday" },
  { name: "invoice-1042.pdf", size: "86 KB", mod: "Nov 20" },
];

export function TableV28({ demo = false }: VariantProps) {
  const [sel, setSel] = useState<number[]>([]);
  const instant = useInstant();

  useEffect(() => {
    if (!demo) return;
    const seq = [[1], [1, 3], [1, 3, 4], [] as number[]];
    let i = 0;
    const t = setInterval(() => {
      setSel(seq[i % seq.length]);
      i += 1;
    }, 1300);
    return () => clearInterval(t);
  }, [demo]);

  const toggle = (i: number) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const all = sel.length === FILES_V28.length;

  return (
    <div className="dd dd-v28">
      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div
            className="dd-v28-bar"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
            transition={instant ?? springs.snappy}
          >
            <strong>{sel.length} selected</strong>
            <span className="dd-v28-actions">
              <button><Download size={13} /> Export</button>
              <button className="dd-v28-danger"><X size={13} /> Remove</button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="dd-v28-head">
        <button className={`dd-v28-check${all ? " is-on" : ""}`} onClick={() => setSel(all ? [] : FILES_V28.map((_, i) => i))} aria-label="Select all files">
          {all && (
            <motion.svg viewBox="0 0 12 12" width="10" height="10">
              <motion.path d="M2 6.4 L4.8 9 L10 3" className="dd-v28-tick" initial={instant ? undefined : ({ pathLength: 0 } as never)} animate={{ pathLength: 1 } as never} transition={{ duration: 0.25 }} />
            </motion.svg>
          )}
        </button>
        <span>Name</span>
        <span className="dd-v28-hr">Size</span>
        <span className="dd-v28-hr">Modified</span>
      </div>
      <ul>
        {FILES_V28.map((f, i) => {
          const on = sel.includes(i);
          return (
            <motion.li key={f.name} className={`dd-v28-row${on ? " is-on" : ""}`} onClick={() => toggle(i)} whileTap={instant ? undefined : { scale: 0.995 }}>
              <span className={`dd-v28-check${on ? " is-on" : ""}`}>
                {on && (
                  <motion.svg viewBox="0 0 12 12" width="10" height="10">
                    <motion.path d="M2 6.4 L4.8 9 L10 3" className="dd-v28-tick" initial={instant ? undefined : ({ pathLength: 0 } as never)} animate={{ pathLength: 1 } as never} transition={{ duration: 0.25 }} />
                  </motion.svg>
                )}
              </span>
              <span className="dd-v28-name">
                <FileText size={14} /> {f.name}
              </span>
              <span className="dd-v28-dim">{f.size}</span>
              <span className="dd-v28-dim">{f.mod}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ================================================================== */
/* 29 — InlineEditTable: click a cell, edit it in place                */
/* ================================================================== */

interface TaskRow {
  task: string;
  owner: string;
  status: string;
}

const TASKS_INIT: TaskRow[] = [
  { task: "Cut launch teaser", owner: "Lena", status: "In progress" },
  { task: "Ship tokens v2", owner: "Aya", status: "Review" },
  { task: "Fix export bug", owner: "Chris", status: "Todo" },
  { task: "Write changelog", owner: "Ana", status: "Done" },
];

export function TableV29() {
  const [rows, setRows] = useState(TASKS_INIT);
  const [edit, setEdit] = useState<{ r: number; c: keyof TaskRow } | null>(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const instant = useInstant();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit) inputRef.current?.focus();
  }, [edit]);

  const commit = () => {
    if (!edit) return;
    setRows((rs) => rs.map((r, i) => (i === edit.r ? { ...r, [edit.c]: draft } : r)));
    setSaved(`${edit.r}-${edit.c}`);
    setEdit(null);
    setTimeout(() => setSaved(null), 900);
  };

  const Cell = ({ r, c, w }: { r: number; c: keyof TaskRow; w?: string }) => {
    const isEdit = edit?.r === r && edit?.c === c;
    const flash = saved === `${r}-${c}`;
    return (
      <td className={`dd-v29-cell${flash ? " is-saved" : ""}`} style={{ width: w }}>
        {isEdit ? (
          <span className="dd-v29-editing">
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEdit(null); }} />
            <button aria-label="Save" onClick={commit}><Check size={13} /></button>
            <button aria-label="Cancel" onClick={() => setEdit(null)}><X size={13} /></button>
          </span>
        ) : (
          <button className="dd-v29-value" onClick={() => { setEdit({ r, c }); setDraft(rows[r][c]); }}>
            {rows[r][c]}
            <Pencil size={11} className="dd-v29-pen" />
          </button>
        )}
      </td>
    );
  };

  return (
    <div className="dd dd-v29">
      <table>
        <thead>
          <tr><th>Task</th><th>Owner</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((_, r) => (
            <motion.tr key={r} initial={instant ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : r * 0.05 }}>
              <Cell r={r} c="task" />
              <Cell r={r} c="owner" w="96px" />
              <Cell r={r} c="status" w="118px" />
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="dd-v29-cap">Click any cell to edit · Enter saves, Esc cancels</p>
    </div>
  );
}

/* ================================================================== */
/* 30 — KeyboardTable: arrow keys move a sprung highlight bar          */
/* ================================================================== */

const INBOX_V30 = [
  { from: "Figma", subj: "Dev mode seats are ready", time: "9:12" },
  { from: "Linear", subj: "GOAT-211 assigned to you", time: "9:41" },
  { from: "Vercel", subj: "Deployment succeeded", time: "10:03" },
  { from: "Notion", subj: "Mira mentioned you", time: "10:28" },
  { from: "GitHub", subj: "PR #482 approved", time: "11:02" },
  { from: "Stripe", subj: "Payout of $1,204 sent", time: "11:37" },
];

export function TableV30({ demo = false }: VariantProps) {
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const instant = useInstant();

  useEffect(() => {
    if (demo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); setIdx((i) => Math.min(INBOX_V30.length - 1, i + 1)); }
      if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter") { setToast(INBOX_V30[idx].subj); setTimeout(() => setToast(null), 1400); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [demo, idx]);

  useEffect(() => {
    if (!demo) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % INBOX_V30.length), 950);
    return () => clearInterval(t);
  }, [demo]);

  return (
    <div className="dd dd-v30">
      <AnimatePresence>
        {toast && (
          <motion.div
            className="dd-v30-toast"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={instant ?? springs.snappy}
          >
            Opened “{toast}”
          </motion.div>
        )}
      </AnimatePresence>
      <ul className="dd-v30-list" role="listbox" aria-label="Inbox" aria-activedescendant={`dd-v30-r${idx}`}>
        {INBOX_V30.map((m, i) => (
          <li key={m.subj} id={`dd-v30-r${i}`} role="option" aria-selected={idx === i} className={`dd-v30-row${idx === i ? " is-hl" : ""}`} onClick={() => setIdx(i)}>
            {idx === i && <motion.span layoutId="dd-v30-hl" className="dd-v30-hl" transition={instant ?? springs.snappy} />}
            <strong>{m.from}</strong>
            <span className="dd-v30-subj">{m.subj}</span>
            <span className="dd-v30-time">{m.time}</span>
          </li>
        ))}
      </ul>
      <p className="dd-v30-cap"><kbd>↑</kbd><kbd>↓</kbd> or <kbd>j</kbd><kbd>k</kbd> to move · <kbd>↵</kbd> to open</p>
    </div>
  );
}

/* ---------------- registry ---------------- */

export const DATA_DISPLAY: Array<{ name: string; label: string; Component: React.ComponentType<VariantProps> }> = [
  { name: "v01", label: "Fan stack", Component: AvatarV01 },
  { name: "v02", label: "Orbit dial", Component: AvatarV02 },
  { name: "v03", label: "Presence list", Component: AvatarV03 },
  { name: "v04", label: "Contributor marquee", Component: AvatarV04 },
  { name: "v05", label: "Pile to grid", Component: AvatarV05 },
  { name: "v06", label: "Stepped rail", Component: ProgressV06 },
  { name: "v07", label: "Spring dial", Component: ProgressV07 },
  { name: "v08", label: "Wave fill", Component: ProgressV08 },
  { name: "v09", label: "Milestone rail", Component: ProgressV09 },
  { name: "v10", label: "Transfer lanes", Component: ProgressV10 },
  { name: "v11", label: "Inbox zero", Component: EmptyV11 },
  { name: "v12", label: "No results", Component: EmptyV12 },
  { name: "v13", label: "Offline", Component: EmptyV13 },
  { name: "v14", label: "Locked folder", Component: EmptyV14 },
  { name: "v15", label: "First project", Component: EmptyV15 },
  { name: "v16", label: "Sparkline counter", Component: StatV16 },
  { name: "v17", label: "Trend bars", Component: StatV17 },
  { name: "v18", label: "Load gauge", Component: StatV18 },
  { name: "v19", label: "Flip card", Component: StatV19 },
  { name: "v20", label: "Compare columns", Component: StatV20 },
  { name: "v21", label: "Status pills", Component: BadgeV21 },
  { name: "v22", label: "Count chips", Component: BadgeV22 },
  { name: "v23", label: "Verified badge", Component: BadgeV23 },
  { name: "v24", label: "Tag set", Component: BadgeV24 },
  { name: "v25", label: "Medal tier", Component: BadgeV25 },
  { name: "v26", label: "Sortable table", Component: TableV26 },
  { name: "v27", label: "Expandable rows", Component: TableV27 },
  { name: "v28", label: "Selectable rows", Component: TableV28 },
  { name: "v29", label: "Inline edit", Component: TableV29 },
  { name: "v30", label: "Keyboard nav", Component: TableV30 },
];
