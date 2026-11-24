"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Reorder,
  useDragControls,
} from "framer-motion";
import "./AccordionFamily.css";

/* ================================================================
   AccordionFamily - 30 accordion & list variants for GOAT UI.
   Every variant has its own mechanic; springs drive all motion.
   Reduced motion: every spring collapses to an instant state.
   ================================================================ */

const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 32 } as const;
const SPRING_SNAP = { type: "spring", stiffness: 520, damping: 34 } as const;
const SPRING_LOOSE = { type: "spring", stiffness: 180, damping: 22 } as const;

function useT() {
  const reduced = useReducedMotion();
  return React.useCallback(
    (t: object) => (reduced ? { duration: 0 } : t),
    [reduced]
  );
}

/** Spring height reveal used by most vertical accordions. */
function Reveal({
  open,
  id,
  labelledBy,
  children,
  className = "",
}: {
  open: boolean;
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useT();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-labelledby={labelledBy}
          className={`af-reveal ${className}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={t(SPRING_SOFT)}
        >
          <div className="af-reveal-inner">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- inline icons (16px stroke set) ---------------- */

type IconName =
  | "chevron" | "plus" | "box" | "chart" | "chat" | "gear" | "bell"
  | "file" | "folder" | "star" | "play" | "pause" | "clock" | "check"
  | "x" | "search" | "music" | "image" | "doc" | "code" | "zip"
  | "grip" | "trash" | "archive" | "spark" | "download" | "arrow";

function I({ n, s = 16 }: { n: IconName; s?: number }) {
  const P: Record<IconName, React.ReactNode> = {
    chevron: <path d="M4 6l4 4 4-4" />,
    plus: <path d="M8 3v10M3 8h10" />,
    box: <path d="M3 5l5-2 5 2v6l-5 2-5-2V5zM3 5l5 2 5-2M8 7v6" />,
    chart: <path d="M3 13V8M8 13V3M13 13v-4" />,
    chat: <path d="M3 4h10v6H8l-3 3v-3H3V4z" />,
    gear: <circle cx="8" cy="8" r="2.2" />,
    bell: <path d="M4 10V7a4 4 0 018 0v3l1 2H3l1-2zM7 13h2" />,
    file: <path d="M4 2h5l3 3v9H4V2zM9 2v3h3" />,
    folder: <path d="M2 4h4l2 2h6v6H2V4z" />,
    star: <path d="M8 2l1.8 3.8L14 6.4l-3 3 .7 4.1L8 11.6 4.3 13.5 5 9.4 2 6.4l4.2-.6L8 2z" />,
    play: <path d="M5 3l8 5-8 5V3z" />,
    pause: <path d="M5 3h2.4v10H5zM8.6 3H11v10H8.6z" />,
    clock: <><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2.2 1.4" /></>,
    check: <path d="M3 8.5l3.4 3.4L13 5" />,
    x: <path d="M4 4l8 8M12 4l-8 8" />,
    search: <><circle cx="7" cy="7" r="4" /><path d="M10.2 10.2L14 14" /></>,
    music: <><path d="M5 12V4l8-1.5V11" /><circle cx="4" cy="12" r="1.8" /><circle cx="12" cy="10.5" r="1.8" /></>,
    image: <><rect x="2.5" y="3" width="11" height="10" rx="1" /><path d="M2.5 10.5l3-3 2.5 2.5 2-2 3.5 3.5" /><circle cx="6" cy="6" r=".9" /></>,
    doc: <path d="M4 2h5l3 3v9H4V2zM9 2v3h3M6 8h4M6 10.5h4" />,
    code: <path d="M5.5 5L3 8l2.5 3M10.5 5L13 8l-2.5 3" />,
    zip: <path d="M4 2h5l3 3v9H4V2zM9 2v3h3M8 5h.8M8 7h.8M8 9h.8M7.2 11h1.6v2H7.2z" />,
    grip: <path d="M5.5 4h.9M5.5 8h.9M5.5 12h.9M9.6 4h.9M9.6 8h.9M9.6 12h.9" />,
    trash: <path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5M6.8 7v4M9.2 7v4" />,
    archive: <><rect x="2.5" y="3" width="11" height="3" rx=".6" /><path d="M3.5 6v7h9V6M6.5 8.5h3" /></>,
    spark: <path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2.5 2.5M9.5 9.5L12 12M12 4L9.5 6.5M6.5 9.5L4 12" />,
    download: <path d="M8 2v8M5 7l3 3 3-3M3 12.5h10" />,
    arrow: <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" />,
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {P[n]}
    </svg>
  );
}

/* ================================================================
   V01 - Ledger: classic single-open accordion, spring chevron.
   ================================================================ */

const V01_ITEMS = [
  { q: "What exactly do I copy?", a: "Each variant is one self-contained component plus its CSS block. Paste both into your project and it renders - no package install, no registry, no build step changes." },
  { q: "Does it need framer-motion?", a: "The motion variants import framer-motion, the same single dependency this site already uses. Everything else is plain CSS springs." },
  { q: "Can I restyle the colors?", a: "Yes. Colors live in plain CSS custom properties at the top of each block, so a rebrand is a four-line edit, not a theme system." },
];

export function AccordionV01() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v01">
      {V01_ITEMS.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v01-item${isOpen ? " open" : ""}`} key={it.q}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v01-h${i}`}
                className="af-head af-v01-head"
                aria-expanded={isOpen}
                aria-controls={`v01-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{it.q}</span>
                <motion.span
                  className="af-v01-chev"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={t(SPRING_SNAP)}
                >
                  <I n="chevron" />
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v01-p${i}`} labelledBy={`v01-h${i}`}>
              <p className="af-body">{it.a}</p>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V02 - Dossier: outer files open to reveal a nested sub-accordion
   on an indented rail.
   ================================================================ */

const V02_DATA = [
  { name: "Brand assets", subs: [
    { t: "Logotype", d: "Primary and mono marks, SVG + PNG, clearspace rules." },
    { t: "Color", d: "Core palette tokens with contrast pairings." },
  ]},
  { name: "Product shots", subs: [
    { t: "Hero renders", d: "4K transparent renders of the three flagship SKUs." },
    { t: "Lifestyle", d: "Editorial photography cleared for web and print." },
    { t: "Icons", d: "The 24px product glyph set, stroke and filled." },
  ]},
  { name: "Legal", subs: [
    { t: "Trademark use", d: "Where the wordmark may and may not appear." },
  ]},
];

export function AccordionV02() {
  const [open, setOpen] = React.useState<number | null>(1);
  const [sub, setSub] = React.useState<string | null>(null);
  const t = useT();
  return (
    <div className="af-v02">
      {V02_DATA.map((sec, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v02-sec" key={sec.name}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v02-h${i}`}
                className="af-head af-v02-head"
                aria-expanded={isOpen}
                aria-controls={`v02-p${i}`}
                onClick={() => { setOpen(isOpen ? null : i); setSub(null); }}
              >
                <span className="af-v02-folder"><I n="folder" /></span>
                <span className="af-v02-name">{sec.name}</span>
                <span className="af-v02-count">{sec.subs.length} {sec.subs.length === 1 ? "file" : "files"}</span>
                <motion.span className="af-v02-chev" animate={{ rotate: isOpen ? 0 : -90 }} transition={t(SPRING_SNAP)}>
                  <I n="chevron" />
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v02-p${i}`} labelledBy={`v02-h${i}`}>
              <div className="af-v02-rail">
                {sec.subs.map((s, j) => {
                  const key = `${i}:${j}`;
                  const sOpen = sub === key;
                  return (
                    <div className="af-v02-sub" key={s.t}>
                      <h4 className="af-h">
                        <button
                          type="button"
                          id={`v02-h${key}`}
                          className="af-head af-v02-subhead"
                          aria-expanded={sOpen}
                          aria-controls={`v02-p${key}`}
                          onClick={() => setSub(sOpen ? null : key)}
                        >
                          <motion.span className="af-v02-dot" animate={{ scale: sOpen ? 1.5 : 1 }} transition={t(SPRING_SNAP)} />
                          <span>{s.t}</span>
                        </button>
                      </h4>
                      <Reveal open={sOpen} id={`v02-p${key}`} labelledBy={`v02-h${key}`}>
                        <p className="af-body af-v02-subbody">{s.d}</p>
                      </Reveal>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V03 - Card stack: bordered cards, opening lifts the card and
   staggers its content lines in.
   ================================================================ */

const V03_CARDS = [
  { tag: "Guide", title: "Getting set up", lines: ["Create a workspace and invite your team", "Connect the tools you already use", "Import existing docs in one pass"] },
  { tag: "Guide", title: "Billing, plainly", lines: ["Seats are priced per editor, viewers are free", "Invoices land on the 1st of each month", "Cancel anytime from workspace settings"] },
  { tag: "Reference", title: "Keyboard map", lines: ["Cmd K opens the command bar", "G then D jumps to the dashboard", "? shows every shortcut in context"] },
];

export function AccordionV03() {
  const [open, setOpen] = React.useState<Set<number>>(new Set([0]));
  const t = useT();
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  return (
    <div className="af-v03">
      {V03_CARDS.map((c, i) => {
        const isOpen = open.has(i);
        return (
          <motion.div
            className="af-v03-card"
            key={c.title}
            animate={{ y: isOpen ? -4 : 0, boxShadow: isOpen
              ? "0 20px 36px -22px rgba(46,40,28,.4)"
              : "0 6px 14px -10px rgba(46,40,28,.25)" }}
            transition={t(SPRING_SOFT)}
          >
            <h3 className="af-h">
              <button
                type="button"
                id={`v03-h${i}`}
                className="af-head af-v03-head"
                aria-expanded={isOpen}
                aria-controls={`v03-p${i}`}
                onClick={() => toggle(i)}
              >
                <span className="af-v03-tag">{c.tag}</span>
                <span className="af-v03-title">{c.title}</span>
                <motion.span className="af-v03-plus" animate={{ rotate: isOpen ? 45 : 0 }} transition={t(SPRING_SNAP)}>
                  <I n="plus" />
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v03-p${i}`} labelledBy={`v03-h${i}`}>
              <motion.ul
                className="af-v03-list"
                initial="closed"
                animate="open"
                variants={{ open: { transition: { staggerChildren: 0.06 } }, closed: {} }}
              >
                {c.lines.map((l) => (
                  <motion.li
                    key={l}
                    variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}
                    transition={t(SPRING_LOOSE)}
                  >
                    <span className="af-v03-tick"><I n="check" s={12} /></span>{l}
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V04 - Rule lines: hairline-divided minimal list, plus morphs to
   minus, index numerals in mono.
   ================================================================ */

const V04_ITEMS = [
  { n: "01", t: "Typography", d: "A single grotesk at five weights. Body copy never drops below 16px; captions are set in the mono cut." },
  { n: "02", t: "Spacing", d: "Everything sits on a 4px grid. Components declare padding in steps of four, so any two parts can sit next to each other." },
  { n: "03", t: "Motion", d: "Springs only - no linear easing anywhere. Stiffness and damping are tuned per surface, never duration-first." },
  { n: "04", t: "Color", d: "Warm paper surfaces, ink text, one brick accent. Accent is reserved for actions and live state." },
];

export function AccordionV04() {
  const [open, setOpen] = React.useState<number | null>(1);
  const t = useT();
  return (
    <div className="af-v04">
      {V04_ITEMS.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v04-row" key={it.n}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v04-h${i}`}
                className="af-head af-v04-head"
                aria-expanded={isOpen}
                aria-controls={`v04-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v04-num">{it.n}</span>
                <span className="af-v04-title">{it.t}</span>
                <span className={`af-v04-pm${isOpen ? " open" : ""}`} aria-hidden="true">
                  <motion.i animate={{ rotate: isOpen ? 180 : 90 }} transition={t(SPRING_SNAP)} />
                  <i />
                </span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v04-p${i}`} labelledBy={`v04-h${i}`}>
              <p className="af-body af-v04-body">{it.d}</p>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V05 - Stepper: numbered steps on a rail; the active circle fills
   and the connector line draws with springs.
   ================================================================ */

const V05_STEPS = [
  { t: "Sketch", d: "Rough frames on paper. Nothing leaves this stage until the flow reads in five seconds." },
  { t: "Prototype", d: "Wire the real component with placeholder data and test the spring curves early." },
  { t: "Polish", d: "Tokens, focus rings, empty states and the reduced-motion pass." },
  { t: "Ship", d: "Freeze the API, write the copy-paste snippet and archive the exploration." },
];

export function AccordionV05() {
  const [open, setOpen] = React.useState(0);
  const t = useT();
  return (
    <ol className="af-v05">
      {V05_STEPS.map((s, i) => {
        const isOpen = open === i;
        return (
          <li className="af-v05-step" key={s.t}>
            {i < V05_STEPS.length - 1 && (
              <span className="af-v05-line" aria-hidden="true">
                <motion.span
                  className="af-v05-linefill"
                  animate={{ scaleY: open > i ? 1 : 0 }}
                  transition={t(SPRING_SOFT)}
                />
              </span>
            )}
            <h3 className="af-h">
              <button
                type="button"
                id={`v05-h${i}`}
                className="af-head af-v05-head"
                aria-expanded={isOpen}
                aria-controls={`v05-p${i}`}
                onClick={() => setOpen(i)}
              >
                <motion.span
                  className={`af-v05-dot${isOpen ? " on" : ""}${open > i ? " done" : ""}`}
                  animate={{ scale: isOpen ? 1.12 : 1 }}
                  transition={t(SPRING_SNAP)}
                >
                  {open > i ? <I n="check" s={11} /> : <span className="af-v05-idx">{i + 1}</span>}
                </motion.span>
                <span className="af-v05-title">{s.t}</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v05-p${i}`} labelledBy={`v05-h${i}`}>
              <p className="af-body af-v05-body">{s.d}</p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/* ================================================================
   V06 - Signal: icon rows with live badges; the badge pops with a
   spring whenever its row is opened.
   ================================================================ */

const V06_ROWS: { icon: IconName; t: string; badge: number; d: string }[] = [
  { icon: "chat", t: "Mentions", badge: 4, d: "Priya and two others mentioned you in the launch thread. The oldest is waiting on a copy decision." },
  { icon: "bell", t: "Alerts", badge: 2, d: "Deploy quota at 80% and one failing check on the nightly build." },
  { icon: "box", t: "Orders", badge: 7, d: "Seven orders ready to pack. Three are express and need pickup before 4pm." },
  { icon: "chart", t: "Reports", badge: 1, d: "The weekly digest is ready. Signups are up 12% week over week." },
];

export function AccordionV06() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div className="af-v06">
      {V06_ROWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v06-row${isOpen ? " open" : ""}`} key={r.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v06-h${i}`}
                className="af-head af-v06-head"
                aria-expanded={isOpen}
                aria-controls={`v06-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v06-icon"><I n={r.icon} /></span>
                <span className="af-v06-title">{r.t}</span>
                <motion.span
                  className="af-v06-badge"
                  key={String(isOpen)}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 700, damping: 18 }}
                >
                  {r.badge}
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v06-p${i}`} labelledBy={`v06-h${i}`}>
              <p className="af-body af-v06-body">{r.d}</p>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V07 - Timeline: a dated rail; opening an entry draws the rail
   segment and slides the entry body in.
   ================================================================ */

const V07_EVENTS = [
  { date: "Mar 04", t: "First sketches", d: "Paper explorations of the rail concept. The dot-and-line language survived every later iteration." },
  { date: "Mar 19", t: "Motion pass", d: "Swapped every duration tween for springs. The rail draw is the detail people notice first." },
  { date: "Apr 02", t: "Accessibility audit", d: "Full keyboard map, region roles and a reduced-motion pass across all thirty variants." },
  { date: "Apr 27", t: "Public release", d: "Thirty accordions and lists, free to copy. No install, no account, no tracking." },
];

export function AccordionV07() {
  const [open, setOpen] = React.useState<number | null>(1);
  const t = useT();
  return (
    <div className="af-v07">
      {V07_EVENTS.map((e, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v07-item" key={e.date}>
            <span className="af-v07-rail" aria-hidden="true">
              <motion.span
                className="af-v07-railfill"
                animate={{ scaleY: isOpen ? 1 : 0 }}
                transition={t(SPRING_SOFT)}
              />
              <motion.span
                className={`af-v07-node${isOpen ? " on" : ""}`}
                animate={{ scale: isOpen ? 1.35 : 1 }}
                transition={t(SPRING_SNAP)}
              />
            </span>
            <div className="af-v07-main">
              <h3 className="af-h">
                <button
                  type="button"
                  id={`v07-h${i}`}
                  className="af-head af-v07-head"
                  aria-expanded={isOpen}
                  aria-controls={`v07-p${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="af-v07-date">{e.date}</span>
                  <span className="af-v07-title">{e.t}</span>
                </button>
              </h3>
              <Reveal open={isOpen} id={`v07-p${i}`} labelledBy={`v07-h${i}`}>
                <motion.p
                  className="af-body af-v07-body"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={t(SPRING_LOOSE)}
                >
                  {e.d}
                </motion.p>
              </Reveal>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V08 - FAQ search: a filter box above the accordion; matches are
   highlighted and non-matches collapse away.
   ================================================================ */

const V08_FAQS = [
  { q: "How do I install a component?", a: "You do not. Copy the component file and its CSS block into your project and import it like any local file." },
  { q: "Which frameworks are supported?", a: "React only, since the motion layer is framer-motion. The CSS is framework-agnostic." },
  { q: "Can I use these commercially?", a: "Yes. Every variant is MIT licensed - ship it in client work, products and templates." },
  { q: "Do the accordions work on touch?", a: "Every control is a real button, so taps, clicks and keyboard all hit the same path." },
  { q: "How is reduced motion handled?", a: "A media query kills CSS transitions and every spring in the TSX collapses to an instant state change." },
];

function V08Mark({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="af-v08-mark">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function AccordionV08() {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<number | null>(null);
  const t = useT();
  const q = query.trim();
  const visible = V08_FAQS.map((f, i) => ({ ...f, i })).filter(
    (f) => !q || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="af-v08">
      <label className="af-v08-search">
        <I n="search" s={14} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter answers..."
          aria-label="Filter frequently asked questions"
        />
      </label>
      <div className="af-v08-list">
        <AnimatePresence initial={false}>
          {visible.map((f) => {
            const isOpen = open === f.i;
            return (
              <motion.div
                key={f.q}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={t(SPRING_SOFT)}
                className="af-v08-item"
              >
                <h3 className="af-h">
                  <button
                    type="button"
                    id={`v08-h${f.i}`}
                    className="af-head af-v08-head"
                    aria-expanded={isOpen}
                    aria-controls={`v08-p${f.i}`}
                    onClick={() => setOpen(isOpen ? null : f.i)}
                  >
                    <span><V08Mark text={f.q} query={q} /></span>
                    <motion.span className="af-v08-chev" animate={{ rotate: isOpen ? 180 : 0 }} transition={t(SPRING_SNAP)}>
                      <I n="chevron" s={14} />
                    </motion.span>
                  </button>
                </h3>
                <Reveal open={isOpen} id={`v08-p${f.i}`} labelledBy={`v08-h${f.i}`}>
                  <p className="af-body af-v08-body"><V08Mark text={f.a} query={q} /></p>
                </Reveal>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length === 0 && (
          <p className="af-v08-empty">No answers match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   V09 - Chip cloud: rows open into a cloud of chips that layout-
   animate as they settle.
   ================================================================ */

const V09_GROUPS = [
  { t: "Motion", chips: ["spring", "stagger", "layout", "exit", "drag", "path"] },
  { t: "Structure", chips: ["rail", "divider", "card", "tree", "grid"] },
  { t: "State", chips: ["single-open", "multi-open", "disabled", "loading", "empty"] },
];

export function AccordionV09() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v09">
      {V09_GROUPS.map((g, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v09-row${isOpen ? " open" : ""}`} key={g.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v09-h${i}`}
                className="af-head af-v09-head"
                aria-expanded={isOpen}
                aria-controls={`v09-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v09-title">{g.t}</span>
                <span className="af-v09-count">{g.chips.length}</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v09-p${i}`} labelledBy={`v09-h${i}`}>
              <motion.div
                className="af-v09-cloud"
                initial="closed"
                animate="open"
                variants={{ open: { transition: { staggerChildren: 0.04 } }, closed: {} }}
              >
                {g.chips.map((c) => (
                  <motion.span
                    key={c}
                    className="af-v09-chip"
                    variants={{
                      open: { opacity: 1, scale: 1, y: 0 },
                      closed: { opacity: 0, scale: 0.6, y: 6 },
                    }}
                    transition={t(SPRING_SNAP)}
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V10 - Media rows: avatar stacks that fan apart on open, with a
   thumbnail panel sliding in.
   ================================================================ */

const V10_ROWS = [
  { t: "Design handoff", who: ["PM", "AK", "RS"], color: "#8c2f22", d: "Final Figma frames, redlines and the token export. Reviewed with engineering on Tuesday." },
  { t: "Launch assets", who: ["JB", "MK"], color: "#3f7a44", d: "Hero video, three social cuts and the press kit. All cleared for release day." },
  { t: "Research notes", who: ["TW", "PM", "AK", "DL"], color: "#28587b", d: "Twelve interviews distilled into four jobs-to-be-done. Quotes are tagged and searchable." },
];

export function AccordionV10() {
  const [open, setOpen] = React.useState<number | null>(null);
  const t = useT();
  return (
    <div className="af-v10">
      {V10_ROWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v10-row" key={r.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v10-h${i}`}
                className="af-head af-v10-head"
                aria-expanded={isOpen}
                aria-controls={`v10-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v10-stack" aria-hidden="true">
                  {r.who.map((w, j) => (
                    <motion.span
                      key={w}
                      className="af-v10-avatar"
                      style={{ background: r.color, zIndex: r.who.length - j }}
                      animate={{ x: isOpen ? j * 4 : 0, scale: isOpen ? 1.08 : 1 }}
                      transition={t(SPRING_SNAP)}
                    >
                      {w}
                    </motion.span>
                  ))}
                </span>
                <span className="af-v10-title">{r.t}</span>
                <motion.span className="af-v10-chev" animate={{ rotate: isOpen ? 180 : 0 }} transition={t(SPRING_SNAP)}>
                  <I n="chevron" s={14} />
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v10-p${i}`} labelledBy={`v10-h${i}`}>
              <div className="af-v10-panel">
                <motion.span
                  className="af-v10-thumb"
                  style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)` }}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={t(SPRING_LOOSE)}
                >
                  <I n="image" s={20} />
                </motion.span>
                <p className="af-body af-v10-body">{r.d}</p>
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V11 - Progress: each header carries a bar that fills with a
   spring when its section opens; the body breaks the number down.
   ================================================================ */

const V11_ROWS = [
  { t: "Core components", pct: 86, rows: [["Buttons", "24 / 26"], ["Inputs", "19 / 22"], ["Cards", "30 / 30"]] },
  { t: "Documentation", pct: 52, rows: [["Guides", "8 / 16"], ["API tables", "12 / 22"], ["Examples", "6 / 12"]] },
  { t: "Motion audit", pct: 34, rows: [["Springs tuned", "10 / 30"], ["Reduced-motion pass", "9 / 30"]] },
];

export function AccordionV11() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v11">
      {V11_ROWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v11-row" key={r.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v11-h${i}`}
                className="af-head af-v11-head"
                aria-expanded={isOpen}
                aria-controls={`v11-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v11-title">{r.t}</span>
                <span className="af-v11-track" aria-hidden="true">
                  <motion.span
                    className="af-v11-fill"
                    animate={{ scaleX: isOpen ? r.pct / 100 : 0.04 }}
                    transition={t(SPRING_LOOSE)}
                  />
                </span>
                <span className="af-v11-pct af-num">{r.pct}%</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v11-p${i}`} labelledBy={`v11-h${i}`}>
              <ul className="af-v11-detail">
                {r.rows.map(([k, v]) => (
                  <li key={k}><span>{k}</span><span className="af-num">{v}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V12 - Command list: roving-tabindex keyboard list. Arrows or j/k
   move, Enter/Space toggles, focus ring follows.
   ================================================================ */

const V12_ITEMS = [
  { t: "Open command bar", k: "⌘K", d: "Summons the palette from anywhere. Results rank by recency and frequency." },
  { t: "Jump to dashboard", k: "G D", d: "Two-key sequence. Every top-level surface has one; hold ? to see the map." },
  { t: "Toggle sidebar", k: "⌘B", d: "Collapses to icons. State persists per workspace, per device." },
  { t: "Quick switcher", k: "⌘P", d: "Fuzzy-jump between the last fifty documents you touched." },
];

export function AccordionV12() {
  const [open, setOpen] = React.useState<number | null>(null);
  const [focus, setFocus] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const t = useT();

  const onKey = (e: React.KeyboardEvent) => {
    const n = V12_ITEMS.length;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "j") next = (focus + 1) % n;
    if (e.key === "ArrowUp" || e.key === "k") next = (focus - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setFocus(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="af-v12" role="list" aria-label="Keyboard shortcuts" onKeyDown={onKey}>
      {V12_ITEMS.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v12-row${focus === i ? " focus" : ""}`} key={it.t} role="listitem">
            <h3 className="af-h">
              <button
                type="button"
                id={`v12-h${i}`}
                ref={(el) => { refs.current[i] = el; }}
                tabIndex={focus === i ? 0 : -1}
                className="af-head af-v12-head"
                aria-expanded={isOpen}
                aria-controls={`v12-p${i}`}
                onFocus={() => setFocus(i)}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <motion.span
                  className="af-v12-pip"
                  animate={{ scaleY: focus === i ? 1 : 0, opacity: focus === i ? 1 : 0 }}
                  transition={t(SPRING_SNAP)}
                  aria-hidden="true"
                />
                <span className="af-v12-title">{it.t}</span>
                <kbd className="af-v12-kbd">{it.k}</kbd>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v12-p${i}`} labelledBy={`v12-h${i}`}>
              <p className="af-body af-v12-body">{it.d}</p>
            </Reveal>
          </div>
        );
      })}
      <p className="af-v12-hint">Use ↑ ↓ or j k, Enter to expand</p>
    </div>
  );
}

/* ================================================================
   V13 - Horizontal: panels grow sideways with a spring; the open
   panel reveals its copy. Collapses to vertical under 420px.
   ================================================================ */

const V13_PANELS = [
  { k: "S", t: "Sketch", d: "Lo-fi frames, fast feedback." },
  { k: "B", t: "Build", d: "Real components, real data." },
  { k: "P", t: "Polish", d: "Tokens, springs, a11y." },
  { k: "R", t: "Release", d: "Copy, paste, ship." },
];

export function AccordionV13() {
  const [open, setOpen] = React.useState(1);
  const t = useT();
  return (
    <div className="af-v13" role="group" aria-label="Process panels">
      {V13_PANELS.map((p, i) => {
        const isOpen = open === i;
        return (
          <motion.button
            type="button"
            key={p.k}
            id={`v13-h${i}`}
            className={`af-head af-v13-panel${isOpen ? " open" : ""}`}
            aria-expanded={isOpen}
            aria-controls={`v13-p${i}`}
            onClick={() => setOpen(i)}
            animate={{ flexGrow: isOpen ? 3.2 : 1 }}
            transition={t(SPRING_SOFT)}
            style={{ flexBasis: 0 }}
          >
            <span className="af-v13-key">{p.k}</span>
            <span className="af-v13-title">{p.t}</span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  id={`v13-p${i}`}
                  className="af-v13-desc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={t(SPRING_LOOSE)}
                >
                  {p.d}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ================================================================
   V14 - Mosaic: a grid of tiles; tapping one springs it open into
   a double-size cell with detail copy (layout animation).
   ================================================================ */

const V14_TILES = [
  { t: "Rail", d: "Vertical guides that draw as sections open." },
  { t: "Lift", d: "Cards rise on a spring when they take focus." },
  { t: "Fan", d: "Stacked avatars spread to reveal the group." },
  { t: "Fill", d: "Bars and rings charge with loose springs." },
  { t: "Snap", d: "Dragged rows settle back with overshoot." },
];

export function AccordionV14() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v14">
      {V14_TILES.map((tile, i) => {
        const isOpen = open === i;
        return (
          <motion.button
            type="button"
            layout
            key={tile.t}
            id={`v14-h${i}`}
            className={`af-head af-v14-tile${isOpen ? " open" : ""}`}
            aria-expanded={isOpen}
            aria-controls={`v14-p${i}`}
            onClick={() => setOpen(isOpen ? null : i)}
            transition={t(SPRING_SOFT)}
          >
            <motion.span layout="position" className="af-v14-t">{tile.t}</motion.span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  id={`v14-p${i}`}
                  className="af-v14-d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={t({ duration: 0.25 })}
                >
                  {tile.d}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ================================================================
   V15 - Tree: recursive folders with indent guides and rotating
   chevrons. Multi-open, any depth.
   ================================================================ */

type V15Node = { name: string; children?: V15Node[] };

const V15_TREE: V15Node[] = [
  { name: "components", children: [
    { name: "accordions", children: [
      { name: "Ledger.tsx" },
      { name: "Dossier.tsx" },
    ]},
    { name: "lists", children: [
      { name: "CommandList.tsx" },
    ]},
  ]},
  { name: "styles", children: [
    { name: "tokens.css" },
    { name: "family.css" },
  ]},
  { name: "README.md" },
];

function V15Branch({ node, path, open, toggle, depth }: {
  node: V15Node; path: string; open: Set<string>;
  toggle: (p: string) => void; depth: number;
}) {
  const t = useT();
  const isBranch = !!node.children;
  const isOpen = open.has(path);
  return (
    <li className="af-v15-node">
      {isBranch ? (
        <>
          <button
            type="button"
            id={`v15-h${path}`}
            className="af-head af-v15-head"
            style={{ paddingLeft: depth * 20 + 8 }}
            aria-expanded={isOpen}
            aria-controls={`v15-p${path}`}
            onClick={() => toggle(path)}
          >
            <motion.span className="af-v15-chev" animate={{ rotate: isOpen ? 0 : -90 }} transition={t(SPRING_SNAP)}>
              <I n="chevron" s={12} />
            </motion.span>
            <span className="af-v15-ic"><I n="folder" s={14} /></span>
            <span>{node.name}</span>
          </button>
          <Reveal open={isOpen} id={`v15-p${path}`} labelledBy={`v15-h${path}`}>
            <ul className="af-v15-list">
              {node.children!.map((c) => (
                <V15Branch key={c.name} node={c} path={`${path}/${c.name}`} open={open} toggle={toggle} depth={depth + 1} />
              ))}
            </ul>
          </Reveal>
        </>
      ) : (
        <span className="af-v15-leaf" style={{ paddingLeft: depth * 20 + 8 }}>
          <span className="af-v15-chev" />
          <span className="af-v15-ic af-v15-file"><I n="file" s={14} /></span>
          <span>{node.name}</span>
        </span>
      )}
    </li>
  );
}

export function AccordionV15() {
  const [open, setOpen] = React.useState<Set<string>>(new Set(["components", "components/accordions"]));
  const toggle = (p: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  return (
    <ul className="af-v15" aria-label="Project files">
      {V15_TREE.map((n) => (
        <V15Branch key={n.name} node={n} path={n.name} open={open} toggle={toggle} depth={0} />
      ))}
    </ul>
  );
}

/* ================================================================
   V16 - Reorder: drag rows by their grip; springs settle the list.
   ================================================================ */

const V16_INITIAL = [
  { id: "a", t: "Warm paper surfaces", tag: "tokens" },
  { id: "b", t: "Spring-first motion", tag: "motion" },
  { id: "c", t: "Copy-paste delivery", tag: "dx" },
  { id: "d", t: "Keyboard everywhere", tag: "a11y" },
  { id: "e", t: "4px grid discipline", tag: "layout" },
];

export function AccordionV16() {
  const [items, setItems] = React.useState(V16_INITIAL);
  return (
    <div className="af-v16">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="af-v16-list"
        aria-label="Priorities, drag to reorder"
      >
        {items.map((it, i) => (
          <Reorder.Item
            key={it.id}
            value={it}
            className="af-v16-item"
            whileDrag={{ scale: 1.02, boxShadow: "0 16px 30px -16px rgba(46,40,28,.45)" }}
            transition={SPRING_SNAP}
          >
            <span className="af-v16-grip" aria-hidden="true"><I n="grip" s={14} /></span>
            <span className="af-v16-rank af-num">{i + 1}</span>
            <span className="af-v16-title">{it.t}</span>
            <span className="af-v16-tag">{it.tag}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <p className="af-v16-hint">Drag rows to reorder</p>
    </div>
  );
}

/* ================================================================
   V17 - Checklist: strike-through animates across the title, done
   items sink to the bottom with layout springs.
   ================================================================ */

const V17_INITIAL = [
  { id: "a", t: "Tune the rail spring", done: true },
  { id: "b", t: "Write the reduced-motion pass", done: true },
  { id: "c", t: "Record the motion clip", done: false },
  { id: "d", t: "Screenshot all five batches", done: false },
  { id: "e", t: "Ship the family file", done: false },
];

export function AccordionV17() {
  const [items, setItems] = React.useState(V17_INITIAL);
  const t = useT();
  const toggle = (id: string) =>
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
      return [...next.filter((x) => !x.done), ...next.filter((x) => x.done)];
    });
  const done = items.filter((x) => x.done).length;
  return (
    <div className="af-v17">
      <p className="af-v17-meta"><span className="af-num">{done}</span> of <span className="af-num">{items.length}</span> done</p>
      <ul className="af-v17-list">
        {items.map((it) => (
          <motion.li layout key={it.id} className={`af-v17-item${it.done ? " done" : ""}`} transition={t(SPRING_SOFT)}>
            <button
              type="button"
              className="af-head af-v17-head"
              aria-pressed={it.done}
              onClick={() => toggle(it.id)}
            >
              <motion.span
                className={`af-v17-box${it.done ? " on" : ""}`}
                animate={{ scale: it.done ? [1, 1.25, 1] : 1 }}
                transition={t({ duration: 0.3 })}
              >
                {it.done && <I n="check" s={11} />}
              </motion.span>
              <span className="af-v17-title">
                {it.t}
                <motion.span
                  className="af-v17-strike"
                  animate={{ scaleX: it.done ? 1 : 0 }}
                  transition={t(SPRING_LOOSE)}
                  aria-hidden="true"
                />
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================
   V18 - Swipe actions: drag a row left to spring open archive and
   delete. A focusable actions button offers the same for keyboard.
   ================================================================ */

const V18_ROWS = [
  { t: "Invoice #1042", meta: "$1,280.00 - due Friday" },
  { t: "Contract renewal", meta: "Acme Co - 12 months" },
  { t: "Receipt - Figma", meta: "$15.00 - October" },
];

function V18Row({ row }: { row: { t: string; meta: string } }) {
  const [open, setOpen] = React.useState(false);
  const [gone, setGone] = React.useState(false);
  const t = useT();
  return (
    <AnimatePresence initial={false}>
      {!gone && (
        <motion.li
          className="af-v18-cell"
          exit={{ height: 0, opacity: 0 }}
          transition={t(SPRING_SOFT)}
        >
          <span className="af-v18-actions" aria-hidden={!open}>
            <button type="button" className="af-v18-act arc" tabIndex={open ? 0 : -1} aria-label={`Archive ${row.t}`}>
              <I n="archive" s={15} />
            </button>
            <button
              type="button"
              className="af-v18-act del"
              tabIndex={open ? 0 : -1}
              aria-label={`Delete ${row.t}`}
              onClick={() => setGone(true)}
            >
              <I n="trash" s={15} />
            </button>
          </span>
          <motion.div
            className="af-v18-row"
            drag="x"
            dragConstraints={{ left: -104, right: 0 }}
            dragElastic={{ left: 0.4, right: 0 }}
            animate={{ x: open ? -104 : 0 }}
            transition={t(SPRING_SNAP)}
            onDragEnd={(_, info) => setOpen(info.offset.x < -40 || info.velocity.x < -300)}
          >
            <span className="af-v18-t">{row.t}</span>
            <span className="af-v18-meta af-num">{row.meta}</span>
            <button
              type="button"
              className="af-v18-more"
              aria-expanded={open}
              aria-label={`Actions for ${row.t}`}
              onClick={() => setOpen(!open)}
            >
              <I n="chevron" s={13} />
            </button>
          </motion.div>
        </motion.li>
      )}
    </AnimatePresence>
  );
}

export function AccordionV18() {
  return (
    <div className="af-v18">
      <ul className="af-v18-list">
        {V18_ROWS.map((r) => <V18Row key={r.t} row={r} />)}
      </ul>
      <p className="af-v18-hint">Drag a row left, or use its action button</p>
    </div>
  );
}

/* ================================================================
   V19 - Reviews: star rows; opening springs the stars into a
   staggered fill and reveals the review.
   ================================================================ */

const V19_REVIEWS = [
  { who: "Priya M.", stars: 5, t: "Replaced our whole accordion set", d: "Dropped three of these into the settings page in an afternoon. The spring curves are the difference between fine and premium." },
  { who: "Jonas B.", stars: 4, t: "Great defaults, easy to skin", d: "Recoloring took one token edit. Docked a star because I wanted a dark variant out of the box." },
  { who: "Talia W.", stars: 5, t: "The keyboard support is real", d: "Every variant tabs, arrows and announces correctly. That almost never happens with copy-paste UI." },
];

export function AccordionV19() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v19">
      {V19_REVIEWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v19-row${isOpen ? " open" : ""}`} key={r.who}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v19-h${i}`}
                className="af-head af-v19-head"
                aria-expanded={isOpen}
                aria-controls={`v19-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v19-ava" aria-hidden="true">{r.who[0]}</span>
                <span className="af-v19-main">
                  <span className="af-v19-who">{r.who}</span>
                  <span className="af-v19-t">{r.t}</span>
                </span>
                <span className="af-v19-stars" aria-label={`${r.stars} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.span
                      key={s}
                      className={`af-v19-star${s <= r.stars ? " on" : ""}`}
                      animate={{ scale: isOpen && s <= r.stars ? [1, 1.4, 1] : 1 }}
                      transition={{ ...t({ duration: 0.4 }), delay: s * 0.05 }}
                    >
                      <I n="star" s={12} />
                    </motion.span>
                  ))}
                </span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v19-p${i}`} labelledBy={`v19-h${i}`}>
              <p className="af-body af-v19-body">{r.d}</p>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V20 - Compare: feature groups open to a check/cross grid with
   tabular counts.
   ================================================================ */

const V20_GROUPS = [
  { t: "Components", rows: [["Accordions", true, true], ["Carousels", true, true], ["Charts", false, true], ["Editors", false, false]] as [string, boolean, boolean][] },
  { t: "Support", rows: [["Community", true, true], ["Email", false, true], ["Slack", false, true]] as [string, boolean, boolean][] },
];

export function AccordionV20() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="af-v20">
      <div className="af-v20-cols" aria-hidden="true">
        <span />
        <span>Free</span>
        <span>Pro</span>
      </div>
      {V20_GROUPS.map((g, i) => {
        const isOpen = open === i;
        const count = g.rows.filter((r) => r[1] || r[2]).length;
        return (
          <div className="af-v20-group" key={g.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v20-h${i}`}
                className="af-head af-v20-head"
                aria-expanded={isOpen}
                aria-controls={`v20-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v20-title">{g.t}</span>
                <span className="af-v20-count af-num">{count} features</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v20-p${i}`} labelledBy={`v20-h${i}`}>
              <ul className="af-v20-rows">
                {g.rows.map(([label, free, pro]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <span className={free ? "af-v20-yes" : "af-v20-no"} aria-label={free ? "Included in Free" : "Not in Free"}>
                      <I n={free ? "check" : "x"} s={12} />
                    </span>
                    <span className={pro ? "af-v20-yes" : "af-v20-no"} aria-label={pro ? "Included in Pro" : "Not in Pro"}>
                      <I n={pro ? "check" : "x"} s={12} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V21 - Activity: day groups with a live pulse on today; opening
   springs the entries in with stagger.
   ================================================================ */

const V21_DAYS = [
  { day: "Today", live: true, items: [["09:41", "Priya merged the rail spring tune"], ["08:12", "Nightly build passed"], ["07:58", "Maya opened the motion audit"]] as [string, string][] },
  { day: "Yesterday", live: false, items: [["18:22", "Tag v0.4.0 published"], ["15:03", "Twelve new icons landed"]] as [string, string][] },
  { day: "Mon 21", live: false, items: [["11:47", "Branch family/lists created"]] as [string, string][] },
];

export function AccordionV21() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v21">
      {V21_DAYS.map((d, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v21-group" key={d.day}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v21-h${i}`}
                className="af-head af-v21-head"
                aria-expanded={isOpen}
                aria-controls={`v21-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v21-day">{d.day}</span>
                {d.live && (
                  <motion.span
                    className="af-v21-pulse"
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                    transition={t({ duration: 1.6, repeat: Infinity, ease: "easeInOut" })}
                    aria-label="live"
                  />
                )}
                <span className="af-v21-count af-num">{d.items.length}</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v21-p${i}`} labelledBy={`v21-h${i}`}>
              <motion.ul
                className="af-v21-items"
                initial="closed"
                animate="open"
                variants={{ open: { transition: { staggerChildren: 0.05 } }, closed: {} }}
              >
                {d.items.map(([time, text]) => (
                  <motion.li
                    key={time + text}
                    variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: -8 } }}
                    transition={t(SPRING_LOOSE)}
                  >
                    <span className="af-v21-time af-num">{time}</span>
                    <span>{text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V22 - Palette: fuzzy-filtered command list with ranked scores
   and kbd hints. Rows spring as the ranking reshuffles.
   ================================================================ */

const V22_CMDS = [
  { t: "New workspace", k: "N" },
  { t: "Invite member", k: "I" },
  { t: "Duplicate document", k: "D" },
  { t: "Export as PDF", k: "E" },
  { t: "Delete document", k: "⌫" },
];

export function AccordionV22() {
  const [query, setQuery] = React.useState("");
  const t = useT();
  const q = query.trim().toLowerCase();
  const scored = V22_CMDS.map((c) => {
    if (!q) return { ...c, score: 1 };
    const hay = c.t.toLowerCase();
    let pos = -1, score = 0;
    for (const ch of q) {
      pos = hay.indexOf(ch, pos + 1);
      if (pos < 0) return { ...c, score: 0 };
      score += pos === 0 ? 3 : 1;
    }
    return { ...c, score: score / q.length };
  }).filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  return (
    <div className="af-v22">
      <label className="af-v22-input">
        <I n="search" s={14} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          aria-label="Filter commands"
        />
        <kbd>⌘K</kbd>
      </label>
      <ul className="af-v22-list">
        <AnimatePresence initial={false}>
          {scored.map((c, i) => (
            <motion.li
              layout
              key={c.t}
              className={`af-v22-row${i === 0 ? " top" : ""}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={t(SPRING_SOFT)}
            >
              <span className="af-v22-t">{c.t}</span>
              <span className="af-v22-score af-num" aria-hidden="true">{i === 0 ? "best" : ""}</span>
              <kbd className="af-v22-kbd">{c.k}</kbd>
            </motion.li>
          ))}
        </AnimatePresence>
        {scored.length === 0 && <li className="af-v22-empty">No commands match.</li>}
      </ul>
    </div>
  );
}

/* ================================================================
   V23 - Status board: three status groups as accordions; the count
   badge pops with a spring each time a group opens.
   ================================================================ */

const V23_COLS = [
  { t: "In progress", tone: "#b46a1b", items: ["Family: accordions & lists", "Family: sliders"] },
  { t: "In review", tone: "#28587b", items: ["Family: navbars", "Family: tables", "Docs: theming"] },
  { t: "Done", tone: "#3f7a44", items: ["Family: buttons", "Family: inputs", "Family: cards", "Lab routing"] },
];

export function AccordionV23() {
  const [open, setOpen] = React.useState<Set<number>>(new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  return (
    <div className="af-v23">
      {V23_COLS.map((c, i) => {
        const isOpen = open.has(i);
        return (
          <div className="af-v23-col" key={c.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v23-h${i}`}
                className="af-head af-v23-head"
                aria-expanded={isOpen}
                aria-controls={`v23-p${i}`}
                onClick={() => toggle(i)}
              >
                <span className="af-v23-dot" style={{ background: c.tone }} />
                <span className="af-v23-title">{c.t}</span>
                <motion.span
                  className="af-v23-count af-num"
                  key={String(isOpen)}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 640, damping: 20 }}
                  style={{ borderColor: c.tone, color: c.tone }}
                >
                  {c.items.length}
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v23-p${i}`} labelledBy={`v23-h${i}`}>
              <ul className="af-v23-items">
                {c.items.map((x) => (
                  <li key={x}><span className="af-v23-tick" style={{ background: c.tone }} />{x}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V24 - Data rows: table-like rows with tabular numerals; a row
   springs open into a three-cell detail grid.
   ================================================================ */

const V24_ROWS = [
  { name: "goatui.vercel.app", visits: "12,408", delta: "+12.4%", up: true, cells: [["Unique", "8,911"], ["Bounce", "31.2%"], ["Avg. visit", "2m 14s"]] },
  { name: "docs.goatui.dev", visits: "4,512", delta: "+3.1%", up: true, cells: [["Unique", "3,208"], ["Bounce", "44.8%"], ["Avg. visit", "4m 02s"]] },
  { name: "playground.goatui.dev", visits: "1,903", delta: "-2.6%", up: false, cells: [["Unique", "1,355"], ["Bounce", "38.5%"], ["Avg. visit", "6m 41s"]] },
];

export function AccordionV24() {
  const [open, setOpen] = React.useState<number | null>(null);
  const t = useT();
  return (
    <div className="af-v24" role="table" aria-label="Site traffic">
      {V24_ROWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v24-row${isOpen ? " open" : ""}`} key={r.name} role="rowgroup">
            <h3 className="af-h">
              <button
                type="button"
                id={`v24-h${i}`}
                className="af-head af-v24-head"
                aria-expanded={isOpen}
                aria-controls={`v24-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v24-name">{r.name}</span>
                <span className="af-v24-visits af-num">{r.visits}</span>
                <motion.span
                  className={`af-v24-delta af-num${r.up ? " up" : " down"}`}
                  animate={{ scale: isOpen ? 1.1 : 1 }}
                  transition={t(SPRING_SNAP)}
                >
                  {r.delta}
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v24-p${i}`} labelledBy={`v24-h${i}`}>
              <div className="af-v24-cells">
                {r.cells.map(([k, v]) => (
                  <div className="af-v24-cell" key={k}>
                    <span className="af-v24-k">{k}</span>
                    <span className="af-v24-v af-num">{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V25 - Notifications: stacked cards with unread accents; dismiss
   springs a card out sideways and the stack closes ranks.
   ================================================================ */

const V25_INITIAL = [
  { id: "a", icon: "bell" as IconName, t: "Deploy finished", d: "goatui@1d635e9 is live.", time: "2m", unread: true },
  { id: "b", icon: "chat" as IconName, t: "New comment", d: "Maya: the rail draw feels right now.", time: "18m", unread: true },
  { id: "c", icon: "box" as IconName, t: "Registry rebuilt", d: "70 components indexed.", time: "1h", unread: false },
];

export function AccordionV25() {
  const [items, setItems] = React.useState(V25_INITIAL);
  const t = useT();
  const dismiss = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const read = (id: string) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  return (
    <div className="af-v25">
      <ul className="af-v25-list">
        <AnimatePresence initial={false}>
          {items.map((n) => (
            <motion.li
              layout
              key={n.id}
              className={`af-v25-card${n.unread ? " unread" : ""}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 140, transition: t(SPRING_SNAP) }}
              transition={t(SPRING_SOFT)}
            >
              <button type="button" className="af-head af-v25-main" onClick={() => read(n.id)} aria-label={`Mark read: ${n.t}`}>
                <span className="af-v25-icon"><I n={n.icon} s={15} /></span>
                <span className="af-v25-text">
                  <span className="af-v25-t">{n.t}</span>
                  <span className="af-v25-d">{n.d}</span>
                </span>
                <span className="af-v25-time af-num">{n.time}</span>
              </button>
              <button type="button" className="af-v25-x" aria-label={`Dismiss: ${n.t}`} onClick={() => dismiss(n.id)}>
                <I n="x" s={13} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 && <p className="af-v25-empty">All caught up.</p>}
    </div>
  );
}

/* ================================================================
   V26 - Tracklist: numbered tracks; the playing row grows live
   equalizer bars. Durations in tabular numerals.
   ================================================================ */

const V26_TRACKS = [
  { t: "Paper & Ink", artist: "Studio Cut", len: "3:42" },
  { t: "Rail Draw", artist: "Spring Ensemble", len: "2:58" },
  { t: "Four Pixel Grid", artist: "Mono Club", len: "4:17" },
  { t: "Warm Surface", artist: "Studio Cut", len: "3:05" },
];

function V26Eq() {
  const t = useT();
  return (
    <span className="af-v26-eq" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
          transition={t({ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" })}
        />
      ))}
    </span>
  );
}

export function AccordionV26() {
  const [playing, setPlaying] = React.useState<number | null>(1);
  return (
    <ol className="af-v26">
      {V26_TRACKS.map((tr, i) => {
        const on = playing === i;
        return (
          <li className={`af-v26-row${on ? " on" : ""}`} key={tr.t}>
            <button
              type="button"
              className="af-head af-v26-head"
              aria-pressed={on}
              aria-label={`${on ? "Pause" : "Play"} ${tr.t} by ${tr.artist}`}
              onClick={() => setPlaying(on ? null : i)}
            >
              <span className="af-v26-left">
                {on ? <V26Eq /> : <span className="af-v26-num af-num">{String(i + 1).padStart(2, "0")}</span>}
              </span>
              <span className="af-v26-main">
                <span className="af-v26-t">{tr.t}</span>
                <span className="af-v26-a">{tr.artist}</span>
              </span>
              <span className="af-v26-len af-num">{tr.len}</span>
              <span className="af-v26-pp"><I n={on ? "pause" : "play"} s={13} /></span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ================================================================
   V27 - Files: a file-browser accordion. Folders open with a
   spring; sizes and dates in tabular mono.
   ================================================================ */

const V27_DIRS = [
  { name: "Exports", size: "48.2 MB", files: [["goat-ui-v0.4.zip", "31.8 MB", "zip" as IconName], ["tokens.json", "12 KB", "code" as IconName], ["preview.png", "4.1 MB", "image" as IconName]] },
  { name: "Docs", size: "1.6 MB", files: [["handoff.pdf", "1.1 MB", "doc" as IconName], ["shortcuts.md", "8 KB", "doc" as IconName]] },
  { name: "Audio refs", size: "92 MB", files: [["rail-draw.wav", "44 MB", "music" as IconName], ["warm-surface.wav", "48 MB", "music" as IconName]] },
];

export function AccordionV27() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v27">
      {V27_DIRS.map((d, i) => {
        const isOpen = open === i;
        return (
          <div className="af-v27-dir" key={d.name}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v27-h${i}`}
                className="af-head af-v27-head"
                aria-expanded={isOpen}
                aria-controls={`v27-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <motion.span className="af-v27-chev" animate={{ rotate: isOpen ? 0 : -90 }} transition={t(SPRING_SNAP)}>
                  <I n="chevron" s={12} />
                </motion.span>
                <span className="af-v27-fic"><I n="folder" s={15} /></span>
                <span className="af-v27-name">{d.name}</span>
                <span className="af-v27-size af-num">{d.size}</span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v27-p${i}`} labelledBy={`v27-h${i}`}>
              <ul className="af-v27-files">
                {d.files.map(([f, s, ic]) => (
                  <li key={f as string}>
                    <I n={ic as IconName} s={14} />
                    <span className="af-v27-fname">{f}</span>
                    <span className="af-v27-fsize af-num">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   V28 - Recipe: timed steps; the active step's ring fills and the
   mm:ss counts. Checking a step springs the next one open.
   ================================================================ */

const V28_STEPS = [
  { t: "Bloom the yeast", time: 300, d: "Warm water, a pinch of sugar, five minutes until foamy." },
  { t: "Knead", time: 480, d: "Eight minutes by hand until the dough windowpanes." },
  { t: "First rise", time: 2700, d: "Cover and rest somewhere warm until doubled." },
];

function V28Ring({ pct }: { pct: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg className="af-v28-ring" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} fill="none" stroke="#e8e2d4" strokeWidth="2.5" />
      <motion.circle
        cx="12" cy="12" r={r} fill="none" stroke="#8c2f22" strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - pct) }}
        transition={{ type: "spring", stiffness: 120, damping: 24 }}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

export function AccordionV28() {
  const [current, setCurrent] = React.useState(0);
  const [done, setDone] = React.useState<Set<number>>(new Set());
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const finish = (i: number) => {
    setDone((prev) => new Set(prev).add(i));
    if (i === current && current < V28_STEPS.length - 1) setCurrent(current + 1);
  };
  return (
    <ol className="af-v28">
      {V28_STEPS.map((s, i) => {
        const isDone = done.has(i);
        const isCurrent = current === i && !isDone;
        return (
          <li className={`af-v28-step${isDone ? " done" : ""}${isCurrent ? " current" : ""}`} key={s.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v28-h${i}`}
                className="af-head af-v28-head"
                aria-expanded={isCurrent}
                aria-controls={`v28-p${i}`}
                onClick={() => setCurrent(i)}
              >
                <V28Ring pct={isDone ? 1 : isCurrent ? 0.4 : 0} />
                <span className="af-v28-t">{s.t}</span>
                <span className="af-v28-time af-num">{fmt(s.time)}</span>
                <span
                  role="checkbox"
                  aria-checked={isDone}
                  aria-label={`Mark ${s.t} done`}
                  tabIndex={0}
                  className={`af-v28-check${isDone ? " on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); finish(i); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); finish(i); } }}
                >
                  {isDone && <I n="check" s={11} />}
                </span>
              </button>
            </h3>
            <Reveal open={isCurrent} id={`v28-p${i}`} labelledBy={`v28-h${i}`}>
              <p className="af-body af-v28-body">{s.d}</p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/* ================================================================
   V29 - Spec sheet: definition-list rows; the value column opens
   into full detail on a hairline grid.
   ================================================================ */

const V29_SPECS = [
  { k: "Format", v: "TSX + CSS", d: "One component file and one stylesheet block per variant. No runtime dependencies beyond framer-motion." },
  { k: "Size", v: "2.1 KB avg", d: "Gzipped, per variant, CSS included. The largest variant is 3.8 KB." },
  { k: "Motion", v: "Springs", d: "Stiffness 120-700, damping 18-34. No duration-based easing anywhere in the family." },
  { k: "A11y", v: "AA", d: "Real buttons, aria-expanded and region wiring, visible focus rings, full reduced-motion pass." },
];

export function AccordionV29() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <dl className="af-v29">
      {V29_SPECS.map((s, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v29-row${isOpen ? " open" : ""}`} key={s.k}>
            <dt className="af-h">
              <button
                type="button"
                id={`v29-h${i}`}
                className="af-head af-v29-head"
                aria-expanded={isOpen}
                aria-controls={`v29-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="af-v29-k">{s.k}</span>
                <span className="af-v29-v">{s.v}</span>
              </button>
            </dt>
            <Reveal open={isOpen} id={`v29-p${i}`} labelledBy={`v29-h${i}`}>
              <dd className="af-body af-v29-d">{s.d}</dd>
            </Reveal>
          </div>
        );
      })}
    </dl>
  );
}

/* ================================================================
   V30 - Master detail: pick a row and its detail panel springs
   open beneath, pushing siblings down on a shared grid.
   ================================================================ */

const V30_ROWS = [
  { t: "Ledger", cat: "Accordion", d: "The classic single-open pattern. One panel at a time, chevron on a snap spring, body copy set at 14/1.6." },
  { t: "Command list", cat: "List", d: "Roving tabindex with arrows and j/k. The focus pip draws on the left edge as selection moves." },
  { t: "Swipe actions", cat: "List", d: "Drag-left reveals archive and delete. A focusable action button gives keyboard users the same surface." },
];

export function AccordionV30() {
  const [open, setOpen] = React.useState<number | null>(0);
  const t = useT();
  return (
    <div className="af-v30">
      {V30_ROWS.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className={`af-v30-row${isOpen ? " open" : ""}`} key={r.t}>
            <h3 className="af-h">
              <button
                type="button"
                id={`v30-h${i}`}
                className="af-head af-v30-head"
                aria-expanded={isOpen}
                aria-controls={`v30-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <motion.span className="af-v30-bar" animate={{ scaleY: isOpen ? 1 : 0 }} transition={t(SPRING_SNAP)} aria-hidden="true" />
                <span className="af-v30-t">{r.t}</span>
                <span className="af-v30-cat">{r.cat}</span>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={t(SPRING_SNAP)} style={{ display: "inline-flex", color: "#8b8577" }}>
                  <I n="arrow" s={13} />
                </motion.span>
              </button>
            </h3>
            <Reveal open={isOpen} id={`v30-p${i}`} labelledBy={`v30-h${i}`}>
              <motion.p
                className="af-body af-v30-body"
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={t(SPRING_LOOSE)}
              >
                {r.d}
              </motion.p>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
                }
