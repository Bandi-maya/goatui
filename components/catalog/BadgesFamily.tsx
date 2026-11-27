"use client";

import {
  AnimatePresence,
  Reorder,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  Flame,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Star,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/* ───────────── shared ───────────── */

const SPRING: Transition = { type: "spring", stiffness: 420, damping: 30, mass: 0.8 };
const SOFT: Transition = { type: "spring", stiffness: 220, damping: 22, mass: 0.9 };
const SNAP: Transition = { type: "spring", stiffness: 640, damping: 34, mass: 0.6 };
const INSTANT: Transition = { duration: 0 };

function useTrans(kind: "spring" | "soft" | "snap" = "spring"): Transition {
  const reduce = useReducedMotion();
  if (reduce) return INSTANT;
  return kind === "soft" ? SOFT : kind === "snap" ? SNAP : SPRING;
}

function Stage({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`gb gb-stage ${className}`} role="group" aria-label={label}>
      {children}
    </div>
  );
}

type Person = { name: string; hue: number; role: string; city: string };
const PEOPLE: Person[] = [
  { name: "Ava Chen", hue: 14, role: "Design lead", city: "Lisbon" },
  { name: "Marcus Webb", hue: 212, role: "Staff engineer", city: "Austin" },
  { name: "Priya Nair", hue: 156, role: "Product", city: "Bengaluru" },
  { name: "Tomás Ruiz", hue: 38, role: "Motion", city: "Madrid" },
  { name: "Hana Sato", hue: 292, role: "Research", city: "Osaka" },
  { name: "Leo Fischer", hue: 188, role: "Platform", city: "Berlin" },
  { name: "Noor Haddad", hue: 340, role: "Brand", city: "Amman" },
  { name: "Jonas Berg", hue: 98, role: "Support", city: "Oslo" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Face({ p, size = 40, className = "", label = true }: { p: Person; size?: number; className?: string; label?: boolean }) {
  return (
    <span
      className={`gb-face ${className}`}
      style={{ "--h": p.hue, "--sz": `${size}px` } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label ? p.name : undefined}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="31" cy="8" r="14" fill="hsl(var(--h) 90% 88% / .35)" />
        <circle cx="6" cy="38" r="16" fill="hsl(calc(var(--h) + 50) 70% 30% / .35)" />
      </svg>
      <b>{initials(p.name)}</b>
    </span>
  );
}


/* ═════════════ BATCH 1 · status and count badges ═════════════ */

/* v01 */
const PRESENCE = [
  { key: "online", label: "Online" },
  { key: "away", label: "Away" },
  { key: "busy", label: "Do not disturb" },
  { key: "offline", label: "Offline" },
] as const;

export function StatusPulseBadge() {
  const [i, setI] = useState(0);
  const t = useTrans();
  const s = PRESENCE[i];
  return (
    <Stage label="Status pulse badge">
      <motion.button
        layout
        transition={t}
        type="button"
        className="gb-pulse"
        data-state={s.key}
        onClick={() => setI((v) => (v + 1) % PRESENCE.length)}
        aria-label={`Status: ${s.label}. Press to change.`}
      >
        <span className="gb-pulse-dot" aria-hidden="true">
          <i />
          <i />
          <em />
        </span>
        <span className="gb-pulse-text">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={s.key}
              initial={{ y: 14, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -14, opacity: 0, filter: "blur(3px)" }}
              transition={t}
            >
              {s.label}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <p className="gb-hint">Click to cycle presence</p>
    </Stage>
  );
}

/* v02 */
function Roll({ d, t }: { d: number; t: Transition }) {
  return (
    <span className="gb-roll" aria-hidden="true">
      <motion.span className="gb-roll-col" animate={{ y: `${-d * 10}%` }} transition={t}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

export function CountOdometerBadge() {
  const [n, setN] = useState(128);
  const t = useTrans("soft");
  const digits = String(n).padStart(4, "0").split("").map(Number);
  const bump = (d: number) => setN((v) => Math.max(0, Math.min(9999, v + d)));
  return (
    <Stage label="Odometer count badge">
      <div className="gb-odo" role="status" aria-live="polite">
        <span className="gb-odo-label">Unread</span>
        <span className="gb-odo-digits gb-num">
          {digits.map((d, idx) => (
            <Roll key={idx} d={d} t={t} />
          ))}
        </span>
        <span className="gb-sr">{n} unread messages</span>
      </div>
      <div className="gb-row">
        <button type="button" className="gb-btn gb-btn-icon" onClick={() => bump(-7)} aria-label="Read 7">
          <Minus size={16} aria-hidden="true" />
        </button>
        <button type="button" className="gb-btn gb-btn-icon" onClick={() => bump(+19)} aria-label="Receive 19">
          <Plus size={16} aria-hidden="true" />
        </button>
        <button type="button" className="gb-btn gb-btn-ghost" onClick={() => bump(1000)}>
          Surge
        </button>
      </div>
    </Stage>
  );
}

/* v03 */
export function LiquidFillBadge() {
  const [lvl, setLvl] = useState(64);
  const t = useTrans("soft");
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); setLvl((v) => Math.min(100, v + 8)); }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); setLvl((v) => Math.max(0, v - 8)); }
    if (e.key === "Home") setLvl(0);
    if (e.key === "End") setLvl(100);
  };
  return (
    <Stage label="Liquid fill badge">
      <div
        className="gb-liquid"
        role="slider"
        tabIndex={0}
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={lvl}
        aria-valuetext={`${lvl} percent`}
        onKeyDown={onKey}
        onClick={() => setLvl((v) => (v >= 100 ? 8 : Math.min(100, v + 12)))}
      >
        <motion.div className="gb-liquid-body" animate={{ y: `${100 - lvl}%` }} transition={t}>
          <svg className="gb-wave gb-wave-a" viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 6 Q20 0 40 6 T80 6 T120 6 T160 6 V12 H0Z" />
          </svg>
          <svg className="gb-wave gb-wave-b" viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 6 Q20 12 40 6 T80 6 T120 6 T160 6 V12 H0Z" />
          </svg>
          <span className="gb-liquid-fill" />
        </motion.div>
        <span className="gb-liquid-num gb-num">
          {lvl}
          <small>%</small>
        </span>
      </div>
      <p className="gb-hint">Click or use arrow keys</p>
    </Stage>
  );
}

/* v04 */
export function FlipTagBadge() {
  const [flip, setFlip] = useState(false);
  const t = useTrans();
  return (
    <Stage label="Flip tag badge">
      <button
        type="button"
        className="gb-flip"
        aria-pressed={flip}
        aria-label="v2.4.0, press to show release details"
        onClick={() => setFlip((v) => !v)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setFlip(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setFlip(false)}
        onFocus={() => setFlip(true)}
        onBlur={() => setFlip(false)}
      >
        <motion.span className="gb-flip-in" animate={{ rotateX: flip ? 180 : 0 }} transition={t}>
          <span className="gb-flip-face gb-flip-front">
            <i aria-hidden="true" />
            <b className="gb-num">v2.4.0</b>
            <em>stable</em>
          </span>
          <span className="gb-flip-face gb-flip-back">
            <span className="gb-num">Shipped 3d ago</span>
            <em className="gb-num">+41 −9</em>
          </span>
        </motion.span>
      </button>
      <p className="gb-hint">Hover, focus or tap</p>
    </Stage>
  );
}

/* v05 */
export function ShimmerProBadge() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sy = useSpring(ry, { stiffness: 260, damping: 20 });
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--hue", `${Math.round(px * 120 + 20)}`);
    rx.set((0.5 - py) * 18);
    ry.set((px - 0.5) * 24);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <Stage label="Holographic pro badge">
      <div className="gb-persp">
        <motion.button
          ref={ref}
          type="button"
          className="gb-holo"
          style={{ rotateX: sx, rotateY: sy }}
          onPointerMove={move}
          onPointerLeave={leave}
          onBlur={leave}
          onFocus={() => { rx.set(-6); ry.set(8); }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="gb-holo-foil" aria-hidden="true" />
          <Star size={16} aria-hidden="true" fill="currentColor" />
          <span>Founding member</span>
        </motion.button>
      </div>
      <p className="gb-hint">Move across the foil</p>
    </Stage>
  );
}

/* v06 */
export function MagneticCountBadge() {
  const [n, setN] = useState(3);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 300, damping: 18, mass: 0.6 });
  const reduce = useReducedMotion();
  const t = useTrans("snap");
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(Math.max(-14, Math.min(14, (e.clientX - (r.right - 4)) * 0.45)));
    y.set(Math.max(-14, Math.min(14, (e.clientY - (r.top + 4)) * 0.45)));
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <Stage label="Magnetic count badge">
      <div className="gb-mag-zone" onPointerMove={move} onPointerLeave={leave}>
        <div className="gb-mag" ref={ref}>
          <button type="button" className="gb-mag-btn" onClick={() => setN((v) => v + 1)} aria-label={`Inbox, ${n} new. Press to add one.`}>
            <Bell size={20} aria-hidden="true" />
            Inbox
          </button>
          <motion.span className="gb-mag-badge" style={{ x: sx, y: sy }} aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b
                key={n}
                className="gb-num"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={t}
              >
                {n}
              </motion.b>
            </AnimatePresence>
          </motion.span>
        </div>
      </div>
      <p className="gb-hint">Badge leans toward the cursor</p>
    </Stage>
  );
}


/* ═════════════ BATCH 2 · avatars ═════════════ */

/* v07 */
export function AvatarStackFan() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const t = useTrans();
  const list = PEOPLE.slice(0, 5);
  return (
    <Stage label="Fanning avatar stack">
      <div
        className="gb-fan"
        role="group"
        aria-label="Project members"
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => { setOpen(false); setActive(null); }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setActive(null); } }}
      >
        {list.map((p, i) => (
          <motion.button
            key={p.name}
            type="button"
            className="gb-fan-item"
            aria-label={`${p.name}, ${p.role}`}
            style={{ zIndex: active === i ? 10 : list.length - i }}
            animate={{
              marginLeft: i === 0 ? 0 : open ? 6 : -14,
              rotate: open ? (i - 2) * 3 : 0,
              y: active === i ? -8 : open ? Math.abs(i - 2) * 2 : 0,
              scale: active === i ? 1.14 : 1,
            }}
            transition={t}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <Face p={p} size={48} label={false} />
          </motion.button>
        ))}
      </div>
      <div className="gb-fan-cap" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active ?? -1}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ ...t, duration: t === INSTANT ? 0 : 0.14 }}
          >
            {active === null ? `${list.length} members` : `${list[active].name} · ${list[active].role}`}
          </motion.span>
        </AnimatePresence>
      </div>
    </Stage>
  );
}

/* v08 */
const SEG = 6;
const R = 34;
const CIRC = 2 * Math.PI * R;

export function StoryRingAvatar() {
  const [seen, setSeen] = useState(2);
  const t = useTrans("soft");
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  const gap = 7;
  const seg = CIRC / SEG - gap;
  const next = () => setSeen((s) => (s >= SEG ? 0 : s + 1));
  return (
    <Stage label="Story ring avatar">
      <button
        type="button"
        className="gb-story"
        onClick={next}
        aria-label={seen >= SEG ? "All stories seen. Press to replay." : `Open story ${seen + 1} of ${SEG}`}
      >
        <svg viewBox="0 0 80 80" className="gb-story-svg" aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff7a3d" />
              <stop offset=".55" stopColor="#e5307a" />
              <stop offset="1" stopColor="#4282f0" />
            </linearGradient>
          </defs>
          <g className={reduce ? "" : "gb-story-spin"}>
            {Array.from({ length: SEG }).map((_, i) => (
              <motion.circle
                key={i}
                cx="40"
                cy="40"
                r={R}
                fill="none"
                strokeLinecap="round"
                strokeWidth={3}
                strokeDasharray={`${seg} ${CIRC - seg}`}
                transform={`rotate(${(i * 360) / SEG - 90 + 2} 40 40)`}
                animate={{ stroke: i < seen ? "#d6d0c2" : `url(#${gid})`, strokeWidth: i === seen ? 4.5 : 3 }}
                transition={t}
              />
            ))}
          </g>
        </svg>
        <motion.span className="gb-story-face" animate={{ scale: seen >= SEG ? 1 : 0.94 }} whileTap={{ scale: 0.88 }} transition={t}>
          <Face p={PEOPLE[2]} size={56} label={false} />
        </motion.span>
      </button>
      <p className="gb-hint gb-num">{Math.min(seen, SEG)} of {SEG} seen</p>
    </Stage>
  );
}

/* v09 */
function shapePoly(fn: (a: number) => number, n = 32) {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = fn(a);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
}
const SHAPES = [
  { name: "Circle", clip: shapePoly(() => 50) },
  { name: "Squircle", clip: shapePoly((a) => 50 / Math.pow(Math.pow(Math.abs(Math.cos(a)), 4) + Math.pow(Math.abs(Math.sin(a)), 4), 0.25)) },
  { name: "Hexagon", clip: shapePoly((a) => { const s = Math.PI / 3; const m = ((((a + Math.PI / 2) % s) + s) % s) - s / 2; return (50 * Math.cos(s / 2)) / Math.cos(m); }) },
  { name: "Bloom", clip: shapePoly((a) => 42 + 8 * Math.cos(6 * a)) },
  { name: "Diamond", clip: shapePoly((a) => 50 / (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a)))) },
];

export function ShapeMorphAvatar() {
  const [i, setI] = useState(0);
  const t = useTrans("soft");
  const s = SHAPES[i];
  return (
    <Stage label="Shape morph avatar">
      <button
        type="button"
        className="gb-morph"
        onClick={() => setI((v) => (v + 1) % SHAPES.length)}
        aria-label={`Avatar shape: ${s.name}. Press to change.`}
      >
        <motion.span className="gb-morph-shape" initial={false} animate={{ clipPath: s.clip, rotate: i * 12 }} transition={t}>
          <Face p={PEOPLE[3]} size={96} label={false} />
        </motion.span>
      </button>
      <p className="gb-hint">
        <span className="gb-num">{String(i + 1).padStart(2, "0")}</span> · {s.name}
      </p>
    </Stage>
  );
}

/* v10 */
export function OverflowGroupAvatar() {
  const [open, setOpen] = useState(false);
  const t = useTrans();
  const wrap = useRef<HTMLDivElement>(null);
  const uid = useId();
  const shown = PEOPLE.slice(0, 3);
  const rest = PEOPLE.slice(3);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);
  return (
    <Stage label="Overflow avatar group">
      <div className="gb-ovf" ref={wrap} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
        <div className="gb-ovf-row">
          {shown.map((p) => (
            <span key={p.name} className="gb-ovf-face"><Face p={p} size={40} /></span>
          ))}
          <motion.button
            type="button"
            className="gb-ovf-more gb-num"
            aria-expanded={open}
            aria-controls={uid}
            aria-label={`${rest.length} more people`}
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: open ? 90 : 0 }}
            transition={t}
          >
            <motion.span animate={{ rotate: open ? -90 : 0 }} transition={t}>+{rest.length}</motion.span>
          </motion.button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.ul
              id={uid}
              className="gb-ovf-pop"
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={t}
              style={{ transformOrigin: "top right" }}
            >
              {rest.map((p, i) => (
                <motion.li
                  key={p.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...t, delay: t === INSTANT ? 0 : 0.03 * i }}
                >
                  <Face p={p} size={24} label={false} />
                  <span>{p.name}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
}

/* v11 */
export function TiltPortraitAvatar() {
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glare = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgb(255 255 255 / .55), rgb(255 255 255 / 0) 55%)`);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * 22);
    ry.set((px - 0.5) * 26);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const rest = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(30); };
  const p = PEOPLE[4];
  return (
    <Stage label="Tilting portrait avatar" className="gb-stage-tall">
      <div className="gb-persp">
        <motion.button
          ref={ref}
          type="button"
          className="gb-tilt"
          style={{ rotateX: rx, rotateY: ry, "--h": p.hue } as never}
          onPointerMove={move}
          onPointerLeave={rest}
          onFocus={() => { rx.set(-8); ry.set(10); gx.set(70); gy.set(25); }}
          onBlur={rest}
          aria-label={`${p.name}, ${p.role}, ${p.city}`}
        >
          <span className="gb-tilt-art" aria-hidden="true">
            <i /><i /><i />
            <b>{initials(p.name)}</b>
          </span>
          <motion.span className="gb-tilt-glare" style={{ background: glare }} aria-hidden="true" />
          <span className="gb-tilt-meta">
            <strong>{p.name}</strong>
            <em>{p.role} · {p.city}</em>
          </span>
        </motion.button>
      </div>
    </Stage>
  );
}

/* v12 */
export function SpeakingRingAvatar() {
  const [on, setOn] = useState(true);
  const reduce = useReducedMotion();
  const lvl = useMotionValue(0);
  const s = useSpring(lvl, { stiffness: 380, damping: 16, mass: 0.5 });
  const r1 = useTransform(s, [0, 1], [1, 1.28]);
  const r2 = useTransform(s, [0, 1], [1, 1.6]);
  const o1 = useTransform(s, [0, 1], [0, 0.55]);
  const o2 = useTransform(s, [0, 1], [0, 0.28]);
  const [bars, setBars] = useState([0.3, 0.5, 0.8, 0.4, 0.6]);
  useEffect(() => {
    if (!on || reduce) { lvl.set(0); return; }
    const id = setInterval(() => {
      const v = Math.random() > 0.2 ? 0.25 + Math.random() * 0.75 : 0.05;
      lvl.set(v);
      setBars((b) => b.map((_, i) => Math.max(0.12, Math.min(1, v * (0.5 + Math.sin(i + v * 9) * 0.5) + Math.random() * 0.2))));
    }, 130);
    return () => clearInterval(id);
  }, [on, reduce, lvl]);
  return (
    <Stage label="Speaking avatar">
      <div className="gb-speak">
        <span className="gb-speak-av">
          <motion.i style={{ scale: r2, opacity: o2 }} aria-hidden="true" />
          <motion.i style={{ scale: r1, opacity: o1 }} aria-hidden="true" />
          <Face p={PEOPLE[5]} size={64} />
          {on && reduce && <u className="gb-speak-static" aria-hidden="true" />}
        </span>
        <span className="gb-speak-meta">
          <strong>{PEOPLE[5].name}</strong>
          <span className="gb-speak-bars" aria-hidden="true">
            {bars.map((b, i) => (
              <motion.b key={i} animate={{ scaleY: on ? (reduce ? 0.6 : b) : 0.12 }} transition={SNAP} />
            ))}
          </span>
        </span>
      </div>
      <button type="button" className="gb-btn" aria-pressed={on} onClick={() => setOn((v) => !v)}>
        {on ? "Mute" : "Unmute"}
      </button>
    </Stage>
  );
}


/* ═════════════ BATCH 3 · tags ═════════════ */

const STACK = ["React", "TypeScript", "Motion", "Accessibility", "Design tokens", "Next.js", "CSS"];

/* v13 */
export function RemovableTagList() {
  const [tags, setTags] = useState(STACK.slice(0, 5));
  const t = useTrans();
  const remove = (x: string) => setTags((l) => l.filter((v) => v !== x));
  return (
    <Stage label="Removable tags">
      <ul className="gb-rm" aria-label="Skills">
        <AnimatePresence mode="popLayout" initial={false}>
          {tags.map((x) => (
            <motion.li
              key={x}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
              transition={t}
              className="gb-rm-tag"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Delete" || e.key === "Backspace") {
                  e.preventDefault();
                  remove(x);
                }
              }}
            >
              <span>{x}</span>
              <button type="button" aria-label={`Remove ${x}`} onClick={() => remove(x)}>
                <X size={12} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="gb-row">
        <span className="gb-hint gb-num" aria-live="polite">{tags.length} of {STACK.length}</span>
        <button type="button" className="gb-btn gb-btn-ghost" onClick={() => setTags(STACK)}>
          <RotateCcw size={12} aria-hidden="true" style={{ marginRight: 4 }} />
          Restore
        </button>
      </div>
    </Stage>
  );
}

/* v14 */
export function DragReorderTags() {
  const [order, setOrder] = useState(["Discovery", "Prototype", "Review", "Handoff", "Launch"]);
  const t = useTrans("snap");
  const move = (x: string, d: number) => {
    setOrder((l) => {
      const i = l.indexOf(x);
      const j = i + d;
      if (j < 0 || j >= l.length) return l;
      const c = l.slice();
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  };
  return (
    <Stage label="Drag to reorder tags">
      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="gb-ro" aria-label="Pipeline stages. Drag, or press Alt with arrow keys, to reorder.">
        {order.map((x, i) => (
          <Reorder.Item
            key={x}
            value={x}
            className="gb-ro-item"
            transition={t}
            whileDrag={{ scale: 1.05, boxShadow: "0 14px 24px -10px rgba(40,30,10,.45)", zIndex: 5 }}
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); move(x, -1); }
              if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); move(x, 1); }
            }}
          >
            <span className="gb-ro-grip" aria-hidden="true">
              <i /><i /><i /><i /><i /><i />
            </span>
            <span className="gb-ro-name">{x}</span>
            <span className="gb-ro-n gb-num">{String(i + 1).padStart(2, "0")}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Stage>
  );
}

/* v15 */
const POOL = ["Figma", "Framer", "Storybook", "Tailwind", "Vitest", "Playwright", "Radix", "Zod"];

export function TagInputCombobox() {
  const [tags, setTags] = useState<string[]>(["Figma"]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const t = useTrans();
  const uid = useId();
  const opts = POOL.filter((p) => !tags.includes(p) && p.toLowerCase().includes(q.trim().toLowerCase()));
  const canCreate = q.trim().length > 0 && !tags.some((x) => x.toLowerCase() === q.trim().toLowerCase()) && !opts.some((o) => o.toLowerCase() === q.trim().toLowerCase());
  const items = [...opts, ...(canCreate ? [`Create "${q.trim()}"`] : [])];
  const add = (label: string) => {
    const v = label.startsWith('Create "') ? q.trim() : label;
    if (!v) return;
    setTags((l) => [...l, v]);
    setQ("");
    setHi(0);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHi((h) => Math.min(items.length - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
    else if (e.key === "Enter" && items[hi]) { e.preventDefault(); add(items[hi]); }
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Backspace" && !q && tags.length) setTags((l) => l.slice(0, -1));
  };
  return (
    <Stage label="Tag input" className="gb-stage-top">
      <div className="gb-ti">
        <div className="gb-ti-field">
          <AnimatePresence initial={false} mode="popLayout">
            {tags.map((x) => (
              <motion.span key={x} layout className="gb-ti-tag" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={t}>
                {x}
                <button type="button" aria-label={`Remove ${x}`} onClick={() => setTags((l) => l.filter((v) => v !== x))}>
                  <X size={12} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            role="combobox"
            aria-expanded={open && items.length > 0}
            aria-controls={uid}
            aria-autocomplete="list"
            aria-activedescendant={open && items[hi] ? `${uid}-${hi}` : undefined}
            aria-label="Add a tool"
            placeholder="Add a tool"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKey}
          />
        </div>
        <AnimatePresence>
          {open && items.length > 0 && (
            <motion.ul
              id={uid}
              role="listbox"
              className="gb-ti-pop"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={t}
            >
              {items.slice(0, 5).map((o, i) => (
                <li
                  key={o}
                  id={`${uid}-${i}`}
                  role="option"
                  aria-selected={i === hi}
                  data-hi={i === hi}
                  onPointerDown={(e) => { e.preventDefault(); add(o); }}
                  onPointerEnter={() => setHi(i)}
                >
                  {i === hi && <motion.span layoutId={`${uid}-hl`} className="gb-ti-hl" transition={t} />}
                  <span>{o}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
}

/* v16 */
const TOPICS = ["Design", "Code", "Motion", "Research", "Writing", "Ops"];

export function ChipFilterCount() {
  const [on, setOn] = useState<string[]>(["Design", "Motion"]);
  const t = useTrans("snap");
  const toggle = (x: string) => setOn((l) => (l.includes(x) ? l.filter((v) => v !== x) : [...l, x]));
  return (
    <Stage label="Filter chips">
      <div className="gb-chips" role="group" aria-label="Topics">
        {TOPICS.map((x) => {
          const sel = on.includes(x);
          return (
            <motion.button
              key={x}
              type="button"
              layout
              className="gb-chip"
              aria-pressed={sel}
              onClick={() => toggle(x)}
              animate={{ backgroundColor: sel ? "#1c1b18" : "#fffdf9", color: sel ? "#fffdf9" : "#1c1b18" }}
              whileTap={{ scale: 0.92 }}
              transition={t}
            >
              <AnimatePresence initial={false}>
                {sel && (
                  <motion.span
                    className="gb-chip-check"
                    initial={{ width: 0, opacity: 0, scale: 0.4 }}
                    animate={{ width: 16, opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.4 }}
                    transition={t}
                  >
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span layout="position">{x}</motion.span>
            </motion.button>
          );
        })}
      </div>
      <div className="gb-row" aria-live="polite">
        <span className="gb-count gb-num">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={on.length} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={t}>
              {on.length}
            </motion.b>
          </AnimatePresence>
          <span>selected</span>
        </span>
        <button type="button" className="gb-btn gb-btn-ghost" disabled={!on.length} onClick={() => setOn([])}>
          Clear
        </button>
      </div>
    </Stage>
  );
}

/* v17 */
const RANGES = ["Day", "Week", "Month", "Year"];

export function SlidingSegmentTags() {
  const [v, setV] = useState(1);
  const t = useTrans();
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    let n = v;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (v + 1) % RANGES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (v + RANGES.length - 1) % RANGES.length;
    else return;
    e.preventDefault();
    setV(n);
    refs.current[n]?.focus();
  };
  const data = [128, 904, 3812, 41270];
  return (
    <Stage label="Segmented tags">
      <div className="gb-seg" role="radiogroup" aria-label="Range" onKeyDown={onKey}>
        {RANGES.map((r, i) => (
          <button
            key={r}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={v === i}
            tabIndex={v === i ? 0 : -1}
            className="gb-seg-item"
            data-on={v === i}
            onClick={() => setV(i)}
          >
            {v === i && <motion.span layoutId={`${uid}-pill`} className="gb-seg-pill" transition={t} />}
            <span>{r}</span>
          </button>
        ))}
      </div>
      <div className="gb-seg-val gb-num" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b key={v} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={t}>
            {data[v].toLocaleString("en-US")}
          </motion.b>
        </AnimatePresence>
        <span>visits</span>
      </div>
    </Stage>
  );
}

/* v18 */
const CLOUD: [string, number][] = [
  ["design", 1240], ["motion", 862], ["react", 3410], ["a11y", 428], ["css", 1975], ["type", 301], ["systems", 659], ["tokens", 187],
];

export function ExpandingHashTags() {
  const [on, setOn] = useState<string | null>(null);
  const t = useTrans();
  return (
    <Stage label="Expanding hashtags">
      <div className="gb-cloud" onPointerLeave={() => setOn(null)}>
        {CLOUD.map(([k, c]) => {
          const open = on === k;
          return (
            <motion.button
              key={k}
              type="button"
              layout
              className="gb-hash"
              data-open={open}
              onPointerEnter={() => setOn(k)}
              onFocus={() => setOn(k)}
              onBlur={() => setOn(null)}
              onClick={() => setOn(open ? null : k)}
              aria-label={`#${k}, ${c.toLocaleString("en-US")} posts`}
              transition={t}
            >
              <motion.span layout="position" transition={t}>#{k}</motion.span>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    className="gb-hash-n gb-num"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={t}
                  >
                    {c.toLocaleString("en-US")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </Stage>
  );
}


/* ═════════════ BATCH 4 · badges with a mechanic ═════════════ */

function AnimatedNum({ value, digits = 0, prefix = "", suffix = "", className = "" }: { value: number; digits?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(value);
  const reduce = useReducedMotion();
  const fmt = useCallback(
    (v: number) => `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}${suffix}`,
    [digits, prefix, suffix],
  );
  useEffect(() => {
    if (reduce) { mv.set(value); if (ref.current) ref.current.textContent = fmt(value); return; }
    const c = animate(mv, value, { type: "spring", stiffness: 120, damping: 20, mass: 0.8 });
    return () => c.stop();
  }, [value, reduce, mv, fmt]);
  useEffect(() => {
    const off = mv.on("change", (v) => { if (ref.current) ref.current.textContent = fmt(v); });
    return off;
  }, [mv, fmt]);
  return <span ref={ref} className={`gb-num ${className}`}>{fmt(value)}</span>;
}

/* v19 */
export function PeelCornerBadge() {
  const [peel, setPeel] = useState(false);
  const t = useTrans();
  return (
    <Stage label="Peeling corner badge">
      <button
        type="button"
        className="gb-peel"
        aria-pressed={peel}
        aria-label="Studio plan, new. Press to peel the corner and reveal the offer."
        onPointerEnter={(e) => e.pointerType === "mouse" && setPeel(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPeel(false)}
        onFocus={() => setPeel(true)}
        onBlur={() => setPeel(false)}
        onClick={() => setPeel((v) => !v)}
      >
        <span className="gb-peel-body">
          <small>STUDIO</small>
          <strong className="gb-num">$24<em>/mo</em></strong>
          <span>Unlimited projects</span>
        </span>
        <motion.span className="gb-peel-corner" initial={false} animate={{ width: peel ? 88 : 32, height: peel ? 88 : 32 }} transition={t}>
          <span className="gb-peel-under"><b className="gb-num">−40%</b></span>
          <span className="gb-peel-flap" />
          <motion.span className="gb-peel-new" animate={{ opacity: peel ? 0 : 1 }} transition={t}>NEW</motion.span>
        </motion.span>
      </button>
      <p className="gb-hint">Hover, focus or tap the corner</p>
    </Stage>
  );
}

/* v20 */
export function TearOffTicketBadge() {
  const [torn, setTorn] = useState(false);
  const t = useTrans("soft");
  return (
    <Stage label="Tear-off ticket">
      <div className="gb-ticket">
        <div className="gb-ticket-main">
          <small>ADMIT ONE</small>
          <strong>Opening night</strong>
          <span className="gb-num">Row C · Seat 14</span>
        </div>
        <motion.div
          className="gb-ticket-stub"
          animate={torn ? { x: 28, y: 36, rotate: 14, opacity: 0.0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={torn ? { ...t, opacity: { duration: t === INSTANT ? 0 : 0.5, delay: 0.15 } } : t}
        >
          <span className="gb-num">No.</span>
          <b className="gb-num">0482</b>
        </motion.div>
        <AnimatePresence>
          {torn && (
            <motion.span className="gb-ticket-ok" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={t} role="status">
              <Check size={14} strokeWidth={3} aria-hidden="true" /> Redeemed
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <button type="button" className="gb-btn" onClick={() => setTorn((v) => !v)}>
        {torn ? "Reissue" : "Tear stub"}
      </button>
    </Stage>
  );
}

/* v21 */
export function StarRatingBadge() {
  const [val, setVal] = useState(4);
  const [hov, setHov] = useState(0);
  const t = useTrans("snap");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = hov || val;
  const onKey = (e: KeyboardEvent) => {
    let n = val;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") n = Math.min(5, val + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = Math.max(1, val - 1);
    else return;
    e.preventDefault();
    setVal(n);
    refs.current[n - 1]?.focus();
  };
  const avg = (1284 * 4.6 + val) / 1285;
  return (
    <Stage label="Star rating badge">
      <div className="gb-rate">
        <div className="gb-rate-stars" role="radiogroup" aria-label="Your rating" onKeyDown={onKey} onPointerLeave={() => setHov(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              ref={(el) => { refs.current[n - 1] = el; }}
              type="button"
              role="radio"
              aria-checked={val === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              tabIndex={val === n ? 0 : -1}
              onPointerEnter={() => setHov(n)}
              onClick={() => setVal(n)}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: shown === n ? 1.2 : 1, rotate: shown === n ? -8 : 0 }}
              transition={t}
            >
              <Star size={24} strokeWidth={1.75} aria-hidden="true" fill={n <= shown ? "#f2a900" : "transparent"} color={n <= shown ? "#c98500" : "#a8a398"} />
            </motion.button>
          ))}
        </div>
        <div className="gb-rate-meta">
          <b><AnimatedNum value={avg} digits={2} /></b>
          <span className="gb-num">1,285 reviews</span>
        </div>
      </div>
    </Stage>
  );
}

/* v22 */
export function CountdownRingBadge() {
  const TOTAL = 45;
  const [left, setLeft] = useState(TOTAL);
  const [run, setRun] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setLeft((l) => (l <= 1 ? (setRun(false), 0) : l - 1)), 1000);
    return () => clearInterval(id);
  }, [run]);
  const C = 2 * Math.PI * 36;
  const urgent = left <= 10 && left > 0;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <Stage label="Countdown ring badge">
      <div className="gb-timer" data-urgent={urgent} role="timer" aria-label={`${left} seconds left`}>
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="36" className="gb-timer-track" />
          <circle cx="40" cy="40" r="36" className="gb-timer-arc" strokeDasharray={C} strokeDashoffset={C * (1 - left / TOTAL)} transform="rotate(-90 40 40)" />
        </svg>
        <span className="gb-timer-num gb-num">{mm}:{ss}</span>
        {urgent && !reduce && <i className="gb-timer-pulse" aria-hidden="true" />}
      </div>
      <div className="gb-row">
        <button type="button" className="gb-btn gb-btn-icon" aria-label={run ? "Pause" : left === 0 ? "Restart" : "Start"} onClick={() => { if (left === 0) setLeft(TOTAL); setRun((v) => !v); }}>
          {run ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        </button>
        <button type="button" className="gb-btn gb-btn-icon" aria-label="Reset" onClick={() => { setRun(false); setLeft(TOTAL); }}>
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>
    </Stage>
  );
}

/* v23 */
const DELTAS = [12.4, -3.8, 28.1, -0.6, 7.9];

export function DeltaTrendBadge() {
  const [i, setI] = useState(0);
  const t = useTrans();
  const d = DELTAS[i];
  const up = d >= 0;
  return (
    <Stage label="Trend delta badge">
      <motion.button
        type="button"
        className="gb-delta"
        onClick={() => setI((v) => (v + 1) % DELTAS.length)}
        animate={{ backgroundColor: up ? "#dff5e8" : "#fbe3e1", color: up ? "#0d6b40" : "#a2231e" }}
        whileTap={{ scale: 0.94 }}
        transition={t}
        aria-label={`${up ? "Up" : "Down"} ${Math.abs(d)} percent. Press for the next period.`}
      >
        <motion.span className="gb-delta-ico" animate={{ rotate: up ? 0 : 90 }} transition={t}>
          <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </motion.span>
        <AnimatedNum value={Math.abs(d)} digits={1} prefix={up ? "+" : "−"} suffix="%" />
      </motion.button>
      <p className="gb-hint gb-num">Period {i + 1} of {DELTAS.length}</p>
    </Stage>
  );
}

/* v24 */
export function StreakFlameBadge() {
  const [n, setN] = useState(6);
  const [burst, setBurst] = useState(0);
  const t = useTrans("snap");
  const reduce = useReducedMotion();
  const heat = Math.min(1, n / 21);
  const hit = () => {
    const nn = n + 1;
    setN(nn);
    if (nn % 7 === 0) setBurst((b) => b + 1);
  };
  return (
    <Stage label="Streak flame badge">
      <div className="gb-streak">
        <motion.span
          className="gb-flame"
          key={n}
          initial={{ scale: 0.6, rotate: -14 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={t}
          style={{ color: `hsl(${28 - heat * 18} 95% ${52 - heat * 4}%)` }}
        >
          <Flame size={28} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
        </motion.span>
        <span className="gb-streak-n gb-num" role="status">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={n} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={t}>
              {n}
            </motion.b>
          </AnimatePresence>
          <small>day streak</small>
        </span>
        {!reduce && burst > 0 && (
          <span className="gb-burst" key={burst} aria-hidden="true">
            {Array.from({ length: 10 }).map((_, k) => {
              const a = (k / 10) * Math.PI * 2;
              return (
                <motion.i
                  key={k}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * 44, y: Math.sin(a) * 44, opacity: 0, scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 90, damping: 14, opacity: { duration: 0.7 } }}
                />
              );
            })}
          </span>
        )}
      </div>
      <button type="button" className="gb-btn" onClick={hit}>Check in</button>
    </Stage>
  );
}


/* ═════════════ BATCH 5 · seals, cards, rails ═════════════ */

/* v25 */
export function VerifiedSealBadge() {
  const [k, setK] = useState(0);
  const t = useTrans("soft");
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  return (
    <Stage label="Verified seal badge">
      <button type="button" className="gb-seal" onClick={() => setK((v) => v + 1)} aria-label="Verified creator. Press to replay the animation.">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id={`${uid}-c`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
          </defs>
          <g className={reduce ? "" : "gb-seal-spin"}>
            <text>
              <textPath href={`#${uid}-c`} startOffset="0" textLength="272" lengthAdjust="spacing">
                VERIFIED CREATOR · GOAT UI · MMXXVI · 
              </textPath>
            </text>
          </g>
          <motion.circle key={`r${k}`} cx="60" cy="60" r="30" className="gb-seal-disc" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={t} style={{ transformOrigin: "60px 60px" }} />
          <motion.path
            key={`p${k}`}
            d="M46 61 L56 71 L75 49"
            className="gb-seal-check"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.18, ease: [0.3, 1, 0.4, 1] }}
          />
        </svg>
      </button>
    </Stage>
  );
}

/* v26 */
export function HoverCardAvatar() {
  const [open, setOpen] = useState(false);
  const [follow, setFollow] = useState(false);
  const t = useTrans();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uid = useId();
  const p = PEOPLE[0];
  const show = (d = 120) => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), d); };
  const hide = () => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 140); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return (
    <Stage label="Avatar hover card" className="gb-stage-top">
      <div className="gb-hc" onPointerEnter={() => show()} onPointerLeave={hide} onFocus={() => show(0)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) hide(); }} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
        <button type="button" className="gb-hc-trigger" aria-expanded={open} aria-controls={uid} aria-label={`${p.name}, profile preview`} onClick={() => setOpen((v) => !v)}>
          <Face p={p} size={56} label={false} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              id={uid}
              role="dialog"
              aria-label={`${p.name} profile`}
              className="gb-hc-card"
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={t}
            >
              <div className="gb-hc-top">
                <Face p={p} size={40} label={false} />
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.role} · {p.city}</span>
                </div>
              </div>
              <dl className="gb-hc-stats gb-num">
                <div><dt>Posts</dt><dd>248</dd></div>
                <div><dt>Followers</dt><dd>12.4k</dd></div>
                <div><dt>Following</dt><dd>381</dd></div>
              </dl>
              <motion.button type="button" className="gb-hc-follow" aria-pressed={follow} onClick={() => setFollow((v) => !v)} whileTap={{ scale: 0.95 }} animate={{ backgroundColor: follow ? "#f3efe6" : "#1c1b18", color: follow ? "#1c1b18" : "#ffffff" }} transition={t}>
                {follow ? "Following" : "Follow"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!open && <p className="gb-hint">Hover or focus the avatar</p>}
    </Stage>
  );
}

/* v27 */
export function SwapUploadAvatar() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(1);
  const t = useTrans("soft");
  const reduce = useReducedMotion();
  const set = [PEOPLE[1], PEOPLE[6], PEOPLE[7], PEOPLE[2]];
  const next = () => { setPrev(cur); setCur((c) => (c + 1) % set.length); };
  return (
    <Stage label="Swappable avatar">
      <div className="gb-swap">
        <span className="gb-swap-stack">
          <Face p={set[prev]} size={96} label={false} className="gb-swap-under" />
          <motion.span
            key={cur}
            className="gb-swap-over"
            initial={{ clipPath: "circle(0% at 86% 86%)" }}
            animate={{ clipPath: "circle(150% at 86% 86%)" }}
            transition={reduce ? INSTANT : { type: "spring", stiffness: 70, damping: 20 }}
          >
            <Face p={set[cur]} size={96} label={false} />
          </motion.span>
        </span>
        <motion.button type="button" className="gb-swap-cam" onClick={next} whileTap={{ scale: 0.8, rotate: -12 }} whileHover={{ scale: 1.12 }} transition={t} aria-label={`Change photo. Current: ${set[cur].name}`}>
          <Camera size={16} aria-hidden="true" />
        </motion.button>
      </div>
      <p className="gb-hint gb-num" aria-live="polite">Photo {cur + 1} of {set.length}</p>
    </Stage>
  );
}

/* v28 */
const LEVELS = [
  { k: "Low", c: "#3b6fd8", bg: "#e6eefc" },
  { k: "Medium", c: "#a8710a", bg: "#fbefd2" },
  { k: "High", c: "#c2530f", bg: "#fde5d3" },
  { k: "Urgent", c: "#c4231d", bg: "#fbdcda" },
];

export function PriorityMorphTag() {
  const [i, setI] = useState(1);
  const t = useTrans("snap");
  const L = LEVELS[i];
  return (
    <Stage label="Priority tag">
      <motion.button
        type="button"
        layout
        className="gb-prio"
        onClick={() => setI((v) => (v + 1) % LEVELS.length)}
        animate={{ backgroundColor: L.bg, color: L.c, x: i === 3 ? [0, -3, 3, -2, 2, 0] : 0 }}
        transition={{ ...t, x: { duration: t === INSTANT ? 0 : 0.35 } }}
        aria-label={`Priority: ${L.k}. Press to raise.`}
      >
        <span className="gb-prio-bars" aria-hidden="true">
          {[0, 1, 2, 3].map((b) => (
            <motion.i key={b} style={{ height: 6 + b * 4 }} animate={{ backgroundColor: b <= i ? L.c : "rgba(0,0,0,.14)", scaleY: b <= i ? 1 : 0.7 }} transition={t} />
          ))}
        </span>
        <span className="gb-prio-label">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={L.k} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={t}>
              {L.k}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <p className="gb-hint">Press to raise priority</p>
    </Stage>
  );
}

/* v29 */
export function BellCountBadge() {
  const [n, setN] = useState(2);
  const [swing, setSwing] = useState(0);
  const t = useTrans("snap");
  const add = () => { setN((v) => v + 1); setSwing((s) => s + 1); };
  return (
    <Stage label="Notification bell">
      <div className="gb-bell">
        <motion.span
          key={swing}
          className="gb-bell-ico"
          initial={{ rotate: 0 }}
          animate={{ rotate: swing ? [0, -22, 18, -12, 8, -3, 0] : 0 }}
          transition={{ duration: swing ? 0.7 : 0, ease: "easeOut" }}
          style={{ transformOrigin: "50% 12%" }}
        >
          <Bell size={28} strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
        <AnimatePresence>
          {n > 0 && (
            <motion.span className="gb-bell-badge gb-num" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={t} role="status" aria-label={`${n} notifications`}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b key={Math.min(n, 100)} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={t}>
                  {n > 99 ? "99+" : n}
                </motion.b>
              </AnimatePresence>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="gb-row">
        <button type="button" className="gb-btn" onClick={add}>Simulate alert</button>
        <button type="button" className="gb-btn gb-btn-ghost" disabled={n === 0} onClick={() => setN(0)}>Mark read</button>
      </div>
    </Stage>
  );
}

/* v30 */
export function AvatarMarqueeRail() {
  const [paused, setPaused] = useState(false);
  const row = PEOPLE;
  return (
    <Stage label="Avatar marquee rail">
      <div className="gb-rail" data-paused={paused} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="gb-rail-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="gb-rail-set" aria-hidden={copy === 1 ? true : undefined}>
              {row.map((p) => (
                <li key={p.name}>
                  <motion.button type="button" tabIndex={copy === 1 ? -1 : 0} className="gb-rail-item" whileHover={{ y: -8, scale: 1.12 }} whileFocus={{ y: -8, scale: 1.12 }} whileTap={{ scale: 0.92 }} transition={SPRING} aria-label={`${p.name}, ${p.role}`}>
                    <Face p={p} size={48} label={false} />
                    <span>{p.name.split(" ")[0]}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button type="button" className="gb-btn gb-btn-icon" aria-pressed={paused} aria-label={paused ? "Resume scrolling" : "Pause scrolling"} onClick={() => setPaused((v) => !v)}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </Stage>
  );
              }
