"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Activity, ArrowRight, ArrowUpRight, Boxes, Check, ChevronDown, Clock, Code, Command, CornerDownLeft,
  Copy, FileText, Gauge, Globe, Heart, Layers, Lock, Mail, MessageCircle, Minus, Monitor, Moon, Palette,
  Pause, Play, Plus, RotateCcw, Rocket, Rss, Search, Send, Settings, Shield, Sparkles, Star, Sun,
  Terminal, User, Users, Video, X, Zap,
} from "lucide-react";
import "./SectionsFamily.css";

/* ---------- shared helpers ---------- */
const SPRING = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 } as const;
const SOFT = { type: "spring", stiffness: 170, damping: 22, mass: 1 } as const;
const SNAP = { type: "spring", stiffness: 620, damping: 34, mass: 0.6 } as const;
const NONE = { duration: 0 } as const;

function useMotionOK() {
  const rm = useReducedMotion();
  return !rm;
}
function useSp(kind: "spring" | "soft" | "snap" = "spring") {
  const ok = useMotionOK();
  return ok ? (kind === "soft" ? SOFT : kind === "snap" ? SNAP : SPRING) : NONE;
}

function Sec({ id, theme, label, children, className = "" }: { id: string; theme: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`gs gs-${id} t-${theme} ${className}`} aria-label={label} data-variant={id}>
      {children}
    </section>
  );
}

/** Rolling number: each digit sits in a vertical reel and springs to its value. */
function Roll({ value, prefix = "", suffix = "", decimals = 0, className = "" }: { value: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const t = useSp("soft");
  const txt = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={`gs-roll num ${className}`} aria-label={`${prefix}${txt}${suffix}`} role="text">
      <span aria-hidden="true">{prefix}</span>
      {txt.split("").map((c, i) =>
        /\d/.test(c) ? (
          <span className="gs-reel" key={txt.length - i} aria-hidden="true">
            <motion.span className="gs-reel-in" initial={false} animate={{ y: `${-Number(c) * 10}%` }} transition={t}>
              {"0123456789".split("").map((d) => <span key={d}>{d}</span>)}
            </motion.span>
          </span>
        ) : (
          <span key={txt.length - i} aria-hidden="true">{c}</span>
        )
      )}
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

function Btn({ children, ghost, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { ghost?: boolean }) {
  const ok = useMotionOK();
  return (
    <motion.button
      type="button"
      className={`gs-btn ${ghost ? "ghost" : ""}`}
      whileHover={ok ? { y: -2 } : undefined}
      whileTap={ok ? { scale: 0.96 } : undefined}
      transition={SNAP}
      onClick={onClick}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

/* =====================================================================
   HEROES
   ===================================================================== */

/* v01 — Magnetic letters + cursor spotlight */
function MagLetter({ ch, px, py }: { ch: string; px: MotionValue<number>; py: MotionValue<number> }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const ok = useMotionOK();
  const calc = (axis: 0 | 1) => (): number => {
    const el = ref.current;
    const mx = px.get(), my = py.get();
    if (!el || !ok || mx < 0) return 0;
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - mx, dy = r.top + r.height / 2 - my;
    const d = Math.hypot(dx, dy) || 1;
    const reach = 140;
    if (d > reach) return 0;
    const push = ((reach - d) / reach) * 28;
    return ((axis === 0 ? dx : dy) / d) * push;
  };
  const x = useSpring(useTransform([px, py], calc(0)), { stiffness: 260, damping: 16, mass: 0.5 });
  const y = useSpring(useTransform([px, py], calc(1)), { stiffness: 260, damping: 16, mass: 0.5 });
  return (
    <span ref={ref} className="gs-ml">
      <motion.span style={{ x, y, display: "inline-block" }}>{ch === " " ? "\u00a0" : ch}</motion.span>
    </span>
  );
}
export function MagneticHero() {
  const px = useMotionValue(-1), py = useMotionValue(-1);
  const sx = useMotionValue(-999), sy = useMotionValue(-999);
  const ref = React.useRef<HTMLElement>(null);
  const glow = useMotionTemplate`radial-gradient(320px circle at ${sx}px ${sy}px, rgba(190,255,120,.22), transparent 70%)`;
  const words = "Interfaces that lean toward you".split(" ");
  return (
    <section
      ref={ref}
      className="gs gs-v01 t-ink"
      aria-label="Magnetic hero"
      data-variant="v01"
      onPointerMove={(e) => {
        px.set(e.clientX); py.set(e.clientY);
        const r = ref.current!.getBoundingClientRect();
        sx.set(e.clientX - r.left); sy.set(e.clientY - r.top);
      }}
      onPointerLeave={() => { px.set(-1); py.set(-1); sx.set(-999); sy.set(-999); }}
    >
      <div className="gs-grid-bg" aria-hidden="true" />
      <motion.div className="gs-glow" style={{ background: glow }} aria-hidden="true" />
      <div className="gs-stack center">
        <p className="gs-eyebrow"><Sparkles size={14} aria-hidden="true" /> Move your cursor near the words</p>
        <h2 className="gs-h" aria-label="Interfaces that lean toward you">
          {words.map((w, wi) => (
            <span className="gs-word" key={wi} aria-hidden="true">
              {w.split("").map((c, i) => <MagLetter key={i} ch={c} px={px} py={py} />)}
              {wi < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <p className="gs-sub">Copy a component, paste it in, and watch every pixel respond to the hand that touches it.</p>
        <div className="gs-row"><Btn>Start building <ArrowRight size={16} aria-hidden="true" /></Btn><Btn ghost>Browse the catalog</Btn></div>
      </div>
    </section>
  );
}

/* v02 — Orbit ring with drag inertia */
const ORBIT = [
  ["Ada", "Design Eng", "#f97316"], ["Linus", "Platform", "#22d3ee"], ["Grace", "Compilers", "#a3e635"], ["Dan", "Motion", "#60a5fa"],
  ["Mae", "Research", "#facc15"], ["Ken", "Infra", "#84adf5"], ["Ivy", "Brand", "#34d399"], ["Raj", "Growth", "#fb7185"],
];
export function OrbitHero() {
  const ok = useMotionOK();
  const rot = useMotionValue(0);
  const vel = React.useRef(0);
  const drag = React.useRef<{ x: number; id: number } | null>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const [rad, setRad] = React.useState(200);
  React.useEffect(() => {
    const el = ringRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setRad(Math.max(88, el.clientWidth / 2 - 60)));
    ro.observe(el); setRad(Math.max(88, el.clientWidth / 2 - 60));
    return () => ro.disconnect();
  }, []);
  useAnimationFrame((_, dt) => {
    if (!ok) return;
    if (!drag.current) {
      vel.current += (0.012 - vel.current) * Math.min(1, dt / 600);
      rot.set(rot.get() + vel.current * dt);
    }
  });
  const step = (d: number) => {
    if (!ok) rot.set(rot.get() + d * 45); else vel.current += d * 0.35;
  };
  return (
    <Sec id="v02" theme="sea" label="Orbit hero">
      <div className="gs-split">
        <div className="gs-stack">
          <p className="gs-eyebrow"><Users size={14} aria-hidden="true" /> 12,480 teams</p>
          <h2 className="gs-h">A crew that never stops orbiting your product.</h2>
          <p className="gs-sub">Drag the ring, flick it, let it coast. Focus it and use the arrow keys.</p>
          <div className="gs-row"><Btn>Join the orbit <ArrowRight size={16} aria-hidden="true" /></Btn></div>
        </div>
        <div
          ref={ringRef}
          className="gs-orbit"
          role="group"
          tabIndex={0}
          aria-label="Team orbit. Drag, or use left and right arrow keys to spin."
          onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); step(1); } if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); } }}
          onPointerDown={(e) => { drag.current = { x: e.clientX, id: e.pointerId }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); vel.current = 0; }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x; drag.current.x = e.clientX;
            rot.set(rot.get() + dx * 0.4); vel.current = dx * 0.4 / 16;
          }}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
        >
          <div className="gs-orbit-core" aria-hidden="true"><Sparkles size={24} /></div>
          {ORBIT.map(([n, r, c], i) => <OrbitChip key={n} i={i} n={n} r={r} c={c} rot={rot} rad={rad} />)}
        </div>
      </div>
    </Sec>
  );
}
function OrbitChip({ i, n, r, c, rot, rad }: { i: number; n: string; r: string; c: string; rot: MotionValue<number>; rad: number }) {
  const a = (v: number) => ((v + i * 45) * Math.PI) / 180;
  const x = useTransform(rot, (v) => Math.cos(a(v)) * rad);
  const y = useTransform(rot, (v) => Math.sin(a(v)) * rad * 0.62);
  const z = useTransform(rot, (v) => Math.round(50 + Math.sin(a(v)) * 40));
  const s = useTransform(rot, (v) => 0.86 + (Math.sin(a(v)) + 1) * 0.1);
  return (
    <motion.div className="gs-chip" style={{ x, y, zIndex: z, scale: s }}>
      <span className="gs-av" style={{ background: c }} aria-hidden="true">{n[0]}</span>
      <span className="gs-chip-t"><b>{n}</b><i>{r}</i></span>
    </motion.div>
  );
}

/* v03 — Kinetic word swap */
const SWAP = ["landing pages", "dashboards", "checkouts", "onboarding"];
export function SwapHero() {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const ok = useMotionOK();
  const t = useSp();
  React.useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % SWAP.length), 2400);
    return () => clearTimeout(id);
  }, [i, paused]);
  return (
    <Sec id="v03" theme="paper" label="Word swap hero">
      <div className="gs-stack center">
        <p className="gs-eyebrow">Components, copy-paste ready</p>
        <h2 className="gs-h">
          <span>Design faster</span>
          <span className="gs-swap" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={SWAP[i]} className="gs-swap-w"
                initial={{ y: ok ? "105%" : 0, opacity: ok ? 0 : 1 }} animate={{ y: 0, opacity: 1 }} exit={{ y: ok ? "-105%" : 0, opacity: ok ? 0 : 0 }} transition={t}>
                {SWAP[i]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="gs-sr">{SWAP.join(", ")}</span>
        </h2>
        <div className="gs-swap-tabs" role="group" aria-label="Pick a use case">
          {SWAP.map((w, k) => (
            <button key={w} type="button" className="gs-pill" aria-pressed={k === i} onClick={() => { setI(k); setPaused(true); }}>
              {k === i && <motion.span layoutId="swap-pill" className="gs-pill-bg" transition={SPRING} />}
              <span>{w}</span>
            </button>
          ))}
        </div>
        <div className="gs-row">
          <Btn>Get started</Btn>
          <Btn ghost aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />} {paused ? "Resume" : "Pause"} rotation
          </Btn>
        </div>
        <div className="gs-bar" aria-hidden="true">
          <motion.i key={`${i}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused || !ok ? 0 : 2.4, ease: "linear" }} />
        </div>
      </div>
    </Sec>
  );
}

/* v04 — 3D tilt stack */
export function TiltHero() {
  const ok = useMotionOK();
  const rx = useSpring(0, { stiffness: 140, damping: 16 }), ry = useSpring(0, { stiffness: 140, damping: 16 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ok) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 20);
  };
  return (
    <Sec id="v04" theme="ember" label="Tilt hero">
      <div className="gs-split">
        <div className="gs-stack">
          <p className="gs-eyebrow"><Layers size={14} aria-hidden="true" /> Depth, on every layer</p>
          <h2 className="gs-h">Your product, with a third dimension.</h2>
          <p className="gs-sub">Hover the stack. Each layer floats at its own depth and settles with a spring.</p>
          <div className="gs-row"><Btn>See it live</Btn><Btn ghost>Read the docs</Btn></div>
        </div>
        <div className="gs-tilt" onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }}>
          <motion.div className="gs-tilt-st" style={{ rotateX: rx, rotateY: ry }}>
            <div className="gs-tl l0"><div className="gs-bars" aria-hidden="true">{[40, 72, 52, 88, 64, 96, 76].map((h, k) => <i key={k} style={{ height: `${h}%` }} />)}</div><span className="num">$48,210</span></div>
            <div className="gs-tl l1"><span className="gs-av sm" aria-hidden="true">A</span><span className="gs-av sm b" aria-hidden="true">B</span><span className="gs-av sm c" aria-hidden="true">C</span><em>+9 reviewing</em></div>
            <div className="gs-tl l2"><span>Auto-deploy</span><i className="gs-switch on" aria-hidden="true" /></div>
          </motion.div>
        </div>
      </div>
    </Sec>
  );
}

/* v05 — Command palette hero */
const CMDS = [
  [FileText, "New document", "Create"], [Palette, "Switch theme", "Settings"], [Users, "Invite teammate", "Team"],
  [Rocket, "Deploy to production", "Ship"], [Settings, "Open preferences", "Settings"], [Code, "Copy component code", "Library"],
] as const;
export function CommandHero() {
  const [q, setQ] = React.useState("");
  const [a, setA] = React.useState(0);
  const [done, setDone] = React.useState("");
  const list = CMDS.filter((c) => c[1].toLowerCase().includes(q.toLowerCase()));
  const idx = Math.min(a, Math.max(0, list.length - 1));
  const uid = React.useId();
  return (
    <Sec id="v05" theme="violet" label="Command hero">
      <div className="gs-stack center">
        <h2 className="gs-h">Do anything. Type less.</h2>
        <p className="gs-sub">A command layer for your whole product, one keystroke away.</p>
        <div className="gs-cmd">
          <div className="gs-cmd-in">
            <Search size={16} aria-hidden="true" />
            <input
              role="combobox" aria-expanded="true" aria-controls={`${uid}-l`} aria-activedescendant={list[idx] ? `${uid}-${idx}` : undefined}
              aria-label="Search commands" placeholder="Search commands" value={q}
              onChange={(e) => { setQ(e.target.value); setA(0); setDone(""); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setA((idx + 1) % Math.max(1, list.length)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setA((idx - 1 + list.length) % Math.max(1, list.length)); }
                if (e.key === "Enter" && list[idx]) setDone(list[idx][1]);
              }}
            />
            <kbd>esc</kbd>
          </div>
          <ul id={`${uid}-l`} role="listbox" aria-label="Commands" className="gs-cmd-l">
            {list.map((c, k) => {
              const I = c[0];
              return (
                <li key={c[1]} id={`${uid}-${k}`} role="option" aria-selected={k === idx} onMouseEnter={() => setA(k)} onClick={() => setDone(c[1])}>
                  {k === idx && <motion.span layoutId="cmd-hl" className="gs-hl" transition={SNAP} />}
                  <I size={16} aria-hidden="true" /><span>{c[1]}</span><em>{c[2]}</em>
                  {k === idx && <CornerDownLeft size={14} aria-hidden="true" />}
                </li>
              );
            })}
            {list.length === 0 && <li className="gs-empty" role="presentation">No command matches “{q}”</li>}
          </ul>
          <div className="gs-cmd-f" role="status">{done ? <><Check size={14} aria-hidden="true" /> Ran “{done}”</> : "↑ ↓ to move · Enter to run"}</div>
        </div>
      </div>
    </Sec>
  );
}

/* v06 — Draggable stickers */
const STICKERS = [
  ["Ship it", 6, 8, -8, "#facc15"], ["Spring", 72, 8, 6, "#60a5fa"], ["No lock-in", 4, 80, 5, "#34d399"],
  ["Tiny", 78, 78, -6, "#60a5fa"], ["A11y", 32, 86, 4, "#fb923c"], ["Free", 56, 88, -4, "#b9d0f9"], ["Copy me", 40, 2, 3, "#f87171"],
] as const;
function Sticker({ label, left, top, rot, color }: { label: string; left: number; top: number; rot: number; color: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const t = useSp();
  const nudge = (dx: number, dy: number) => { animate(x, x.get() + dx, t); animate(y, y.get() + dy, t); };
  return (
    <motion.button
      type="button" className="gs-sticker" data-sticker
      style={{ left: `${left}%`, top: `${top}%`, x, y, rotate: rot, background: color }}
      drag dragMomentum={false} dragElastic={0.2} dragConstraints={{ left: -240, right: 240, top: -200, bottom: 200 }}
      whileDrag={{ scale: 1.12, rotate: 0, zIndex: 20 }} whileHover={{ scale: 1.06 }} transition={SPRING}
      aria-label={`${label} sticker. Drag, or use arrow keys to move.`}
      onKeyDown={(e) => {
        const m: Record<string, [number, number]> = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] };
        if (m[e.key]) { e.preventDefault(); nudge(...m[e.key]); }
      }}
    >{label}</motion.button>
  );
}
export function StickerHero() {
  const [k, setK] = React.useState(0);
  return (
    <Sec id="v06" theme="sand" label="Sticker hero">
      <div className="gs-stickers" key={k}>
        {STICKERS.map((s) => <Sticker key={s[0]} label={s[0]} left={s[1]} top={s[2]} rot={s[3]} color={s[4]} />)}
        <div className="gs-stack center gs-mid">
          <h2 className="gs-h">Make it yours. Literally.</h2>
          <p className="gs-sub">Grab the stickers and move them around. They keep their momentum.</p>
          <div className="gs-row"><Btn>Start free</Btn><Btn ghost onClick={() => setK((v) => v + 1)}><RotateCcw size={14} aria-hidden="true" /> Reset stickers</Btn></div>
        </div>
      </div>
    </Sec>
  );
}

/* v07 — Curtain wipe: drag the handle to reveal the finished design */
function MockPage({ done }: { done: boolean }) {
  return (
    <div className={`gs-mock ${done ? "done" : "wire"}`} aria-hidden="true">
      <div className="gs-mock-nav"><i /><span /><span /><span /></div>
      <div className="gs-mock-h"><b /><b /></div>
      <div className="gs-mock-p"><u /><u /></div>
      <div className="gs-mock-cta"><s /><s /></div>
      <div className="gs-mock-cards"><em /><em /><em /></div>
    </div>
  );
}
export function CurtainHero() {
  const ok = useMotionOK();
  const [val, setVal] = React.useState(50);
  const pos = useSpring(50, { stiffness: ok ? 300 : 100000, damping: ok ? 32 : 1000, mass: 0.6 });
  const ref = React.useRef<HTMLDivElement>(null);
  const set = (v: number) => { const c = Math.max(0, Math.min(100, v)); setVal(Math.round(c)); pos.set(c); };
  const clip = useMotionTemplate`inset(0 ${useTransform(pos, (v) => 100 - v)}% 0 0)`;
  const left = useMotionTemplate`${pos}%`;
  const fromX = (x: number) => { const r = ref.current!.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };
  return (
    <Sec id="v07" theme="blue" label="Curtain hero">
      <div className="gs-stack center">
        <p className="gs-eyebrow">Before / after</p>
        <h2 className="gs-h">From wireframe to shipped in one drag.</h2>
      </div>
      <div
        ref={ref} className="gs-curtain"
        onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); fromX(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons) fromX(e.clientX); }}
      >
        <MockPage done={false} />
        <motion.div className="gs-curtain-top" style={{ clipPath: clip }}><MockPage done /></motion.div>
        <motion.div
          className="gs-handle" style={{ left }} role="slider" tabIndex={0} aria-label="Reveal finished design"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={val} aria-valuetext={`${val}% finished`}
          onKeyDown={(e) => {
            const k: Record<string, number> = { ArrowLeft: val - 5, ArrowDown: val - 5, ArrowRight: val + 5, ArrowUp: val + 5, Home: 0, End: 100 };
            if (e.key in k) { e.preventDefault(); set(k[e.key]); }
          }}
        ><span aria-hidden="true"><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /><ArrowRight size={14} /></span></motion.div>
      </div>
    </Sec>
  );
}

/* v08 — Odometer stats */
const STATS: [string, number, string, string, number][] = [
  ["Components copied", 48920, "", "", 0], ["Teams shipping", 1284, "", "", 0], ["Avg. paste time", 3.2, "", "s", 1],
];
export function OdometerHero() {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ok = useMotionOK();
  const [live, setLive] = React.useState(0);
  const [zero, setZero] = React.useState(false);
  const replay = () => { setZero(true); setLive(0); setTimeout(() => setZero(false), 350); };
  React.useEffect(() => {
    if (!inView || !ok) return;
    const id = setInterval(() => setLive((v) => v + 1 + Math.floor(Math.random() * 4)), 1600);
    return () => clearInterval(id);
  }, [inView, ok]);
  const shown = inView && !zero;
  return (
    <section ref={ref} className="gs gs-v08 t-lime" aria-label="Odometer hero" data-variant="v08">
      <div className="gs-stack">
        <p className="gs-eyebrow"><Activity size={14} aria-hidden="true" /> Live, right now</p>
        <h2 className="gs-h">Numbers that roll like they mean it.</h2>
      </div>
      <dl className="gs-stats">
        {STATS.map(([l, v, p, s, d], i) => (
          <div key={l} className="gs-stat">
            <dt>{l}</dt>
            <dd><Roll value={shown ? v + (i === 0 ? live : 0) : 0} prefix={p} suffix={s} decimals={d} /></dd>
          </div>
        ))}
      </dl>
      <div className="gs-row"><Btn onClick={replay}><RotateCcw size={14} aria-hidden="true" /> Replay count</Btn></div>
    </section>
  );
}

/* v09 — Terminal typewriter with copy */
const CMD = "npx goat add hero-terminal";
export function TerminalHero() {
  const ok = useMotionOK();
  const [n, setN] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    if (!ok) { setN(CMD.length); return; }
    setN(0);
    let i = 0;
    const id = setInterval(() => { i++; setN(i); if (i >= CMD.length) clearInterval(id); }, 55);
    return () => clearInterval(id);
  }, [ok, run]);
  const typed = n >= CMD.length;
  const copy = async () => {
    try { await navigator.clipboard.writeText(CMD); } catch { /* clipboard may be blocked */ }
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  return (
    <Sec id="v09" theme="ink" label="Terminal hero">
      <div className="gs-split">
        <div className="gs-stack">
          <p className="gs-eyebrow"><Terminal size={14} aria-hidden="true" /> No install. No lock-in.</p>
          <h2 className="gs-h">One line. One component. Yours forever.</h2>
          <p className="gs-sub">Copy the command or the source. Nothing hides behind a package.</p>
          <div className="gs-row"><Btn onClick={() => setRun((r) => r + 1)} ghost><RotateCcw size={14} aria-hidden="true" /> Replay</Btn></div>
        </div>
        <div className="gs-term">
          <div className="gs-term-bar"><i /><i /><i /><span>zsh</span>
            <button type="button" className="gs-copy" onClick={copy} aria-label={copied ? "Copied" : "Copy command"}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? "c" : "n"} initial={{ scale: ok ? 0.4 : 1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: ok ? 0.4 : 1, opacity: 0 }} transition={SNAP}>
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <div className="gs-term-b" role="log" aria-label="Terminal output">
            <p><span className="pr">~/app</span> <span className="ar">$</span> {CMD.slice(0, n)}<span className="gs-caret" aria-hidden="true" /></p>
            {typed && ["Resolved 1 component", "Wrote components/ui/hero-terminal.tsx", "Done in 0.4s"].map((l, i) => (
              <motion.p key={l + run} className="ok" initial={{ opacity: 0, x: ok ? -8 : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ ...(ok ? SPRING : NONE), delay: ok ? i * 0.18 : 0 }}>
                <Check size={12} aria-hidden="true" /> {l}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </Sec>
  );
}

/* v10 — Ripple dot grid */
export function RippleHero() {
  const ok = useMotionOK();
  const COLS = 16, ROWS = 8;
  const [o, setO] = React.useState({ x: 0.5, y: 0.5, n: 0 });
  const last = React.useRef(0);
  const ref = React.useRef<HTMLElement>(null);
  const fire = (cx: number, cy: number) => {
    const r = ref.current!.getBoundingClientRect();
    setO((p) => ({ x: (cx - r.left) / r.width, y: (cy - r.top) / r.height, n: p.n + 1 }));
  };
  React.useEffect(() => { if (ok) { const id = setTimeout(() => setO({ x: 0.5, y: 0.5, n: 1 }), 400); return () => clearTimeout(id); } }, [ok]);
  return (
    <section
      ref={ref} className="gs gs-v10 t-rose" aria-label="Ripple hero" data-variant="v10"
      onPointerDown={(e) => fire(e.clientX, e.clientY)}
      onPointerMove={(e) => { const now = performance.now(); if (now - last.current > 500) { last.current = now; fire(e.clientX, e.clientY); } }}
    >
      <div className="gs-dots" style={{ gridTemplateColumns: `repeat(${COLS},1fr)` }} aria-hidden="true">
        {Array.from({ length: COLS * ROWS }).map((_, k) => {
          const cx = ((k % COLS) + 0.5) / COLS, cy = (Math.floor(k / COLS) + 0.5) / ROWS;
          const d = Math.hypot((cx - o.x) * 2, cy - o.y);
          return (
            <i key={k}>
              <motion.b key={o.n} initial={false}
                animate={ok && o.n ? { scale: [1, 2.6, 1], opacity: [0.3, 1, 0.3] } : { scale: 1, opacity: 0.3 }}
                transition={{ duration: 0.9, delay: d * 0.38, ease: "easeOut" }} />
            </i>
          );
        })}
      </div>
      <div className="gs-stack center">
        <h2 className="gs-h">Every click sends a wave.</h2>
        <p className="gs-sub">Touch anywhere on the field. The ripple travels at the speed of your intent.</p>
        <div className="gs-row">
          <Btn onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.stopPropagation(); fire(r.left + r.width / 2, r.top + r.height / 2); }}>
            <Zap size={14} aria-hidden="true" /> Send a ripple
          </Btn>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   PRICING
   ===================================================================== */
const PLANS = [
  { n: "Starter", m: 0, y: 0, d: "For side projects", f: ["3 projects", "Community support", "1 GB storage"] },
  { n: "Pro", m: 19, y: 15, d: "For shipping teams", f: ["Unlimited projects", "Priority support", "100 GB storage", "Custom domains"], hot: true },
  { n: "Team", m: 49, y: 39, d: "For growing orgs", f: ["Everything in Pro", "SSO and audit log", "1 TB storage", "99.9% SLA"] },
] as const;

/* v11 — Billing switch with rolling prices */
export function SwitchPricing() {
  const [yearly, setYearly] = React.useState(true);
  const ok = useMotionOK();
  return (
    <Sec id="v11" theme="paper" label="Billing switch pricing">
      <div className="gs-stack center">
        <h2 className="gs-h2">Simple pricing. Real savings.</h2>
        <div className="gs-sw-row">
          <span className={!yearly ? "on" : ""}>Monthly</span>
          <button type="button" role="switch" aria-checked={yearly} aria-label="Bill yearly" className="gs-sw" onClick={() => setYearly((y) => !y)}>
            <motion.i animate={{ x: yearly ? 24 : 0 }} transition={SNAP} />
          </button>
          <span className={yearly ? "on" : ""}>Yearly</span>
          <AnimatePresence>
            {yearly && <motion.em className="gs-save" initial={{ scale: ok ? 0 : 1, rotate: -12 }} animate={{ scale: 1, rotate: -4 }} exit={{ scale: ok ? 0 : 1 }} transition={SNAP}>Save 20%</motion.em>}
          </AnimatePresence>
        </div>
      </div>
      <div className="gs-plans">
        {PLANS.map((p) => (
          <motion.article key={p.n} className={`gs-plan ${"hot" in p ? "hot" : ""}`} whileHover={ok ? { y: -6 } : undefined} transition={SPRING}>
            <h3>{p.n}{"hot" in p && <span className="gs-badge">Popular</span>}</h3>
            <p className="gs-sub">{p.d}</p>
            <div className="gs-price"><Roll value={yearly ? p.y : p.m} prefix="$" className="big" /><span>/mo</span></div>
            <ul>{p.f.map((x) => <li key={x}><Check size={14} aria-hidden="true" />{x}</li>)}</ul>
            <Btn ghost={!("hot" in p)}>Choose {p.n}</Btn>
          </motion.article>
        ))}
      </div>
    </Sec>
  );
}

/* v12 — Seat slider with tier bands */
const BANDS = [[1, 10, 12], [11, 50, 9], [51, 100, 7]] as const;
export function SeatPricing() {
  const [seats, setSeats] = React.useState(24);
  const band = BANDS.findIndex(([a, b]) => seats >= a && seats <= b);
  const rate = BANDS[band][2];
  const pct = ((seats - 1) / 99) * 100;
  return (
    <Sec id="v12" theme="sea" label="Seat slider pricing">
      <div className="gs-split">
        <div className="gs-stack">
          <p className="gs-eyebrow"><Users size={14} aria-hidden="true" /> Volume pricing</p>
          <h2 className="gs-h2">The bigger the team, the lower the rate.</h2>
          <p className="gs-sub">Every seat in a band is billed at that band’s rate. Slide to see the total.</p>
          <div className="gs-bands" role="list">
            {BANDS.map(([a, b, r], i) => (
              <div role="listitem" key={a} className={`gs-band ${i === band ? "on" : ""}`}>
                {i === band && <motion.span layoutId="band-bg" className="gs-band-bg" transition={SPRING} />}
                <span className="num">{a}–{b} seats</span><b className="num">${r}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="gs-calc">
          <label htmlFor="seat-range" className="gs-calc-l">Team size <b className="num">{seats} seats</b></label>
          <input id="seat-range" type="range" min={1} max={100} value={seats} onChange={(e) => setSeats(+e.target.value)} className="gs-range" style={{ ["--p" as string]: `${pct}%` }} aria-valuetext={`${seats} seats`} />
          <div className="gs-ticks num" aria-hidden="true"><span>1</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
          <div className="gs-total"><Roll value={seats * rate} prefix="$" className="big" /><span>/ month</span></div>
          <p className="gs-sub num">${rate} per seat · ${Math.round(seats * rate * 12 * 0.8).toLocaleString("en-US")} billed yearly</p>
          <Btn>Start 14-day trial</Btn>
        </div>
      </div>
    </Sec>
  );
}

/* v13 — Accordion cards: the active plan grows and reveals its features */
export function ExpandPricing() {
  const [a, setA] = React.useState(1);
  const sp = useSp();
  return (
    <Sec id="v13" theme="violet" label="Expanding plans pricing">
      <div className="gs-stack">
        <h2 className="gs-h2">Pick a plan. It opens up.</h2>
        <p className="gs-sub">Hover, tap or tab to a plan to see everything inside.</p>
      </div>
      <div className="gs-xp">
        {PLANS.map((p, i) => {
          const open = a === i;
          return (
            <motion.article key={p.n} className={`gs-xp-c ${open ? "open" : ""}`} animate={{ flexGrow: open ? 2.6 : 1 }} transition={sp} onMouseEnter={() => setA(i)}>
              <button type="button" className="gs-xp-h" aria-expanded={open} aria-controls={`xp-${i}`} onClick={() => setA(i)} onFocus={() => setA(i)}>
                <span>{p.n}</span><ChevronDown size={18} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }} />
              </button>
              <div className="gs-price"><Roll value={p.m} prefix="$" className="big" /><span>/mo</span></div>
              <motion.div id={`xp-${i}`} className="gs-xp-b" initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={sp}>
                <p className="gs-sub">{p.d}</p>
                <ul>{p.f.map((x) => <li key={x}><Check size={14} aria-hidden="true" />{x}</li>)}</ul>
                <Btn tabIndex={open ? 0 : -1} ghost={!open}>Choose {p.n}</Btn>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </Sec>
  );
}

/* v14 — Comparison grid with a roaming column highlight */
const ROWS: [string, (boolean | string)[]][] = [
  ["Projects", ["3", "Unlimited", "Unlimited"]], ["Storage", ["1 GB", "100 GB", "1 TB"]], ["Custom domains", [false, true, true]],
  ["Priority support", [false, true, true]], ["SSO and audit log", [false, false, true]], ["Uptime SLA", [false, false, "99.9%"]],
];
function Tick({ on }: { on: boolean }) {
  const ok = useMotionOK();
  if (!on) return <Minus size={14} className="no" aria-label="Not included" />;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-label="Included" role="img">
      <motion.path d="M3 9.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: ok ? 0 : 1 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: ok ? 0.5 : 0 }} />
    </svg>
  );
}
export function CompareTable() {
  const [c, setC] = React.useState(1);
  const left = useMotionValue(34 + c * 22);
  const sp = useSp("snap");
  React.useEffect(() => { animate(left, 34 + c * 22, sp); }, [c, left, sp]);
  const l = useMotionTemplate`${left}%`;
  return (
    <Sec id="v14" theme="mono" label="Comparison pricing">
      <div className="gs-stack center">
        <h2 className="gs-h2">Compare, then commit.</h2>
        <p className="gs-sub">Choose a plan header to spotlight its column.</p>
      </div>
      <div className="gs-cmp-w" role="region" aria-label="Plan comparison table" tabIndex={0}>
        <div className="gs-cmp">
          <motion.i className="gs-cmp-hl" style={{ left: l }} aria-hidden="true" />
          <table>
            <thead>
              <tr><th scope="col"><span className="gs-sr">Feature</span></th>
                {PLANS.map((p, i) => (
                  <th scope="col" key={p.n}><button type="button" aria-pressed={c === i} onClick={() => setC(i)} onMouseEnter={() => setC(i)}>{p.n}<small className="num">${p.m}/mo</small></button></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([f, v]) => (
                <tr key={f}><th scope="row">{f}</th>{v.map((x, i) => <td key={i} className={`num ${c === i ? "sel" : ""}`}>{typeof x === "string" ? x : <Tick on={x} />}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sec>
  );
}

/* v15 — Card deck: tabs bring a plan to the front */
export function DeckPricing() {
  const [a, setA] = React.useState(1);
  const sp = useSp();
  const n = PLANS.length;
  return (
    <Sec id="v15" theme="sand" label="Deck pricing">
      <div className="gs-split">
        <div className="gs-stack">
          <h2 className="gs-h2">Shuffle the deck. Keep the plan that fits.</h2>
          <div className="gs-deck-tabs" role="tablist" aria-label="Plans" onKeyDown={(e) => {
            if (e.key === "ArrowRight") { setA((a + 1) % n); } if (e.key === "ArrowLeft") { setA((a + n - 1) % n); }
          }}>
            {PLANS.map((p, i) => (
              <button key={p.n} role="tab" type="button" aria-selected={a === i} tabIndex={a === i ? 0 : -1} id={`deck-t${i}`} aria-controls={`deck-p${i}`} onClick={() => setA(i)} ref={(el) => { if (el && a === i && document.activeElement?.getAttribute("role") === "tab") el.focus(); }}>{p.n}</button>
            ))}
          </div>
        </div>
        <div className="gs-deck">
          {PLANS.map((p, i) => {
            const d = (i - a + n) % n;
            return (
              <motion.article key={p.n} role="tabpanel" id={`deck-p${i}`} aria-labelledby={`deck-t${i}`} aria-hidden={d !== 0} className="gs-deck-c"
                initial={false} animate={{ y: d * -24, scale: 1 - d * 0.06, rotate: d === 0 ? 0 : d % 2 ? 2 : -2, opacity: d > 1 ? 0.6 : 1 }}
                style={{ zIndex: n - d }} transition={sp} onClick={() => setA(i)}>
                <h3>{p.n}</h3>
                <div className="gs-price"><Roll value={p.m} prefix="$" className="big" /><span>/mo</span></div>
                <ul>{p.f.map((x) => <li key={x}><Check size={14} aria-hidden="true" />{x}</li>)}</ul>
                <Btn tabIndex={d === 0 ? 0 : -1}>Choose {p.n}</Btn>
              </motion.article>
            );
          })}
        </div>
      </div>
    </Sec>
  );
}

/* v16 — Usage calculator with a live cost breakdown */
export function UsagePricing() {
  const [req, setReq] = React.useState(12);
  const [gb, setGb] = React.useState(120);
  const sp = useSp("soft");
  const base = 9, r = Math.max(0, req - 5) * 2, s = Math.max(0, gb - 50) * 0.1;
  const total = base + r + s;
  const parts: [string, number, string][] = [["Base", base, "#a3e635"], ["Requests", r, "#22d3ee"], ["Storage", s, "#60a5fa"]];
  return (
    <Sec id="v16" theme="ink" label="Usage pricing calculator">
      <div className="gs-split">
        <div className="gs-stack">
          <p className="gs-eyebrow"><Gauge size={14} aria-hidden="true" /> Pay for what you use</p>
          <h2 className="gs-h2">A bill you can predict before it arrives.</h2>
          <div className="gs-field"><label htmlFor="u-req">API requests <b className="num">{req}M / mo</b></label>
            <input id="u-req" className="gs-range" type="range" min={0} max={50} value={req} onChange={(e) => setReq(+e.target.value)} style={{ ["--p" as string]: `${(req / 50) * 100}%` }} /></div>
          <div className="gs-field"><label htmlFor="u-gb">Storage <b className="num">{gb} GB</b></label>
            <input id="u-gb" className="gs-range" type="range" min={0} max={500} step={10} value={gb} onChange={(e) => setGb(+e.target.value)} style={{ ["--p" as string]: `${(gb / 500) * 100}%` }} /></div>
        </div>
        <div className="gs-calc">
          <div className="gs-total"><Roll value={total} prefix="$" decimals={2} className="big" /><span>/ month</span></div>
          <div className="gs-stackbar" role="img" aria-label={`Breakdown: base $${base}, requests $${r.toFixed(2)}, storage $${s.toFixed(2)}`}>
            {parts.map(([l, v, c]) => <motion.i key={l} style={{ background: c }} initial={false} animate={{ flexGrow: v }} transition={sp} />)}
          </div>
          <ul className="gs-legend num">
            {parts.map(([l, v, c]) => <li key={l}><i style={{ background: c }} />{l}<b>${v.toFixed(2)}</b></li>)}
          </ul>
          <p className="gs-sub">First 5M requests and 50 GB are free.</p>
        </div>
      </div>
    </Sec>
  );
}

/* v17 — Pointer-lit borders */
function LitCard({ p }: { p: (typeof PLANS)[number] }) {
  const mx = useMotionValue(-200), my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(180px circle at ${mx}px ${my}px, var(--ac), transparent 70%)`;
  const fill = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(244,114,182,.16), transparent 70%)`;
  const hot = "hot" in p;
  return (
    <motion.article className="gs-lit" style={{ background: bg }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      onPointerLeave={() => { mx.set(-200); my.set(-200); }}>
      <motion.div className="gs-lit-in" style={{ backgroundImage: fill }}>
        <h3>{p.n}{hot && <span className="gs-badge shimmer">Popular</span>}</h3>
        <p className="gs-sub">{p.d}</p>
        <div className="gs-price"><span className="gs-roll big num">${p.m}</span><span>/mo</span></div>
        <ul>{p.f.map((x) => <li key={x}><Check size={14} aria-hidden="true" />{x}</li>)}</ul>
        <Btn ghost={!hot}>Choose {p.n}</Btn>
      </motion.div>
    </motion.article>
  );
}
export function LitPricing() {
  return (
    <Sec id="v17" theme="rose" label="Pointer-lit pricing">
      <div className="gs-stack center"><h2 className="gs-h2">Cards that notice you.</h2><p className="gs-sub">The border glows where your cursor is.</p></div>
      <div className="gs-plans">{PLANS.map((p) => <LitCard key={p.n} p={p} />)}</div>
    </Sec>
  );
}

/* v18 — One panel that morphs between plans */
export function MorphPricing() {
  const [a, setA] = React.useState(1);
  const sp = useSp();
  const ok = useMotionOK();
  const p = PLANS[a];
  const cols = ["#38bdf8", "#bef264", "#60a5fa"];
  return (
    <Sec id="v18" theme="ink" label="Morphing plan pricing">
      <div className="gs-stack center">
        <h2 className="gs-h2">One panel. Three plans.</h2>
        <div className="gs-seg" role="radiogroup" aria-label="Plan" onKeyDown={(e) => {
          const n = PLANS.length;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setA((a + 1) % n); }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setA((a + n - 1) % n); }
        }}>
          {PLANS.map((x, i) => (
            <button key={x.n} role="radio" type="button" aria-checked={a === i} tabIndex={a === i ? 0 : -1} onClick={() => setA(i)}
              ref={(el) => { if (el && a === i && el.parentElement?.contains(document.activeElement)) el.focus(); }}>
              {a === i && <motion.span layoutId="seg-bg" className="gs-seg-bg" transition={SNAP} />}<span>{x.n}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div className="gs-morph" animate={{ borderColor: cols[a] }} transition={sp}>
        <motion.i className="gs-morph-glow" animate={{ background: cols[a] }} transition={sp} aria-hidden="true" />
        <div className="gs-morph-l">
          <h3>{p.n}</h3><p className="gs-sub">{p.d}</p>
          <div className="gs-price"><Roll value={p.m} prefix="$" className="big" /><span>/mo</span></div>
        </div>
        <ul className="gs-morph-f" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {p.f.map((x, i) => (
              <motion.li key={`${p.n}-${x}`} layout initial={{ opacity: 0, x: ok ? 24 : 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: ok ? -24 : 0 }} transition={{ ...(ok ? SPRING : NONE), delay: ok ? i * 0.05 : 0 }}>
                <Check size={14} aria-hidden="true" />{x}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <Btn>Choose {p.n}</Btn>
      </motion.div>
    </Sec>
  );
}

/* v19 — Flip cards: monthly on the front, yearly on the back */
export function FlipPricing() {
  const [yearly, setYearly] = React.useState(false);
  const sp = useSp("soft");
  const ok = useMotionOK();
  return (
    <Sec id="v19" theme="sea" label="Flip card pricing">
      <div className="gs-stack center">
        <h2 className="gs-h2">Flip to see what a year saves you.</h2>
        <Btn ghost aria-pressed={yearly} onClick={() => setYearly((y) => !y)}><RotateCcw size={14} aria-hidden="true" /> {yearly ? "Show monthly" : "Show yearly"}</Btn>
      </div>
      <div className="gs-plans gs-flips">
        {PLANS.map((p, i) => (
          <div className="gs-flip" key={p.n}>
            <motion.div className="gs-flip-in" initial={false} animate={{ rotateY: yearly ? 180 : 0 }} transition={{ ...sp, delay: ok ? i * 0.07 : 0 }}>
              <div className="gs-face front" aria-hidden={yearly}>
                <h3>{p.n}</h3><p className="gs-sub">{p.d}</p>
                <div className="gs-price"><span className="gs-roll big num">${p.m}</span><span>/month</span></div>
                <Btn tabIndex={yearly ? -1 : 0} ghost>Choose {p.n}</Btn>
              </div>
              <div className="gs-face back" aria-hidden={!yearly}>
                <h3>{p.n} · yearly</h3><p className="gs-sub num">Billed ${p.y * 12} once a year</p>
                <div className="gs-price"><span className="gs-roll big num">${p.y}</span><span>/month</span></div>
                <em className="gs-save num">{p.m ? `Save $${(p.m - p.y) * 12}` : "Always free"}</em>
                <Btn tabIndex={yearly ? 0 : -1}>Choose {p.n}</Btn>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </Sec>
  );
}

/* v20 — Itemised receipt that builds as you add things */
const ADDONS = [["Extra seats (5)", 15], ["Priority support", 9], ["Analytics suite", 12], ["Custom domain", 5]] as const;
export function ReceiptPricing() {
  const [on, setOn] = React.useState<string[]>(["Priority support"]);
  const ok = useMotionOK();
  const toggle = (n: string) => setOn((o) => (o.includes(n) ? o.filter((x) => x !== n) : [...o, n]));
  const items: [string, number][] = [["Pro plan", 19], ...ADDONS.filter(([n]) => on.includes(n)).map(([n, v]) => [n, v] as [string, number])];
  const total = items.reduce((s, [, v]) => s + v, 0);
  return (
    <Sec id="v20" theme="sand" label="Receipt pricing">
      <div className="gs-split">
        <div className="gs-stack">
          <h2 className="gs-h2">Build your plan. Watch the receipt.</h2>
          <fieldset className="gs-addons">
            <legend className="gs-sr">Add-ons</legend>
            {ADDONS.map(([n, v]) => (
              <label key={n} className={on.includes(n) ? "on" : ""}>
                <input type="checkbox" checked={on.includes(n)} onChange={() => toggle(n)} />
                <span className="gs-cb" aria-hidden="true"><Check size={14} /></span>
                <span>{n}</span><b className="num">+${v}</b>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="gs-receipt" aria-live="polite">
          <p className="gs-receipt-t">GOAT UI · ORDER</p>
          <ul>
            <AnimatePresence initial={false}>
              {items.map(([n, v]) => (
                <motion.li key={n} layout initial={{ opacity: 0, height: 0, x: ok ? -16 : 0 }} animate={{ opacity: 1, height: 32, x: 0 }} exit={{ opacity: 0, height: 0, x: ok ? 16 : 0 }} transition={ok ? SPRING : NONE}>
                  <span>{n}</span><i aria-hidden="true" /><b className="num">${v.toFixed(2)}</b>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="gs-receipt-sum"><span>Total / mo</span><Roll value={total} prefix="$" decimals={2} /></div>
          <Btn>Checkout</Btn>
        </div>
      </div>
    </Sec>
  );
}

/* =====================================================================
   FOOTERS
   ===================================================================== */
const COLS: [string, string[]][] = [
  ["Product", ["Components", "Templates", "Changelog", "Pricing"]],
  ["Company", ["About", "Careers", "Press", "Contact"]],
  ["Resources", ["Docs", "Guides", "Community", "Status"]],
  ["Legal", ["Privacy", "Terms", "Licenses"]],
];
function LinkCols({ className = "" }: { className?: string }) {
  return (
    <nav className={`gs-cols ${className}`} aria-label="Footer">
      {COLS.map(([h, ls]) => (
        <div key={h}><h3>{h}</h3><ul>{ls.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul></div>
      ))}
    </nav>
  );
}

/* v21 — Giant wordmark: letters rise in, then bounce on touch */
export function WordmarkFooter() {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const ok = useMotionOK();
  return (
    <section ref={ref} className="gs gs-v21 t-ink" aria-label="Wordmark footer" data-variant="v21">
      <LinkCols />
      <div className="gs-wm" role="img" aria-label="GOAT UI">
        {"GOAT UI".split("").map((c, i) => (
          <span className="gs-wm-c" key={i} aria-hidden="true">
            <motion.span initial={false} animate={{ y: inView || !ok ? "0%" : "110%" }} transition={{ ...(ok ? { type: "spring", stiffness: 160, damping: 14 } : NONE), delay: ok ? i * 0.06 : 0 }}
              whileHover={ok ? { y: "-10%", scale: 1.06 } : undefined} whileTap={ok ? { y: "-16%" } : undefined} style={{ display: "inline-block" }}>
              {c === " " ? "\u00a0" : c}
            </motion.span>
          </span>
        ))}
      </div>
      <p className="gs-fine num">© 2026 GOAT UI. Copy it, ship it, make it yours.</p>
    </section>
  );
}

/* v22 — Newsletter with validation, shake and success morph */
export function NewsletterFooter() {
  const [email, setEmail] = React.useState("");
  const [st, setSt] = React.useState<"idle" | "error" | "busy" | "done">("idle");
  const ok = useMotionOK();
  const id = React.useId();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setSt("error"); return; }
    setSt("busy"); setTimeout(() => setSt("done"), 900);
  };
  return (
    <Sec id="v22" theme="paper" label="Newsletter footer">
      <div className="gs-split gs-nl">
        <div className="gs-stack">
          <h2 className="gs-h2">One email a month. Zero filler.</h2>
          <form onSubmit={submit} noValidate className="gs-nl-f">
            <label htmlFor={id} className="gs-sr">Email address</label>
            <motion.div className={`gs-nl-in ${st === "error" ? "bad" : ""}`} animate={st === "error" && ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
              <Mail size={16} aria-hidden="true" />
              <input id={id} type="email" placeholder="you@studio.com" value={email} disabled={st === "done"} aria-invalid={st === "error"} aria-describedby={`${id}-m`}
                onChange={(e) => { setEmail(e.target.value); if (st === "error") setSt("idle"); }} />
              <motion.button type="submit" className="gs-nl-b" layout transition={ok ? SPRING : NONE} disabled={st === "busy" || st === "done"} whileTap={ok ? { scale: 0.94 } : undefined}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={st === "done" ? "d" : st === "busy" ? "b" : "i"} initial={{ opacity: 0, y: ok ? 12 : 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: ok ? -12 : 0 }} transition={ok ? SNAP : NONE}>
                    {st === "done" ? <Check size={16} aria-label="Subscribed" /> : st === "busy" ? <span className="gs-spin" aria-label="Sending" /> : "Subscribe"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
            <p id={`${id}-m`} className={`gs-nl-m ${st}`} role="status">
              {st === "error" ? "Enter a valid email like name@site.com." : st === "done" ? "You’re in. Check your inbox to confirm." : "Unsubscribe any time."}
            </p>
          </form>
        </div>
        <LinkCols />
      </div>
    </Sec>
  );
}

/* v23 — Disclosure footer: groups collapse on small widths */
export function DisclosureFooter() {
  const ref = React.useRef<HTMLElement>(null);
  const [wide, setWide] = React.useState(false);
  const [open, setOpen] = React.useState<string | null>("Product");
  const sp = useSp();
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => setWide(el.clientWidth >= 640));
    ro.observe(el); setWide(el.clientWidth >= 640);
    return () => ro.disconnect();
  }, []);
  return (
    <section ref={ref} className="gs gs-v23 t-blue" aria-label="Disclosure footer" data-variant="v23">
      <div className="gs-dis-top"><b className="gs-logo"><Boxes size={20} aria-hidden="true" /> GOAT UI</b><p className="gs-sub">Open components for people who ship.</p></div>
      <div className="gs-dis">
        {COLS.map(([h, ls]) => {
          const isOpen = wide || open === h;
          return (
            <div key={h} className="gs-dis-g">
              {wide ? <h3>{h}</h3> : (
                <h3><button type="button" aria-expanded={isOpen} aria-controls={`dis-${h}`} onClick={() => setOpen(isOpen ? null : h)}>
                  {h}<Plus size={16} aria-hidden="true" style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .3s cubic-bezier(.3,1.6,.5,1)" }} />
                </button></h3>
              )}
              <motion.ul id={`dis-${h}`} initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={sp} style={{ overflow: "hidden" }} aria-hidden={!isOpen}>
                {ls.map((l) => <li key={l}><a href="#" tabIndex={isOpen ? 0 : -1}>{l}</a></li>)}
              </motion.ul>
            </div>
          );
        })}
      </div>
      <p className="gs-fine num">© 2026 GOAT UI</p>
    </section>
  );
}

/* v24 — Press and hold to launch back to the top */
export function LaunchFooter() {
  const ok = useMotionOK();
  const prog = useMotionValue(0);
  const [launched, setLaunched] = React.useState(false);
  const holding = React.useRef<ReturnType<typeof animate> | null>(null);
  const dash = useTransform(prog, (v) => 1 - v);
  const rocketY = useMotionValue(0);
  const start = () => {
    if (launched) return;
    holding.current?.stop();
    holding.current = animate(prog, 1, { duration: ok ? 1.1 : 0.01, ease: "linear", onComplete: fire });
  };
  const cancel = () => {
    if (launched) return;
    holding.current?.stop();
    holding.current = animate(prog, 0, ok ? SPRING : NONE);
  };
  const fire = () => {
    setLaunched(true);
    animate(rocketY, -160, ok ? { type: "spring", stiffness: 60, damping: 12 } : NONE);
    try { window.scrollTo({ top: 0, behavior: ok ? "smooth" : "auto" }); } catch { /* ignore */ }
    setTimeout(() => { setLaunched(false); prog.set(0); rocketY.set(0); }, 1800);
  };
  return (
    <Sec id="v24" theme="ember" label="Launch footer">
      <div className="gs-split gs-lf">
        <div className="gs-stack">
          <h2 className="gs-h2">Ready for liftoff?</h2>
          <p className="gs-sub">Press and hold the rocket to return to the top. Hold Space or Enter if you prefer the keyboard.</p>
          <p className="gs-fine num" role="status">{launched ? "Launched. Welcome back to the top." : "Hold for one second."}</p>
        </div>
        <div className="gs-launch">
          <button
            type="button" className="gs-lbtn" aria-label="Hold to launch back to the top"
            onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} onPointerCancel={cancel}
            onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }}
            onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") cancel(); }}
          >
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" className="trk" />
              <motion.circle cx="60" cy="60" r="54" className="bar" pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: dash }} />
            </svg>
            <motion.span style={{ y: rocketY }} className="gs-rk"><Rocket size={36} aria-hidden="true" /></motion.span>
          </button>
        </div>
      </div>
      <LinkCols className="gs-cols-s" />
    </Sec>
  );
}

/* v25 — Link ribbon: scrolls, then eases to a stop when you reach for it */
const RIBBON = ["Components", "Templates", "Changelog", "Docs", "Guides", "Community", "Status", "Pricing", "Careers", "Contact"];
export function RibbonFooter() {
  const ok = useMotionOK();
  const x = useMotionValue(0);
  const speed = React.useRef(0.06);
  const target = React.useRef(0.06);
  const half = React.useRef<HTMLUListElement>(null);
  useAnimationFrame((_, dt) => {
    if (!ok) return;
    speed.current += (target.current - speed.current) * Math.min(1, dt / 120);
    const w = half.current?.scrollWidth ?? 0;
    let nx = x.get() - speed.current * dt;
    if (w && nx <= -w) nx += w;
    x.set(nx);
  });
  const slow = () => { target.current = 0; };
  const go = () => { target.current = 0.06; };
  return (
    <Sec id="v25" theme="lime" label="Ribbon footer">
      <div className="gs-stack">
        <h2 className="gs-h">Take what you need.</h2>
      </div>
      <div className="gs-ribbon" onMouseEnter={slow} onMouseLeave={go} onFocus={slow} onBlur={go}>
        <motion.div className={`gs-ribbon-t ${ok ? "" : "static"}`} style={{ x: ok ? x : 0 }}>
          {[0, 1].map((k) => (
            <ul key={k} ref={k === 0 ? half : undefined} aria-hidden={k === 1 ? true : undefined}>
              {RIBBON.map((l) => <li key={l}><a href="#" tabIndex={k === 1 ? -1 : 0}>{l}<ArrowUpRight size={20} aria-hidden="true" /></a></li>)}
            </ul>
          ))}
        </motion.div>
      </div>
      <p className="gs-fine num">© 2026 GOAT UI</p>
    </Sec>
  );
}

/* v26 — Preferences footer: theme pill and language listbox */
const LANGS = ["English", "Español", "Français", "Deutsch", "日本語", "हिन्दी"];
export function PrefsFooter() {
  const [theme, setTheme] = React.useState(0);
  const [lang, setLang] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(0);
  const sp = useSp("snap");
  const ok = useMotionOK();
  const T: [typeof Monitor, string][] = [[Monitor, "System"], [Sun, "Light"], [Moon, "Dark"]];
  return (
    <Sec id="v26" theme="violet" label="Preferences footer">
      <LinkCols />
      <div className="gs-prefs">
        <p className="gs-status"><span className="gs-dot" aria-hidden="true" /> All systems normal</p>
        <div className="gs-theme" role="radiogroup" aria-label="Theme" onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); setTheme((theme + 1) % 3); }
          if (e.key === "ArrowLeft") { e.preventDefault(); setTheme((theme + 2) % 3); }
        }}>
          {T.map(([I, l], i) => (
            <button key={l} role="radio" type="button" aria-checked={theme === i} aria-label={l} tabIndex={theme === i ? 0 : -1} onClick={() => setTheme(i)}
              ref={(el) => { if (el && theme === i && el.parentElement?.contains(document.activeElement)) el.focus(); }}>
              {theme === i && <motion.span layoutId="theme-pill" className="gs-theme-bg" transition={sp} />}<I size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="gs-lang">
          <button type="button" className="gs-lang-b" aria-haspopup="listbox" aria-expanded={open} onClick={() => { setOpen((o) => !o); setHi(lang); }}
            onKeyDown={(e) => { if (e.key === "ArrowDown" && !open) { e.preventDefault(); setOpen(true); setHi(lang); } }}>
            <Globe size={16} aria-hidden="true" /> {LANGS[lang]} <ChevronDown size={14} aria-hidden="true" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul role="listbox" tabIndex={-1} aria-label="Language" aria-activedescendant={`lg-${hi}`} className="gs-lang-l"
                ref={(el) => { el?.focus(); }}
                initial={{ opacity: 0, y: ok ? 12 : 0, scale: ok ? 0.96 : 1 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: ok ? 8 : 0, scale: ok ? 0.96 : 1 }} transition={ok ? SNAP : NONE}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % LANGS.length); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi + LANGS.length - 1) % LANGS.length); }
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLang(hi); setOpen(false); }
                  if (e.key === "Escape") { setOpen(false); }
                }}
                onBlur={() => setOpen(false)}>
                {LANGS.map((l, i) => (
                  <li key={l} id={`lg-${i}`} role="option" aria-selected={lang === i} className={hi === i ? "hi" : ""} onMouseEnter={() => setHi(i)} onMouseDown={(e) => { e.preventDefault(); setLang(i); setOpen(false); }}>
                    {l}{lang === i && <Check size={14} aria-hidden="true" />}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Sec>
  );
}

/* v27 — Focus list + magnetic social buttons */
function Mag({ children, label }: { children: React.ReactNode; label: string }) {
  const ok = useMotionOK();
  const x = useSpring(0, { stiffness: 300, damping: 15, mass: 0.4 }), y = useSpring(0, { stiffness: 300, damping: 15, mass: 0.4 });
  return (
    <motion.a href="#" className="gs-mag" aria-label={label} style={{ x, y }}
      onPointerMove={(e) => { if (!ok) return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.4); y.set((e.clientY - r.top - r.height / 2) * 0.4); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.a>
  );
}
export function FocusFooter() {
  const [f, setF] = React.useState<string | null>(null);
  const all = COLS.flatMap(([, l]) => l).slice(0, 8);
  return (
    <Sec id="v27" theme="mono" label="Focus list footer">
      <div className="gs-split">
        <div className="gs-stack">
          <h2 className="gs-h">Let’s build something good.</h2>
          <div className="gs-row gs-socials">
            <Mag label="Newsletter"><Rss size={18} aria-hidden="true" /></Mag>
            <Mag label="Chat"><MessageCircle size={18} aria-hidden="true" /></Mag>
            <Mag label="Videos"><Video size={18} aria-hidden="true" /></Mag>
            <Mag label="Email"><Mail size={18} aria-hidden="true" /></Mag>
          </div>
        </div>
        <ul className="gs-focus" onMouseLeave={() => setF(null)} onBlur={() => setF(null)}>
          {all.map((l) => (
            <li key={l} className={f && f !== l ? "dim" : ""}>
              <a href="#" onMouseEnter={() => setF(l)} onFocus={() => setF(l)}>{l}<ArrowUpRight size={20} aria-hidden="true" /></a>
            </li>
          ))}
        </ul>
      </div>
    </Sec>
  );
}

/* v28 — World clocks */
const ZONES: [string, string][] = [["San Francisco", "America/Los_Angeles"], ["London", "Europe/London"], ["Hyderabad", "Asia/Kolkata"]];
function Hand({ deg, y1, y2, cls, kind }: { deg: number; y1: number; y2: number; cls: string; kind: "snap" | "tick" }) {
  const ok = useMotionOK();
  const acc = React.useRef(deg);
  const delta = ((deg - (acc.current % 360)) + 540) % 360 - 180;
  acc.current += delta;
  const a = useSpring(acc.current, kind === "tick" ? { stiffness: 700, damping: 18, mass: 0.4 } : { stiffness: 380, damping: 30, mass: 0.8 });
  React.useEffect(() => { if (ok) a.set(acc.current); else a.jump(acc.current); }, [deg, ok, a]);
  const ref = React.useRef<SVGLineElement>(null);
  const apply = (v: number) => ref.current?.setAttribute("transform", `rotate(${v} 50 50)`);
  useMotionValueEvent(a, "change", apply);
  React.useEffect(() => { apply(a.get()); });
  return <line ref={ref} x1="50" y1={y1} x2="50" y2={y2} className={cls} />;
}
function ClockFace({ city, tz, now }: { city: string; tz: string; now: Date | null }) {
  const p = React.useMemo(() => {
    if (!now) return { h: 0, m: 0, s: 0, txt: "--:--:--" };
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(now);
    const g = (t: string) => Number(f.find((x) => x.type === t)?.value ?? 0);
    const h = g("hour") % 24, m = g("minute"), s = g("second");
    const pad = (n: number) => String(n).padStart(2, "0");
    return { h, m, s, txt: `${pad(h)}:${pad(m)}:${pad(s)}` };
  }, [now, tz]);
  const hd = ((p.h % 12) + p.m / 60) * 30, md = p.m * 6 + p.s / 10, sd = p.s * 6;
  return (
    <div className="gs-clock" role="timer" aria-label={`${city} local time ${p.txt}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="47" className="face" />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="50" y1="6" x2="50" y2={i % 3 === 0 ? 13 : 10} className="tick" transform={`rotate(${i * 30} 50 50)`} />)}
        <Hand deg={hd} y1={50} y2={28} cls="h" kind="snap" />
        <Hand deg={md} y1={54} y2={14} cls="m" kind="snap" />
        <Hand deg={sd} y1={58} y2={10} cls="s" kind="tick" />
        <circle cx="50" cy="50" r="3" className="pin" />
      </svg>
      <b className="num">{p.txt}</b><span>{city}</span>
    </div>
  );
}
export function ClockFooter() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => { setNow(new Date()); const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <Sec id="v28" theme="sea" label="World clock footer">
      <div className="gs-stack">
        <p className="gs-eyebrow"><Clock size={14} aria-hidden="true" /> Always someone awake</p>
        <h2 className="gs-h2">Support follows the sun.</h2>
      </div>
      <div className="gs-clocks">{ZONES.map(([c, z]) => <ClockFace key={c} city={c} tz={z} now={now} />)}</div>
      <p className="gs-fine num">© 2026 GOAT UI</p>
    </Sec>
  );
}

/* v29 — Slide to subscribe */
export function SlideFooter() {
  const ok = useMotionOK();
  const track = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = React.useState(false);
  const [max, setMax] = React.useState(240);
  React.useEffect(() => {
    const el = track.current; if (!el) return;
    const ro = new ResizeObserver(() => setMax(el.clientWidth - 56 - 8));
    ro.observe(el); setMax(el.clientWidth - 64);
    return () => ro.disconnect();
  }, []);
  const fill = useTransform(x, (v) => v + 56);
  const label = useTransform(x, [0, max * 0.5], [1, 0]);
  const finish = () => { setDone(true); animate(x, max, ok ? SPRING : NONE); };
  const release = () => { if (x.get() > max * 0.85) finish(); else animate(x, 0, ok ? SPRING : NONE); };
  return (
    <Sec id="v29" theme="paper" label="Slide to subscribe footer">
      <div className="gs-stack center">
        <h2 className="gs-h2">Join 18,000 builders.</h2>
        <p className="gs-sub">Slide the handle all the way across. Or focus it and press the right arrow.</p>
        <div ref={track} className={`gs-track ${done ? "done" : ""}`}>
          <motion.i className="gs-track-fill" style={{ width: fill }} aria-hidden="true" />
          <motion.span className="gs-track-l" style={{ opacity: label }} aria-hidden="true">Slide to subscribe</motion.span>
          {done && <span className="gs-track-d" role="status"><Check size={16} aria-hidden="true" /> You’re on the list</span>}
          <motion.button
            type="button" className="gs-thumb" style={{ x }} drag={done ? false : "x"} dragConstraints={{ left: 0, right: max }} dragElastic={0} dragMomentum={false}
            onDragEnd={release} role="slider" aria-label="Slide to subscribe" aria-valuemin={0} aria-valuemax={100} aria-valuenow={done ? 100 : 0}
            onKeyDown={(e) => {
              if (done) return;
              if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); const nx = Math.min(max, x.get() + max / 4); if (nx >= max * 0.85 || e.key === "Enter") finish(); else animate(x, nx, ok ? SNAP : NONE); }
              if (e.key === "ArrowLeft") { e.preventDefault(); animate(x, Math.max(0, x.get() - max / 4), ok ? SNAP : NONE); }
            }}
          >{done ? <Check size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}</motion.button>
        </div>
        {done && <Btn ghost onClick={() => { setDone(false); animate(x, 0, ok ? SPRING : NONE); }}><RotateCcw size={14} aria-hidden="true" /> Reset</Btn>}
      </div>
    </Sec>
  );
}

/* v30 — Status footer with a 60-day uptime strip */
const UPTIME = Array.from({ length: 60 }, (_, i) => {
  const v = (i * 37 + 11) % 100;
  return v > 94 ? 97.1 + (v % 5) * 0.4 : v > 90 ? 99.2 + (v % 3) * 0.2 : 99.9 + (v % 2) * 0.05;
});
export function StatusFooter() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const ok = useMotionOK();
  const [a, setA] = React.useState(59);
  const avg = UPTIME.reduce((s, v) => s + v, 0) / UPTIME.length;
  const day = (i: number) => { const d = new Date(Date.UTC(2026, 10, 24)); d.setUTCDate(d.getUTCDate() - (59 - i)); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); };
  return (
    <Sec id="v30" theme="ink" label="Status footer">
      <div className="gs-split gs-st">
        <div className="gs-stack">
          <p className="gs-status"><span className="gs-dot" aria-hidden="true" /> All systems operational</p>
          <h2 className="gs-h2">Uptime, in the open.</h2>
          <p className="gs-sub num">{avg.toFixed(2)}% over the last 60 days. Arrow keys move through the days.</p>
        </div>
        <div>
          <div ref={ref} className="gs-up" role="group" tabIndex={0} aria-label="Daily uptime, last 60 days" aria-describedby="up-tip"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); setA(Math.max(0, a - 1)); }
              if (e.key === "ArrowRight") { e.preventDefault(); setA(Math.min(59, a + 1)); }
              if (e.key === "Home") setA(0); if (e.key === "End") setA(59);
            }}>
            {UPTIME.map((v, i) => (
              <motion.i key={i} className={v < 99 ? "bad" : v < 99.5 ? "warn" : ""} onMouseEnter={() => setA(i)}
                initial={false} animate={{ scaleY: inView || !ok ? (a === i ? 1.25 : 1) : 0.1, opacity: a === i ? 1 : 0.7 }}
                transition={{ ...(ok ? { type: "spring", stiffness: 420, damping: 18 } : NONE), delay: ok && !inView ? 0 : 0 }} style={{ transformOrigin: "bottom" }} />
            ))}
          </div>
          <p id="up-tip" className="gs-up-tip num" role="status"><b>{day(a)}</b> · {UPTIME[a].toFixed(2)}% uptime</p>
        </div>
      </div>
      <LinkCols className="gs-cols-s" />
    </Sec>
  );
                           }
