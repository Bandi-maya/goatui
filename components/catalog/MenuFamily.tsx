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
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import {
  Archive,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  CopyPlus,
  Download,
  FilePlus2,
  Flag,
  Folder,
  FolderInput,
  Globe,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Link2,
  MessageSquare,
  MousePointer2,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  User,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import "./MenuFamily.css";

/* ------------------------------------------------------------------ */
/* Shared physics + utilities                                          */
/* ------------------------------------------------------------------ */

export const springs = {
  snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.9 } as Transition,
  soft: { type: "spring", stiffness: 260, damping: 26 } as Transition,
  bouncy: { type: "spring", stiffness: 430, damping: 17 } as Transition,
  stiff: { type: "spring", stiffness: 700, damping: 35 } as Transition,
};

function useInstant() {
  const rm = useReducedMotion();
  return rm ? ({ duration: 0.01 } as Transition) : null;
}

function useClickOutside(
  active: boolean,
  refs: React.RefObject<HTMLElement | null>[],
  onOutside: () => void
) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: PointerEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current && r.current.contains(t))) return;
      onOutside();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [active, onOutside, refs]);
}

function useEscape(active: boolean, onEsc: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEsc();
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [active, onEsc]);
}

export interface MenuItem {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  danger?: boolean;
}

const defaults: MenuItem[] = [
  { label: "Edit", hint: "⌘E", icon: <Pencil size={15} /> },
  { label: "Duplicate", hint: "⌘D", icon: <Copy size={15} /> },
  { label: "Share", hint: "⌘S", icon: <Share2 size={15} /> },
  { label: "Archive", icon: <Archive size={15} /> },
  { label: "Delete", hint: "⌫", icon: <Trash2 size={15} />, danger: true },
];

export interface VariantProps {
  defaultOpen?: boolean;
}

/* ================================================================== */
/* 1 — SpringDropMenu: origin-aware spring dropdown, staggered items   */
/* ================================================================== */

export function SpringDropMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [focus, setFocus] = useState(-1);
  const instant = useInstant();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  useClickOutside(open, [btnRef, panelRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => { setOpen(false); btnRef.current?.focus(); }, []));

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      setFocus(0);
    }
  };
  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocus((f) => (f + 1) % defaults.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocus((f) => (f - 1 + defaults.length) % defaults.length); }
    if (e.key === "Enter" && focus >= 0) { setOpen(false); btnRef.current?.focus(); }
    if (e.key === "Tab") setOpen(false);
  };

  return (
    <div className="gm-root">
      <motion.button
        ref={btnRef}
        className="gm-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        onClick={() => { setOpen((o) => !o); setFocus(-1); }}
        onKeyDown={onTriggerKey}
      >
        Actions
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={instant ?? springs.snappy} style={{ display: "inline-flex" }}>
          <ChevronDown size={15} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={listId}
            role="menu"
            tabIndex={-1}
            className="gm-panel gm-drop-panel"
            style={{ transformOrigin: "top center" }}
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -8 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 }}
            transition={instant ?? springs.snappy}
            onKeyDown={onPanelKey}
          >
            {defaults.map((item, i) => (
              <motion.button
                key={item.label}
                role="menuitem"
                tabIndex={focus === i ? 0 : -1}
                ref={(el) => { if (focus === i && el) el.focus(); }}
                className={`gm-item${item.danger ? " gm-danger" : ""}`}
                initial={instant ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : i * 0.035 }}
                onClick={() => { setOpen(false); btnRef.current?.focus(); }}
              >
                <span className="gm-item-icon">{item.icon}</span>
                <span className="gm-item-label">{item.label}</span>
                {item.hint && <kbd className="gm-kbd">{item.hint}</kbd>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 2 — FrostSheetSelect: frosted glass sheet with drawn check          */
/* ================================================================== */

const workspaces = [
  { name: "Personal", desc: "4 projects, just you" },
  { name: "Studio North", desc: "18 projects, 6 members" },
  { name: "Acme Client", desc: "3 projects, external" },
  { name: "Archive 2024", desc: "Read-only, 41 projects" },
];

export function FrostSheetSelect({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [sel, setSel] = useState(1);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));
  const listId = useId();

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.button
        className="gm-btn gm-frost-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        whileTap={instant ? undefined : { scale: 0.96, y: 1 }}
        transition={springs.stiff}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="gm-frost-dot" aria-hidden />
        <span>{workspaces[sel].name}</span>
        <ChevronDown size={15} className="gm-dim" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Workspace"
            className="gm-panel gm-frost-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(6px)" }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={instant ?? springs.soft}
          >
            {workspaces.map((w, i) => (
              <motion.li key={w.name} role="option" aria-selected={sel === i} whileHover={instant ? undefined : { x: 3 }}>
                <button className="gm-frost-option" onClick={() => { setSel(i); setOpen(false); }}>
                  <span className="gm-frost-text">
                    <span className="gm-frost-name">{w.name}</span>
                    <span className="gm-frost-desc">{w.desc}</span>
                  </span>
                  <span className="gm-frost-check" aria-hidden>
                    <AnimatePresence>
                      {sel === i && (
                        <motion.span
                          initial={instant ? false : { scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={instant ? undefined : { scale: 0 }}
                          transition={instant ?? springs.bouncy}
                          style={{ display: "inline-flex" }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 3 — RingRadialMenu: circular FAB with radial fan-out (true circles) */
/* ================================================================== */

const ringActions = [
  { icon: <Pencil size={16} />, label: "Edit" },
  { icon: <Copy size={16} />, label: "Copy" },
  { icon: <Share2 size={16} />, label: "Share" },
  { icon: <Star size={16} />, label: "Star" },
  { icon: <Download size={16} />, label: "Save" },
  { icon: <Trash2 size={16} />, label: "Delete" },
];

export function RingRadialMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const R = 92; // radius, multiple of 4
  const N = ringActions.length;

  return (
    <div className="gm-ring-root">
      {ringActions.map((a, i) => {
        const angle = -Math.PI / 2 + (i / N) * Math.PI * 2; // even distribution on a true circle
        const x = Math.cos(angle) * R;
        const y = Math.sin(angle) * R;
        return (
          <motion.button
            key={a.label}
            className="gm-ring-item"
            aria-label={a.label}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            initial={false}
            animate={
              open
                ? instant ? { opacity: 1 } : { x, y, scale: 1, opacity: 1 }
                : instant ? { opacity: 0 } : { x: 0, y: 0, scale: 0.2, opacity: 0 }
            }
            transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : open ? i * 0.04 : (N - i) * 0.02 }}
            whileHover={instant ? undefined : { scale: 1.15 }}
            whileTap={instant ? undefined : { scale: 0.85 }}
            style={{ pointerEvents: open ? "auto" : "none" }}
          >
            {a.icon}
            <span className="gm-ring-tip" role="tooltip">{a.label}</span>
          </motion.button>
        );
      })}
      <motion.button
        className={`gm-ring-fab${open ? " gm-open" : ""}`}
        aria-expanded={open}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        whileTap={instant ? undefined : { scale: 0.88 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={instant ?? springs.snappy}
        onClick={() => setOpen((o) => !o)}
      >
        <Plus size={20} />
      </motion.button>
    </div>
  );
}

/* ================================================================== */
/* 4 — FlipPanelSelect: 3D flip-down panel with perspective            */
/* ================================================================== */

const regions = [
  { name: "Mumbai", code: "BOM", dot: "#f59e0b" },
  { name: "Bengaluru", code: "BLR", dot: "#10b981" },
  { name: "Delhi NCR", code: "DEL", dot: "#6366f1" },
  { name: "Hyderabad", code: "HYD", dot: "#ec4899" },
  { name: "Chennai", code: "MAA", dot: "#06b6d4" },
];

export function FlipPanelSelect({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [sel, setSel] = useState(0);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.button
        className="gm-btn gm-flip-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        whileTap={instant ? undefined : { scale: 0.95 }}
        transition={springs.stiff}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="gm-region-dot" style={{ background: regions[sel].dot }} aria-hidden />
        {regions[sel].name}
        <span className="gm-region-code">{regions[sel].code}</span>
      </motion.button>
      <div className="gm-flip-stage">
        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              aria-label="Region"
              className="gm-panel gm-flip-panel"
              style={{ transformOrigin: "top center" }}
              initial={instant ? { opacity: 0 } : { opacity: 0, rotateX: -75, y: -4 }}
              animate={instant ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, rotateX: -50 }}
              transition={instant ?? springs.snappy}
            >
              {regions.map((r, i) => (
                <li key={r.code} role="option" aria-selected={sel === i}>
                  <motion.button
                    className="gm-flip-option"
                    initial={instant ? false : { opacity: 0, rotateX: -40 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.05 + i * 0.04 }}
                    onClick={() => { setSel(i); setOpen(false); }}
                  >
                    <span className="gm-region-dot" style={{ background: r.dot }} aria-hidden />
                    <span className="gm-flip-name">{r.name}</span>
                    <span className="gm-region-code">{r.code}</span>
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 5 — DockMagnifyMenu: macOS-style magnification dock                 */
/* ================================================================== */

const dockApps = [
  { icon: <Home size={22} />, label: "Home", hue: "#60a5fa" },
  { icon: <Search size={22} />, label: "Search", hue: "#a78bfa" },
  { icon: <LayoutGrid size={22} />, label: "Apps", hue: "#34d399" },
  { icon: <MessageSquare size={22} />, label: "Chat", hue: "#f472b6" },
  { icon: <Calendar size={22} />, label: "Calendar", hue: "#fbbf24" },
  { icon: <Settings size={22} />, label: "Settings", hue: "#94a3b8" },
];

function DockIcon({
  mouseX,
  icon,
  label,
  hue,
  instant,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  icon: React.ReactNode;
  label: string;
  hue: string;
  instant: Transition | null;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (x: number) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - (b.x + b.width / 2);
  });
  const target = useTransform(distance, [-110, 0, 110], [44, 76, 44]);
  const size = useSpring(target, instant ? { duration: 0.01 } : { stiffness: 420, damping: 24, mass: 0.6 });
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      ref={ref}
      className="gm-dock-icon"
      style={{ width: size, height: size, background: `color-mix(in srgb, ${hue} 18%, #14161c)` }}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      whileTap={instant ? undefined : { scale: 0.88 }}
    >
      <span style={{ color: hue, display: "inline-flex" }}>{icon}</span>
      <AnimatePresence>
        {hover && (
          <motion.span
            role="tooltip"
            className="gm-dock-tip"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.9 }}
            transition={instant ?? springs.bouncy}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function DockMagnifyMenu(_: VariantProps) {
  const mouseX = useMotionValue(Infinity);
  const instant = useInstant();
  return (
    <div
      className="gm-dock"
      role="menubar"
      aria-label="Applications"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {dockApps.map((a) => (
        <DockIcon key={a.label} mouseX={mouseX} icon={a.icon} label={a.label} hue={a.hue} instant={instant} />
      ))}
    </div>
  );
}

/* ================================================================== */
/* 6 — CommandPalette: ⌘K fuzzy palette with grouped results           */
/* ================================================================== */

interface Cmd {
  group: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
}

const commands: Cmd[] = [
  { group: "Actions", label: "Create new project", hint: "C", icon: <FilePlus2 size={15} /> },
  { group: "Actions", label: "Invite teammate", hint: "I", icon: <User size={15} /> },
  { group: "Actions", label: "Toggle notifications", icon: <Bell size={15} /> },
  { group: "Navigation", label: "Go to dashboard", hint: "G D", icon: <Home size={15} /> },
  { group: "Navigation", label: "Go to settings", hint: "G S", icon: <Settings size={15} /> },
  { group: "Navigation", label: "Open gallery", hint: "G G", icon: <ImageIcon size={15} /> },
  { group: "Create", label: "New document", hint: "D", icon: <FilePlus2 size={15} /> },
  { group: "Create", label: "New folder", icon: <Folder size={15} /> },
  { group: "Create", label: "Quick capture", hint: "Q", icon: <Zap size={15} /> },
];

function fuzzy(q: string, text: string) {
  if (!q) return true;
  const t = text.toLowerCase();
  let qi = 0;
  const s = q.toLowerCase();
  for (let i = 0; i < t.length && qi < s.length; i++) if (t[i] === s[qi]) qi++;
  return qi === s.length;
}

export function CommandPalette({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [ran, setRan] = useState<string | null>(null);
  const instant = useInstant();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  useEscape(open, useCallback(() => setOpen(false), []));
  useEffect(() => { if (open) { setQ(""); setActive(0); inputRef.current?.focus(); } }, [open]);

  const results = useMemo(() => commands.filter((c) => fuzzy(q, c.label)), [q]);
  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % Math.max(results.length, 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1)); }
    if (e.key === "Enter" && results[active]) {
      setRan(results[active].label);
      setOpen(false);
    }
  };

  const groups = useMemo(() => {
    const m = new Map<string, { cmd: Cmd; idx: number }[]>();
    results.forEach((cmd, idx) => {
      if (!m.has(cmd.group)) m.set(cmd.group, []);
      m.get(cmd.group)!.push({ cmd, idx });
    });
    return [...m.entries()];
  }, [results]);

  return (
    <div className="gm-root">
      <motion.button
        className="gm-cmdk-trigger"
        whileTap={instant ? undefined : { scale: 0.97 }}
        transition={springs.stiff}
        onClick={() => setOpen(true)}
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Search size={14} className="gm-dim" />
        <span>Search commands…</span>
        <kbd className="gm-kbd">⌘K</kbd>
      </motion.button>
      <AnimatePresence>
        {ran && !open && (
          <motion.p
            className="gm-cmdk-ran"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={instant ?? springs.soft}
          >
            <Zap size={13} /> Ran “{ran}”
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            className={defaultOpen ? "gm-overlay-inline" : "gm-overlay"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal={defaultOpen ? undefined : true}
              aria-label="Command palette"
              className="gm-cmdk"
              initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
              animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8 }}
              transition={instant ?? springs.snappy}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gm-cmdk-inputrow">
                <Search size={16} className="gm-dim" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Type a command or search…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-activedescendant={results[active] ? `gm-cmd-${active}` : undefined}
                />
                <kbd className="gm-kbd">esc</kbd>
              </div>
              <div className="gm-cmdk-list" role="listbox" ref={listRef}>
                {results.length === 0 && <p className="gm-cmdk-empty">No results for “{q}”</p>}
                {groups.map(([g, items]) => (
                  <div key={g}>
                    <p className="gm-cmdk-group">{g}</p>
                    {items.map(({ cmd, idx }) => (
                      <button
                        key={cmd.label}
                        id={`gm-cmd-${idx}`}
                        data-idx={idx}
                        role="option"
                        aria-selected={active === idx}
                        className={`gm-cmdk-item${active === idx ? " gm-active" : ""}`}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => { setRan(cmd.label); setOpen(false); }}
                      >
                        <span className="gm-item-icon">{cmd.icon}</span>
                        <span className="gm-item-label">{cmd.label}</span>
                        {cmd.hint && <kbd className="gm-kbd">{cmd.hint}</kbd>}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 7 — ContextRippleMenu: right-click menu with circular clip reveal   */
/* ================================================================== */

const ctxItems: MenuItem[] = [
  { label: "New file", hint: "N", icon: <FilePlus2 size={15} /> },
  { label: "Rename", hint: "R", icon: <Pencil size={15} /> },
  { label: "Make a copy", icon: <CopyPlus size={15} /> },
  { label: "Get link", icon: <Link2 size={15} /> },
  { label: "Move to trash", hint: "⌫", icon: <Trash2 size={15} />, danger: true },
];

export function ContextRippleMenu({ defaultOpen = false }: VariantProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(defaultOpen ? { x: 110, y: 60 } : null);
  const instant = useInstant();
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(!!pos, [panelRef], useCallback(() => setPos(null), []));
  useEscape(!!pos, useCallback(() => setPos(null), []));

  const openAt = (e: React.MouseEvent) => {
    e.preventDefault();
    const b = stageRef.current!.getBoundingClientRect();
    setPos({
      x: Math.min(e.clientX - b.left, b.width - 216),
      y: Math.min(e.clientY - b.top, b.height - 220),
    });
  };

  return (
    <div
      ref={stageRef}
      className="gm-ctx-stage"
      onContextMenu={openAt}
      onClick={(e) => { if (!pos) openAt(e); }}
      role="application"
      aria-label="File canvas, right click for actions"
    >
      {!pos && (
        <p className="gm-ctx-hint">
          <MousePointer2 size={14} /> Right-click (or click) anywhere here
        </p>
      )}
      <AnimatePresence>
        {pos && (
          <motion.div
            ref={panelRef}
            role="menu"
            className="gm-panel gm-ctx-panel"
            style={{ left: pos.x, top: pos.y, transformOrigin: "top left" }}
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.85, clipPath: "circle(0% at 12px 12px)" }}
            animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: "circle(140% at 12px 12px)" }}
            exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.9, clipPath: "circle(0% at 12px 12px)" }}
            transition={instant ?? springs.snappy}
          >
            {ctxItems.map((item, i) => (
              <motion.button
                key={item.label}
                role="menuitem"
                className={`gm-item${item.danger ? " gm-danger" : ""}`}
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: instant ? 0 : 0.08 + i * 0.03 }}
                onClick={() => setPos(null)}
              >
                <span className="gm-item-icon">{item.icon}</span>
                <span className="gm-item-label">{item.label}</span>
                {item.hint && <kbd className="gm-kbd">{item.hint}</kbd>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 8 — ChipMultiSelect: animated chips inside the control              */
/* ================================================================== */

const members = ["Asha", "Ravi", "Meera", "Kiran", "Zoya", "Arjun", "Nila"];
const memberHues = ["#6d7cff", "#34d399", "#f472b6", "#fbbf24", "#06b6d4", "#a78bfa", "#fb7185"];

export function ChipMultiSelect({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [picked, setPicked] = useState<string[]>(["Asha", "Meera"]);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  const toggle = (m: string) =>
    setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  return (
    <div className="gm-root" ref={rootRef} style={{ width: 300 }}>
      <motion.div
        className="gm-chip-control"
        layout
        transition={instant ?? springs.soft}
        onClick={() => setOpen(true)}
        role="combobox"
        aria-expanded={open}
        aria-label="Assign members"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && picked.length) setPicked((p) => p.slice(0, -1));
          if (e.key === "Enter" || e.key === "ArrowDown") setOpen(true);
        }}
      >
        <AnimatePresence mode="popLayout">
          {picked.map((m) => (
            <motion.span
              key={m}
              layout
              className="gm-chip"
              style={{ borderColor: memberHues[members.indexOf(m)] + "55" }}
              initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={instant ?? springs.bouncy}
            >
              <span className="gm-chip-dot" style={{ background: memberHues[members.indexOf(m)] }} aria-hidden />
              {m}
              <button
                className="gm-chip-x"
                aria-label={`Remove ${m}`}
                onClick={(e) => { e.stopPropagation(); toggle(m); }}
              >
                <X size={11} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {picked.length === 0 && <span className="gm-chip-placeholder">Assign members…</span>}
        <ChevronDown size={14} className="gm-dim gm-chip-caret" />
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-multiselectable="true"
            className="gm-panel gm-chip-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={instant ?? springs.snappy}
          >
            {members.map((m) => {
              const on = picked.includes(m);
              return (
                <li key={m} role="option" aria-selected={on}>
                  <button className="gm-item" onClick={() => toggle(m)}>
                    <span className="gm-chip-dot" style={{ background: memberHues[members.indexOf(m)] }} aria-hidden />
                    <span className="gm-item-label">{m}</span>
                    <motion.span
                      className="gm-chip-check"
                      animate={on ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.25 }}
                      transition={instant ?? springs.bouncy}
                      style={{ color: on ? "#34d399" : "var(--gm-text-dim)" }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 9 — CascadeSubMenu: multi-level submenus with directional slide     */
/* ================================================================== */

const cascade: { label: string; icon: React.ReactNode; children?: { label: string; hint?: string }[] }[] = [
  { label: "New", icon: <Plus size={15} />, children: [{ label: "Document", hint: "D" }, { label: "Spreadsheet", hint: "S" }, { label: "Deck", hint: "P" }] },
  { label: "Share", icon: <Share2 size={15} />, children: [{ label: "Copy link" }, { label: "Email invite" }, { label: "Export PDF" }] },
  { label: "Move to", icon: <FolderInput size={15} />, children: [{ label: "Projects" }, { label: "Personal" }, { label: "Archive" }] },
  { label: "Rename", icon: <Pencil size={15} /> },
];

export function CascadeSubMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [sub, setSub] = useState<number | null>(defaultOpen ? 0 : null);
  const [flip, setFlip] = useState(false);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => { setOpen(false); setSub(null); }, []));

  useEffect(() => {
    if (sub === null || !rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    // panel (208) + gap (6) + submenu (188) extend from the root's left edge
    setFlip(r.left + 208 + 6 + 188 > window.innerWidth - 8);
  }, [sub]);

  const hoverIn = (i: number | null) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSub(i), 90);
  };

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.button
        className="gm-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        onClick={() => { setOpen((o) => !o); if (open) setSub(null); }}
      >
        File <ChevronDown size={15} className="gm-dim" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            className="gm-panel gm-cascade-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, x: -8 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, x: -8 }}
            transition={instant ?? springs.snappy}
          >
            {cascade.map((item, i) => (
              <li key={item.label} className="gm-cascade-li" onMouseEnter={() => hoverIn(item.children ? i : null)}>
                <button
                  className={`gm-item${sub === i ? " gm-item-on" : ""}`}
                  aria-haspopup={item.children ? "menu" : undefined}
                  aria-expanded={item.children ? sub === i : undefined}
                  onClick={() => item.children && setSub(sub === i ? null : i)}
                >
                  <span className="gm-item-icon">{item.icon}</span>
                  <span className="gm-item-label">{item.label}</span>
                  {item.children && <ChevronRight size={13} className="gm-dim" />}
                </button>
                <AnimatePresence>
                  {item.children && sub === i && (
                    <motion.ul
                      role="menu"
                      className={`gm-panel gm-cascade-sub${flip ? " gm-flip" : ""}`}
                      initial={instant ? { opacity: 0 } : { opacity: 0, x: flip ? -14 : 14, scale: 0.97 }}
                      animate={instant ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                      exit={instant ? { opacity: 0 } : { opacity: 0, x: flip ? -10 : 10 }}
                      transition={instant ?? springs.snappy}
                    >
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <button role="menuitem" className="gm-item" onClick={() => { setOpen(false); setSub(null); }}>
                            <span className="gm-item-label">{c.label}</span>
                            {c.hint && <kbd className="gm-kbd">{c.hint}</kbd>}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 10 — DialRotarySelect: rotary dial that snaps with a spring         */
/* ================================================================== */

const dialStops = [
  { label: "Draft", angle: -90 },
  { label: "Review", angle: -45 },
  { label: "Scheduled", angle: 0 },
  { label: "Live", angle: 45 },
  { label: "Archived", angle: 90 },
];

export function DialRotarySelect({ defaultOpen }: VariantProps) {
  void defaultOpen;
  const [idx, setIdx] = useState(2);
  const [angle, setAngle] = useState(0);
  const instant = useInstant();
  const dialRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ start: number; base: number } | null>(null);

  const pointerAngle = (e: React.PointerEvent) => {
    const b = dialRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI;
  };
  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { start: pointerAngle(e), base: angle };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    let a = dragState.current.base + (pointerAngle(e) - dragState.current.start);
    a = Math.max(-100, Math.min(100, a));
    setAngle(a);
  };
  const onUp = () => {
    if (!dragState.current) return;
    dragState.current = null;
    let best = 0;
    dialStops.forEach((s, i) => { if (Math.abs(angle - s.angle) < Math.abs(angle - dialStops[best].angle)) best = i; });
    setIdx(best);
    setAngle(dialStops[best].angle);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowUp" ? idx + 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? idx - 1 : idx;
    if (next !== idx) {
      e.preventDefault();
      const c = Math.max(0, Math.min(dialStops.length - 1, next));
      setIdx(c);
      setAngle(dialStops[c].angle);
    }
  };

  return (
    <div className="gm-dial-root">
      <div
        ref={dialRef}
        className="gm-dial"
        role="slider"
        aria-label="Status"
        aria-valuemin={0}
        aria-valuemax={dialStops.length - 1}
        aria-valuenow={idx}
        aria-valuetext={dialStops[idx].label}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onKeyDown={onKey}
      >
        {dialStops.map((s, i) => (
          <span
            key={s.label}
            className={`gm-dial-tick${i === idx ? " gm-on" : ""}`}
            style={{ transform: `rotate(${s.angle}deg) translateY(-58px)` }}
            aria-hidden
          />
        ))}
        <motion.div
          className="gm-dial-face"
          animate={{ rotate: angle }}
          transition={dragState.current ? { duration: 0 } : (instant ?? springs.bouncy)}
        >
          <span className="gm-dial-pointer" aria-hidden />
        </motion.div>
        <div className="gm-dial-cap" aria-hidden />
      </div>
      <motion.p
        key={dialStops[idx].label}
        className="gm-dial-value"
        initial={instant ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={instant ?? springs.soft}
      >
        {dialStops[idx].label}
      </motion.p>
      <p className="gm-dial-hint">drag the dial or use arrow keys</p>
    </div>
  );
}

/* ================================================================== */
/* 11 — SpeedDialFAB: vertical speed dial with labeled satellites      */
/* ================================================================== */

const dialActions = [
  { icon: <Pencil size={16} />, label: "Compose", hue: "#6d7cff" },
  { icon: <UserPlus size={16} />, label: "Invite", hue: "#34d399" },
  { icon: <Paperclip size={16} />, label: "Attach", hue: "#fbbf24" },
  { icon: <Flag size={16} />, label: "Report", hue: "#fb7185" },
];

export function SpeedDialFAB({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();

  return (
    <div className="gm-speed-root">
      <AnimatePresence>
        {open && (
          <motion.div
            className="gm-speed-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className="gm-speed-stack">
        <AnimatePresence>
          {open &&
            dialActions.map((a, i) => (
              <motion.div
                key={a.label}
                className="gm-speed-row"
                initial={instant ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.6 }}
                animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={instant ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.7 }}
                transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : open ? i * 0.05 : (dialActions.length - i) * 0.03 }}
              >
                <motion.span
                  className="gm-speed-label"
                  initial={instant ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.1 + i * 0.05 }}
                >
                  {a.label}
                </motion.span>
                <motion.button
                  className="gm-speed-btn"
                  aria-label={a.label}
                  style={{ color: a.hue }}
                  whileHover={instant ? undefined : { scale: 1.12, rotate: -4 }}
                  whileTap={instant ? undefined : { scale: 0.85 }}
                  transition={springs.stiff}
                  onClick={() => setOpen(false)}
                >
                  {a.icon}
                </motion.button>
              </motion.div>
            ))}
        </AnimatePresence>
        <motion.button
          className="gm-speed-fab"
          aria-expanded={open}
          aria-label={open ? "Close actions" : "Open actions"}
          animate={{ rotate: open ? 135 : 0 }}
          whileTap={instant ? undefined : { scale: 0.88 }}
          transition={instant ?? springs.snappy}
          onClick={() => setOpen((o) => !o)}
        >
          <Plus size={22} />
        </motion.button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 12 — ActionSheetSwipe: bottom sheet with drag-to-dismiss            */
/* ================================================================== */

const sheetActions = [
  { icon: <Share2 size={17} />, label: "Share post", desc: "Link or social" },
  { icon: <Star size={17} />, label: "Add to favorites", desc: "Find it later" },
  { icon: <Flag size={17} />, label: "Report", desc: "Spam or abuse", danger: true },
];

export function ActionSheetSwipe({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="gm-sheet-frame" ref={constraintsRef}>
      <p className="gm-sheet-status">9:41</p>
      <div className="gm-sheet-body">
        <motion.button
          className="gm-btn"
          whileTap={instant ? undefined : { scale: 0.95 }}
          transition={springs.stiff}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          Open actions
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="gm-sheet-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Post actions"
              className="gm-sheet"
              drag={instant ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 500) setOpen(false); }}
              initial={instant ? { opacity: 0 } : { y: "105%" }}
              animate={instant ? { opacity: 1 } : { y: 0 }}
              exit={instant ? { opacity: 0 } : { y: "105%" }}
              transition={instant ?? springs.soft}
            >
              <div className="gm-sheet-grip" aria-hidden />
              {sheetActions.map((a, i) => (
                <motion.button
                  key={a.label}
                  className={`gm-sheet-action${a.danger ? " gm-danger" : ""}`}
                  initial={instant ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.1 + i * 0.05 }}
                  onClick={() => setOpen(false)}
                >
                  <span className="gm-sheet-icon">{a.icon}</span>
                  <span className="gm-sheet-text">
                    <span className="gm-sheet-label">{a.label}</span>
                    <span className="gm-sheet-desc">{a.desc}</span>
                  </span>
                </motion.button>
              ))}
              <button className="gm-sheet-cancel" onClick={() => setOpen(false)}>Cancel</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 13 — SegmentedPillSelect: sliding-pill segmented control            */
/* ================================================================== */

const segments = [
  { label: "Day", value: "24h", note: "hourly resolution" },
  { label: "Week", value: "7d", note: "daily rollup" },
  { label: "Month", value: "30d", note: "daily rollup" },
  { label: "Year", value: "12mo", note: "monthly rollup" },
];

export function SegmentedPillSelect(_: VariantProps) {
  const [idx, setIdx] = useState(1);
  const instant = useInstant();
  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowRight" ? idx + 1 : e.key === "ArrowLeft" ? idx - 1 : idx;
    if (next !== idx) {
      e.preventDefault();
      setIdx(Math.max(0, Math.min(segments.length - 1, next)));
    }
  };
  return (
    <div className="gm-seg-root">
      <div className="gm-seg" role="radiogroup" aria-label="Time range" onKeyDown={onKey}>
        {segments.map((s, i) => (
          <button
            key={s.label}
            role="radio"
            aria-checked={idx === i}
            className={`gm-seg-btn${idx === i ? " gm-on" : ""}`}
            onClick={() => setIdx(i)}
          >
            {idx === i && (
              <motion.span
                layoutId="gm-seg-pill"
                className="gm-seg-pill"
                transition={instant ?? springs.snappy}
                aria-hidden
              />
            )}
            <span className="gm-seg-text">{s.label}</span>
          </button>
        ))}
      </div>
      <motion.p
        key={segments[idx].value}
        className="gm-seg-readout"
        initial={instant ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={instant ?? springs.soft}
      >
        <span className="gm-seg-value">{segments[idx].value}</span>
        <span className="gm-seg-note">{segments[idx].note}</span>
      </motion.p>
    </div>
  );
}

/* ================================================================== */
/* 14 — TreeNavMenu: file tree with indent guides, spring expansion    */
/* ================================================================== */

interface TreeNode {
  label: string;
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    label: "components",
    children: [
      { label: "menus", children: [{ label: "MenuFamily.tsx" }, { label: "MenuFamily.css" }] },
      { label: "cards", children: [{ label: "CardFamily.tsx" }] },
    ],
  },
  {
    label: "app",
    children: [{ label: "lab", children: [{ label: "page.tsx" }] }, { label: "layout.tsx" }],
  },
  { label: "package.json" },
];

function TreeRow({
  node,
  depth,
  openSet,
  toggle,
  selected,
  setSelected,
  instant,
}: {
  node: TreeNode;
  depth: number;
  openSet: Set<string>;
  toggle: (k: string) => void;
  selected: string;
  setSelected: (k: string) => void;
  instant: Transition | null;
}) {
  const key = `${depth}:${node.label}`;
  const open = openSet.has(key);
  const isParent = !!node.children;
  return (
    <li role="treeitem" aria-expanded={isParent ? open : undefined} aria-selected={selected === key}>
      <button
        className={`gm-tree-row${selected === key ? " gm-on" : ""}`}
        style={{ paddingLeft: 10 + depth * 18 }}
        onClick={() => { setSelected(key); if (isParent) toggle(key); }}
      >
        {isParent ? (
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={instant ?? springs.snappy} style={{ display: "inline-flex" }}>
            <ChevronRight size={13} className="gm-dim" />
          </motion.span>
        ) : (
          <span className="gm-tree-leaf" aria-hidden />
        )}
        {isParent ? <Folder size={14} className="gm-dim" /> : <FilePlus2 size={14} className="gm-dim" />}
        <span>{node.label}</span>
      </button>
      <AnimatePresence initial={false}>
        {isParent && open && (
          <motion.ul
            role="group"
            className="gm-tree-group"
            initial={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={instant ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={instant ?? springs.soft}
          >
            {node.children!.map((c) => (
              <TreeRow key={c.label} node={c} depth={depth + 1} openSet={openSet} toggle={toggle} selected={selected} setSelected={setSelected} instant={instant} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export function TreeNavMenu(_: VariantProps) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(["0:components", "1:menus"]));
  const [selected, setSelected] = useState("2:MenuFamily.tsx");
  const instant = useInstant();
  const toggle = (k: string) =>
    setOpenSet((s) => { const n = new Set(s); if (n.has(k)) { n.delete(k); } else { n.add(k); } return n; });
  return (
    <ul className="gm-tree" role="tree" aria-label="Project files">
      {treeData.map((n) => (
        <TreeRow key={n.label} node={n} depth={0} openSet={openSet} toggle={toggle} selected={selected} setSelected={setSelected} instant={instant} />
      ))}
    </ul>
  );
}

/* ================================================================== */
/* 15 — PieContextMenu: radial pie wedges, angle-tracked highlight     */
/* ================================================================== */

const pieActions = [
  { label: "Cut", icon: <Copy size={15} /> },
  { label: "Copy", icon: <CopyPlus size={15} /> },
  { label: "Paste", icon: <Download size={15} /> },
  { label: "Share", icon: <Share2 size={15} /> },
  { label: "Star", icon: <Star size={15} /> },
  { label: "Delete", icon: <Trash2 size={15} /> },
];

function wedgePath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
  return `M ${p(r0, a0)} L ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
}

export function PieContextMenu({ defaultOpen = false }: VariantProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(defaultOpen ? { x: 150, y: 120 } : null);
  const [hot, setHot] = useState(-1);
  const [chosen, setChosen] = useState<string | null>(null);
  const instant = useInstant();
  const stageRef = useRef<HTMLDivElement>(null);
  useEscape(!!pos, useCallback(() => setPos(null), []));

  const openAt = (e: React.MouseEvent) => {
    e.preventDefault();
    const b = stageRef.current!.getBoundingClientRect();
    setChosen(null);
    setPos({
      x: Math.max(96, Math.min(e.clientX - b.left, b.width - 96)),
      y: Math.max(96, Math.min(e.clientY - b.top, b.height - 96)),
    });
  };

  const onMove = (e: React.MouseEvent) => {
    if (!pos) return;
    const dx = e.clientX - (stageRef.current!.getBoundingClientRect().left + pos.x);
    const dy = e.clientY - (stageRef.current!.getBoundingClientRect().top + pos.y);
    const dist = Math.hypot(dx, dy);
    if (dist < 26 || dist > 110) { setHot(-1); return; }
    const n = pieActions.length;
    const seg = (Math.PI * 2) / n;
    let a = Math.atan2(dy, dx) + seg / 2 + Math.PI / 2;
    a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    setHot(Math.floor(a / seg) % n);
  };

  const pick = (i: number) => { setChosen(pieActions[i].label); setPos(null); };

  const N = pieActions.length;
  const seg = (Math.PI * 2) / N;
  return (
    <div
      ref={stageRef}
      className="gm-ctx-stage gm-pie-stage"
      onContextMenu={openAt}
      onClick={(e) => { if (!pos) openAt(e); }}
      onMouseMove={onMove}
      role="application"
      aria-label="Canvas, right click for radial menu"
    >
      {!pos && (
        <p className="gm-ctx-hint">
          <MousePointer2 size={14} /> Right-click (or click) for the pie menu
          {chosen && <span className="gm-pie-chosen"> · last: {chosen}</span>}
        </p>
      )}
      <AnimatePresence>
        {pos && (
          <motion.div
            className="gm-pie-wrap"
            style={{ left: pos.x - 96, top: pos.y - 96 }}
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -30 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: 12 }}
            transition={instant ?? springs.bouncy}
          >
            <svg width="192" height="192" viewBox="0 0 192 192" role="menu" aria-label="Quick actions">
              {pieActions.map((a, i) => {
                const a0 = -Math.PI / 2 - seg / 2 + i * seg + 0.03;
                const a1 = a0 + seg - 0.06;
                return (
                  <path
                    key={a.label}
                    d={wedgePath(96, 96, 30, 88, a0, a1)}
                    className={`gm-pie-wedge${hot === i ? " gm-on" : ""}`}
                    role="menuitem"
                    aria-label={a.label}
                    onClick={() => pick(i)}
                  />
                );
              })}
              <circle cx="96" cy="96" r="24" className="gm-pie-cancel" onClick={() => setPos(null)}>
                <title>Close</title>
              </circle>
            </svg>
            {pieActions.map((a, i) => {
              const am = -Math.PI / 2 + i * seg;
              const x = 96 + Math.cos(am) * 59;
              const y = 96 + Math.sin(am) * 59;
              return (
                <span
                  key={a.label}
                  className={`gm-pie-icon${hot === i ? " gm-on" : ""}`}
                  style={{ left: x, top: y }}
                  aria-hidden
                >
                  {a.icon}
                </span>
              );
            })}
            {hot >= 0 && (
              <motion.span
                key={hot}
                className="gm-pie-label"
                initial={instant ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={instant ?? springs.bouncy}
              >
                {pieActions[hot].label}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 16 — GridAppMenu: 3x3 launcher grid with diagonal stagger           */
/* ================================================================== */

const gridApps = [
  { icon: <Home size={19} />, label: "Home", hue: "#60a5fa" },
  { icon: <MessageSquare size={19} />, label: "Chat", hue: "#f472b6" },
  { icon: <Calendar size={19} />, label: "Cal", hue: "#fbbf24" },
  { icon: <ImageIcon size={19} />, label: "Media", hue: "#34d399" },
  { icon: <LayoutGrid size={19} />, label: "Boards", hue: "#a78bfa" },
  { icon: <Globe size={19} />, label: "Sites", hue: "#06b6d4" },
  { icon: <Bell size={19} />, label: "Alerts", hue: "#fb7185" },
  { icon: <User size={19} />, label: "Team", hue: "#f97316" },
  { icon: <Settings size={19} />, label: "Config", hue: "#94a3b8" },
];

export function GridAppMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.button
        className="gm-btn gm-grid-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        whileTap={instant ? undefined : { scale: 0.92 }}
        transition={springs.stiff}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open app launcher"
      >
        <LayoutGrid size={16} /> Apps
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="gm-panel gm-grid-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -8 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 }}
            transition={instant ?? springs.snappy}
            style={{ transformOrigin: "top left" }}
          >
            <div className="gm-grid">
              {gridApps.map((a, i) => {
                const row = Math.floor(i / 3), col = i % 3;
                return (
                  <motion.button
                    key={a.label}
                    role="menuitem"
                    className="gm-grid-tile"
                    initial={instant ? false : { opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 0.05 + (row + col) * 0.045 }}
                    whileTap={instant ? undefined : { scale: 0.82 }}
                    whileHover={instant ? undefined : { y: -3 }}
                    onClick={() => setOpen(false)}
                  >
                    <span className="gm-grid-icon" style={{ color: a.hue, background: `color-mix(in srgb, ${a.hue} 14%, transparent)` }}>
                      {a.icon}
                    </span>
                    <span className="gm-grid-label">{a.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 17 — AccordionSpringMenu: inline sections with spring height        */
/* ================================================================== */

const accordionSections = [
  {
    label: "Notifications",
    icon: <Bell size={15} />,
    rows: ["Mentions and replies", "Weekly digest", "Product updates"],
  },
  {
    label: "Appearance",
    icon: <Star size={15} />,
    rows: ["Theme: System", "Density: Comfortable", "Reduce motion: Off"],
  },
  {
    label: "Privacy",
    icon: <User size={15} />,
    rows: ["Profile visibility", "Search indexing", "Blocked accounts"],
  },
];

export function AccordionSpringMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen ? 0 : null);
  const instant = useInstant();
  return (
    <div className="gm-acc">
      {accordionSections.map((s, i) => (
        <div className="gm-acc-item" key={s.label}>
          <motion.button
            className="gm-acc-head"
            aria-expanded={open === i}
            aria-controls={`gm-acc-panel-${i}`}
            whileTap={instant ? undefined : { scale: 0.985 }}
            transition={springs.stiff}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="gm-item-icon">{s.icon}</span>
            <span className="gm-acc-title">{s.label}</span>
            <motion.span
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={instant ?? springs.snappy}
              style={{ display: "inline-flex" }}
            >
              <ChevronDown size={14} className="gm-dim" />
            </motion.span>
          </motion.button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`gm-acc-panel-${i}`}
                className="gm-acc-panel"
                initial={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={instant ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                exit={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={instant ?? springs.soft}
              >
                <ul className="gm-acc-list">
                  {s.rows.map((r, j) => (
                    <motion.li
                      key={r}
                      initial={instant ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.06 + j * 0.04 }}
                    >
                      <button className="gm-acc-row">{r}<ChevronRight size={13} className="gm-dim" /></button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* 18 — MegaMenuHoverIntent: nav bar with hover-intent mega panel      */
/* ================================================================== */

const megaData: Record<string, { col: string; links: string[] }[]> = {
  Products: [
    { col: "Build", links: ["Canvas", "Blocks", "Templates"] },
    { col: "Ship", links: ["Hosting", "Analytics", "Domains"] },
  ],
  Solutions: [
    { col: "Teams", links: ["Startups", "Enterprise", "Agencies"] },
    { col: "Use cases", links: ["Marketing sites", "Dashboards", "Docs"] },
  ],
  Resources: [
    { col: "Learn", links: ["Guides", "API reference", "Changelog"] },
    { col: "Community", links: ["Discord", "Showcase", "Blog"] },
  ],
};

export function MegaMenuHoverIntent({ defaultOpen = false }: VariantProps) {
  const [active, setActive] = useState<string | null>(defaultOpen ? "Products" : null);
  const instant = useInstant();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(!!active, [rootRef], useCallback(() => setActive(null), []));
  useEscape(!!active, useCallback(() => setActive(null), []));

  const enter = (k: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActive(k); };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 220); // hover intent grace
  };

  return (
    <div className="gm-mega-root" ref={rootRef} onMouseLeave={leave}>
      <nav className="gm-mega-bar" aria-label="Site">
        <span className="gm-mega-logo">◆ goat</span>
        {Object.keys(megaData).map((k) => (
          <button
            key={k}
            className={`gm-mega-tab${active === k ? " gm-on" : ""}`}
            aria-expanded={active === k}
            onMouseEnter={() => enter(k)}
            onFocus={() => enter(k)}
            onClick={() => setActive(active === k ? null : k)}
          >
            {k}
            <motion.span animate={{ rotate: active === k ? 180 : 0 }} transition={instant ?? springs.snappy} style={{ display: "inline-flex" }}>
              <ChevronDown size={12} />
            </motion.span>
          </button>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            className="gm-mega-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={instant ?? springs.snappy}
            onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
          >
            {megaData[active].map((group) => (
              <div key={group.col} className="gm-mega-col">
                <p className="gm-cmdk-group">{group.col}</p>
                {group.links.map((l, i) => (
                  <motion.a
                    key={l}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="gm-mega-link"
                    initial={instant ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.05 + i * 0.04 }}
                  >
                    {l}
                    <ChevronRight size={12} className="gm-mega-arrow" />
                  </motion.a>
                ))}
              </div>
            ))}
            <div className="gm-mega-feature">
              <p className="gm-cmdk-group">Featured</p>
              <p className="gm-mega-feature-title">GOAT UI 2.0</p>
              <p className="gm-mega-feature-sub">Spring physics in every component.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 19 — ComboboxTypeahead: grouped combobox with tabular counts        */
/* ================================================================== */

interface ComboItem {
  group: string;
  label: string;
  count: number;
  icon: React.ReactNode;
}

const comboData: ComboItem[] = [
  { group: "Pages", label: "Pricing", count: 12, icon: <Globe size={15} /> },
  { group: "Pages", label: "Changelog", count: 48, icon: <Globe size={15} /> },
  { group: "Pages", label: "Careers", count: 6, icon: <Globe size={15} /> },
  { group: "Components", label: "MenuFamily", count: 30, icon: <LayoutGrid size={15} /> },
  { group: "Components", label: "CardFamily", count: 30, icon: <LayoutGrid size={15} /> },
  { group: "Components", label: "TabsFamily", count: 30, icon: <LayoutGrid size={15} /> },
  { group: "People", label: "Asha Verma", count: 3, icon: <User size={15} /> },
  { group: "People", label: "Ravi Menon", count: 11, icon: <User size={15} /> },
];

export function ComboboxTypeahead({ defaultOpen = false }: VariantProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  const results = useMemo(
    () => comboData.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  useEffect(() => setActive(0), [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % Math.max(results.length, 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1)); }
    if (e.key === "Enter" && results[active]) { e.preventDefault(); setPicked(results[active].label); setQ(results[active].label); setOpen(false); }
  };

  const groups = useMemo(() => {
    const m = new Map<string, { item: ComboItem; idx: number }[]>();
    results.forEach((item, idx) => {
      if (!m.has(item.group)) m.set(item.group, []);
      m.get(item.group)!.push({ item, idx });
    });
    return [...m.entries()];
  }, [results]);

  return (
    <div className="gm-root" ref={rootRef} style={{ width: 300 }}>
      <div className="gm-combo-box">
        <Search size={14} className="gm-dim" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search the site…"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={results[active] ? `gm-combo-${active}` : undefined}
          aria-label="Search the site"
        />
        {picked && (
          <motion.span
            className="gm-combo-picked"
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={instant ?? springs.bouncy}
          >
            <Check size={12} strokeWidth={3} />
          </motion.span>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            className="gm-panel gm-combo-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={instant ?? springs.snappy}
          >
            {results.length === 0 && <p className="gm-cmdk-empty">Nothing matches “{q}”</p>}
            {groups.map(([g, items]) => (
              <div key={g}>
                <p className="gm-cmdk-group">{g}</p>
                {items.map(({ item, idx }) => (
                  <button
                    key={item.label}
                    id={`gm-combo-${idx}`}
                    role="option"
                    aria-selected={active === idx}
                    className={`gm-cmdk-item${active === idx ? " gm-active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => { setPicked(item.label); setQ(item.label); setOpen(false); }}
                  >
                    <span className="gm-item-icon">{item.icon}</span>
                    <span className="gm-item-label">{item.label}</span>
                    <span className="gm-combo-count">{item.count}</span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 20 — SplitButtonMenu: joined action + chevron with separate springs */
/* ================================================================== */

const splitOptions = [
  { label: "Deploy to production", icon: <Zap size={14} /> },
  { label: "Deploy preview", icon: <Globe size={14} /> },
  { label: "Schedule deploy", icon: <Calendar size={14} /> },
];

export function SplitButtonMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  return (
    <div className="gm-root" ref={rootRef}>
      <div className="gm-split" role="group" aria-label="Deploy">
        <motion.button
          className="gm-split-main"
          whileTap={instant ? undefined : { scale: 0.94, x: -1 }}
          transition={springs.stiff}
        >
          <Zap size={14} /> Deploy
        </motion.button>
        <span className="gm-split-div" aria-hidden />
        <motion.button
          className="gm-split-caret"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Deploy options"
          whileTap={instant ? undefined : { scale: 0.9 }}
          transition={springs.stiff}
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={instant ?? springs.snappy} style={{ display: "inline-flex" }}>
            <ChevronDown size={14} />
          </motion.span>
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            className="gm-panel gm-split-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -8, scaleY: 0.9 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, scaleY: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={instant ?? springs.snappy}
            style={{ transformOrigin: "top center" }}
          >
            {splitOptions.map((o, i) => (
              <li key={o.label}>
                <motion.button
                  role="menuitem"
                  className="gm-item"
                  initial={instant ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.04 + i * 0.04 }}
                  onClick={() => setOpen(false)}
                >
                  <span className="gm-item-icon">{o.icon}</span>
                  <span className="gm-item-label">{o.label}</span>
                </motion.button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 21 — DrawerSideMenu: right drawer with overshoot + item stagger     */
/* ================================================================== */

const drawerLinks = [
  { icon: <Home size={16} />, label: "Overview" },
  { icon: <LayoutGrid size={16} />, label: "Projects" },
  { icon: <Bell size={16} />, label: "Activity", badge: "4" },
  { icon: <User size={16} />, label: "Members" },
  { icon: <Settings size={16} />, label: "Settings" },
];

export function DrawerSideMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();

  return (
    <div className="gm-speed-root">
      {!open && (
        <motion.button
          className="gm-btn gm-drawer-open"
          whileTap={instant ? undefined : { scale: 0.95 }}
          transition={springs.stiff}
          onClick={() => setOpen(true)}
        >
          Open drawer
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="gm-speed-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Workspace navigation"
              className="gm-drawer"
              initial={instant ? { opacity: 0 } : { x: "108%" }}
              animate={instant ? { opacity: 1 } : { x: 0 }}
              exit={instant ? { opacity: 0 } : { x: "108%" }}
              transition={instant ?? { type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="gm-drawer-head">
                <span className="gm-drawer-title">Workspace</span>
                <motion.button
                  className="gm-drawer-x"
                  aria-label="Close drawer"
                  whileTap={instant ? undefined : { scale: 0.85, rotate: 90 }}
                  transition={springs.stiff}
                  onClick={() => setOpen(false)}
                >
                  <X size={15} />
                </motion.button>
              </div>
              <nav>
                {drawerLinks.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="gm-drawer-link"
                    initial={instant ? false : { opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.08 + i * 0.05 }}
                  >
                    <span className="gm-item-icon">{l.icon}</span>
                    <span className="gm-item-label">{l.label}</span>
                    {l.badge && <span className="gm-drawer-badge">{l.badge}</span>}
                  </motion.a>
                ))}
              </nav>
              <p className="gm-drawer-foot">Free plan · 2 of 3 seats</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 22 — CurtainMenu: twin panels part to reveal the menu               */
/* ================================================================== */

const curtainItems = ["Home", "Work", "About", "Contact"];

export function CurtainMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();

  return (
    <div className="gm-curtain-root">
      <motion.button
        className="gm-btn gm-curtain-trigger"
        aria-expanded={open}
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </motion.button>
      <div className="gm-curtain-stage" aria-hidden={!open}>
        <motion.div
          className="gm-curtain-half gm-left"
          animate={open ? { x: "-101%" } : { x: 0 }}
          transition={instant ?? { type: "spring", stiffness: 210, damping: 26 }}
        />
        <motion.div
          className="gm-curtain-half gm-right"
          animate={open ? { x: "101%" } : { x: 0 }}
          transition={instant ?? { type: "spring", stiffness: 210, damping: 26 }}
        />
        <nav className="gm-curtain-nav" aria-label="Site">
          {curtainItems.map((l, i) => (
            <motion.a
              key={l}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="gm-curtain-link"
              tabIndex={open ? 0 : -1}
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : (instant ? { opacity: 0 } : { opacity: 0, y: 18 })}
              transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : open ? 0.16 + i * 0.06 : 0 }}
            >
              <span className="gm-curtain-num">0{i + 1}</span>
              {l}
            </motion.a>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 23 — MeterSelect: vertical drag meter with tick snapping            */
/* ================================================================== */

export function MeterSelect(_: VariantProps) {
  const [value, setValue] = useState(64);
  const instant = useInstant();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromPointer = (clientY: number, snap: boolean) => {
    const b = trackRef.current!.getBoundingClientRect();
    let v = Math.round(((b.bottom - clientY) / b.height) * 100);
    v = Math.max(0, Math.min(100, v));
    if (snap) v = Math.round(v / 10) * 10;
    setValue(v);
  };

  return (
    <div className="gm-meter-root">
      <div
        ref={trackRef}
        className="gm-meter-track"
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setFromPointer(e.clientY, false);
        }}
        onPointerMove={(e) => dragging.current && setFromPointer(e.clientY, false)}
        onPointerUp={(e) => { dragging.current = false; setFromPointer(e.clientY, true); }}
        onKeyDown={(e) => {
          const d = e.key === "ArrowUp" ? 10 : e.key === "ArrowDown" ? -10 : 0;
          if (d) { e.preventDefault(); setValue((v) => Math.max(0, Math.min(100, v + d))); }
        }}
      >
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="gm-meter-tick" style={{ bottom: `${t}%` }} aria-hidden />
        ))}
        <motion.div
          className="gm-meter-fill"
          animate={{ height: `${value}%` }}
          transition={dragging.current ? { duration: 0.05 } : (instant ?? springs.soft)}
        />
        <motion.div
          className="gm-meter-thumb"
          animate={{ bottom: `${value}%` }}
          transition={dragging.current ? { duration: 0.05 } : (instant ?? springs.bouncy)}
        />
      </div>
      <motion.p key={value} className="gm-meter-value" initial={instant ? false : { scale: 0.85 }} animate={{ scale: 1 }} transition={instant ?? springs.bouncy}>
        {value}
        <span className="gm-meter-unit">%</span>
      </motion.p>
      <p className="gm-meter-label">Volume</p>
    </div>
  );
}

/* ================================================================== */
/* 24 — EmojiGridMenu: roving-tabindex picker with category tabs       */
/* ================================================================== */

const emojiSets: Record<string, string[]> = {
  Smileys: ["😀", "😄", "😂", "🤣", "😊", "😍", "🤩", "😎", "🥳", "🤔", "😴", "🙃", "😅", "🥺", "😤", "🤯"],
  Animals: ["🐶", "🐱", "🦊", "🐼", "🐨", "🦁", "🐸", "🐵", "🦄", "🐝", "🦋", "🐙", "🦖", "🐳", "🦉", "🐢"],
  Food: ["🍎", "🍊", "🍉", "🍇", "🍓", "🥭", "🍍", "🥝", "🍕", "🍔", "🌮", "🍜", "🍣", "🍩", "🧁", "☕"],
};

export function EmojiGridMenu(_: VariantProps) {
  const cats = Object.keys(emojiSets);
  const [cat, setCat] = useState(cats[0]);
  const [focus, setFocus] = useState(0);
  const [recent, setRecent] = useState<string[]>(["🐐"]);
  const navByKey = useRef(false);
  const instant = useInstant();
  const emojis = emojiSets[cat];

  const pick = (e: string) =>
    setRecent((r) => [e, ...r.filter((x) => x !== e)].slice(0, 8));

  const onKey = (e: React.KeyboardEvent) => {
    const cols = 8;
    let n = focus;
    if (e.key === "ArrowRight") n = (focus + 1) % emojis.length;
    else if (e.key === "ArrowLeft") n = (focus - 1 + emojis.length) % emojis.length;
    else if (e.key === "ArrowDown") n = Math.min(focus + cols, emojis.length - 1);
    else if (e.key === "ArrowUp") n = Math.max(focus - cols, 0);
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(emojis[focus]); return; }
    else return;
    e.preventDefault();
    navByKey.current = true;
    setFocus(n);
  };

  return (
    <div className="gm-emoji" onKeyDown={onKey}>
      <div className="gm-emoji-tabs" role="tablist" aria-label="Emoji categories">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            className={`gm-emoji-tab${cat === c ? " gm-on" : ""}`}
            onClick={() => { setCat(c); setFocus(0); }}
          >
            {cat === c && <motion.span layoutId="gm-emoji-tabpill" className="gm-emoji-tabpill" transition={instant ?? springs.snappy} aria-hidden />}
            <span className="gm-seg-text">{c}</span>
          </button>
        ))}
      </div>
      <div className="gm-emoji-grid" role="grid" aria-label={`${cat} emoji`}>
        <AnimatePresence mode="popLayout">
          {emojis.map((e, i) => (
            <motion.button
              key={`${cat}-${e}`}
              role="gridcell"
              tabIndex={focus === i ? 0 : -1}
              ref={(el) => { if (focus === i && el && navByKey.current) { navByKey.current = false; el.focus(); } }}
              className={`gm-emoji-cell${focus === i ? " gm-focus" : ""}`}
              aria-label={`Insert ${e}`}
              initial={instant ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : i * 0.015 }}
              whileTap={instant ? undefined : { scale: 0.7 }}
              onMouseEnter={() => setFocus(i)}
              onClick={() => pick(e)}
            >
              {e}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <div className="gm-emoji-recent">
        <span className="gm-cmdk-group" style={{ margin: 0 }}>Recent</span>
        <AnimatePresence mode="popLayout">
          {recent.map((e) => (
            <motion.span
              key={e}
              layout
              className="gm-emoji-recent-chip"
              initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
              transition={instant ?? springs.bouncy}
            >
              {e}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 25 — ToastStackMenu: actions arrive as a dismissible toast stack    */
/* ================================================================== */

interface Toast {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  hue: string;
}

let toastSeq = 3;
const initialToasts: Toast[] = [
  { id: 0, icon: <Check size={15} />, title: "Deployed", desc: "goatui.vercel.app is live", hue: "#34d399" },
  { id: 1, icon: <UserPlus size={15} />, title: "Asha joined", desc: "Studio North workspace", hue: "#6d7cff" },
  { id: 2, icon: <Bell size={15} />, title: "3 mentions", desc: "in #design-review", hue: "#fbbf24" },
];

export function ToastStackMenu(_: VariantProps) {
  const [toasts, setToasts] = useState<Toast[]>(initialToasts);
  const instant = useInstant();
  const push = () =>
    setToasts((t) => [
      ...t.slice(-2),
      { id: toastSeq++, icon: <Zap size={15} />, title: `Event ${toastSeq}`, desc: "just now", hue: "#f472b6" },
    ]);
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <div className="gm-speed-root">
      <motion.button
        className="gm-btn gm-toast-push"
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        onClick={push}
      >
        <Bell size={14} /> Push notification
      </motion.button>
      <div className="gm-toast-stack" role="log" aria-label="Notifications">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className="gm-toast"
              role="status"
              drag={instant ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) dismiss(t.id); }}
              initial={instant ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={instant ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.85 }}
              transition={instant ?? springs.bouncy}
            >
              <span className="gm-toast-icon" style={{ color: t.hue, background: `color-mix(in srgb, ${t.hue} 14%, transparent)` }}>
                {t.icon}
              </span>
              <span className="gm-toast-text">
                <span className="gm-toast-title">{t.title}</span>
                <span className="gm-toast-desc">{t.desc}</span>
              </span>
              <button className="gm-chip-x" aria-label={`Dismiss ${t.title}`} onClick={() => dismiss(t.id)}>
                <X size={11} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 26 — SearchMorphDropdown: pill input morphs into a results panel    */
/* ================================================================== */

const morphResults = ["goatui.vercel.app", "github.com/Bandi-maya/goatui", "MenuFamily.tsx", "lab/menus"];

export function SearchMorphDropdown({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.div
        layout
        className={`gm-morph${open ? " gm-morph-open" : ""}`}
        transition={instant ?? springs.soft}
        style={{ borderRadius: open ? 14 : 999 }}
      >
        <motion.div layout="position" className="gm-morph-inputrow">
          <Search size={14} className="gm-dim" />
          <input
            placeholder="Quick jump…"
            aria-label="Quick jump"
            onFocus={() => setOpen(true)}
          />
          {!open && <kbd className="gm-kbd">/</kbd>}
          {open && (
            <motion.button
              className="gm-chip-x"
              aria-label="Close"
              initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={instant ?? springs.bouncy}
              onClick={() => setOpen(false)}
            >
              <X size={11} />
            </motion.button>
          )}
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.ul
              className="gm-morph-list"
              initial={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={instant ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={instant ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={instant ?? springs.soft}
            >
              {morphResults.map((r, i) => (
                <motion.li
                  key={r}
                  initial={instant ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.08 + i * 0.045 }}
                >
                  <button className="gm-item gm-morph-item" onClick={() => setOpen(false)}>
                    <span className="gm-item-label gm-mono">{r}</span>
                    <ChevronRight size={13} className="gm-dim" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/* 27 — StepBreadcrumbMenu: dropdown as a vertical progress stepper    */
/* ================================================================== */

const steps = [
  { label: "Account created", state: "done" as const },
  { label: "Profile completed", state: "done" as const },
  { label: "Billing connected", state: "current" as const },
  { label: "Launch checklist", state: "todo" as const },
];

export function StepBreadcrumbMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(open, [rootRef], useCallback(() => setOpen(false), []));
  useEscape(open, useCallback(() => setOpen(false), []));
  const done = steps.filter((s) => s.state === "done").length;

  return (
    <div className="gm-root" ref={rootRef}>
      <motion.button
        className="gm-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        whileTap={instant ? undefined : { scale: 0.94 }}
        transition={springs.stiff}
        onClick={() => setOpen((o) => !o)}
      >
        Setup
        <span className="gm-step-count">{done}/{steps.length}</span>
        <ChevronDown size={14} className="gm-dim" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ol
            role="menu"
            className="gm-panel gm-step-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={instant ?? springs.snappy}
          >
            {steps.map((s, i) => (
              <motion.li
                key={s.label}
                className="gm-step"
                initial={instant ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.06 + i * 0.07 }}
              >
                {i < steps.length - 1 && (
                  <motion.span
                    className={`gm-step-line${s.state === "done" ? " gm-done" : ""}`}
                    initial={instant ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.12 + i * 0.07 }}
                    aria-hidden
                  />
                )}
                <span className={`gm-step-node gm-${s.state}`} aria-hidden>
                  {s.state === "done" ? (
                    <motion.span
                      initial={instant ? false : { scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ ...(instant ?? springs.bouncy), delay: instant ? 0 : 0.1 + i * 0.07 }}
                      style={{ display: "inline-flex" }}
                    >
                      <Check size={11} strokeWidth={3.5} />
                    </motion.span>
                  ) : s.state === "current" ? (
                    <motion.span
                      className="gm-step-pulse"
                      animate={instant ? undefined : { scale: [1, 1.5, 1], opacity: [0.9, 0.3, 0.9] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                </span>
                <span className={`gm-step-label gm-${s.state}`}>{s.label}</span>
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 28 — InkUnderlineMenu: sliding ink bar with attached dropdown       */
/* ================================================================== */

const inkTabs = ["Overview", "Analytics", "Reports"];
const inkReports = ["Weekly digest", "Funnel report", "Export CSV"];

export function InkUnderlineMenu({ defaultOpen = false }: VariantProps) {
  const [tab, setTab] = useState(defaultOpen ? 2 : 0);
  const [drop, setDrop] = useState(defaultOpen);
  const instant = useInstant();
  const rootRef = useRef<HTMLDivElement>(null);
  useClickOutside(drop, [rootRef], useCallback(() => setDrop(false), []));
  useEscape(drop, useCallback(() => setDrop(false), []));

  return (
    <div className="gm-root" ref={rootRef}>
      <nav className="gm-ink-bar" aria-label="Sections">
        {inkTabs.map((t, i) => (
          <button
            key={t}
            className={`gm-ink-tab${tab === i ? " gm-on" : ""}`}
            aria-current={tab === i ? "page" : undefined}
            aria-expanded={i === 2 ? drop : undefined}
            onClick={() => { setTab(i); if (i === 2) setDrop((d) => !d); else setDrop(false); }}
          >
            {t}
            {tab === i && (
              <motion.span layoutId="gm-ink" className="gm-ink" transition={instant ?? springs.snappy} aria-hidden />
            )}
          </button>
        ))}
      </nav>
      <AnimatePresence>
        {drop && tab === 2 && (
          <motion.ul
            role="menu"
            className="gm-panel gm-ink-panel"
            initial={instant ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={instant ?? springs.snappy}
            style={{ transformOrigin: "top right" }}
          >
            {inkReports.map((r, i) => (
              <li key={r}>
                <motion.button
                  role="menuitem"
                  className="gm-item"
                  initial={instant ? false : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : i * 0.04 }}
                  onClick={() => setDrop(false)}
                >
                  <span className="gm-item-label">{r}</span>
                  <Download size={13} className="gm-dim" />
                </motion.button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* 29 — OrbitalMenu: satellites spiral out along an arc with a trail   */
/* ================================================================== */

const orbitItems = [
  { icon: <Pencil size={15} />, label: "Edit" },
  { icon: <Star size={15} />, label: "Star" },
  { icon: <Share2 size={15} />, label: "Share" },
  { icon: <Download size={15} />, label: "Save" },
  { icon: <Trash2 size={15} />, label: "Delete" },
];

export function OrbitalMenu({ defaultOpen = false }: VariantProps) {
  const [open, setOpen] = useState(defaultOpen);
  const instant = useInstant();
  const R = 84;
  const N = orbitItems.length;

  return (
    <div className="gm-ring-root gm-orbit-root">
      <svg className="gm-orbit-ring" width="200" height="200" viewBox="0 0 200 200" aria-hidden>
        <motion.circle
          cx="100" cy="100" r={R}
          fill="none"
          stroke="rgba(109,124,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          animate={open ? (instant ? { opacity: 1 } : { opacity: 1, rotate: 360 }) : { opacity: 0 }}
          transition={instant ?? { duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        />
      </svg>
      {orbitItems.map((a, i) => {
        const angle = -Math.PI / 2 + (i / N) * Math.PI * 2;
        const x = Math.cos(angle) * R;
        const y = Math.sin(angle) * R;
        return (
          <motion.button
            key={a.label}
            className="gm-ring-item gm-orbit-item"
            aria-label={a.label}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            initial={false}
            animate={
              open
                ? instant ? { opacity: 1 } : { x, y, scale: 1, opacity: 1, rotate: 0 }
                : instant ? { opacity: 0 } : { x: 0, y: 0, scale: 0.15, opacity: 0, rotate: -540 }
            }
            transition={{ ...(instant ?? { type: "spring", stiffness: 180, damping: 16 }), delay: instant ? 0 : open ? i * 0.06 : 0 }}
            whileHover={instant ? undefined : { scale: 1.18 }}
            whileTap={instant ? undefined : { scale: 0.85 }}
            style={{ pointerEvents: open ? "auto" : "none" }}
          >
            {a.icon}
            <span className="gm-ring-tip" role="tooltip">{a.label}</span>
          </motion.button>
        );
      })}
      <motion.button
        className="gm-ring-fab gm-orbit-fab"
        aria-expanded={open}
        aria-label={open ? "Close orbit menu" : "Open orbit menu"}
        whileTap={instant ? undefined : { scale: 0.88 }}
        animate={instant ? { rotate: open ? 45 : 0 } : { rotate: open ? 405 : 0 }}
        transition={instant ?? { type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setOpen((o) => !o)}
      >
        <Plus size={20} />
      </motion.button>
    </div>
  );
}

/* ================================================================== */
/* 30 — SpotlightContextMenu: context menu with cursor spotlight       */
/* ================================================================== */

const spotItems = [
  { n: "01", label: "Open in new tab", icon: <Globe size={15} /> },
  { n: "02", label: "Copy address", icon: <Link2 size={15} /> },
  { n: "03", label: "Inspect element", icon: <Search size={15} /> },
  { n: "04", label: "Save offline", icon: <Download size={15} /> },
  { n: "05", label: "Delete forever", icon: <Trash2 size={15} /> },
];

export function SpotlightContextMenu({ defaultOpen = false }: VariantProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(defaultOpen ? { x: 96, y: 56 } : null);
  const instant = useInstant();
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(!!pos, [panelRef], useCallback(() => setPos(null), []));
  useEscape(!!pos, useCallback(() => setPos(null), []));

  const openAt = (e: React.MouseEvent) => {
    e.preventDefault();
    const b = stageRef.current!.getBoundingClientRect();
    setPos({
      x: Math.min(e.clientX - b.left, b.width - 236),
      y: Math.min(e.clientY - b.top, b.height - 216),
    });
  };

  const track = (e: React.MouseEvent) => {
    const p = panelRef.current;
    if (!p) return;
    const b = p.getBoundingClientRect();
    p.style.setProperty("--gm-spot-x", `${e.clientX - b.left}px`);
    p.style.setProperty("--gm-spot-y", `${e.clientY - b.top}px`);
  };

  return (
    <div
      ref={stageRef}
      className="gm-ctx-stage"
      onContextMenu={openAt}
      onClick={(e) => { if (!pos) openAt(e); }}
      role="application"
      aria-label="Page area, right click for menu"
    >
      {!pos && (
        <p className="gm-ctx-hint">
          <MousePointer2 size={14} /> Right-click (or click) for the spotlight menu
        </p>
      )}
      <AnimatePresence>
        {pos && (
          <motion.div
            ref={panelRef}
            role="menu"
            className="gm-panel gm-spot-panel"
            style={{ left: pos.x, top: pos.y, transformOrigin: "top left" }}
            initial={instant ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
            animate={instant ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={instant ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={instant ?? springs.snappy}
            onMouseMove={track}
          >
            {spotItems.map((item, i) => (
              <motion.button
                key={item.n}
                role="menuitem"
                className={`gm-item gm-spot-item${item.label.includes("Delete") ? " gm-danger" : ""}`}
                initial={instant ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...(instant ?? springs.soft), delay: instant ? 0 : 0.05 + i * 0.035 }}
                onClick={() => setPos(null)}
              >
                <span className="gm-spot-num">{item.n}</span>
                <span className="gm-item-icon">{item.icon}</span>
                <span className="gm-item-label">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                    }
