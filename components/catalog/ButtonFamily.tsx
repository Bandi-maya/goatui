"use client";

import "./ButtonFamily.css";
import {
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

/* ---------- shared bits ---------- */

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const I = {
  bag: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 5.5h10l-.8 8H3.8l-.8-8Z" />
      <path d="M5.5 5.5v-1a2.5 2.5 0 0 1 5 0v1" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 17.2C5.6 14 2.5 11.2 2.5 7.9 2.5 5.6 4.3 4 6.4 4c1.4 0 2.7.8 3.6 2 .9-1.2 2.2-2 3.6-2 2.1 0 3.9 1.6 3.9 3.9 0 3.3-3.1 6.1-7.5 9.3Z" />
    </svg>
  ),
  heartLine: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M10 16.6C5.9 13.6 3 11 3 7.9 3 5.9 4.6 4.4 6.5 4.4c1.3 0 2.5.7 3.5 2 1-1.3 2.2-2 3.5-2 1.9 0 3.5 1.5 3.5 3.5 0 3.1-2.9 5.7-7 8.7Z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M5.5 3.6v10.8c0 .8.9 1.3 1.6.9l8-5.4c.6-.4.6-1.4 0-1.8l-8-5.4c-.7-.4-1.6.1-1.6.9Z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="3.6" height="12" rx="1.2" />
      <rect x="10.4" y="3" width="3.6" height="12" rx="1.2" />
    </svg>
  ),
  prev: (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M4 3.5h1.8v11H4z" />
      <path d="M14.5 4.2v9.6c0 .8-.9 1.3-1.6.9L6 9.8a1 1 0 0 1 0-1.7l6.9-4.8c.7-.5 1.6 0 1.6.9Z" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M12.2 3.5H14v11h-1.8z" />
      <path d="M3.5 4.2v9.6c0 .8.9 1.3 1.6.9l6.9-4.9a1 1 0 0 0 0-1.7L5.1 3.3c-.7-.5-1.6 0-1.6.9Z" />
    </svg>
  ),
  shuffle: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4h3l7 8h4m0 0-2-2m2 2-2 2M1 12h3l1.7-1.9M9.3 5.9 11 4h4m0 0-2-2m2 2-2 2" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 4.5 3 3 3-3" />
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="3" width="13" height="3.4" rx="1" />
      <path d="M3.6 6.4v6.3a1.8 1.8 0 0 0 1.8 1.8h7.2a1.8 1.8 0 0 0 1.8-1.8V6.4M7.4 9.4h3.2" />
    </svg>
  ),
  snooze: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="9" r="6.3" />
      <path d="M9 5.6V9l2.5 1.6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 2.8 1.9 3.9 4.3.6-3.1 3 .7 4.2L9 12.5l-3.8 2 .7-4.2-3.1-3 4.3-.6L9 2.8Z" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 1.8v8m0 0L3.8 6.6M7 9.8l3.2-3.2M2 12.2h10" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.8 8.2a2.9 2.9 0 0 0 4.1 0l1.7-1.7a2.9 2.9 0 1 0-4.1-4.1l-.9.9" />
      <path d="M8.2 5.8a2.9 2.9 0 0 0-4.1 0L2.4 7.5a2.9 2.9 0 1 0 4.1 4.1l.9-.9" />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 12.2v-8m0 0L3.8 7.4M7 4.2l3.2 3.2M2 1.8h10" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="bf-check" d="m3 8.5 3.2 3.2L13 4.8" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 2H3.2A1.2 1.2 0 0 0 2 3.2v7.6A1.2 1.2 0 0 0 3.2 12h2.3M9.5 9.5 12 7l-2.5-2.5M12 7H5.8" />
    </svg>
  ),
  thumb: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 6.8 7 2.6c.9 0 1.7.8 1.7 1.8v2h3.4a1.4 1.4 0 0 1 1.4 1.7l-.8 4.6a1.6 1.6 0 0 1-1.6 1.3H5m0-7.2v7.2m0-7.2H2.6a.6.6 0 0 0-.6.6v6a.6.6 0 0 0 .6.6H5" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="2.6" y="6" width="8.8" height="6" rx="1.4" />
      <path d="M4.6 6V4.4a2.4 2.4 0 0 1 4.8 0V6" />
    </svg>
  ),
};

/* ---------- B1 - ink primary with sheen ---------- */
export function InkSheenButton({ label = "Add to bag", onAdd }: { label?: string; onAdd?: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={cx("bf-btn-ink", added && "is-added")}
      onClick={() => {
        onAdd?.();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "In your bag" : label}
    </button>
  );
}

/* ---------- B2 - outline with tap ripple ---------- */
export function OutlineRippleButton({ label = "Buy it now" }: { label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const fire = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = document.createElement("span");
    const size = Math.max(r.width, r.height) * 2.2;
    s.className = "bf-ripple-ink";
    s.style.width = s.style.height = `${size}px`;
    s.style.left = `${x - r.left - size / 2}px`;
    s.style.top = `${y - r.top - size / 2}px`;
    el.appendChild(s);
    window.setTimeout(() => s.remove(), 700);
  };
  return (
    <button
      type="button"
      ref={ref}
      className="bf-btn-ripple"
      onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => fire(e.clientX, e.clientY)}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          const r = e.currentTarget.getBoundingClientRect();
          fire(r.left + r.width / 2, r.top + r.height / 2);
        }
      }}
    >
      {label}
    </button>
  );
}

/* ---------- B3 - quantity stepper ---------- */
export function QuantityStepper({
  min = 1,
  max = 9,
  initial = 1,
  value,
  onChange,
}: {
  min?: number;
  max?: number;
  initial?: number;
  value?: number;
  onChange?: (n: number) => void;
}) {
  const [inner, setInner] = useState(initial);
  const n = typeof value === "number" ? value : inner;
  const [pop, setPop] = useState(false);
  const bump = (d: number) => {
    const next = Math.min(max, Math.max(min, n + d));
    setInner(next);
    onChange?.(next);
    setPop(true);
    window.setTimeout(() => setPop(false), 320);
  };
  return (
    <span className="bf-stepper" role="group" aria-label="Quantity">
      <button type="button" aria-label="One fewer" onClick={() => bump(-1)} disabled={n <= min}>
        −
      </button>
      <output aria-live="polite" className={pop ? "bf-pop" : undefined}>
        {n}
      </output>
      <button type="button" aria-label="One more" onClick={() => bump(1)} disabled={n >= max}>
        +
      </button>
    </span>
  );
}

/* ---------- B4 - wishlist heart ---------- */
export function WishlistHeartButton({ item = "this notebook" }: { item?: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={cx("bf-heart", on && "is-on")}
      aria-pressed={on}
      aria-label={on ? `Remove ${item} from the wishlist` : `Save ${item} to the wishlist`}
      onClick={() => setOn((v) => !v)}
    >
      {on ? I.heart : I.heartLine}
      <span className="bf-burst" aria-hidden="true" />
      <span className="bf-spark" aria-hidden="true" />
      <span className="bf-spark" aria-hidden="true" />
      <span className="bf-spark" aria-hidden="true" />
      <span className="bf-spark" aria-hidden="true" />
    </button>
  );
}

/* ---------- B5 - play / pause morph (controlled) ---------- */
export function PlayPauseMorphButton({
  playing,
  onToggle,
  label = "Sundown",
  progress = 0,
}: {
  playing: boolean;
  onToggle: (next: boolean) => void;
  label?: string;
  progress?: number;
}) {
  const C = 2 * Math.PI * 24;
  return (
    <button
      type="button"
      className="bf-play"
      aria-pressed={playing}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      onClick={() => onToggle(!playing)}
    >
      <svg className="bf-play-ring" viewBox="0 0 54 54" aria-hidden="true">
        <circle cx="27" cy="27" r="24" className="bf-play-ring-track" />
        <circle
          cx="27"
          cy="27"
          r="24"
          className="bf-play-ring-run"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.min(1, Math.max(0, progress)))}
        />
      </svg>
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <g className="bf-ico-play">
          <path fill="currentColor" d="M5.5 3.6v10.8c0 .8.9 1.3 1.6.9l8-5.4c.6-.4.6-1.4 0-1.8l-8-5.4c-.7-.4-1.6.1-1.6.9Z" />
        </g>
        <g className="bf-ico-pause">
          <rect x="4" y="3" width="3.6" height="12" rx="1.2" fill="currentColor" />
          <rect x="10.4" y="3" width="3.6" height="12" rx="1.2" fill="currentColor" />
        </g>
      </svg>
    </button>
  );
}

/* ---------- B6 - skip with directional nudge ---------- */
export function SkipNudgeButton({ dir, onSkip }: { dir: "prev" | "next"; onSkip?: () => void }) {
  return (
    <button
      type="button"
      className="bf-skip"
      data-dir={dir}
      aria-label={dir === "prev" ? "Previous track" : "Next track"}
      onClick={onSkip}
    >
      {dir === "prev" ? I.prev : I.next}
    </button>
  );
}

/* ---------- B7 - shuffle toggle ---------- */
export function ShuffleToggleButton() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="bf-shuffle" aria-pressed={on} onClick={() => setOn((v) => !v)}>
      {I.shuffle}
      Shuffle
      <span className="bf-dot" aria-hidden="true" />
    </button>
  );
}

/* ---------- B8 - split send with working menu ---------- */
const SEND_OPTIONS = [
  { label: "Send now", hint: "⌘↵" },
  { label: "Send tomorrow, 8:00", hint: "" },
  { label: "Send Friday, 9:30", hint: "" },
  { label: "Pick a time…", hint: "" },
];

export function SendSplitButton() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const fire = (what: string) => {
    setOpen(false);
    setSent(what);
    window.setTimeout(() => setSent(null), 2100);
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll("button") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      setOpen(false);
      chevRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  };

  return (
    <span className={cx("bf-split", open && "is-open")} ref={wrapRef}>
      <button type="button" className="bf-split-main" onClick={() => fire("Sent")}>
        Send
      </button>
      <button
        type="button"
        ref={chevRef}
        className="bf-split-chev"
        aria-label="Schedule send"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          setOpen((v) => !v);
          window.setTimeout(() => menuRef.current?.querySelector("button")?.focus(), 0);
        }}
      >
        {I.chevron}
      </button>
      {open && (
        <div className="bf-split-menu" role="menu" ref={menuRef} onKeyDown={onMenuKey}>
          {SEND_OPTIONS.map((o) => (
            <button type="button" role="menuitem" key={o.label} onClick={() => fire(o.label === "Send now" ? "Sent" : "Scheduled")}>
              {o.label}
              {o.hint && <span>{o.hint}</span>}
            </button>
          ))}
        </div>
      )}
      {sent && (
        <span className="bf-split-sent" role="status">
          {sent === "Sent" ? "Sent to Ava" : "Scheduled"}
        </span>
      )}
    </span>
  );
}

/* ---------- B9 - toolbar icon buttons ---------- */
export function ToolbarIconButton({
  icon,
  tip,
  pressed,
  onToggle,
}: {
  icon: "archive" | "snooze" | "star";
  tip: string;
  pressed?: boolean;
  onToggle?: () => void;
}) {
  const [flash, setFlash] = useState(false);
  const isToggle = typeof pressed === "boolean";
  return (
    <button
      type="button"
      className="bf-tool"
      aria-label={tip}
      aria-pressed={isToggle ? pressed : flash}
      onClick={() => {
        if (isToggle) onToggle?.();
        else {
          setFlash(true);
          window.setTimeout(() => setFlash(false), 900);
        }
      }}
    >
      {I[icon]}
      <span className="bf-tip" aria-hidden="true">
        {tip}
      </span>
    </button>
  );
}

/* ---------- B10 - retreating underline text button ---------- */
export function RetreatLinkButton({ label = "Discard draft" }: { label?: string }) {
  const [gone, setGone] = useState(false);
  return (
    <button
      type="button"
      className="bf-textbtn"
      onClick={() => {
        setGone(true);
        window.setTimeout(() => setGone(false), 2000);
      }}
    >
      {gone ? "Draft discarded" : label}
    </button>
  );
}

/* ---------- B11 - spring switch ---------- */
export function SpringSwitch({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="bf-switch"
      onClick={() => setOn((v) => !v)}
    >
      <span className="bf-knob" aria-hidden="true" />
    </button>
  );
}

/* ---------- B12 - segmented billing control ---------- */
const PLANS = [
  { id: "monthly", label: "Monthly", price: "$9 a month" },
  { id: "yearly", label: "Yearly", price: "$86 a year, two months free" },
  { id: "forever", label: "Lifetime", price: "$240 once, yours for good" },
];

export function SegmentedBillingControl() {
  const [sel, setSel] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const inkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = refs.current[sel];
    const ink = inkRef.current;
    if (el && ink) {
      ink.style.width = `${el.offsetWidth}px`;
      ink.style.transform = `translateX(${el.offsetLeft - 3}px)`;
    }
  }, [sel]);

  const move = (i: number) => {
    const next = (i + PLANS.length) % PLANS.length;
    setSel(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div className="bf-seg" role="radiogroup" aria-label="Billing period">
        <span className="bf-seg-ink" ref={inkRef} aria-hidden="true" />
        {PLANS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={sel === i}
            tabIndex={sel === i ? 0 : -1}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onClick={() => setSel(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") move(i + 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(i - 1);
              else if (e.key === "Home") move(0);
              else if (e.key === "End") move(PLANS.length - 1);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="bf-seg-note" aria-live="polite">
        <b>{PLANS[sel].label}.</b> {PLANS[sel].price}
      </p>
    </div>
  );
}

/* ---------- B13 - hold to confirm ---------- */
const HOLD_MS = 950;

export function HoldToConfirmButton({ label = "Erase listening history" }: { label?: string }) {
  const [fill, setFill] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const raf = useRef<number>(0);
  const startT = useRef(0);
  const holding = useRef(false);

  const stop = (completed: boolean) => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    if (completed) {
      setFill(1);
      setDone(true);
      window.setTimeout(() => {
        setDone(false);
        setFill(0);
      }, 2600);
    } else if (fill > 0 && fill < 1) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      setFill(0);
    }
  };

  const begin = () => {
    if (done || holding.current) return;
    holding.current = true;
    startT.current = performance.now();
    const tick = (t: number) => {
      if (!holding.current) return;
      const p = Math.min(1, (t - startT.current) / HOLD_MS);
      setFill(p);
      if (p >= 1) stop(true);
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div className="bf-hold-wrap">
      <button
        type="button"
        className={cx("bf-hold", fill > 0.02 && "is-arming", done && "is-done", shake && "is-shake")}
        style={{ "--hold": fill } as CSSProperties}
        aria-describedby="bf-hold-hint"
        onPointerDown={begin}
        onPointerUp={() => stop(false)}
        onPointerLeave={() => stop(false)}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            begin();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") stop(false);
        }}
      >
        <span className="bf-hold-fill" aria-hidden="true" />
        <span className="bf-hold-label">{done ? "History erased" : label}</span>
      </button>
      <span className="bf-hold-hint" id="bf-hold-hint">
        {done ? "Nothing left to erase." : "Press and hold for a second. Letting go early keeps everything."}
      </span>
    </div>
  );
}

/* ---------- B14 - quiet sign out ---------- */
export function QuietSignOutButton() {
  return (
    <button type="button" className="bf-quiet" onClick={() => {}}>
      Sign out of this device
      {I.logout}
    </button>
  );
}

/* ---------- B15 - download with progress ring ---------- */
const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

export function DownloadProgressButton({ file = "Fieldguide.pdf" }: { file?: string }) {
  const [p, setP] = useState(0);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const start = () => {
    if (state !== "idle") return;
    setState("busy");
    setP(0);
    const iv = window.setInterval(() => {
      setP((v) => {
        const nv = v + 0.03 + Math.random() * 0.05;
        if (nv >= 1) {
          window.clearInterval(iv);
          setState("done");
          window.setTimeout(() => {
            setState("idle");
            setP(0);
          }, 2800);
          return 1;
        }
        return nv;
      });
    }, 90);
  };

  return (
    <button
      type="button"
      className={cx("bf-dl", state === "busy" && "is-busy", state === "done" && "is-done")}
      onClick={start}
    >
      <span className="bf-sr-only">{file}: </span>
      {state === "idle" && (
        <>
          <span className="bf-dl-arrow" style={{ display: "inline-flex" }}>
            {I.down}
          </span>
          Save
        </>
      )}
      {state === "busy" && (
        <>
          <svg className="bf-dl-ring" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle className="bf-dl-track" cx="11" cy="11" r={RING_R} />
            <circle
              className="bf-dl-run"
              cx="11"
              cy="11"
              r={RING_R}
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - p)}
            />
          </svg>
          {Math.round(p * 100)}%
        </>
      )}
      {state === "done" && (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="bf-dl-check" d="m3 8.5 3.2 3.2L13 4.8" />
          </svg>
          Saved
        </>
      )}
    </button>
  );
}

/* ---------- B16 - copy link ---------- */
export function CopyLinkButton({ url = "https://goatui.local/f/fieldguide" }: { url?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={cx("bf-copy", copied && "is-copied")}
      onClick={() => {
        try {
          navigator.clipboard?.writeText(url).catch(() => {});
        } catch {}
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1900);
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 8.5 3.2 3.2L13 4.8" />
          </svg>
          <span className="bf-copy-label">Link copied</span>
        </>
      ) : (
        <>
          {I.link}
          <span className="bf-copy-label">Copy link</span>
        </>
      )}
    </button>
  );
}

/* ---------- B17 - upload fill ---------- */
export function UploadFillButton({ label = "Add files" }: { label?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  return (
    <button
      type="button"
      className={cx("bf-upload", state === "busy" && "is-busy")}
      onClick={() => {
        if (state !== "idle") return;
        setState("busy");
        window.setTimeout(() => {
          setState("done");
          window.setTimeout(() => setState("idle"), 1600);
        }, 1500);
      }}
    >
      {state === "done" ? "✓ Added" : state === "busy" ? "Adding…" : label}
      {state === "idle" && I.up}
    </button>
  );
}

/* ---------- B18 - arcade push block ---------- */
export function ArcadePushButton({ label = "Start the tour" }: { label?: string }) {
  return (
    <button type="button" className="bf-arcade">
      <span className="bf-arcade-base" aria-hidden="true" />
      <span className="bf-arcade-face">{label}</span>
    </button>
  );
}

/* ---------- B19 - brutalist offset shadow ---------- */
export function BrutalistShadowButton({ label = "Read the manifesto" }: { label?: string }) {
  return (
    <button type="button" className="bf-brutal">
      {label}
    </button>
  );
}

/* ---------- B20 - frosted glass over photo ---------- */
export function FrostedGlassButton({ label = "View the set" }: { label?: string }) {
  return (
    <button type="button" className="bf-frost">
      {label}
    </button>
  );
}

/* ---------- B21 - soft raised ---------- */
export function SoftRaisedButton({ label = "Dim the room" }: { label?: string }) {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="bf-soft" aria-pressed={on} onClick={() => setOn((v) => !v)}>
      {on ? "Bring the light back" : label}
    </button>
  );
}

/* ---------- B22 - gooey drip ---------- */
export function GooeyDripButton({ label = "Blend in" }: { label?: string }) {
  return (
    <span className="bf-goo-zone">
      <span className="bf-goo-merge" aria-hidden="true">
        <button type="button" className="bf-goo" tabIndex={-1}>
          {label}
          <span className="bf-goo-blob" />
          <span className="bf-goo-blob" />
          <span className="bf-goo-blob" />
        </button>
      </span>
      <span className="bf-goo-label">{label}</span>
      <button type="button" className="bf-goo-hit" aria-label={label} />
    </span>
  );
}

/* ---------- B23 - keycap ---------- */
export function KeycapButton() {
  const [opened, setOpened] = useState(false);
  return (
    <button
      type="button"
      className="bf-keycap"
      onClick={() => {
        setOpened(true);
        window.setTimeout(() => setOpened(false), 1600);
      }}
    >
      {opened ? "Palette open" : "Quick find"}
      <span className="bf-kbd" aria-hidden="true">
        ⌘K
      </span>
    </button>
  );
}

/* ---------- B24 - glow trace ---------- */
export function GlowTraceButton({ label = "Enter the gallery" }: { label?: string }) {
  return (
    <button type="button" className="bf-glow">
      {label}
    </button>
  );
}

/* ---------- B25 - like with counting pop ---------- */
export function LikeCountButton({ initial = 42 }: { initial?: number }) {
  const [on, setOn] = useState(false);
  const [tick, setTick] = useState(false);
  const n = initial + (on ? 1 : 0);
  return (
    <button
      type="button"
      className="bf-like"
      aria-pressed={on}
      aria-label={on ? `Unlike, ${n} likes` : `Like, ${n} likes`}
      onClick={() => {
        setOn((v) => !v);
        setTick(true);
        window.setTimeout(() => setTick(false), 340);
      }}
    >
      {on ? I.heart : I.thumb}
      <span className={cx("bf-like-count", tick && "bf-tick")} aria-hidden="true">
        {n}
      </span>
    </button>
  );
}

/* ---------- B26 - follow morph ---------- */
export function FollowMorphButton({ name = "Rin" }: { name?: string }) {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="bf-follow" aria-pressed={on} onClick={() => setOn((v) => !v)}>
      <span className="bf-follow-label" key={String(on)}>
        {on ? "Following" : `Follow ${name}`}
      </span>
    </button>
  );
}

/* ---------- B27 - reaction balloon ---------- */
const REACTION_ICONS = {
  leaf: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 3.5C8 3.5 4 7 4 11.5c0 1 .3 2 .8 2.7C5.6 9.5 9 6.4 14.5 3.5Z" fill="currentColor" stroke="none" />
      <path d="M4.8 14.2C6.5 9.3 10 6.2 14.5 3.5" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M9 1.8c.6 3.9 3.3 6.6 7.2 7.2-3.9.6-6.6 3.3-7.2 7.2-.6-3.9-3.3-6.6-7.2-7.2 3.9-.6 6.6-3.3 7.2-7.2Z" />
    </svg>
  ),
};

export function ReactionBalloonButton({
  icon = "leaf",
  label = "Send a leaf",
}: {
  icon?: "leaf" | "spark";
  label?: string;
}) {
  const [sent, setSent] = useState(0);
  return (
    <button
      type="button"
      className={cx("bf-react", sent > 0 && "is-sent")}
      aria-label={label}
      onClick={() => setSent((v) => v + 1)}
    >
      {REACTION_ICONS[icon]}
      {sent > 0 && (
        <span className="bf-react-fly" key={sent} aria-hidden="true">
          {REACTION_ICONS[icon]}
        </span>
      )}
      {sent > 0 && (
        <span className="bf-react-badge" aria-hidden="true">
          {sent}
        </span>
      )}
    </button>
  );
}

/* ---------- B28 - submit flow ---------- */
export function SubmitFlowButton({ email, onState }: { email: () => string; onState?: (msg: string, ok: boolean) => void }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  return (
    <button
      type="button"
      className={cx("bf-submit", state === "done" && "is-done")}
      disabled={state !== "idle"}
      onClick={() => {
        const value = email().trim();
        if (!value || !value.includes("@")) {
          onState?.("Add an email address first.", false);
          return;
        }
        setState("busy");
        onState?.("", false);
        window.setTimeout(() => {
          setState("done");
          onState?.(`Invite on its way to ${value}.`, true);
          window.setTimeout(() => setState("idle"), 2400);
        }, 1400);
      }}
    >
      {state === "idle" && "Invite"}
      {state === "busy" && (
        <>
          <span className="bf-spin" aria-hidden="true" />
          Sending
        </>
      )}
      {state === "done" && (
        <>
          {I.check}
          Sent
        </>
      )}
    </button>
  );
}

/* ---------- B29 - progress fill button ---------- */
export function ProgressFillButton({ label = "Save draft" }: { label?: string }) {
  const [p, setP] = useState(0);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  return (
    <button
      type="button"
      className={cx("bf-prog", state === "done" && "is-done")}
      disabled={state !== "idle"}
      style={{ "--p": p } as CSSProperties}
      onClick={() => {
        setState("busy");
        setP(0);
        const iv = window.setInterval(() => {
          setP((v) => {
            const nv = v + 0.05 + Math.random() * 0.07;
            if (nv >= 1) {
              window.clearInterval(iv);
              setState("done");
              window.setTimeout(() => {
                setState("idle");
                setP(0);
              }, 2200);
              return 1;
            }
            return nv;
          });
        }, 80);
      }}
    >
      <span className="bf-prog-fill" aria-hidden="true" />
      <span className="bf-prog-label">
        {state === "busy" ? `Saving ${Math.round(p * 100)}%` : state === "done" ? "Draft saved" : label}
      </span>
    </button>
  );
}

/* ---------- B30 - honest disabled ---------- */
export function HonestDisabledButton({ label = "Invite" }: { label?: string }) {
  return (
    <button type="button" className="bf-disabled" disabled>
      {I.lock}
      {label}
    </button>
  );
}

/* ============================================================
   Surfaces - each button lives inside a believable product
   ============================================================ */

function StoreSurface() {
  const [qty, setQty] = useState(1);
  return (
    <section className="bf-surface bf-store" aria-label="Fieldnotes Supply, product page">
      <div className="bf-store-visual" aria-hidden="true">
        <span className="bf-store-photo" />
      </div>
      <div className="bf-store-body">
        <div className="bf-store-brand">
          <span>Fieldnotes Supply</span>
          <span className="bf-store-crumb">Stationery / Notebooks</span>
        </div>
        <h2 className="bf-store-title">The Orchard Notebook</h2>
        <p className="bf-store-sub">
          192 pages of laid paper that takes fountain pen ink without a fight. Stitched binding, opens flat,
          smells faintly of a print shop.
        </p>
        <div className="bf-store-meta">
          <span className="bf-store-price">$28</span>
          <span className="bf-store-note">Ships Thursday, free over $40</span>
        </div>
        <div className="bf-store-actions">
          <InkSheenButton label={qty > 1 ? `Add ${qty} to bag · $${28 * qty}` : "Add to bag · $28"} />
          <OutlineRippleButton />
          <QuantityStepper value={qty} onChange={setQty} />
          <WishlistHeartButton item="the Orchard Notebook" />
        </div>
        <div className="bf-store-foot">
          <span>Made in small runs</span>
          <span>Returns within 60 days</span>
        </div>
      </div>
    </section>
  );
}

function PlayerSurface() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.18);
  useEffect(() => {
    if (!playing) return;
    const iv = window.setInterval(() => setProgress((v) => (v >= 1 ? 0 : v + 0.006)), 300);
    return () => window.clearInterval(iv);
  }, [playing]);
  return (
    <section className="bf-surface bf-player" aria-label="Soundroom, now playing">
      <div className="bf-player-head">
        <strong>soundroom</strong>
        <span>{playing ? "Playing now" : "Paused"}</span>
      </div>
      <div className="bf-player-track">
        <span className="bf-player-art" aria-hidden="true" />
        <div className="bf-player-names">
          <b>
            Sundown
            {playing && (
              <span className="bf-eq" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </b>
          <span>Khruangbin · Con Todo El Mundo</span>
        </div>
        <div className="bf-player-controls">
          <ShuffleToggleButton />
          <SkipNudgeButton dir="prev" />
          <PlayPauseMorphButton playing={playing} onToggle={setPlaying} label="Sundown" progress={progress} />
          <SkipNudgeButton dir="next" />
        </div>
      </div>
    </section>
  );
}

function ComposeSurface() {
  const [starred, setStarred] = useState(false);
  return (
    <section className="bf-surface bf-compose" aria-label="Post, reply draft">
      <div className="bf-compose-top">
        <b>To</b> Ava Lewis <span>· Re: Website direction, round two</span>
      </div>
      <div className="bf-compose-body">
        <p className="bf-compose-line">
          The quieter route is the one. I marked up the two screens with the spacing changes we talked about and
          dropped the counter treatment everywhere.
        </p>
        <p className="bf-compose-sign">Jamie</p>
      </div>
      <div className="bf-compose-bar">
        <SendSplitButton />
        <ToolbarIconButton icon="archive" tip="Archive thread" />
        <ToolbarIconButton icon="snooze" tip="Snooze until Friday" />
        <ToolbarIconButton icon="star" tip="Star thread" pressed={starred} onToggle={() => setStarred((v) => !v)} />
        <span className="bf-compose-spacer" />
        <RetreatLinkButton />
      </div>
    </section>
  );
}

function SettingsSurface() {
  return (
    <section className="bf-surface bf-settings" aria-label="Soundroom settings">
      <div className="bf-set-card">
        <h3>Notifications</h3>
        <p>Decide when soundroom taps you on the shoulder.</p>
        <div className="bf-row">
          <div>
            <b>New releases</b>
            <span>Artists you follow, once a week at most.</span>
          </div>
          <SpringSwitch label="New releases" defaultOn />
        </div>
        <div className="bf-row">
          <div>
            <b>Friend activity</b>
            <span>When someone you know starts listening.</span>
          </div>
          <SpringSwitch label="Friend activity" />
        </div>
      </div>
      <div className="bf-set-card">
        <h3>Membership</h3>
        <p>One plan across every device you own.</p>
        <SegmentedBillingControl />
      </div>
      <div className="bf-set-card">
        <h3>Your data</h3>
        <p>Some things should be a little hard to do on accident.</p>
        <HoldToConfirmButton />
      </div>
      <div className="bf-set-card">
        <h3>Account</h3>
        <p>Signed in as Jamie Lane on three devices.</p>
        <QuietSignOutButton />
      </div>
    </section>
  );
}

function FilesSurface() {
  return (
    <section className="bf-surface bf-files" aria-label="Shared folder">
      <div className="bf-files-head">
        <h3>Round two, shared</h3>
        <span>3 files · updated this morning</span>
      </div>
      <div className="bf-file">
        <span className="bf-file-ico" data-kind="pdf" aria-hidden="true">
          PDF
        </span>
        <div className="bf-file-names">
          <b>Field-notes, direction pass.pdf</b>
          <span>4.2 MB · Ava added comments</span>
        </div>
        <div className="bf-file-actions">
          <CopyLinkButton url="https://goatui.local/f/direction-pass" />
          <DownloadProgressButton file="Field-notes, direction pass.pdf" />
        </div>
      </div>
      <div className="bf-file">
        <span className="bf-file-ico" data-kind="key" aria-hidden="true">
          KEY
        </span>
        <div className="bf-file-names">
          <b>Type and spacing walkthrough.key</b>
          <span>18 MB · for Thursday review</span>
        </div>
        <div className="bf-file-actions">
          <CopyLinkButton url="https://goatui.local/f/walkthrough" />
          <DownloadProgressButton file="Type and spacing walkthrough.key" />
        </div>
      </div>
      <div className="bf-file">
        <span className="bf-file-ico" data-kind="zip" aria-hidden="true">
          ZIP
        </span>
        <div className="bf-file-names">
          <b>Reference captures, March.zip</b>
          <span>61 MB · 44 images</span>
        </div>
        <div className="bf-file-actions">
          <UploadFillButton label="Add version" />
        </div>
      </div>
    </section>
  );
}

function ShelfSurface() {
  return (
    <section className="bf-surface bf-shelf" aria-label="Material studies">
      <div className="bf-shelf-head">
        <h3>After hours</h3>
        <span>Seven materials that would never share a product, sharing a shelf</span>
      </div>
      <div className="bf-shelf-grid">
        <div className="bf-tile bf-tile-dark">
          <ArcadePushButton />
        </div>
        <div className="bf-tile bf-tile-light">
          <BrutalistShadowButton />
        </div>
        <div className="bf-tile bf-tile-photo">
          <FrostedGlassButton />
        </div>
        <div className="bf-tile bf-tile-soft">
          <SoftRaisedButton />
        </div>
        <div className="bf-tile bf-tile-dark">
          <GooeyDripButton />
        </div>
        <div className="bf-tile bf-tile-ink">
          <KeycapButton />
        </div>
        <div className="bf-tile bf-tile-ink">
          <GlowTraceButton />
        </div>
      </div>
    </section>
  );
}

function SocialSurface() {
  return (
    <section className="bf-surface bf-social" aria-label="Comment thread">
      <div className="bf-comment">
        <span className="bf-avatar" aria-hidden="true">
          RM
        </span>
        <div className="bf-comment-body">
          <div className="bf-comment-head">
            <b>Rin Mori</b>
            <span>2 hours ago · Berlin</span>
          </div>
          <p className="bf-comment-text">
            Pressed the arcade one forty times in a row and I am not sorry. The yellow settles exactly where your
            thumb expects it to.
          </p>
          <div className="bf-comment-actions">
            <LikeCountButton initial={42} />
            <ReactionBalloonButton icon="leaf" label="Send a leaf" />
            <ReactionBalloonButton icon="spark" label="Send a spark" />
            <FollowMorphButton name="Rin" />
          </div>
        </div>
      </div>
    </section>
  );
}

function InviteSurface() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [typed, setTyped] = useState("");
  return (
    <section className="bf-surface bf-invite" aria-label="Invite a teammate">
      <div className="bf-invite-intro">
        <h3>Bring someone into round two</h3>
        <p>Everyone in this workspace can see the shared folder, the settings sheet and the after-hours shelf.</p>
        <div className="bf-invite-members" aria-label="Current members: Ava, Miles, Rin, Jamie">
          <span style={{ background: "#7d6a8f" }}>AL</span>
          <span style={{ background: "#3e6d8e" }}>MC</span>
          <span style={{ background: "#b3554a" }}>RM</span>
          <span style={{ background: "#40543a" }}>JL</span>
        </div>
      </div>
      <div className="bf-invite-form">
        <label htmlFor="bf-invite-email">Work email</label>
        <div className="bf-invite-row">
          <input
            id="bf-invite-email"
            ref={inputRef}
            type="email"
            placeholder="maya@northstudio.co"
            autoComplete="off"
            onChange={(e) => setTyped(e.target.value)}
          />
          {typed.includes("@") ? (
            <SubmitFlowButton
              email={() => inputRef.current?.value ?? ""}
              onState={(m, good) => {
                setMsg(m);
                setOk(good);
              }}
            />
          ) : (
            <HonestDisabledButton />
          )}
        </div>
        <p className={cx("bf-invite-msg", ok && "is-ok")} aria-live="polite">
          {msg || "The button wakes up once an email is on the table."}
        </p>
        <div style={{ marginTop: 14 }}>
          <ProgressFillButton label="Save draft invite" />
        </div>
      </div>
    </section>
  );
}

export default function ButtonFamily() {
  return (
    <div className="bf-stack">
      <StoreSurface />
      <PlayerSurface />
      <ComposeSurface />
      <SettingsSurface />
      <FilesSurface />
      <ShelfSurface />
      <SocialSurface />
      <InviteSurface />
    </div>
  );
}
