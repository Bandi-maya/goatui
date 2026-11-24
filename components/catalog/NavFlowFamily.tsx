"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import "./NavFlowFamily.css";

/* ================================================================
   NavFlowFamily - 30 navigation & flow components for GOAT UI:
   five steppers, five timelines, five paginations, five
   breadcrumbs, five tab-style navs, five sidebars.
   Spring physics everywhere, keyboard + aria throughout,
   prefers-reduced-motion aware. Prefix: nf-
   ================================================================ */

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const snappy = { type: "spring", stiffness: 420, damping: 32 } as Transition;
const gentle = { type: "spring", stiffness: 230, damping: 26 } as Transition;
const bouncy = { type: "spring", stiffness: 300, damping: 17 } as Transition;
const stiff = { type: "spring", stiffness: 640, damping: 36 } as Transition;

function useInstant(): Transition | null {
  const rm = useReducedMotion();
  return rm ? { duration: 0.01 } : null;
}

function useCycle(count: number, initial = 0) {
  const [i, setI] = React.useState(initial);
  const go = React.useCallback(
    (n: number) => setI(((n % count) + count) % count),
    [count]
  );
  return { i, go };
}

function onArrows(
  e: React.KeyboardEvent,
  prev: () => void,
  next: () => void
) {
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    prev();
  } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    next();
  }
}

/* ---------------- icons (inline, 1.5px stroke) ---------------- */

const I = {
  chevR: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 2.5 4.5 4.5L5 11.5" />
    </svg>
  ),
  chevL: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 2.5 4.5 7 9 11.5" />
    </svg>
  ),
  chevD: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2.5 5 4.5 4.5L11.5 5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2.5 7.5 3 3 6-6.5" />
    </svg>
  ),
  dots: (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="12.5" cy="8" r="1.5" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2.5 7 5.5-4.5L13.5 7M4 6.5V13a.6.6 0 0 0 .6.6h6.8a.6.6 0 0 0 .6-.6V6.5" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.4" />
      <path d="m10.4 10.4 3 3" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M12.4 3.6l-1.2 1.2M4.8 11.2l-1.2 1.2" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="5" r="2.6" />
      <path d="M3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2a4 4 0 0 0-4 4v2.6L2.8 11h10.4L12 8.6V6a4 4 0 0 0-4-4ZM6.6 13a1.5 1.5 0 0 0 2.8 0" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 2 1.8 3.8 4.2.5-3 3 .8 4.1L8 11.6l-3.8 1.8.8-4.1-3-3 4.2-.5L8 2Z" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 3.8a.8.8 0 0 1 .8-.8h3.4l1.6 1.8h5.8a.8.8 0 0 1 .8.8v6.8a.8.8 0 0 1-.8.8H2.6a.8.8 0 0 1-.8-.8V3.8Z" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 1.8h5.6l3.4 3.4v9H3.5V1.8Z" />
      <path d="M9 1.8v3.5h3.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 14.5s5-4.6 5-8A5 5 0 1 0 3 6.5c0 3.4 5 8 5 8Z" />
      <circle cx="8" cy="6.5" r="1.7" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 14V2.2M3.5 2.2c3-1.4 6 1.4 9 0v6.4c-3 1.4-6-1.4-9 0" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.6V8l2.4 1.6" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1.5 3 9h4l-1 5.5L13 7H9l1-5.5Z" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 1.6 6 3.2v6.4L8 14.4l-6-3.2V4.8l6-3.2Z" />
      <path d="M2.2 4.9 8 8l5.8-3.1M8 8v6.2" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 1.8 6.2 3L8 7.8 1.8 4.8 8 1.8Z" />
      <path d="m1.8 8 6.2 3 6.2-3M1.8 11.2 8 14.2l6.2-3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 13.5v-4M6.2 13.5V6M9.8 13.5V8.6M13.5 13.5V3.4" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="10" rx="1.6" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </svg>
  ),
  cal: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="1.8" y="2.8" width="12.4" height="11" rx="1.6" />
      <path d="M1.8 6.4h12.4M5.2 1.4v2.8M10.8 1.4v2.8" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M7 2v10M2 7h10" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="m2.5 2.5 9 9M11.5 2.5l-9 9" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5.5 4h8M5.5 8h8M5.5 12h8" />
      <circle cx="2.6" cy="4" r=".9" fill="currentColor" stroke="none" />
      <circle cx="2.6" cy="8" r=".9" fill="currentColor" stroke="none" />
      <circle cx="2.6" cy="12" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      <path d="m10.6 5.4-1.4 3.8-3.8 1.4 1.4-3.8 3.8-1.4Z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M1.8 8h12.4M8 1.8c-3.7 3.9-3.7 8.5 0 12.4 3.7-3.9 3.7-8.5 0-12.4Z" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 9.5 3.6 3.4a.8.8 0 0 1 .8-.6h7.2a.8.8 0 0 1 .8.6l1.8 6.1v3a.8.8 0 0 1-.8.8H2.6a.8.8 0 0 1-.8-.8v-3Z" />
      <path d="M1.8 9.5H6a2 2 0 0 0 4 0h4.2" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1.5 4.5h9v8h-9zM10.5 7.5h3l2 2.5v2.5h-5" />
      <circle cx="4.5" cy="13.5" r="1.6" />
      <circle cx="13" cy="13.5" r="1.6" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1.5" y="3.5" width="15" height="11" rx="2" />
      <path d="M1.5 7h15M4.5 11h4" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </svg>
  ),
  panelL: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.8" y="2.4" width="12.4" height="11.2" rx="1.6" />
      <path d="M6.2 2.4v11.2" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2h5.2L14 8.8a1.6 1.6 0 0 1 0 2.3l-3 2.9a1.6 1.6 0 0 1-2.2 0L2 7.2V2Z" />
      <circle cx="5.4" cy="5.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6.5h8.5v3.2A4.3 4.3 0 0 1 7.2 14h-.9A4.3 4.3 0 0 1 2 9.7V6.5h1Z" />
      <path d="M11.5 7h1a1.8 1.8 0 0 1 0 3.6h-1M5.2 4.4c0-1 .8-1 .8-2M8 4.4c0-1 .8-1 .8-2" />
    </svg>
  ),
};

/* ---------------- shared demo atoms ---------------- */

function Frame({
  label,
  dark,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cx("nf nf-frame", dark && "nf-frame-dark")}>
      <div className="nf-frame-bar" aria-hidden="true">
        <span className="nf-frame-dot" />
        <span className="nf-frame-dot" />
        <span className="nf-frame-dot" />
        <em>{label}</em>
      </div>
      <div className="nf-frame-body">{children}</div>
    </div>
  );
}

function StepButtons({
  i,
  count,
  go,
  back = "Back",
  fwd = "Continue",
}: {
  i: number;
  count: number;
  go: (n: number) => void;
  back?: string;
  fwd?: string;
}) {
  return (
    <div className="nf-stepbtns">
      <motion.button
        type="button"
        className="nf-btn nf-btn-ghost"
        whileTap={{ scale: 0.94 }}
        transition={snappy}
        disabled={i === 0}
        onClick={() => go(i - 1)}
      >
        {back}
      </motion.button>
      <motion.button
        type="button"
        className="nf-btn nf-btn-solid"
        whileTap={{ scale: 0.94 }}
        transition={snappy}
        disabled={i === count - 1}
        onClick={() => go(i + 1)}
      >
        {i === count - 2 ? "Finish" : fwd}
      </motion.button>
    </div>
  );
}

/* ================================================================
   STEPPERS (v01 - v05)
   ================================================================ */

const ORDER_STEPS = [
  { t: "Address", d: "Where the parcel lands" },
  { t: "Delivery", d: "Speed and carrier" },
  { t: "Payment", d: "How you pay" },
  { t: "Review", d: "One last look" },
];

/* v01 - Rail: numbered discs on a filling connector */
export function NavFlowV01() {
  const instant = useInstant();
  const { i, go } = useCycle(ORDER_STEPS.length, 1);
  return (
    <div
      className="nf nf-v01"
      onKeyDown={(e) => onArrows(e, () => go(i - 1), () => go(i + 1))}
    >
      <ol className="nf-v01-rail" aria-label="Checkout progress">
        <div className="nf-v01-track" aria-hidden="true">
          <motion.div
            className="nf-v01-fill"
            animate={{ width: `${(i / (ORDER_STEPS.length - 1)) * 100}%` }}
            transition={instant ?? gentle}
          />
        </div>
        {ORDER_STEPS.map((s, k) => (
          <li key={s.t}>
            <button
              type="button"
              className={cx(
                "nf-v01-step",
                k < i && "done",
                k === i && "current"
              )}
              aria-current={k === i ? "step" : undefined}
              onClick={() => go(k)}
            >
              <motion.span
                className="nf-v01-disc"
                animate={k === i ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                transition={instant ?? bouncy}
                key={k === i ? `on-${i}` : `off-${k}`}
              >
                {k < i ? I.check : <b>{k + 1}</b>}
              </motion.span>
              <span className="nf-v01-name">{s.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          className="nf-v01-desc"
          key={i}
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={instant ?? gentle}
        >
          {ORDER_STEPS[i].d}
        </motion.p>
      </AnimatePresence>
      <StepButtons i={i} count={ORDER_STEPS.length} go={go} />
    </div>
  );
}

/* v02 - Vertical journal: rail on the left, sections expand */
export function NavFlowV02() {
  const instant = useInstant();
  const { i, go } = useCycle(4, 0);
  const steps = [
    { t: "Roast profile", d: "Light city roast, Ethiopian Guji lot 14.", icon: I.zap },
    { t: "Grind and dose", d: "18 g in, medium-fine, settled bed.", icon: I.settings },
    { t: "Bloom", d: "45 g water, 40 seconds, gentle swirl.", icon: I.clock },
    { t: "Pour and serve", d: "Two spirals to 280 g. Drink warm.", icon: I.cup },
  ];
  return (
    <div className="nf nf-v02">
      <ol className="nf-v02-list" aria-label="Brew guide progress">
        {steps.map((s, k) => {
          const open = k === i;
          return (
            <li key={s.t} className={cx("nf-v02-item", open && "open", k < i && "done")}>
              <button
                type="button"
                className="nf-v02-head"
                aria-expanded={open}
                aria-current={open ? "step" : undefined}
                onClick={() => go(k)}
              >
                <span className="nf-v02-node" aria-hidden="true">
                  {k < i ? I.check : <span className="nf-v02-dot" />}
                  {k < steps.length - 1 && (
                    <motion.span
                      className="nf-v02-wire"
                      animate={{ scaleY: k < i ? 1 : 0 }}
                      transition={instant ?? gentle}
                    />
                  )}
                </span>
                <span className="nf-v02-title">{s.t}</span>
                <motion.span
                  className="nf-v02-chev"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={instant ?? gentle}
                >
                  {I.chevD}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="nf-v02-body"
                    initial={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    animate={instant ? { height: "auto" } : { height: "auto", opacity: 1 }}
                    exit={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    transition={instant ?? gentle}
                  >
                    <div className="nf-v02-detail">
                      <span className="nf-v02-ico">{s.icon}</span>
                      <p>{s.d}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <StepButtons i={i} count={4} go={go} fwd="Next pour" />
    </div>
  );
}

/* v03 - Pulse dots: sliding pill behind dots on a dark bar */
export function NavFlowV03() {
  const instant = useInstant();
  const uid = React.useId();
  const steps = ["Scope", "Design", "Build", "Test", "Ship"];
  const { i, go } = useCycle(steps.length, 2);
  return (
    <div
      className="nf nf-v03"
      onKeyDown={(e) => onArrows(e, () => go(i - 1), () => go(i + 1))}
    >
      <div className="nf-v03-bar">
        <motion.button
          type="button"
          className="nf-v03-arrow"
          aria-label="Previous step"
          whileTap={{ scale: 0.88 }}
          transition={snappy}
          onClick={() => go(i - 1)}
        >
          {I.chevL}
        </motion.button>
        <div className="nf-v03-mid">
          <div className="nf-v03-dots" role="tablist" aria-label="Project phase">
            {steps.map((s, k) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={s}
                className="nf-v03-dotbtn"
                onClick={() => go(k)}
              >
                {k === i && (
                  <motion.span
                    className="nf-v03-pill"
                    layoutId={`nf-v03-pill-${uid}`}
                    transition={instant ?? snappy}
                  />
                )}
                <span className={cx("nf-v03-dot", k < i && "done", k === i && "on")} />
              </button>
            ))}
          </div>
          <div className="nf-v03-labels">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={i}
                className="nf-v03-name"
                initial={instant ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={instant ?? gentle}
              >
                {steps[i]}
              </motion.span>
            </AnimatePresence>
            <span className="nf-v03-count">
              {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>
        <motion.button
          type="button"
          className="nf-v03-arrow"
          aria-label="Next step"
          whileTap={{ scale: 0.88 }}
          transition={snappy}
          onClick={() => go(i + 1)}
        >
          {I.chevR}
        </motion.button>
      </div>
    </div>
  );
}

/* v04 - Segments: chapter bar with a springing marker */
export function NavFlowV04() {
  const instant = useInstant();
  const uid = React.useId();
  const steps = [
    { t: "Measure", d: "Mark the cut line twice." },
    { t: "Cut", d: "Slow pass, steady feed." },
    { t: "Sand", d: "120 then 240 grit." },
    { t: "Oil", d: "Two coats, four hours apart." },
  ];
  const { i, go } = useCycle(steps.length, 0);
  return (
    <div
      className="nf nf-v04"
      onKeyDown={(e) => onArrows(e, () => go(i - 1), () => go(i + 1))}
    >
      <div className="nf-v04-segs" role="tablist" aria-label="Build steps">
        {steps.map((s, k) => (
          <button
            key={s.t}
            type="button"
            role="tab"
            aria-selected={k === i}
            aria-label={s.t}
            className={cx("nf-v04-seg", k <= i && "filled")}
            onClick={() => go(k)}
          >
            <motion.span
              className="nf-v04-segfill"
              animate={{ scaleX: k <= i ? 1 : 0 }}
              transition={instant ?? gentle}
            />
            {k === i && (
              <motion.span
                className="nf-v04-marker"
                layoutId={`nf-v04-marker-${uid}`}
                transition={instant ?? bouncy}
              />
            )}
          </button>
        ))}
      </div>
      <div className="nf-v04-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={instant ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, x: -18 }}
            transition={instant ?? gentle}
          >
            <p className="nf-v04-kicker">
              Step {i + 1} of {steps.length}
            </p>
            <h3 className="nf-v04-title">{steps[i].t}</h3>
            <p className="nf-v04-desc">{steps[i].d}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <StepButtons i={i} count={steps.length} go={go} />
    </div>
  );
}

/* v05 - Ring: circular progress with a rotating icon hub */
export function NavFlowV05() {
  const instant = useInstant();
  const stops = [
    { t: "Ordered", icon: I.box },
    { t: "Packed", icon: I.layers },
    { t: "In transit", icon: I.truck },
    { t: "Delivered", icon: I.check },
  ];
  const { i, go } = useCycle(stops.length, 2);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="nf nf-v05">
      <div
        className="nf-v05-ring"
        role="img"
        aria-label={`Step ${i + 1} of ${stops.length}: ${stops[i].t}`}
      >
        <svg viewBox="0 0 128 128" className="nf-v05-svg">
          <circle cx="64" cy="64" r={R} className="nf-v05-ringtrack" />
          <motion.circle
            cx="64"
            cy="64"
            r={R}
            className="nf-v05-ringfill"
            strokeDasharray={C}
            animate={{ strokeDashoffset: C * (1 - (i + 1) / stops.length) }}
            transition={instant ?? gentle}
          />
          {stops.map((_, k) => {
            const a = (k / stops.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={k}
                cx={64 + R * Math.cos(a)}
                cy={64 + R * Math.sin(a)}
                r="4"
                className={cx("nf-v05-stop", k <= i && "hit")}
              />
            );
          })}
        </svg>
        <div className="nf-v05-hub">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={i}
              initial={instant ? false : { opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: 30 }}
              transition={instant ?? bouncy}
            >
              {stops[i].icon}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          className="nf-v05-name"
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={instant ?? gentle}
        >
          {stops[i].t}
        </motion.p>
      </AnimatePresence>
      <div className="nf-v05-btns">
        <motion.button type="button" aria-label="Previous status" whileTap={{ scale: 0.9 }} transition={snappy} onClick={() => go(i - 1)}>
          {I.chevL}
        </motion.button>
        <motion.button type="button" aria-label="Next status" whileTap={{ scale: 0.9 }} transition={snappy} onClick={() => go(i + 1)}>
          {I.chevR}
        </motion.button>
      </div>
    </div>
  );
}

/* ================================================================
   TIMELINES (v06 - v10)
   ================================================================ */

/* v06 - Alternating road: center line, cards switch sides */
export function NavFlowV06() {
  const instant = useInstant();
  const [open, setOpen] = React.useState(1);
  const events = [
    { t: "Kickoff", d: "Charter signed, team of six, room 4B.", when: "Mar 3" },
    { t: "First prototype", d: "Clickable demo, fourteen screens.", when: "Mar 21" },
    { t: "Field trial", d: "Twelve users, three days, one notebook.", when: "Apr 9" },
    { t: "Launch", d: "Public release with docs and support.", when: "May 2" },
  ];
  return (
    <div className="nf nf-v06">
      <ol className="nf-v06-list" aria-label="Project timeline">
        <span className="nf-v06-spine" aria-hidden="true" />
        {events.map((ev, k) => (
          <li key={ev.t} className={cx("nf-v06-item", k % 2 === 1 && "alt")}>
            <motion.span
              className={cx("nf-v06-node", k === open && "on")}
              initial={instant ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...(instant ?? bouncy), delay: instant ? 0 : k * 0.08 }}
              aria-hidden="true"
            />
            <motion.button
              type="button"
              className={cx("nf-v06-card", k === open && "open")}
              aria-expanded={k === open}
              onClick={() => setOpen(k)}
              initial={instant ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...(instant ?? gentle), delay: instant ? 0 : 0.05 + k * 0.08 }}
              whileHover={instant ? undefined : { y: -3 }}
            >
              <span className="nf-v06-when">{ev.when}</span>
              <span className="nf-v06-title">{ev.t}</span>
              <AnimatePresence initial={false}>
                {k === open && (
                  <motion.span
                    className="nf-v06-detail"
                    initial={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    animate={instant ? { height: "auto" } : { height: "auto", opacity: 1 }}
                    exit={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    transition={instant ?? gentle}
                  >
                    {ev.d}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* v07 - Scrub: draggable handle across release ticks */
export function NavFlowV07() {
  const instant = useInstant();
  const events = [
    { v: "0.9", t: "Private beta", d: "Forty invites, crash-free weeks." },
    { v: "1.0", t: "General release", d: "Core editor, offline first." },
    { v: "1.4", t: "Sharing", d: "Live cursors and comments." },
    { v: "2.0", t: "Plugins", d: "A real API and a small store." },
    { v: "2.3", t: "Mobile", d: "Read anywhere, edit on tablets." },
  ];
  const [idx, setIdx] = React.useState(1);
  const [dragging, setDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const raw = useMotionValue(1 / (events.length - 1));
  const sprung = useSpring(raw, { stiffness: 300, damping: 28 });
  const pos = instant ? raw : sprung;
  const left = useTransform(pos, (v) => `${v * 100}%`);

  const setFromPointer = React.useCallback(
    (clientX: number, snap: boolean) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const nearest = Math.round(ratio * (events.length - 1));
      setIdx(nearest);
      raw.set(snap ? nearest / (events.length - 1) : ratio);
    },
    [raw, events.length]
  );

  return (
    <div className="nf nf-v07">
      <div
        ref={trackRef}
        className={cx("nf-v07-track", dragging && "dragging")}
        role="slider"
        aria-label="Release timeline"
        aria-valuemin={0}
        aria-valuemax={events.length - 1}
        aria-valuenow={idx}
        aria-valuetext={events[idx].v}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            const n = Math.min(events.length - 1, Math.max(0, idx + (e.key === "ArrowRight" ? 1 : -1)));
            setIdx(n);
            raw.set(n / (events.length - 1));
          }
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setFromPointer(e.clientX, false);
        }}
        onPointerCancel={() => { setDragging(false); raw.set(idx / (events.length - 1)); }}
        onPointerMove={(e) => dragging && setFromPointer(e.clientX, false)}
        onPointerUp={(e) => {
          setDragging(false);
          setFromPointer(e.clientX, true);
        }}
      >
        <motion.span className="nf-v07-fill" style={{ width: left }} />
        {events.map((ev, k) => (
          <button
            key={ev.v}
            type="button"
            tabIndex={-1}
            className={cx("nf-v07-tick", k <= idx && "hit")}
            style={{ left: `${(k / (events.length - 1)) * 100}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setIdx(k);
              raw.set(k / (events.length - 1));
            }}
            aria-label={`Version ${ev.v}`}
          >
            <span className="nf-v07-v">{ev.v}</span>
          </button>
        ))}
        <motion.span className="nf-v07-handle" style={{ left }} transition={instant ?? undefined} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={idx}
          className="nf-v07-card"
          initial={instant ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={instant ?? gentle}
        >
          <span className="nf-v07-badge">{events[idx].v}</span>
          <div>
            <h3>{events[idx].t}</h3>
            <p>{events[idx].d}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* v08 - Branch: a commit-graph timeline in a dark terminal */
export function NavFlowV08() {
  const instant = useInstant();
  const [sel, setSel] = React.useState(2);
  const rows = [
    { hash: "a41f9c2", msg: "merge: offline sync into main", branch: "main", when: "2h" },
    { hash: "7d3b081", msg: "sync: resolve clock skew retries", branch: "sync", when: "5h" },
    { hash: "c90e4aa", msg: "sync: queue writes while offline", branch: "sync", when: "1d" },
    { hash: "512f7d0", msg: "main: bump deps, pin node 22", branch: "main", when: "1d" },
    { hash: "e83c116", msg: "main: settings schema v3", branch: "main", when: "2d" },
  ];
  return (
    <div className="nf nf-v08">
      <div className="nf-v08-term" role="list" aria-label="Commit history">
        <svg className="nf-v08-graph" viewBox="0 0 44 210" aria-hidden="true" preserveAspectRatio="none">
          <path d="M14 0 V210" className="nf-v08-line" />
          <path d="M14 42 C 14 21, 30 21, 30 42 L 30 84 C 30 105, 14 105, 14 126" className="nf-v08-line nf-v08-branch" />
        </svg>
        {rows.map((r, k) => (
          <motion.button
            key={r.hash}
            type="button"
            role="listitem"
            className={cx("nf-v08-row", k === sel && "sel")}
            onClick={() => setSel(k)}
            initial={instant ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...(instant ?? gentle), delay: instant ? 0 : k * 0.06 }}
            whileHover={instant ? undefined : { x: 3 }}
          >
            <span className={cx("nf-v08-dot", r.branch === "sync" && "alt")} style={{ left: r.branch === "sync" ? 24 : 8 }} />
            <span className="nf-v08-hash">{r.hash}</span>
            <span className="nf-v08-msg">{r.msg}</span>
            <span className="nf-v08-when">{r.when}</span>
          </motion.button>
        ))}
        <AnimatePresence>
          <motion.div
            key={sel}
            className="nf-v08-detail"
            initial={instant ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={instant ?? gentle}
          >
            <span className="nf-v08-tag">{rows[sel].branch}</span>
            <span>{rows[sel].msg}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* v09 - Flags: pennants above and below a straight line */
export function NavFlowV09() {
  const instant = useInstant();
  const [sel, setSel] = React.useState(3);
  const stops = [
    { t: "Seed", d: "Two founders, one garage bench.", y: "2019" },
    { t: "Series A", d: "Eight hires, first office.", y: "2021" },
    { t: "100k users", d: "Word of mouth did it.", y: "2023" },
    { t: "Profit", d: "Boring, durable, calm.", y: "2025" },
    { t: "Next", d: "Write the second act.", y: "Now" },
  ];
  return (
    <div className="nf nf-v09">
      <ol className="nf-v09-line" aria-label="Company milestones">
        {stops.map((s, k) => (
          <li key={s.t} className={k % 2 === 1 ? "low" : "high"}>
            <motion.button
              type="button"
              className={cx("nf-v09-flag", k === sel && "on")}
              aria-pressed={k === sel}
              onClick={() => setSel(k)}
              initial={instant ? false : { opacity: 0, y: k % 2 === 1 ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...(instant ?? bouncy), delay: instant ? 0 : k * 0.07 }}
            >
              <span className="nf-v09-pennant">{s.y}</span>
              <span className="nf-v09-pole" aria-hidden="true" />
            </motion.button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={sel}
          className="nf-v09-detail"
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={instant ?? gentle}
        >
          <strong>{stops[sel].t}</strong>
          <span>{stops[sel].d}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* v10 - Live feed: a pulsing now-node, events prepend */
export function NavFlowV10() {
  const instant = useInstant();
  const seed = [
    { id: 3, who: "MK", what: "approved the print run", when: "09:41" },
    { id: 2, who: "AR", what: "uploaded final cover art", when: "09:12" },
    { id: 1, who: "JT", what: "locked the release date", when: "08:57" },
  ];
  const pool = [
    { who: "NL", what: "left a note on page 12" },
    { who: "AR", what: "merged the errata branch" },
    { who: "MK", what: "tagged v1.2 for review" },
    { who: "JT", what: "booked the bindery slot" },
  ];
  const [items, setItems] = React.useState(seed);
  const n = React.useRef(0);
  const add = () => {
    const p = pool[n.current % pool.length];
    n.current += 1;
    setItems((cur) => [
      { id: 100 + n.current, who: p.who, what: p.what, when: "now" },
      ...cur.map((it) => ({ ...it })),
    ]);
  };
  return (
    <div className="nf nf-v10">
      <div className="nf-v10-head">
        <span className="nf-v10-live">
          <motion.span
            className="nf-v10-pulse"
            animate={instant ? undefined : { scale: [1, 1.7, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          Live
        </span>
        <motion.button type="button" className="nf-btn nf-btn-solid nf-v10-add" whileTap={{ scale: 0.94 }} transition={snappy} onClick={add}>
          {I.plus} Simulate event
        </motion.button>
      </div>
      <ol className="nf-v10-list" aria-label="Activity">
        <AnimatePresence initial={false} mode="popLayout">
          {items.slice(0, 4).map((it) => (
            <motion.li
              key={it.id}
              layout
              className="nf-v10-item"
              initial={instant ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={instant ?? gentle}
            >
              <span className="nf-v10-ava" aria-hidden="true">{it.who}</span>
              <span className="nf-v10-text">
                <b>{it.who}</b> {it.what}
              </span>
              <span className="nf-v10-when">{it.when}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}

/* ================================================================
   PAGINATION (v11 - v15)
   ================================================================ */

/* v11 - Sliding window numbers with a springing thumb */
export function NavFlowV11() {
  const instant = useInstant();
  const uid = React.useId();
  const total = 12;
  const [page, setPage] = React.useState(4);
  const window = React.useMemo(() => {
    const out: number[] = [];
    const start = Math.max(1, Math.min(page - 2, total - 4));
    for (let n = start; n <= Math.min(total, start + 4); n++) out.push(n);
    return out;
  }, [page]);
  return (
    <nav
      className="nf nf-v11"
      aria-label="Results pages"
      onKeyDown={(e) => onArrows(e, () => setPage(Math.max(1, page - 1)), () => setPage(Math.min(total, page + 1)))}
    >
      <div className="nf-v11-row">
        <motion.button
          type="button"
          className="nf-v11-edge"
          aria-label="Previous page"
          disabled={page === 1}
          whileTap={{ scale: 0.9 }}
          transition={snappy}
          onClick={() => setPage(Math.max(1, page - 1))}
        >
          {I.chevL}
        </motion.button>
        {window[0] > 1 && (
          <>
            <PageNum n={1} page={page} setPage={setPage} uid={uid} instant={instant} />
            <span className="nf-v11-gap" aria-hidden="true">{I.dots}</span>
          </>
        )}
        {window.map((n) => (
          <PageNum key={n} n={n} page={page} setPage={setPage} uid={uid} instant={instant} />
        ))}
        {window[window.length - 1] < total && (
          <>
            <span className="nf-v11-gap" aria-hidden="true">{I.dots}</span>
            <PageNum n={total} page={page} setPage={setPage} uid={uid} instant={instant} />
          </>
        )}
        <motion.button
          type="button"
          className="nf-v11-edge"
          aria-label="Next page"
          disabled={page === total}
          whileTap={{ scale: 0.9 }}
          transition={snappy}
          onClick={() => setPage(Math.min(total, page + 1))}
        >
          {I.chevR}
        </motion.button>
      </div>
      <p className="nf-v11-cap">
        Page {page} of {total} · 240 results
      </p>
    </nav>
  );
}

function PageNum({
  n,
  page,
  setPage,
  uid,
  instant,
}: {
  n: number;
  page: number;
  setPage: (n: number) => void;
  uid: string;
  instant: Transition | null;
}) {
  const active = n === page;
  return (
    <button
      type="button"
      className={cx("nf-v11-num", active && "on")}
      aria-label={`Page ${n}`}
      aria-current={active ? "page" : undefined}
      onClick={() => setPage(n)}
    >
      {active && (
        <motion.span
          className="nf-v11-thumb"
          layoutId={`nf-v11-thumb-${uid}`}
          transition={instant ?? snappy}
        />
      )}
      <span className="nf-v11-n">{n}</span>
    </button>
  );
}

/* v12 - Stretchy dots on a dark strip */
export function NavFlowV12() {
  const instant = useInstant();
  const uid = React.useId();
  const total = 7;
  const [page, setPage] = React.useState(2);
  return (
    <nav
      className="nf nf-v12"
      aria-label="Gallery pages"
      onKeyDown={(e) => onArrows(e, () => setPage(Math.max(0, page - 1)), () => setPage(Math.min(total - 1, page + 1)))}
    >
      <motion.button
        type="button"
        className="nf-v12-arrow"
        aria-label="Previous"
        whileTap={{ scale: 0.88 }}
        transition={snappy}
        onClick={() => setPage(Math.max(0, page - 1))}
      >
        {I.chevL}
      </motion.button>
      <div className="nf-v12-dots">
        {Array.from({ length: total }, (_, k) => (
          <button
            key={k}
            type="button"
            className="nf-v12-dotbtn"
            aria-label={`Slide ${k + 1}`}
            aria-current={k === page ? "page" : undefined}
            onClick={() => setPage(k)}
          >
            {k === page ? (
              <motion.span
                className="nf-v12-active"
                layoutId={`nf-v12-active-${uid}`}
                transition={instant ?? bouncy}
              />
            ) : (
              <span className="nf-v12-dot" />
            )}
          </button>
        ))}
      </div>
      <motion.button
        type="button"
        className="nf-v12-arrow"
        aria-label="Next"
        whileTap={{ scale: 0.88 }}
        transition={snappy}
        onClick={() => setPage(Math.min(total - 1, page + 1))}
      >
        {I.chevR}
      </motion.button>
    </nav>
  );
}

/* v13 - Flipping folio numbers over a hairline */
export function NavFlowV13() {
  const instant = useInstant();
  const total = 12;
  const [page, setPage] = React.useState(3);
  const dir = React.useRef(1);
  const set = (n: number) => {
    dir.current = n > page ? 1 : -1;
    setPage(Math.min(total, Math.max(1, n)));
  };
  return (
    <nav className="nf nf-v13" aria-label="Article pages">
      <motion.button type="button" className="nf-v13-side" aria-label="Previous page" whileTap={{ scale: 0.92 }} transition={snappy} onClick={() => set(page - 1)}>
        {I.chevL}
      </motion.button>
      <div className="nf-v13-mid">
        <div className="nf-v13-folio" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
            <motion.span
              key={page}
              custom={dir.current}
              initial={instant ? { opacity: 0 } : { opacity: 0, y: 26 * dir.current }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, y: -26 * dir.current }}
              transition={instant ?? gentle}
            >
              {String(page).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="nf-v13-of">/ {String(total).padStart(2, "0")}</span>
        </div>
        <div className="nf-v13-hairline" aria-hidden="true">
          <motion.span
            animate={{ width: `${(page / total) * 100}%` }}
            transition={instant ?? gentle}
          />
        </div>
      </div>
      <motion.button type="button" className="nf-v13-side" aria-label="Next page" whileTap={{ scale: 0.92 }} transition={snappy} onClick={() => set(page + 1)}>
        {I.chevR}
      </motion.button>
    </nav>
  );
}

/* v14 - Named chapters that fill as you advance */
export function NavFlowV14() {
  const instant = useInstant();
  const chapters = ["Intro", "Setup", "Build", "Ship"];
  const [page, setPage] = React.useState(1);
  return (
    <nav
      className="nf nf-v14"
      aria-label="Guide chapters"
      onKeyDown={(e) => onArrows(e, () => setPage(Math.max(0, page - 1)), () => setPage(Math.min(chapters.length - 1, page + 1)))}
    >
      <div className="nf-v14-chapters">
        {chapters.map((c, k) => (
          <button
            key={c}
            type="button"
            className={cx("nf-v14-ch", k === page && "on")}
            aria-current={k === page ? "page" : undefined}
            onClick={() => setPage(k)}
          >
            <span className="nf-v14-bar" aria-hidden="true">
              <motion.span
                animate={{ scaleX: k < page ? 1 : k === page ? 0.5 : 0 }}
                transition={instant ?? gentle}
              />
            </span>
            <span className="nf-v14-name">{c}</span>
            <span className="nf-v14-idx">0{k + 1}</span>
          </button>
        ))}
      </div>
      <div className="nf-v14-foot">
        <span>
          Reading <b>{chapters[page]}</b>
        </span>
        <span className="nf-v14-arrows">
          <motion.button type="button" aria-label="Previous chapter" whileTap={{ scale: 0.9 }} transition={snappy} disabled={page === 0} onClick={() => setPage(page - 1)}>
            {I.chevL}
          </motion.button>
          <motion.button type="button" aria-label="Next chapter" whileTap={{ scale: 0.9 }} transition={snappy} disabled={page === chapters.length - 1} onClick={() => setPage(page + 1)}>
            {I.chevR}
          </motion.button>
        </span>
      </div>
    </nav>
  );
}

/* v15 - Load-more with a progress ring and incoming cards */
export function NavFlowV15() {
  const instant = useInstant();
  const total = 16;
  const [shown, setShown] = React.useState(4);
  const [busy, setBusy] = React.useState(false);
  const done = shown >= total;
  const load = () => {
    if (busy || done) return;
    setBusy(true);
    window.setTimeout(() => {
      setShown((s) => Math.min(total, s + 4));
      setBusy(false);
    }, 700);
  };
  return (
    <div className="nf nf-v15">
      <div className="nf-v15-grid">
        <AnimatePresence initial={false}>
          {Array.from({ length: shown }, (_, k) => (
            <motion.div
              key={k}
              className="nf-v15-card"
              initial={instant ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...(instant ?? gentle), delay: instant ? 0 : (k % 4) * 0.05 }}
            >
              <span className="nf-v15-art" aria-hidden="true">{String.fromCharCode(65 + (k % 26))}</span>
              <span className="nf-v15-t">Print {k + 1}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="nf-v15-foot">
        <span className="nf-v15-count" aria-live="polite">
          Showing {shown} of {total}
        </span>
        {done ? (
          <span className="nf-v15-done">{I.check} All caught up</span>
        ) : (
          <motion.button
            type="button"
            className="nf-btn nf-btn-solid nf-v15-load"
            whileTap={{ scale: 0.95 }}
            transition={snappy}
            onClick={load}
            disabled={busy}
          >
            <svg viewBox="0 0 20 20" className="nf-v15-ring" aria-hidden="true">
              <circle cx="10" cy="10" r="7" className="nf-v15-ringbg" />
              <motion.circle
                cx="10"
                cy="10"
                r="7"
                className="nf-v15-ringfg"
                strokeDasharray={2 * Math.PI * 7}
                animate={{ strokeDashoffset: 2 * Math.PI * 7 * (1 - shown / total) }}
                transition={instant ?? gentle}
              />
            </svg>
            {busy ? "Loading" : "Load more"}
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   BREADCRUMBS (v16 - v20)
   ================================================================ */

const TRAIL = ["Home", "Library", "Components", "Navigation", "Breadcrumbs"];

/* v16 - Chevron trail that collapses to an ellipsis */
export function NavFlowV16() {
  const instant = useInstant();
  const [expanded, setExpanded] = React.useState(false);
  const shown = expanded ? TRAIL : [TRAIL[0], null, ...TRAIL.slice(-2)];
  return (
    <nav className="nf nf-v16" aria-label="Breadcrumb">
      <ol className="nf-v16-list">
        {shown.map((item, k) =>
          item === null ? (
            <li key="gap" className="nf-v16-item">
              <motion.button
                type="button"
                className="nf-v16-ellipsis"
                aria-label="Show full path"
                whileTap={{ scale: 0.9 }}
                transition={snappy}
                onClick={() => setExpanded(true)}
              >
                {I.dots}
              </motion.button>
              <span className="nf-v16-sep" aria-hidden="true">{I.chevR}</span>
            </li>
          ) : (
            <motion.li
              key={item}
              className="nf-v16-item"
              initial={instant ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...(instant ?? gentle), delay: instant ? 0 : k * 0.05 }}
            >
              {k === shown.length - 1 ? (
                <span className="nf-v16-current" aria-current="page">{item}</span>
              ) : (
                <>
                  <a href="#" className="nf-v16-link" onClick={(e) => e.preventDefault()}>
                    {k === 0 && <span className="nf-v16-home" aria-hidden="true">{I.home}</span>}
                    {item}
                    <span className="nf-v16-under" aria-hidden="true" />
                  </a>
                  <span className="nf-v16-sep" aria-hidden="true">{I.chevR}</span>
                </>
              )}
            </motion.li>
          )
        )}
      </ol>
    </nav>
  );
}

/* v17 - Folder tabs that jostle forward when active */
export function NavFlowV17() {
  const instant = useInstant();
  const trail = ["Desk", "Projects", "Orbit Press", "Print run"];
  const [at, setAt] = React.useState(2);
  return (
    <nav className="nf nf-v17" aria-label="Breadcrumb">
      <ol className="nf-v17-list">
        {trail.map((t, k) => (
          <li key={t} style={{ zIndex: k === at ? 5 : trail.length - k }}>
            <motion.button
              type="button"
              className={cx("nf-v17-tab", k === at && "on")}
              aria-current={k === at ? "page" : undefined}
              onClick={() => setAt(k)}
              animate={k === at ? { y: -4, scale: 1.03 } : { y: 0, scale: 1 }}
              whileHover={instant ? undefined : { y: -3 }}
              transition={instant ?? bouncy}
            >
              <span className="nf-v17-ico" aria-hidden="true">{k === 0 ? I.home : I.folder}</span>
              {t}
            </motion.button>
          </li>
        ))}
      </ol>
      <p className="nf-v17-path">/ {trail.slice(0, at + 1).join(" / ")}</p>
    </nav>
  );
}

/* v18 - History pills with an overflow drawer */
export function NavFlowV18() {
  const instant = useInstant();
  const trail = ["Dashboard", "Teams", "Orbit", "Sprint 14", "Board"];
  const [open, setOpen] = React.useState(false);
  const tail = trail.slice(-3);
  const hidden = trail.slice(0, -3);
  return (
    <nav className="nf nf-v18" aria-label="Breadcrumb">
      <div className="nf-v18-bar">
        <motion.button type="button" className="nf-v18-back" aria-label="Go back" whileTap={{ scale: 0.9 }} transition={snappy}>
          {I.chevL}
        </motion.button>
        <ol className="nf-v18-list">
          <li className="nf-v18-overflow">
            <motion.button
              type="button"
              className={cx("nf-v18-pill", open && "on")}
              aria-expanded={open}
              aria-label="Earlier locations"
              whileTap={{ scale: 0.95 }}
              transition={snappy}
              onClick={() => setOpen(!open)}
            >
              {I.dots}
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.ul
                  className="nf-v18-menu"
                  initial={instant ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={instant ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
                  transition={instant ?? snappy}
                >
                  {hidden.map((h, k) => (
                    <motion.li
                      key={h}
                      initial={instant ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...(instant ?? gentle), delay: instant ? 0 : k * 0.04 }}
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>{h}</a>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
          {tail.map((t, k) => (
            <li key={t}>
              {k === tail.length - 1 ? (
                <span className="nf-v18-pill nf-v18-current" aria-current="page">{t}</span>
              ) : (
                <a href="#" className="nf-v18-pill" onClick={(e) => e.preventDefault()}>{t}</a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/* v19 - Arrow segments, a process trail */
export function NavFlowV19() {
  const instant = useInstant();
  const trail = ["Cart", "Details", "Shipping", "Payment"];
  const [at, setAt] = React.useState(2);
  return (
    <nav className="nf nf-v19" aria-label="Breadcrumb">
      <ol className="nf-v19-list">
        {trail.map((t, k) => (
          <motion.li
            key={t}
            initial={instant ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...(instant ?? gentle), delay: instant ? 0 : k * 0.06 }}
          >
            <motion.button
              type="button"
              className={cx("nf-v19-seg", k < at && "past", k === at && "on")}
              aria-current={k === at ? "page" : undefined}
              onClick={() => setAt(k)}
              whileTap={{ scale: 0.97 }}
              transition={snappy}
            >
              {k < at && <span className="nf-v19-check" aria-hidden="true">{I.check}</span>}
              {t}
            </motion.button>
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}

/* v20 - Route: pins on a dashed map line */
export function NavFlowV20() {
  const instant = useInstant();
  const trail = [
    { t: "Depot", icon: I.home },
    { t: "Hub East", icon: I.box },
    { t: "Crossdock", icon: I.truck },
    { t: "You", icon: I.pin },
  ];
  const [at, setAt] = React.useState(2);
  return (
    <nav className="nf nf-v20" aria-label="Breadcrumb">
      <div className="nf-v20-map">
        <svg className="nf-v20-route" viewBox="0 0 400 60" aria-hidden="true" preserveAspectRatio="none">
          <motion.path
            d="M14 40 C 110 10, 150 54, 200 34 S 300 16, 386 30"
            fill="none"
            initial={instant ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={instant ?? { duration: 1.4, ease: "easeInOut" }}
          />
        </svg>
        <ol className="nf-v20-stops">
          {trail.map((t, k) => (
            <li key={t.t}>
              <motion.button
                type="button"
                className={cx("nf-v20-stop", k === at && "on", k < at && "past")}
                aria-current={k === at ? "page" : undefined}
                onClick={() => setAt(k)}
                animate={k === at && !instant ? { y: [0, -7, 0] } : { y: 0 }}
                transition={k === at && !instant ? { ...bouncy, delay: 0.1 } : gentle}
                key={`s${k}-${k === at}`}
              >
                <span className="nf-v20-pin">{t.icon}</span>
                <span className="nf-v20-name">{t.t}</span>
              </motion.button>
            </li>
          ))}
        </ol>
        <span className="nf-v20-compass" aria-hidden="true">{I.compass}</span>
      </div>
    </nav>
  );
}

/* ================================================================
   TAB-ADJACENT NAV (v21 - v25)
   ================================================================ */

/* v21 - Ink underline top nav */
export function NavFlowV21() {
  const instant = useInstant();
  const uid = React.useId();
  const items = ["Product", "Docs", "Pricing", "Journal"];
  const [at, setAt] = React.useState(0);
  return (
    <nav
      className="nf nf-v21"
      aria-label="Site"
      onKeyDown={(e) => onArrows(e, () => setAt(Math.max(0, at - 1)), () => setAt(Math.min(items.length - 1, at + 1)))}
    >
      <div className="nf-v21-bar">
        <span className="nf-v21-logo" aria-hidden="true" />
        <ul className="nf-v21-list">
          {items.map((t, k) => (
            <li key={t}>
              <button
                type="button"
                className={cx("nf-v21-link", k === at && "on")}
                aria-current={k === at ? "page" : undefined}
                onClick={() => setAt(k)}
              >
                {t}
                {k === at && (
                  <motion.span
                    className="nf-v21-ink"
                    layoutId={`nf-v21-ink-${uid}`}
                    transition={instant ?? snappy}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
        <span className="nf-v21-cta">Sign in</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={at}
          className="nf-v21-page"
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={instant ?? gentle}
        >
          The <b>{items[at]}</b> page loads here.
        </motion.p>
      </AnimatePresence>
    </nav>
  );
}

/* v22 - Segmented view switcher with a live preview */
export function NavFlowV22() {
  const instant = useInstant();
  const uid = React.useId();
  const views = [
    { t: "Grid", icon: I.grid },
    { t: "List", icon: I.list },
    { t: "Board", icon: I.layers },
  ];
  const [at, setAt] = React.useState(0);
  return (
    <div
      className="nf nf-v22"
      onKeyDown={(e) => onArrows(e, () => setAt(Math.max(0, at - 1)), () => setAt(Math.min(views.length - 1, at + 1)))}
    >
      <div className="nf-v22-seg" role="tablist" aria-label="View">
        {views.map((v, k) => (
          <button
            key={v.t}
            type="button"
            role="tab"
            aria-selected={k === at}
            className={cx("nf-v22-opt", k === at && "on")}
            onClick={() => setAt(k)}
          >
            {k === at && (
              <motion.span
                className="nf-v22-thumb"
                layoutId={`nf-v22-thumb-${uid}`}
                transition={instant ?? snappy}
              />
            )}
            <span className="nf-v22-ico" aria-hidden="true">{v.icon}</span>
            <span className="nf-v22-text">{v.t}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={at}
          className={cx("nf-v22-preview", `as-${views[at].t.toLowerCase()}`)}
          initial={instant ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          transition={instant ?? gentle}
          aria-hidden="true"
        >
          {at === 0 && (
            <div className="nf-v22-gridview">
              {Array.from({ length: 6 }, (_, k) => <span key={k} />)}
            </div>
          )}
          {at === 1 && (
            <div className="nf-v22-listview">
              {Array.from({ length: 3 }, (_, k) => (
                <span key={k}><i /><b /></span>
              ))}
            </div>
          )}
          {at === 2 && (
            <div className="nf-v22-boardview">
              {Array.from({ length: 3 }, (_, k) => (
                <span key={k}><i /><i /><i /></span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* v23 - Vertical rail nav with badges and a sliding notch */
export function NavFlowV23() {
  const instant = useInstant();
  const uid = React.useId();
  const groups = [
    {
      label: "Main",
      items: [
        { t: "Overview", icon: I.home, badge: 0 },
        { t: "Inbox", icon: I.inbox, badge: 4 },
        { t: "Calendar", icon: I.cal, badge: 0 },
      ],
    },
    {
      label: "Workspace",
      items: [
        { t: "Reports", icon: I.chart, badge: 0 },
        { t: "Files", icon: I.folder, badge: 12 },
        { t: "Settings", icon: I.settings, badge: 0 },
      ],
    },
  ];
  const flat = groups.flatMap((g) => g.items);
  const [at, setAt] = React.useState(1);
  return (
    <Frame label="studio.app" dark>
      <div className="nf-v23-wrap">
        <nav className="nf nf-v23" aria-label="Workspace">
          {groups.map((g) => (
            <div key={g.label} className="nf-v23-group">
              <p className="nf-v23-label">{g.label}</p>
              <ul>
                {g.items.map((it) => {
                  const k = flat.indexOf(it);
                  return (
                    <li key={it.t}>
                      <button
                        type="button"
                        className={cx("nf-v23-item", k === at && "on")}
                        aria-current={k === at ? "page" : undefined}
                        onClick={() => setAt(k)}
                      >
                        {k === at && (
                          <motion.span
                            className="nf-v23-notch"
                            layoutId={`nf-v23-notch-${uid}`}
                            transition={instant ?? snappy}
                          />
                        )}
                        <span className="nf-v23-ico" aria-hidden="true">{it.icon}</span>
                        <span className="nf-v23-t">{it.t}</span>
                        {it.badge > 0 && <span className="nf-v23-badge">{it.badge}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="nf-v23-content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={at}
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={instant ?? gentle}
            >
              <h3>{flat[at].t}</h3>
              <p>Panel for {flat[at].t.toLowerCase()} renders in this region.</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Frame>
  );
}

/* v24 - Scrollable pill strip with edge fades */
export function NavFlowV24() {
  const instant = useInstant();
  const uid = React.useId();
  const cats = ["All", "Print", "Packaging", "Identity", "Web", "Motion", "3D", "Type"];
  const [at, setAt] = React.useState(0);
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 160, behavior: instant ? "auto" : "smooth" });
  };
  return (
    <nav className="nf nf-v24" aria-label="Categories">
      <motion.button type="button" className="nf-v24-arrow" aria-label="Scroll left" whileTap={{ scale: 0.9 }} transition={snappy} onClick={() => scrollBy(-1)}>
        {I.chevL}
      </motion.button>
      <div className="nf-v24-mask">
        <div className="nf-v24-strip" ref={scroller} role="tablist" aria-label="Work categories">
          {cats.map((c, k) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={k === at}
              className={cx("nf-v24-pill", k === at && "on")}
              onClick={() => setAt(k)}
            >
              {k === at && (
                <motion.span
                  className="nf-v24-fill"
                  layoutId={`nf-v24-fill-${uid}`}
                  transition={instant ?? snappy}
                />
              )}
              <span className="nf-v24-t">{c}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.button type="button" className="nf-v24-arrow" aria-label="Scroll right" whileTap={{ scale: 0.9 }} transition={snappy} onClick={() => scrollBy(1)}>
        {I.chevR}
      </motion.button>
    </nav>
  );
}

/* v25 - Dock: icons magnify near the pointer */
export function NavFlowV25() {
  const instant = useInstant();
  const apps = [
    { t: "Finder", icon: I.compass },
    { t: "Mail", icon: I.mail },
    { t: "Notes", icon: I.doc },
    { t: "Photos", icon: I.star },
    { t: "Music", icon: I.zap },
    { t: "Terminal", icon: I.box },
  ];
  const [at, setAt] = React.useState(0);
  const [hover, setHover] = React.useState<number | null>(null);
  const [prox, setProx] = React.useState(0.5);
  return (
    <Frame label="dock.demo" dark>
      <div className="nf-v25-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={at}
            className="nf-v25-open"
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={instant ?? gentle}
          >
            {apps[at].t} is open
          </motion.p>
        </AnimatePresence>
        <nav
          className="nf nf-v25"
          aria-label="Applications"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setProx((e.clientX - r.left) / r.width);
          }}
          onMouseLeave={() => setHover(null)}
        >
          {apps.map((a, k) => {
            const center = (k + 0.5) / apps.length;
            const dist = hover === null ? 1 : Math.abs(prox - center) * apps.length;
            const scale = hover === null ? 1 : 1 + Math.max(0, 0.55 * (1 - dist / 1.6));
            return (
              <motion.button
                key={a.t}
                type="button"
                className={cx("nf-v25-app", k === at && "on")}
                aria-label={a.t}
                aria-current={k === at ? "page" : undefined}
                onMouseEnter={() => setHover(k)}
                onClick={() => setAt(k)}
                animate={{ scale, y: hover === null ? 0 : -(scale - 1) * 26 }}
                transition={instant ?? stiff}
              >
                <span className="nf-v25-ico">{a.icon}</span>
                <AnimatePresence>
                  {hover === k && (
                    <motion.span
                      className="nf-v25-tip"
                      initial={instant ? { opacity: 0 } : { opacity: 0, y: 6, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={instant ? { opacity: 0 } : { opacity: 0, y: 6, x: "-50%" }}
                      transition={instant ?? gentle}
                    >
                      {a.t}
                    </motion.span>
                  )}
                </AnimatePresence>
                {k === at && <span className="nf-v25-dot" aria-hidden="true" />}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </Frame>
  );
}

/* ================================================================
   SIDEBARS (v26 - v30)
   ================================================================ */

const SIDE_MAIN = [
  { t: "Dashboard", icon: I.home },
  { t: "Projects", icon: I.folder },
  { t: "Messages", icon: I.mail },
  { t: "Analytics", icon: I.chart },
];

/* v26 - Collapsible rail: 64px to 224px with a spring */
export function NavFlowV26() {
  const instant = useInstant();
  const [open, setOpen] = React.useState(false);
  const [at, setAt] = React.useState(1);
  return (
    <Frame label="atlas.app">
      <div className="nf-v26-wrap">
        <motion.aside
          className={cx("nf nf-v26", open && "open")}
          animate={{ width: open ? 224 : 64 }}
          transition={instant ?? snappy}
          aria-label="Primary"
        >
          <button
            type="button"
            className="nf-v26-toggle"
            aria-expanded={open}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setOpen(!open)}
          >
            {I.panelL}
          </button>
          <ul className="nf-v26-list">
            {SIDE_MAIN.map((it, k) => (
              <li key={it.t}>
                <button
                  type="button"
                  className={cx("nf-v26-item", k === at && "on")}
                  aria-current={k === at ? "page" : undefined}
                  onClick={() => setAt(k)}
                >
                  <span className="nf-v26-ico" aria-hidden="true">{it.icon}</span>
                  <motion.span
                    className="nf-v26-t"
                    animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
                    transition={instant ?? gentle}
                  >
                    {it.t}
                  </motion.span>
                </button>
              </li>
            ))}
          </ul>
          <div className="nf-v26-user">
            <span className="nf-v26-ava" aria-hidden="true">B</span>
            <motion.span
              className="nf-v26-uname"
              animate={{ opacity: open ? 1 : 0 }}
              transition={instant ?? gentle}
            >
              bandi
            </motion.span>
          </div>
        </motion.aside>
        <div className="nf-v26-content">
          <h3>{SIDE_MAIN[at].t}</h3>
          <p>The rail {open ? "is expanded. Click the panel icon to collapse it." : "is collapsed. Click the panel icon to expand it."}</p>
        </div>
      </div>
    </Frame>
  );
}

/* v27 - Drawer over content with a backdrop */
export function NavFlowV27() {
  const instant = useInstant();
  const [open, setOpen] = React.useState(false);
  const [at, setAt] = React.useState(0);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const openerRef = React.useRef<HTMLButtonElement>(null);
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) openerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const buttons = dialog?.querySelectorAll<HTMLButtonElement>('button');
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);
  return (
    <Frame label="fieldnotes.blog">
      <div className="nf-v27-wrap">
        <div className="nf-v27-topbar">
          <motion.button
            type="button"
            ref={openerRef}
            className="nf-v27-burger"
            aria-label="Open menu"
            aria-expanded={open}
            whileTap={{ scale: 0.9 }}
            transition={snappy}
            onClick={() => setOpen(true)}
          >
            {I.menu}
          </motion.button>
          <span className="nf-v27-brand">Fieldnotes</span>
        </div>
        <div className="nf-v27-content">
          <h3>{SIDE_MAIN[at].t}</h3>
          <p>Open the drawer to move between sections.</p>
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="nf-v27-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={instant ?? { duration: 0.2 }}
                onClick={() => setOpen(false)}
              />
              <motion.aside
                className="nf nf-v27"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                initial={instant ? { opacity: 0 } : { x: "-104%" }}
                animate={instant ? { opacity: 1 } : { x: 0 }}
                exit={instant ? { opacity: 0 } : { x: "-104%" }}
                transition={instant ?? snappy}
              >
                <div className="nf-v27-head">
                  <span>Fieldnotes</span>
                  <button ref={closeRef} type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                    {I.x}
                  </button>
                </div>
                <ul>
                  {SIDE_MAIN.map((it, k) => (
                    <motion.li
                      key={it.t}
                      initial={instant ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...(instant ?? gentle), delay: instant ? 0 : 0.06 + k * 0.05 }}
                    >
                      <button
                        type="button"
                        className={cx("nf-v27-item", k === at && "on")}
                        aria-current={k === at ? "page" : undefined}
                        onClick={() => {
                          setAt(k);
                          setOpen(false);
                        }}
                      >
                        <span aria-hidden="true">{it.icon}</span>
                        {it.t}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* v28 - Tree sidebar: groups fold and unfold */
export function NavFlowV28() {
  const instant = useInstant();
  const uid = React.useId();
  const tree = [
    { g: "Foundations", items: ["Color", "Type", "Spacing"] },
    { g: "Components", items: ["Buttons", "Inputs", "Navigation"] },
    { g: "Patterns", items: ["Empty states", "Loading"] },
  ];
  const [open, setOpen] = React.useState<Record<string, boolean>>({ Foundations: false, Components: true, Patterns: false });
  const [at, setAt] = React.useState("Buttons");
  return (
    <Frame label="design-system">
      <div className="nf-v28-wrap">
        <nav className="nf nf-v28" aria-label="System docs">
          {tree.map((node) => (
            <div key={node.g} className="nf-v28-group">
              <button
                type="button"
                className="nf-v28-grow"
                aria-expanded={!!open[node.g]}
                onClick={() => setOpen((o) => ({ ...o, [node.g]: !o[node.g] }))}
              >
                <motion.span
                  className="nf-v28-chev"
                  animate={{ rotate: open[node.g] ? 90 : 0 }}
                  transition={instant ?? gentle}
                  aria-hidden="true"
                >
                  {I.chevR}
                </motion.span>
                {node.g}
              </button>
              <AnimatePresence initial={false}>
                {open[node.g] && (
                  <motion.ul
                    initial={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    animate={instant ? { height: "auto" } : { height: "auto", opacity: 1 }}
                    exit={instant ? { height: 0 } : { height: 0, opacity: 0 }}
                    transition={instant ?? gentle}
                  >
                    {node.items.map((it, k) => (
                      <motion.li
                        key={it}
                        initial={instant ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...(instant ?? gentle), delay: instant ? 0 : k * 0.04 }}
                      >
                        <button
                          type="button"
                          className={cx("nf-v28-leaf", at === it && "on")}
                          aria-current={at === it ? "page" : undefined}
                          onClick={() => setAt(it)}
                        >
                          {at === it && (
                            <motion.span
                              className="nf-v28-pillbg"
                              layoutId={`nf-v28-pill-${uid}`}
                              transition={instant ?? snappy}
                            />
                          )}
                          <span className="nf-v28-leaft">{it}</span>
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
        <div className="nf-v28-content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h3
              key={at}
              initial={instant ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={instant ?? gentle}
            >
              {at}
            </motion.h3>
          </AnimatePresence>
        </div>
      </div>
    </Frame>
  );
}

/* v29 - Command sidebar: type to filter, kbd hints */
export function NavFlowV29() {
  const instant = useInstant();
  const all = [
    { t: "New document", icon: I.doc, kbd: "N" },
    { t: "Search vault", icon: I.search, kbd: "F" },
    { t: "Starred", icon: I.star, kbd: "S" },
    { t: "Shared with me", icon: I.user, kbd: "H" },
    { t: "Trash", icon: I.x, kbd: "T" },
    { t: "Settings", icon: I.settings, kbd: "," },
  ];
  const [q, setQ] = React.useState("");
  const [at, setAt] = React.useState(0);
  const list = all.filter((a) => a.t.toLowerCase().includes(q.toLowerCase()));
  return (
    <Frame label="vault.app" dark>
      <div className="nf-v29-wrap">
        <nav className="nf nf-v29" aria-label="Vault">
          <label className="nf-v29-search">
            <span aria-hidden="true">{I.search}</span>
            <input
              type="text"
              placeholder="Filter actions"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setAt(0);
              }}
              aria-label="Filter actions"
            />
            <kbd>⌘K</kbd>
          </label>
          <ul className="nf-v29-list">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((a, k) => (
                <motion.li
                  key={a.t}
                  layout
                  initial={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={instant ?? gentle}
                >
                  <button
                    type="button"
                    className={cx("nf-v29-item", k === at && "on")}
                    onClick={() => setAt(k)}
                  >
                    <span className="nf-v29-ico" aria-hidden="true">{a.icon}</span>
                    <span className="nf-v29-t">{a.t}</span>
                    <kbd>{a.kbd}</kbd>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {list.length === 0 && <li className="nf-v29-empty">No actions match</li>}
          </ul>
        </nav>
        <div className="nf-v29-content">
          <h3>{list.length ? list[Math.min(at, list.length - 1)].t : "Nothing here"}</h3>
          <p>Type in the filter to thin the list.</p>
        </div>
      </div>
    </Frame>
  );
}

/* v30 - Dual sidebar: icon column plus a sliding panel */
export function NavFlowV30() {
  const instant = useInstant();
  const uid = React.useId();
  const sections = [
    { t: "Spaces", icon: I.globe, items: ["orbit-press", "fieldnotes", "studio-kl"] },
    { t: "Chats", icon: I.mail, items: ["mira", "print-vendor", "family"] },
    { t: "Files", icon: I.folder, items: ["contracts", "covers", "invoices"] },
    { t: "Admin", icon: I.settings, items: ["members", "billing", "audit"] },
  ];
  const [sec, setSec] = React.useState(0);
  const [item, setItem] = React.useState(0);
  const dir = React.useRef(1);
  return (
    <Frame label="relay.chat" dark>
      <div className="nf-v30-wrap">
        <nav className="nf nf-v30-rail" aria-label="Sections">
          {sections.map((s, k) => (
            <motion.button
              key={s.t}
              type="button"
              className={cx("nf-v30-icon", k === sec && "on")}
              aria-label={s.t}
              aria-pressed={k === sec}
              whileTap={{ scale: 0.9 }}
              transition={snappy}
              onClick={() => {
                dir.current = k > sec ? 1 : -1;
                setSec(k);
                setItem(0);
              }}
            >
              {s.icon}
              {k === sec && (
                <motion.span className="nf-v30-pip" layoutId={`nf-v30-pip-${uid}`} transition={instant ?? snappy} aria-hidden="true" />
              )}
            </motion.button>
          ))}
        </nav>
        <div className="nf-v30-panel">
          <AnimatePresence mode="wait" initial={false} custom={dir.current}>
            <motion.nav
              key={sec}
              className="nf nf-v30-list"
              aria-label={sections[sec].t}
              custom={dir.current}
              initial={instant ? { opacity: 0 } : { opacity: 0, x: 26 * dir.current }}
              animate={{ opacity: 1, x: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, x: -26 * dir.current }}
              transition={instant ?? gentle}
            >
              <p className="nf-v30-label">{sections[sec].t}</p>
              <ul>
                {sections[sec].items.map((it, k) => (
                  <li key={it}>
                    <button
                      type="button"
                      className={cx("nf-v30-item", k === item && "on")}
                      aria-current={k === item ? "page" : undefined}
                      onClick={() => setItem(k)}
                    >
                      <span className="nf-v30-hashsym" aria-hidden="true">#</span>
                      {it}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </AnimatePresence>
        </div>
        <div className="nf-v30-content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h3
              key={`${sec}-${item}`}
              initial={instant ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={instant ?? gentle}
            >
              #{sections[sec].items[item]}
            </motion.h3>
          </AnimatePresence>
        </div>
      </div>
    </Frame>
  );
}

/* ================================================================
   REGISTRY
   ================================================================ */

export const NAV_FLOW: Array<{
  name: string;
  label: string;
  kind: string;
  wide?: boolean;
  Component: React.ComponentType;
}> = [
  { name: "v01", label: "Rail stepper", kind: "Stepper", Component: NavFlowV01 },
  { name: "v02", label: "Journal stepper", kind: "Stepper", Component: NavFlowV02 },
  { name: "v03", label: "Pulse dots", kind: "Stepper", Component: NavFlowV03 },
  { name: "v04", label: "Chapter segments", kind: "Stepper", Component: NavFlowV04 },
  { name: "v05", label: "Ring stepper", kind: "Stepper", Component: NavFlowV05 },
  { name: "v06", label: "Alternating road", kind: "Timeline", Component: NavFlowV06 },
  { name: "v07", label: "Scrub timeline", kind: "Timeline", wide: true, Component: NavFlowV07 },
  { name: "v08", label: "Commit graph", kind: "Timeline", Component: NavFlowV08 },
  { name: "v09", label: "Pennant line", kind: "Timeline", wide: true, Component: NavFlowV09 },
  { name: "v10", label: "Live feed", kind: "Timeline", Component: NavFlowV10 },
  { name: "v11", label: "Window pager", kind: "Pagination", Component: NavFlowV11 },
  { name: "v12", label: "Stretch dots", kind: "Pagination", Component: NavFlowV12 },
  { name: "v13", label: "Folio flip", kind: "Pagination", Component: NavFlowV13 },
  { name: "v14", label: "Chapter bar", kind: "Pagination", wide: true, Component: NavFlowV14 },
  { name: "v15", label: "Load more ring", kind: "Pagination", Component: NavFlowV15 },
  { name: "v16", label: "Chevron trail", kind: "Breadcrumb", Component: NavFlowV16 },
  { name: "v17", label: "Folder tabs", kind: "Breadcrumb", Component: NavFlowV17 },
  { name: "v18", label: "History pills", kind: "Breadcrumb", Component: NavFlowV18 },
  { name: "v19", label: "Arrow trail", kind: "Breadcrumb", Component: NavFlowV19 },
  { name: "v20", label: "Route map", kind: "Breadcrumb", wide: true, Component: NavFlowV20 },
  { name: "v21", label: "Ink underline", kind: "Tab nav", wide: true, Component: NavFlowV21 },
  { name: "v22", label: "View segments", kind: "Tab nav", Component: NavFlowV22 },
  { name: "v23", label: "Notch rail", kind: "Tab nav", wide: true, Component: NavFlowV23 },
  { name: "v24", label: "Pill strip", kind: "Tab nav", Component: NavFlowV24 },
  { name: "v25", label: "Magnify dock", kind: "Tab nav", wide: true, Component: NavFlowV25 },
  { name: "v26", label: "Collapse rail", kind: "Sidebar", wide: true, Component: NavFlowV26 },
  { name: "v27", label: "Overlay drawer", kind: "Sidebar", wide: true, Component: NavFlowV27 },
  { name: "v28", label: "Tree sidebar", kind: "Sidebar", wide: true, Component: NavFlowV28 },
  { name: "v29", label: "Command filter", kind: "Sidebar", wide: true, Component: NavFlowV29 },
  { name: "v30", label: "Dual sidebar", kind: "Sidebar", wide: true, Component: NavFlowV30 },
];
