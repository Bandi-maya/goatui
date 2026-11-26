"use client";

/**
 * GOAT UI - Navbar & Header family (30 variants)
 * Top navbars, mega menus, floating docks, mobile navs, breadcrumbs, search headers.
 * Plain CSS (NavbarFamily.css) + framer-motion springs (already a repo dependency).
 */
import * as React from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import "./NavbarFamily.css";

const { useEffect, useLayoutEffect, useRef, useState } = React;

/* ---------------- shared springs ---------------- */
const SPRING = { type: "spring", stiffness: 420, damping: 32 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;
const SPRING_BOUNCE = { type: "spring", stiffness: 380, damping: 22 } as const;

/* ---------------- inline icon set (copy-paste safe, no icon lib) ---------------- */
type IconProps = { size?: number; strokeWidth?: number };
const Svg = ({ size = 16, strokeWidth = 1.8, children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const IHome = (p: IconProps) => (<Svg {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></Svg>);
const ISearch = (p: IconProps) => (<Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>);
const IGrid = (p: IconProps) => (<Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>);
const IUser = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Svg>);
const IBell = (p: IconProps) => (<Svg {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></Svg>);
const IChev = (p: IconProps) => (<Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>);
const IChevR = (p: IconProps) => (<Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>);
const IArrow = (p: IconProps) => (<Svg {...p}><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></Svg>);
const IBox = (p: IconProps) => (<Svg {...p}><path d="m12 2 9 5v10l-9 5-9-5V7z" /><path d="m3 7 9 5 9-5" /><path d="M12 12v10" /></Svg>);
const ISpark = (p: IconProps) => (<Svg {...p}><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19" /></Svg>);
const IFile = (p: IconProps) => (<Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></Svg>);
const IGear = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" /></Svg>);
const IHeart = (p: IconProps) => (<Svg {...p}><path d="M19 14c1.5-1.5 3-3.5 3-6a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 2.5 1.5 4.5 3 6l6 6z" /></Svg>);
const IStar = (p: IconProps) => (<Svg {...p}><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.2l1.4-7L2 9.4l7-.8z" /></Svg>);
const ICompass = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></Svg>);
const IMail = (p: IconProps) => (<Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>);
const IClose = (p: IconProps) => (<Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>);
const ICopy = (p: IconProps) => (<Svg {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Svg>);
const ICheck = (p: IconProps) => (<Svg {...p}><path d="m4 12.5 5 5L20 6.5" /></Svg>);
const IZap = (p: IconProps) => (<Svg {...p}><path d="M13 2 3 14h7l-1 8 11-13h-8z" /></Svg>);
const IPlus = (p: IconProps) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
const IChat = (p: IconProps) => (<Svg {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /></Svg>);

/* hook: measure the active item for a sliding thumb */
function useThumb(count: number, active: number) {
  const refs = useRef<Array<HTMLElement | null>>([]);
  const [r, setR] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setR({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, count]);
  return { refs, r };
}

/* ============================================================
   01 - NavbarGlassPill
   ============================================================ */
export function NavbarGlassPill() {
  const items = ["Product", "Docs", "Pricing", "Blog"];
  const [active, setActive] = useState(0);
  const { refs, r } = useThumb(items.length, active);
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-glasspill-wrap">
        <header className="nf-glasspill">
          <a className="brand" href="#"><span className="dot" />Lumen</a>
          <nav aria-label="Primary">
            <motion.span className="thumb" animate={{ left: r.left, width: r.width }} transition={SPRING} />
            {items.map((it, i) => (
              <button key={it} ref={(el) => { refs.current[i] = el; }} className="item"
                aria-current={i === active ? "page" : undefined}
                onClick={() => setActive(i)}>{it}</button>
            ))}
          </nav>
          <motion.button className="cta" whileTap={{ scale: 0.94 }}>Get started</motion.button>
        </header>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   02 - NavbarSplitLedger (shrinks when its page scrolls)
   ============================================================ */
export function NavbarSplitLedger() {
  const [compact, setCompact] = useState(false);
  const items = ["Platform", "Solutions", "Customers", "Pricing"];
  const [active, setActive] = useState(1);
  return (
    <div>
      <header className={`nf-ledger${compact ? " compact" : ""}`}>
        <a className="brand" href="#"><span className="mark">L</span>Ledgerline</a>
        <nav aria-label="Primary">
          {items.map((it, i) => (
            <button key={it} className="link" aria-current={i === active ? "page" : undefined}
              onClick={() => setActive(i)}>{it}</button>
          ))}
        </nav>
        <div className="right">
          <button className="ghost" onClick={() => setCompact(!compact)}>
            {compact ? "Expand demo" : "Scroll demo"}
          </button>
          <motion.button className="solid" whileTap={{ scale: 0.94 }} whileHover={{ y: -1 }} transition={SPRING}>
            Book a demo
          </motion.button>
        </div>
      </header>
    </div>
  );
}

/* ============================================================
   03 - NavbarTickerStrip (marquee + magnetic links)
   ============================================================ */
function MagLink({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  return (
    <motion.button ref={ref} className="mag" style={{ x, y }}
      onMouseMove={(e) => {
        const b = ref.current!.getBoundingClientRect();
        x.set((e.clientX - b.left - b.width / 2) * 0.3);
        y.set((e.clientY - b.top - b.height / 2) * 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.button>
  );
}
export function NavbarTickerStrip() {
  const news = ["v2.4 is live", "New: edge rendering", "50k stars on GitHub", "Join the Discord"];
  return (
    <MotionConfig reducedMotion="user">
      <div>
        <div className="nf-ticker-tick" role="note">
          <div className="rail">
            {[0, 1].map((k) => (
              <React.Fragment key={k}>
                {news.map((n) => <span key={n + k}><b>*</b> {n}</span>)}
              </React.Fragment>
            ))}
          </div>
        </div>
        <header className="nf-ticker-bar">
          <a className="brand" href="#">pulseline</a>
          <nav aria-label="Primary">
            {["Feed", "Stats", "Teams", "API"].map((n) => <MagLink key={n}>{n}</MagLink>)}
          </nav>
          <button className="cta">Go live</button>
        </header>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   04 - NavbarMonoLine
   ============================================================ */
export function NavbarMonoLine() {
  const items = ["Index", "Work", "Notes", "About"];
  const [active, setActive] = useState(0);
  return (
    <header className="nf-mono">
      <a className="brand" href="#">STUDIO/KM</a>
      <nav aria-label="Primary">
        {items.map((it, i) => (
          <button key={it} className="lnk" aria-current={i === active ? "page" : undefined}
            onClick={() => setActive(i)}>
            {it}<span className="arr"><IArrow size={11} /></span>
          </button>
        ))}
      </nav>
      <span className="idx">03 / PROJECTS</span>
    </header>
  );
}

/* ============================================================
   05 - NavbarNeubrutal
   ============================================================ */
export function NavbarNeubrutal() {
  const items = ["Home", "Shop", "Zine", "Drops"];
  const [active, setActive] = useState(0);
  return (
    <header className="nf-brutal">
      <a className="brand" href="#">LOUD!</a>
      <nav aria-label="Primary">
        {items.map((it, i) => (
          <button key={it} className="b" aria-current={i === active ? "page" : undefined}
            onClick={() => setActive(i)}>{it}</button>
        ))}
      </nav>
      <button className="cta">Cart (2)</button>
    </header>
  );
}

/* ============================================================
   06 - NavbarAurora
   ============================================================ */
export function NavbarAurora() {
  const items = ["Overview", "Models", "Playground", "Research"];
  const [active, setActive] = useState(2);
  return (
    <div className="nf-aurora">
      <header className="inner">
        <a className="brand" href="#"><span className="glow" />Nebula AI</a>
        <nav aria-label="Primary">
          {items.map((it, i) => (
            <button key={it} className="lnk" aria-current={i === active ? "page" : undefined}
              onClick={() => setActive(i)}>{it}<span className="pip" /></button>
          ))}
        </nav>
        <motion.button className="cta" whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }} transition={SPRING}>
          Try the beta
        </motion.button>
      </header>
    </div>
  );
}

/* ============================================================
   07 - NavbarCenterOrb
   ============================================================ */
export function NavbarCenterOrb() {
  const L = ["Journal", "Collections"];
  const R = ["Atelier", "Contact"];
  const [active, setActive] = useState("Journal");
  const Btn = ({ n }: { n: string }) => (
    <button className="lnk" aria-current={active === n ? "page" : undefined} onClick={() => setActive(n)}>{n}</button>
  );
  return (
    <header className="nf-centerorb">
      <nav className="left" aria-label="Primary left">{L.map((n) => <Btn key={n} n={n} />)}</nav>
      <motion.button className="orb" aria-label="Maison home" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} transition={SPRING}>M</motion.button>
      <nav className="right" aria-label="Primary right">{R.map((n) => <Btn key={n} n={n} />)}</nav>
    </header>
  );
}

/* ============================================================
   08 - NavbarScrollGhost (hides on scroll down, springs back up)
   ============================================================ */
export function NavbarScrollGhost() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const items = ["Chapters", "Authors", "Reviews"];
  const [active, setActive] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-ghost-zone"
        onScroll={(e) => {
          const y = e.currentTarget.scrollTop;
          if (y > lastY.current + 6 && y > 60) setHidden(true);
          else if (y < lastY.current - 6) setHidden(false);
          lastY.current = y;
        }}>
        <motion.header className="nf-ghost-nav" animate={{ y: hidden ? -64 : 0 }} transition={SPRING_SOFT}>
          <a className="brand" href="#">Papertrail</a>
          <nav aria-label="Primary">
            {items.map((it, i) => (
              <button key={it} className="lnk" aria-current={i === active ? "page" : undefined}
                onClick={() => setActive(i)}>{it}</button>
            ))}
          </nav>
          <motion.button className="ava" aria-label="Account" whileTap={{ scale: 0.9 }} transition={SPRING}>BM</motion.button>
        </motion.header>
        <div className="nf-ghost-body">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>Scroll this panel - the bar tucks away when you go down and springs back when you return. Paragraph {i + 1} of the demo text keeps the panel scrollable.</p>
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   09 - NavbarSegmentedTabs
   ============================================================ */
export function NavbarSegmentedTabs() {
  const items = ["Overview", "Activity", "Members", "Settings"];
  const [active, setActive] = useState(1);
  const { refs, r } = useThumb(items.length, active);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-seg">
        <a className="brand" href="#">Workspace</a>
        <nav className="seg" aria-label="Section">
          <motion.span className="thumb" animate={{ left: r.left - 3, width: r.width }} transition={SPRING} />
          {items.map((it, i) => (
            <button key={it} ref={(el) => { refs.current[i] = el; }} className="opt"
              aria-current={i === active ? "page" : undefined} onClick={() => setActive(i)}>{it}</button>
          ))}
        </nav>
        <button className="bell" aria-label="Notifications, 3 unread"><IBell size={16} /><span className="n">3</span></button>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   10 - NavbarCommandBar
   ============================================================ */
export function NavbarCommandBar() {
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setFocus((f) => !f); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="nf-cmd">
      <a className="brand" href="#">kit.studio</a>
      <button className="fake-input" aria-expanded={focus} onClick={() => setFocus(!focus)}>
        <ISearch size={14} />
        <span>{focus ? "Type a command..." : "Search components, docs..."}</span>
        <span className="spacer" />
        <kbd>⌘</kbd><kbd>K</kbd>
      </button>
      <nav aria-label="Primary">
        {["Docs", "Blocks", "Themes"].map((n) => <button key={n} className="lnk">{n}</button>)}
      </nav>
    </header>
  );
}

/* ============================================================
   11 - MegaMenuColumns
   ============================================================ */
const megaCols = [
  { h: "Build", rows: [[IBox, "Components", "Copy-paste React building blocks"], [IZap, "Animations", "Spring presets and easings"], [IFile, "Templates", "Whole pages, ready to ship"]] },
  { h: "Learn", rows: [[IFile, "Docs", "Guides and API notes"], [ICompass, "Playground", "Try props live in the browser"], [IChat, "Community", "Discord and discussions"]] },
] as const;
export function MegaMenuColumns() {
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-mega">
        <div className="bar">
          <a className="brand" href="#">foundry</a>
          <button className="trig" aria-expanded={open} onClick={() => setOpen(!open)}>
            Platform <span className="chev"><IChev size={13} /></span>
          </button>
          <button className="trig">Pricing</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div className="panel" role="menu"
              initial={{ opacity: 0, y: -10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={SPRING_SOFT}>
              {megaCols.map((col, ci) => (
                <div className="col" key={col.h}>
                  <h3>{col.h}</h3>
                  {col.rows.map(([Icon, t, s], ri) => (
                    <motion.a key={t} href="#" className="row" role="menuitem"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING_SOFT, delay: 0.05 + (ci * 3 + ri) * 0.04 }}>
                      <span className="ic"><Icon size={16} /></span>
                      <span><b>{t}</b><small>{s}</small></span>
                    </motion.a>
                  ))}
                </div>
              ))}
              <motion.a href="#" className="feat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SOFT, delay: 0.32 }}>
                <b>What's new in 2.4</b>
                <small>Edge rendering, a new dock family and 40 fresh blocks.</small>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   12 - MegaMenuCards
   ============================================================ */
const cardTiles = [
  [IGrid, "#5b5bd6", "Blocks", "Sections and full page shells"],
  [IBox, "#0d9488", "Components", "Inputs, cards, tabs and more"],
  [ISpark, "#d97706", "Motion", "Spring presets and transitions"],
  [IFile, "#dc2626", "Templates", "Marketing and app starters"],
  [ICompass, "#1e6fe0", "Icons", "Two thousand crisp glyphs"],
  [IChat, "#0284c7", "Support", "Humans, not ticket queues"],
] as const;
export function MegaMenuCards() {
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-cards">
        <div className="bar">
          <a className="brand" href="#">stackyard</a>
          <button className="trig" aria-expanded={open} onClick={() => setOpen(!open)}>Library <span className="chev" style={{ display: "inline-grid", transition: "transform .4s", transform: open ? "rotate(180deg)" : "none" }}><IChev size={13} /></span></button>
          <button className="trig">Pricing</button>
          <button className="trig">Changelog</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div className="panel" role="menu"
              initial={{ opacity: 0, scale: 0.97, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }} transition={SPRING}>
              {cardTiles.map(([Icon, color, t, s], i) => (
                <motion.a key={t} href="#" className="tile" role="menuitem"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING_BOUNCE, delay: 0.05 + i * 0.045 }}>
                  <span className="ic" style={{ background: color }}><Icon size={17} /></span>
                  <b>{t}</b><small>{s}</small>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   13 - MegaMenuTabbed
   ============================================================ */
const mtabData: Record<string, [string, string][]> = {
  Products: [["Analytics", "Funnels, cohorts and retention"], ["Forms", "No-code data capture"], ["Email", "Broadcasts and drip flows"], ["Docs", "Hosted product guides"], ["Billing", "Usage-based invoicing"], ["Search", "Instant site search"]],
  Solutions: [["Startups", "Ship the MVP this week"], ["Agencies", "One kit for every client"], ["Enterprise", "SSO, audit logs, SLAs"], ["Education", "Free for classrooms"], ["Open source", "Sponsor-friendly tiers"], ["Nonprofit", "Discounted forever"]],
  Resources: [["Blog", "Field notes from the team"], ["Changelog", "What shipped this week"], ["Community", "Twelve thousand builders"], ["Support", "Median reply: 9 minutes"], ["Status", "99.99% trailing uptime"], ["Careers", "We are hiring"]],
};
export function MegaMenuTabbed() {
  const [open, setOpen] = useState(false);
  const tabs = Object.keys(mtabData);
  const [tab, setTab] = useState(0);
  const { refs, r } = useThumb(tabs.length, tab);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-mtab">
        <div className="bar">
          <a className="brand" href="#">hexlab</a>
          <button className="trig" aria-expanded={open} onClick={() => setOpen(!open)}>Explore <span style={{ display: "inline-grid", transition: "transform .4s", transform: open ? "rotate(180deg)" : "none" }}><IChev size={13} /></span></button>
          <button className="trig">Customers</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div className="panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={SPRING_SOFT}>
              <div className="tabs" role="tablist">
                <motion.span className="tabline" animate={{ left: r.left, width: r.width }} transition={SPRING} />
                {tabs.map((t, i) => (
                  <button key={t} role="tab" aria-selected={i === tab} className="tab"
                    ref={(el) => { refs.current[i] = el; }} onClick={() => setTab(i)}>{t}</button>
                ))}
              </div>
              <div className="body" role="tabpanel">
                <AnimatePresence mode="popLayout">
                  {mtabData[tabs[tab]].map(([t, s], i) => (
                    <motion.a key={tabs[tab] + t} href="#" className="cell"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ ...SPRING_SOFT, delay: i * 0.035 }}>
                      <b>{t}</b><small>{s}</small>
                    </motion.a>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   14 - MegaMenuMorph (panel resizes to fit each menu)
   ============================================================ */
const morphMenus: Record<string, [typeof IBox, string, string][]> = {
  Product: [[IBox, "Overview", "The whole toolkit"], [IZap, "Speed", "Why it feels instant"], [IGrid, "Blocks", "Sections on demand"]],
  Company: [[IUser, "About", "Small team, big care"], [IMail, "Contact", "Say hello"], [IStar, "Press", "Logos and facts"], [IChat, "Blog", "Notes and essays"], [IGear, "Careers", "Three open roles"]],
};
export function MegaMenuMorph() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-morph">
        <a className="brand" href="#">quiver</a>
        {Object.keys(morphMenus).map((k) => (
          <button key={k} className="trig" data-open={open === k}
            onMouseEnter={() => setOpen(k)} onFocus={() => setOpen(k)}>{k}</button>
        ))}
        <div onMouseLeave={() => setOpen(null)} style={{ display: "contents" }}>
          <AnimatePresence>
            {open && (
              <motion.div className="float" onMouseLeave={() => setOpen(null)}
                initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={SPRING}>
                <motion.div className="pad" layout transition={SPRING}
                  style={{ width: open === "Company" ? 250 : 220 }}>
                  {morphMenus[open].map(([Icon, t, s]) => (
                    <a key={t} href="#" className="mi">
                      <span className="ic"><Icon size={15} /></span>
                      <span>{t}<br /><small>{s}</small></span>
                    </a>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   15 - MegaMenuSpotlight
   ============================================================ */
const spotItems = [
  { t: "Analytics", d: "Watch people flow through your product in real time, then zoom into any session.", g: "linear-gradient(135deg,#3b82f6,#9cc4ff)" },
  { t: "Automations", d: "Trigger emails, webhooks and cleanups from any event, no cron jobs required.", g: "linear-gradient(135deg,#0d9488,#5eead4)" },
  { t: "Warehouses", d: "Sync every row to BigQuery or Snowflake on a fifteen minute cadence.", g: "linear-gradient(135deg,#d97706,#fcd34d)" },
  { t: "Edge API", d: "Sub-50ms reads from thirty regions with a single endpoint.", g: "linear-gradient(135deg,#dc2626,#fca5a5)" },
];
export function MegaMenuSpotlight() {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <header className="nf-spot">
        <div className="bar">
          <a className="brand" href="#">datastack</a>
          <button className="trig" aria-expanded={open} onClick={() => setOpen(!open)}>Platform <span style={{ display: "inline-grid", transition: "transform .4s", transform: open ? "rotate(180deg)" : "none" }}><IChev size={13} /></span></button>
          <button className="trig">Pricing</button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div className="panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={SPRING_SOFT}>
              <div className="list" role="menu">
                {spotItems.map((s, i) => (
                  <button key={s.t} className="li" role="menuitem" data-hot={hot === i}
                    onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)}>
                    {s.t}<span className="go"><IArrow size={14} /></span>
                  </button>
                ))}
              </div>
              <div className="view" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={hot} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }} transition={SPRING_SOFT}>
                    <div className="art" style={{ background: spotItems[hot].g }} />
                    <b>{spotItems[hot].t}</b>
                    <p>{spotItems[hot].d}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}

/* ============================================================
   16 - DockMagnify (macOS-style distance scaling)
   ============================================================ */
const dockApps = [
  [IGrid, "#5b5bd6", "Apps"], [ISearch, "#0d9488", "Find"], [IChat, "#d97706", "Chat"],
  [IMail, "#dc2626", "Mail"], [ICompass, "#0284c7", "Maps"], [IHeart, "#e11d78", "Health"],
] as const;
function DockIcon({ Icon, color, label, mouseX, on, onPick }:
  { Icon: typeof IBox; color: string; label: string; mouseX: MotionValue<number>; on: boolean; onPick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const dist = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || v < 0) return 200;
    return v - (b.left + b.width / 2);
  });
  const scale = useTransform(dist, [-90, 0, 90], [1, 1.55, 1]);
  const spring = useSpring(scale, { stiffness: 320, damping: 22, mass: 0.6 });
  return (
    <motion.button ref={ref} className="app" data-on={on} aria-label={label} aria-current={on ? "page" : undefined}
      style={{ scale: spring, transformOrigin: "bottom" }} onClick={onPick}>
      <span className="tip">{label}</span>
      <span className="tile" style={{ background: color }}><Icon size={20} /></span>
    </motion.button>
  );
}
export function DockMagnify() {
  const mouseX = useMotionValue(-1);
  const [on, setOn] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-dock-zone">
        <div className="nf-dock" role="navigation" aria-label="Dock"
          onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(-1)}>
          {dockApps.slice(0, 4).map(([Icon, color, label], i) => (
            <DockIcon key={label} Icon={Icon} color={color} label={label} mouseX={mouseX} on={on === i} onPick={() => setOn(i)} />
          ))}
          <span className="sep" />
          {dockApps.slice(4).map(([Icon, color, label], i) => (
            <DockIcon key={label} Icon={Icon} color={color} label={label} mouseX={mouseX} on={on === i + 4} onPick={() => setOn(i + 4)} />
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   17 - DockOrbit
   ============================================================ */
export function DockOrbit() {
  const items = [[IHome, "Home"], [ISearch, "Search"], [IBell, "Alerts"], [IUser, "You"]] as const;
  const [active, setActive] = useState(0);
  return (
    <div className="nf-orbit-zone">
      <nav className="nf-orbit" aria-label="Dock">
        {items.map(([Icon, label], i) => (
          <button key={label} className="oi" aria-label={label} aria-current={i === active ? "page" : undefined}
            onClick={() => setActive(i)}>
            <Icon size={17} /><span className="sat" />
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ============================================================
   18 - DockRail (vertical, springing tooltips)
   ============================================================ */
export function DockRail() {
  const items = [[IGrid, "Dashboard"], [IFile, "Pages"], [ISpark, "Effects"], [IGear, "Settings"]] as const;
  const [active, setActive] = useState(0);
  return (
    <div className="nf-rail-zone">
      <nav className="nf-rail" aria-label="Side">
        {items.slice(0, 3).map(([Icon, label], i) => (
          <button key={label} className="ri" aria-label={label} aria-current={i === active ? "page" : undefined}
            onClick={() => setActive(i)}>
            <Icon size={16} /><span className="tip">{label}</span>
          </button>
        ))}
        <span className="hr" />
        <button className="ri" aria-label="Settings" aria-current={3 === active ? "page" : undefined} onClick={() => setActive(3)}>
          <IGear size={16} /><span className="tip">Settings</span>
        </button>
      </nav>
    </div>
  );
}

/* ============================================================
   19 - DockExpando
   ============================================================ */
export function DockExpando() {
  const items = [[IHome, "Home"], [ICompass, "Explore"], [IBell, "Alerts"], [IUser, "Profile"]] as const;
  const [active, setActive] = useState(1);
  return (
    <div className="nf-expando-zone">
      <nav className="nf-expando" aria-label="Dock">
        {items.map(([Icon, label], i) => (
          <button key={label} className="ei" aria-current={i === active ? "page" : undefined} onClick={() => setActive(i)}>
            <Icon size={17} /><span className="lbl">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ============================================================
   20 - MobileSheetNav
   ============================================================ */
export function MobileSheetNav() {
  const [open, setOpen] = useState(false);
  const links = [[IGrid, "Dashboard", "01"], [IHeart, "Saved", "02"], [IBell, "Alerts", "03"], [IGear, "Settings", "04"]] as const;
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-sheet-zone">
        <header className="nf-sheet-top">
          <a className="brand" href="#">waypoint</a>
          <button className="burger" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}><span className="lines" /></button>
        </header>
        <AnimatePresence>
          {open && (
            <>
              <motion.div className="nf-sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.div className="nf-sheet" role="dialog" aria-label="Menu"
                initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "112%" }} transition={SPRING_BOUNCE}>
                <div className="grab" />
                {links.map(([Icon, label, num], i) => (
                  <motion.button key={label} className="sl"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING_SOFT, delay: 0.08 + i * 0.05 }} onClick={() => setOpen(false)}>
                    <span className="ic"><Icon size={15} /></span>{label}<small>{num}</small>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   21 - MobileOrbReveal (circular clip reveal, giant links)
   ============================================================ */
export function MobileOrbReveal() {
  const [open, setOpen] = useState(false);
  const links = ["Work", "Studio", "Journal", "Contact"];
  return (
    <div className="nf-orb-zone">
      <header className="nf-orb-top">
        <a className="brand" href="#">studio/km</a>
        <button className="nf-orb-btn" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}>
          {open ? <IClose size={17} /> : <IPlus size={17} />}
        </button>
      </header>
      <div className={`nf-orb-veil${open ? " open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <button key={l} className="big" style={{ transitionDelay: open ? `${0.15 + i * 0.07}s` : "0s" }}
              onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              <span className="num">0{i + 1}</span>{l}
            </button>
          ))}
        </nav>
        <div className="foot"><span>hello@km.studio</span><span>BLR / IND</span></div>
      </div>
    </div>
  );
}

/* ============================================================
   22 - MobileTabBar (sliding indicator + badges)
   ============================================================ */
export function MobileTabBar() {
  const items = [[IHome, "Home", 0], [ISearch, "Search", 0], [IChat, "Inbox", 4], [IUser, "You", 0]] as const;
  const [active, setActive] = useState(0);
  const { refs, r } = useThumb(items.length, active);
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-tabbar-zone">
        <nav className="nf-tabbar" aria-label="Tabs">
          <motion.span className="ind" animate={{ left: r.left, width: r.width }} transition={SPRING} />
          {items.map(([Icon, label, badge], i) => (
            <button key={label} ref={(el) => { refs.current[i] = el; }} className="ti"
              aria-current={i === active ? "page" : undefined} onClick={() => setActive(i)}>
              <span className="ico"><Icon size={19} />{badge > 0 && <span className="badge">{badge}</span>}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   23 - MobileDrawerBlur
   ============================================================ */
export function MobileDrawerBlur() {
  const [open, setOpen] = useState(false);
  const items = [[IGrid, "Overview"], [IFile, "Documents"], [IStar, "Favorites"], [IGear, "Settings"]] as const;
  const [active, setActive] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <div className="nf-drawer-zone">
        <header className="nf-drawer-top">
          <a className="brand" href="#">fieldnotes</a>
          <button className="open" onClick={() => setOpen(true)} aria-expanded={open}>Menu</button>
        </header>
        <AnimatePresence>
          {open && (
            <>
              <motion.div className="nf-drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.aside className="nf-drawer" role="dialog" aria-label="Menu"
                initial={{ x: "-104%" }} animate={{ x: 0 }} exit={{ x: "-106%" }} transition={SPRING_BOUNCE}>
                <div className="dhead">fieldnotes
                  <button className="x" aria-label="Close menu" onClick={() => setOpen(false)}><IClose size={14} /></button>
                </div>
                {items.map(([Icon, label], i) => (
                  <motion.button key={label} className="dl" aria-current={i === active ? "page" : undefined}
                    initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_SOFT, delay: 0.06 + i * 0.05 }}
                    onClick={() => { setActive(i); setOpen(false); }}>
                    <Icon size={15} />{label}
                  </motion.button>
                ))}
                <div className="dfoot"><span className="ava" /><span><b>Bandi Maya</b><br /><small>bandi@goatui.dev</small></span></div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ============================================================
   24 - BreadcrumbChevron (collapsible middle)
   ============================================================ */
export function BreadcrumbChevron() {
  const all = ["Home", "Library", "Components", "Navigation", "Navbar", "Glass Pill"];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? all : [all[0], null, ...all.slice(-2)] as (string | null)[];
  const hidden = all.slice(1, -2);
  return (
    <nav className="nf-bc" aria-label="Breadcrumb">
      <ol>
        {visible.map((c, i) => (
          <li className="crumb" key={i}>
            {i > 0 && <span className="sep" aria-hidden="true"><IChevR size={13} /></span>}
            {c === null ? (
              <span className="popwrap">
                <button className="ell" aria-label={`Show ${hidden.length} hidden levels`}
                  onClick={() => setExpanded(true)}>···</button>
                <span className="peek" role="menu">
                  {hidden.map((h) => <a key={h} href="#">{h}</a>)}
                </span>
              </span>
            ) : i === visible.length - 1 ? (
              <span className="cur" aria-current="page">{c}</span>
            ) : (
              <a className="lk" href="#">{c}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ============================================================
   25 - BreadcrumbStepTrail
   ============================================================ */
export function BreadcrumbStepTrail() {
  const steps = ["Cart", "Shipping", "Payment", "Review", "Done"];
  const [now, setNow] = useState(2);
  return (
    <MotionConfig reducedMotion="user">
      <nav className="nf-steps" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button className={`dotw${i < now ? " done" : ""}${i === now ? " now" : ""}`}
              aria-current={i === now ? "step" : undefined} onClick={() => setNow(i)}>
              <span className="dot">{i < now ? <ICheck size={12} /> : i + 1}</span>
              <span className="nm">{s}</span>
            </button>
            {i < steps.length - 1 && (
              <span className="barw" aria-hidden="true">
                <motion.span className="barf" animate={{ width: i < now ? "100%" : "0%" }}
                  transition={{ ...SPRING_SOFT, delay: 0.05 }} style={{ display: "block" }} />
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </MotionConfig>
  );
}

/* ============================================================
   26 - BreadcrumbPillChain
   ============================================================ */
export function BreadcrumbPillChain() {
  const parts = ["goatui.dev", "docs", "components", "navbar"];
  const [active, setActive] = useState(2);
  return (
    <nav className="nf-chain" aria-label="Breadcrumb">
      <ol className="pc" style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        {parts.map((p, i) => (
          <li key={p}>
            <button className={`pl${i === parts.length - 1 ? " last" : ""}`}
              aria-current={i === active ? "page" : undefined} onClick={() => setActive(i)}>{p}</button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ============================================================
   27 - BreadcrumbTerminal
   ============================================================ */
export function BreadcrumbTerminal() {
  const segs = ["home", "goatui", "components", "navbar"];
  const [copied, setCopied] = useState(false);
  const path = "~/" + segs.join("/");
  return (
    <nav className="nf-term" aria-label="Breadcrumb">
      <span className="ps1">➜</span>
      <span className="ps1">~</span>
      {segs.map((s, i) => (
        <React.Fragment key={s}>
          <span className="slash" aria-hidden="true">/</span>
          <button className={`seg${i === segs.length - 1 ? " cur" : ""}`}
            aria-current={i === segs.length - 1 ? "page" : undefined}
            onClick={() => { navigator.clipboard?.writeText(path).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
            {s}
          </button>
        </React.Fragment>
      ))}
      <span className="caret" aria-hidden="true" />
      {copied && <span className="copied"><ICopy size={10} /> path copied</span>}
    </nav>
  );
}

/* ============================================================
   28 - SearchCommandHeader (⌘K + keyboard-nav results)
   ============================================================ */
const scIndex = [
  { t: "Navbar - Glass Pill", k: "Component" }, { t: "Tabs - Sliding Pill", k: "Component" },
  { t: "Cards - Tilt Deck", k: "Component" }, { t: "Getting started", k: "Doc" },
  { t: "Theming tokens", k: "Doc" }, { t: "Changelog v2.4", k: "Note" },
];
export function SearchCommandHeader() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = scIndex.filter((x) => x.t.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="nf-sc">
      <div className="bar">
        <a className="brand" href="#">GOAT UI</a>
        <div className="field">
          <span className="mag"><ISearch size={14} /></span>
          <input ref={inputRef} type="search" placeholder="Search components..." aria-label="Search components"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setSel(0); }}
            onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === "Escape") inputRef.current?.blur();
            }} />
          <span className="keys"><kbd>⌘</kbd><kbd>K</kbd></span>
          {open && (
            <div className="res" role="listbox">
              {hits.length === 0 ? <div className="empty">No matches for "{q}"</div> :
                hits.map((h, i) => (
                  <button key={h.t} className="ri2" role="option" aria-selected={i === sel} data-sel={i === sel}
                    onMouseEnter={() => setSel(i)} onClick={() => setOpen(false)}>
                    <ISearch size={13} />{h.t}<span className="kind">{h.k}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
        <nav aria-label="Primary">
          {["Docs", "Blocks"].map((n) => <button key={n} className="lnk">{n}</button>)}
        </nav>
      </div>
    </header>
  );
}

/* ============================================================
   29 - SearchMorphIcon (icon springs open into a field)
   ============================================================ */
export function SearchMorphIcon() {
  const [on, setOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (on) inputRef.current?.focus(); }, [on]);
  return (
    <header className="nf-sm">
      <a className="brand" href="#">northwind</a>
      <div className="right">
        <nav aria-label="Primary">
          {["Guide", "API", "Blog"].map((n) => <button key={n} className="lnk">{n}</button>)}
        </nav>
        <div className={`morph${on ? " on" : ""}`}>
          <button className="icobtn" aria-label={on ? "Close search" : "Open search"} aria-expanded={on}
            onClick={() => setOn(!on)}>{on ? <IClose size={15} /> : <ISearch size={16} />}</button>
          <input ref={inputRef} type="search" placeholder="Search the docs..."
            aria-label="Search the docs" aria-hidden={!on} tabIndex={on ? 0 : -1}
            onKeyDown={(e) => e.key === "Escape" && setOn(false)} />
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   30 - SearchChipSuggest
   ============================================================ */
const schAll = [
  { t: "Glass pill navbar", tag: "nav" }, { t: "Sliding tabs", tag: "nav" },
  { t: "Tilt card deck", tag: "cards" }, { t: "Number input", tag: "forms" },
  { t: "Spring buttons", tag: "motion" }, { t: "Dock magnification", tag: "nav" },
];
const schChips = ["nav", "cards", "forms", "motion"];
export function SearchChipSuggest() {
  const [q, setQ] = useState("");
  const [chip, setChip] = useState<string | null>(null);
  const hits = schAll.filter((x) =>
    (!chip || x.tag === chip) && x.t.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <header className="nf-sch">
        <div className="bar">
          <a className="brand" href="#">kitbase</a>
          <div className="field">
            <span className="mag"><ISearch size={14} /></span>
            <input type="search" placeholder="Search the kit..." aria-label="Search the kit"
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="chips" role="group" aria-label="Filter by category">
          {schChips.map((c) => (
            <button key={c} className="chip" aria-pressed={chip === c}
              onClick={() => setChip(chip === c ? null : c)}>{c}</button>
          ))}
        </div>
      </header>
      <div className="nf-hits" aria-live="polite">
        {hits.map((h) => (
          <a key={h.t} href="#" className="nf-hit"><ISearch size={13} />{h.t}<span className="tag">{h.tag}</span></a>
        ))}
        {hits.length === 0 && <p style={{ padding: 10, fontSize: 13, color: "var(--nf-ink-3)" }}>Nothing in this filter yet.</p>}
      </div>
    </div>
  );
                  }
