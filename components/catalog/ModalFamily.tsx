"use client";

/* ============================================================
   GOAT UI - Modal & Dialog Family (30 variants)
   Copy-paste components. CSS lives in ModalFamily.css.
   Spring motion + damped drag physics + prefers-reduced-motion.
   ============================================================ */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X, Search, Sparkles, Trash2, Bell, Command, ChevronLeft, ChevronRight,
  Play, Pause, SkipBack, SkipForward, Share2, Copy, Link2, Mail, MessageCircle,
  Crown, Check, Gem, Zap, Home, Folder, Settings, Users, Calendar, Star,
  ArrowRight, ArrowLeft, Plus, Keyboard, ListChecks, Image as ImageIcon,
  Maximize2, Volume2, Heart, Flag, Bookmark, Download, Globe, Lock,
} from "lucide-react";
import "./ModalFamily.css";

export interface ModalVariantProps {
  /** Render overlay absolutely inside a relative parent (lab preview). */
  contained?: boolean;
  /** Start open (lab preview). */
  defaultOpen?: boolean;
}

/* ---------- shared hooks ---------- */

function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
    };
    window.addEventListener("keydown", fn, true);
    return () => window.removeEventListener("keydown", fn, true);
  }, [active, onClose]);
}


/* Keeps an overlay mounted while it plays its exit (slide down). */
function usePresence(open: boolean, ms = 360) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); setClosing(false); return; }
    setClosing(true);
    const t = window.setTimeout(() => { setMounted(false); setClosing(false); }, ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted: mounted || open, closing: closing && !open };
}

function useAutofocus<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (active) {
      const t = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), 60);
      return () => window.clearTimeout(t);
    }
  }, [active]);
  return ref;
}

function Overlay({
  contained,
  closing = false,
  className = "",
  label,
  onBackdrop,
  plain = false,
  children,
}: {
  contained?: boolean;
  closing?: boolean;
  className?: string;
  label: string;
  onBackdrop?: () => void;
  plain?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`gmf-overlay ${className} ${contained ? "is-contained" : ""} ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => { if (e.target === e.currentTarget) onBackdrop?.(); }}
    >
      <div
        className={`gmf-backdrop ${plain ? "plain" : ""}`}
        onClick={onBackdrop}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function CloseBtn({ onClose, className = "", label = "Close dialog" }: { onClose: () => void; className?: string; label?: string }) {
  return (
    <button type="button" className={`gmf-iconbtn ${className}`} onClick={onClose} aria-label={label}>
      <X size={15} strokeWidth={2.2} />
    </button>
  );
}

function Trigger({ onOpen, children }: { onOpen: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="gmf-trigger" onClick={onOpen}>
      {children}
    </button>
  );
}

/* ============================================================
   01 - CenterSpringModal
   ============================================================ */
export function CenterSpringModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Sparkles size={14} /> Open dialog</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-cs" label="Publish project" onBackdrop={close}>
          <div className="gmf-cs-panel" ref={ref} tabIndex={-1}>
            <CloseBtn onClose={close} className="gmf-cs-close" />
            <div className="gmf-cs-badge"><Sparkles size={20} /></div>
            <h3 className="gmf-cs-title">Publish to production?</h3>
            <p className="gmf-cs-sub">
              Version <span className="num">2.4.0</span> will go live for all
              {" "}<span className="num">1,248</span> team members. You can roll back anytime.
            </p>
            <div className="gmf-cs-actions">
              <button type="button" className="gmf-btn ghost" onClick={close}>Cancel</button>
              <button type="button" className="gmf-btn primary" onClick={close}>Publish <ArrowRight size={14} /></button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   02 - SlideOverRight
   ============================================================ */
const SOR_ROWS = [
  { icon: <Folder size={16} />, name: "Design system audit", meta: "12 files - edited 2h ago" },
  { icon: <ImageIcon size={16} />, name: "Hero illustrations v3", meta: "8 assets - shared with you" },
  { icon: <ListChecks size={16} />, name: "Launch checklist", meta: "26 tasks - 70% done" },
  { icon: <Users size={16} />, name: "Beta testers", meta: "128 members" },
  { icon: <Globe size={16} />, name: "goatui.vercel.app", meta: "Production deployment" },
];
export function SlideOverRight({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Folder size={14} /> Open drawer</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-sor" label="Project files" onBackdrop={close}>
          <div className="gmf-sor-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-sor-head">
              <h3>Recent files</h3>
              <CloseBtn onClose={close} />
            </div>
            <div className="gmf-sor-list">
              {SOR_ROWS.map((r) => (
                <button type="button" className="gmf-sor-row" key={r.name}>
                  <span className="gmf-cmd-ico">{r.icon}</span>
                  <span className="meta"><b>{r.name}</b><span>{r.meta}</span></span>
                  <ChevronRight size={14} color="#68738a" />
                </button>
              ))}
            </div>
            <div className="gmf-sor-foot">
              <button type="button" className="gmf-btn ghost" style={{ flex: 1 }}>Archive all</button>
              <button type="button" className="gmf-btn primary" style={{ flex: 1 }} onClick={close}>Done</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   03 - BottomSheetSnap (real damped-spring drag)
   ============================================================ */
export function BottomSheetSnap({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ startY: 0, dy: 0, vel: 0, lastY: 0, lastT: 0, active: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.active = true; d.startY = e.clientY; d.dy = 0; d.vel = 0;
    d.lastY = e.clientY; d.lastT = performance.now();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const el = panelRef.current;
    if (el) el.style.transition = "none";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vel = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY; d.lastT = now;
    d.dy = Math.max(0, e.clientY - d.startY);
    const el = panelRef.current;
    if (el) el.style.transform = `translateY(${d.dy}px)`;
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const el = panelRef.current;
    if (!el) return;
    if (d.dy > 110 || d.vel > 0.55) {
      el.style.transition = "transform 260ms cubic-bezier(0.5,0,0.75,0)";
      el.style.transform = "translateY(110%)";
      window.setTimeout(close, 240);
    } else {
      // damped spring snap-back
      el.style.transition = "transform 560ms cubic-bezier(0.22, 1.36, 0.36, 1)";
      el.style.transform = "translateY(0)";
    }
  };

  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><ListChecks size={14} /> Open sheet</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-bs" label="Choose a destination" onBackdrop={close}>
          <div
            className="gmf-bs-panel"
            ref={panelRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="gmf-bs-grip" aria-hidden="true" />
            <h3 className="gmf-bs-title">Move to project</h3>
            <p className="gmf-bs-sub">Drag down to dismiss, or pick a destination below.</p>
            <div className="gmf-bs-opts">
              {[
                ["#4d8dff", "GOAT UI Library", "32 components"],
                ["#34d399", "Marketing site", "18 components"],
                ["#fbbf24", "Mobile app shell", "9 components"],
                ["#fb4d6d", "Archive", "Read only"],
              ].map(([c, n, m]) => (
                <button type="button" className="gmf-bs-opt" key={n} onClick={close}>
                  <span className="dot" style={{ background: c }} />
                  <span style={{ flex: 1 }}>{n}</span>
                  <span style={{ color: "#68738a", fontSize: 12 }} className="num">{m}</span>
                </button>
              ))}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   04 - TopDropBanner
   ============================================================ */
export function TopDropBanner({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Zap size={14} /> Show banner</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-td" label="New version available" onBackdrop={close}>
          <div className="gmf-td-panel" role="alert">
            <div className="gmf-td-ico"><Zap size={20} color="#fff" /></div>
            <div className="gmf-td-body">
              <b>GOAT UI <span className="num">v2.4</span> is live</b>
              <span>30 new modal variants just dropped. Spring physics included.</span>
            </div>
            <button type="button" className="gmf-td-pill" onClick={close}>Changelog</button>
            <CloseBtn onClose={close} />
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   05 - CommandPalette
   ============================================================ */
const CMD_ITEMS = [
  { g: "Actions", icon: <Plus size={14} />, t: "Create new component", k: "C" },
  { g: "Actions", icon: <Copy size={14} />, t: "Copy install command", k: "I" },
  { g: "Actions", icon: <Share2 size={14} />, t: "Share preview link", k: "S" },
  { g: "Navigate", icon: <Home size={14} />, t: "Go to dashboard", k: "G D" },
  { g: "Navigate", icon: <Settings size={14} />, t: "Open settings", k: "G S" },
  { g: "Navigate", icon: <Star size={14} />, t: "View changelog", k: "G L" },
];
export function CommandPalette({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const close = useCallback(() => { setOpen(false); setQ(""); setIdx(0); }, []);
  useEscape(open, close);
  const inputRef = useAutofocus<HTMLInputElement>(open);
  const items = useMemo(
    () => CMD_ITEMS.filter((i) => i.t.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  useEffect(() => setIdx(0), [q]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((v) => Math.min(items.length - 1, v + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((v) => Math.max(0, v - 1)); }
    if (e.key === "Enter" && items[idx]) close();
  };
  let lastGroup = "";
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Command size={14} /> Command menu <span className="gmf-kbd">K</span></Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-cmd" label="Command palette" onBackdrop={close}>
          <div className="gmf-cmd-panel" onKeyDown={onKey}>
            <div className="gmf-cmd-inputrow">
              <Search size={16} color="#68738a" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command or search..."
                aria-label="Search commands"
              />
              <span className="gmf-kbd">esc</span>
            </div>
            <div className="gmf-cmd-group" role="listbox" aria-label="Commands">
              {items.map((i, n) => {
                const head = i.g !== lastGroup ? <div className="gmf-cmd-label" key={`h-${i.g}-${n}`}>{i.g}</div> : null;
                lastGroup = i.g;
                return (
                  <React.Fragment key={i.t}>
                    {head}
                    <button
                      type="button"
                      role="option"
                      aria-selected={n === idx}
                      className={`gmf-cmd-item ${n === idx ? "active" : ""}`}
                      onMouseEnter={() => setIdx(n)}
                      onClick={close}
                    >
                      <span className="gmf-cmd-ico">{i.icon}</span>
                      <span className="grow">{i.t}</span>
                      <span className="gmf-kbd">{i.k}</span>
                    </button>
                  </React.Fragment>
                );
              })}
              {items.length === 0 && (
                <div style={{ padding: 18, color: "#68738a", fontSize: 13, textAlign: "center" }}>
                  No results for "{q}"
                </div>
              )}
            </div>
            <div className="gmf-cmd-foot">
              <span><span className="gmf-kbd">↑↓</span> navigate</span>
              <span><span className="gmf-kbd">↵</span> select</span>
              <span style={{ marginLeft: "auto" }} className="num">{items.length} results</span>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   06 - LightboxGallery
   ============================================================ */
const LB_SLIDES = [
  { cap: "Nebula study - render 04", bg: "radial-gradient(120% 90% at 20% 10%, #2f466e 0%, transparent 55%), radial-gradient(100% 100% at 85% 80%, #1d4e5f 0%, transparent 50%), linear-gradient(160deg, #141c29, #0b0e15)" },
  { cap: "Chrome dunes - v2", bg: "radial-gradient(110% 90% at 80% 15%, #7a3b5f 0%, transparent 55%), radial-gradient(90% 90% at 15% 85%, #2e4a7a 0%, transparent 55%), linear-gradient(200deg, #131b29, #0c0b12)" },
  { cap: "Solar field - print A", bg: "radial-gradient(100% 100% at 50% 100%, #7a5a2e 0%, transparent 60%), radial-gradient(80% 80% at 80% 10%, #2e456e 0%, transparent 55%), linear-gradient(160deg, #111823, #0b0a10)" },
  { cap: "Iris bloom - macro", bg: "radial-gradient(90% 90% at 30% 30%, #2e6e54 0%, transparent 55%), radial-gradient(100% 100% at 85% 85%, #6e2e4d 0%, transparent 55%), linear-gradient(140deg, #141a1e, #0a0d10)" },
];
export function LightboxGallery({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [idx, setIdx] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  const slide = LB_SLIDES[idx];
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><ImageIcon size={14} /> Open lightbox</Trigger>
      {pres.mounted && (
        <div
          className={`gmf-overlay gmf-lb ${contained ? "is-contained" : ""} ${pres.closing ? "is-closing" : ""}`}
          role="dialog" aria-modal="true" aria-label="Image lightbox"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="gmf-lb-frame" ref={ref} tabIndex={-1}>
            <CloseBtn onClose={close} className="gmf-lb-close" />
            <div className="gmf-lb-media" style={{ background: slide.bg }}>
              <span className="gmf-lb-caption">{slide.cap}</span>
              <span className="gmf-lb-count num">{idx + 1} / {LB_SLIDES.length}</span>
            </div>
            <button type="button" className="gmf-lb-nav prev" aria-label="Previous image"
              onClick={() => setIdx((v) => (v - 1 + LB_SLIDES.length) % LB_SLIDES.length)}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="gmf-lb-nav next" aria-label="Next image"
              onClick={() => setIdx((v) => (v + 1) % LB_SLIDES.length)}>
              <ChevronRight size={18} />
            </button>
            <div className="gmf-lb-thumbs" role="tablist" aria-label="Slides">
              {LB_SLIDES.map((s, n) => (
                <button
                  key={s.cap} type="button" role="tab" aria-selected={n === idx}
                  aria-label={`Slide ${n + 1}`}
                  className={`gmf-lb-thumb ${n === idx ? "active" : ""}`}
                  style={{ background: s.bg }}
                  onClick={() => setIdx(n)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   07 - ConfirmDestructive
   ============================================================ */
export function ConfirmDestructive({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Trash2 size={14} /> Delete project</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-cfd" label="Delete project confirmation" onBackdrop={close}>
          <div className="gmf-cfd-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-cfd-ring"><Trash2 size={24} /></div>
            <h3 className="gmf-cfd-title">Delete "Marketing site"?</h3>
            <p className="gmf-cfd-sub">
              This removes <span className="num">18</span> components and
              {" "}<span className="num">4</span> shared links. This cannot be undone.
            </p>
            <div className="gmf-cfd-actions">
              <button type="button" className="gmf-btn ghost" onClick={close}>Keep it</button>
              <button type="button" className="gmf-btn danger" onClick={close}>Delete forever</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   08 - IOSAlertDialog
   ============================================================ */
export function IOSAlertDialog({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Bell size={14} /> Show alert</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-ios" label="Allow notifications" onBackdrop={close} plain>
          <div className="gmf-ios-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-ios-body">
              <div className="gmf-ios-title">Allow Notifications</div>
              <div className="gmf-ios-sub">GOAT UI would like to send you release notes and mentions.</div>
            </div>
            <div className="gmf-ios-actions">
              <button type="button" className="gmf-ios-action bold" onClick={close}>Allow</button>
              <button type="button" className="gmf-ios-action" onClick={close}>Only While Using</button>
              <button type="button" className="gmf-ios-action red" onClick={close}>Don't Allow</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   09 - ActionToastDialog
   ============================================================ */
export function ActionToastDialog({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Check size={14} /> Trigger toast</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-tst" label="Export complete" plain onBackdrop={close}>
          <div className="gmf-tst-panel" role="status">
            <div className="gmf-tst-ico"><Check size={18} /></div>
            <div className="gmf-tst-body">
              <b>Export complete</b>
              <span><span className="num">30</span> components bundled to <span className="num">goat-ui.zip</span> (<span className="num">2.4 MB</span>).</span>
              <div className="gmf-tst-actions">
                <button type="button" className="gmf-btn primary" onClick={close}><Download size={12} /> Download</button>
                <button type="button" className="gmf-btn ghost" onClick={close}>Dismiss</button>
              </div>
            </div>
            <CloseBtn onClose={close} />
            <div className="gmf-tst-timer" aria-hidden="true"><i /></div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   10 - FullScreenTakeover
   ============================================================ */
export function FullScreenTakeover({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Maximize2 size={14} /> Launch takeover</Trigger>
      {pres.mounted && (
        <div className={`gmf-overlay gmf-fst ${contained ? "is-contained" : ""} ${pres.closing ? "is-closing" : ""}`} role="dialog" onClick={(e) => { if (e.target === e.currentTarget) close(); }} aria-modal="true" aria-label="Welcome to GOAT UI Pro">
          <div className="gmf-fst-inner">
            <CloseBtn onClose={close} className="gmf-fst-close" />
            <span className="gmf-fst-eyebrow">Introducing Pro</span>
            <h2 className="gmf-fst-title">Every overlay pattern, perfected.</h2>
            <p className="gmf-fst-sub">
              Thirty hand-tuned modal variants with real spring physics, keyboard
              support and a consistent 4px grid. Copy, paste, ship.
            </p>
            <div className="gmf-fst-feats">
              <span className="gmf-fst-feat"><Zap size={13} color="#95b8f6" /> Spring motion</span>
              <span className="gmf-fst-feat"><Keyboard size={13} color="#95b8f6" /> Full keyboard nav</span>
              <span className="gmf-fst-feat"><Check size={13} color="#95b8f6" /> axe clean</span>
              <span className="gmf-fst-feat"><Copy size={13} color="#95b8f6" /> Zero install</span>
            </div>
            <div className="gmf-fst-cta">
              <button type="button" className="gmf-btn primary" style={{ padding: "12px 22px" }} onClick={close}>Start free <ArrowRight size={15} /></button>
              <button type="button" className="gmf-btn ghost" style={{ padding: "12px 22px" }} onClick={close}>Watch the tour</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   11 - LeftDockDrawer
   ============================================================ */
const LDD_ITEMS = [
  { icon: <Home size={15} />, t: "Home", c: "" },
  { icon: <Folder size={15} />, t: "Projects", c: "12" },
  { icon: <Star size={15} />, t: "Favorites", c: "5" },
  { icon: <Users size={15} />, t: "Team", c: "" },
  { icon: <Calendar size={15} />, t: "Releases", c: "3" },
  { icon: <Settings size={15} />, t: "Settings", c: "" },
];
export function LeftDockDrawer({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [sel, setSel] = useState(1);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Home size={14} /> Open dock</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-ldd" label="Navigation dock" onBackdrop={close}>
          <div className="gmf-ldd-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-ldd-brand">
              <span className="gmf-ldd-logo">G</span>
              <b>GOAT UI</b>
              <CloseBtn onClose={close} className="" />
            </div>
            <nav className="gmf-ldd-nav" aria-label="Primary">
              {LDD_ITEMS.map((i, n) => (
                <button
                  type="button" key={i.t}
                  className={`gmf-ldd-item ${n === sel ? "active" : ""}`}
                  aria-current={n === sel ? "page" : undefined}
                  onClick={() => setSel(n)}
                >
                  {i.icon}<span>{i.t}</span>
                  {i.c && <span className="count num">{i.c}</span>}
                </button>
              ))}
            </nav>
            <div className="gmf-ldd-foot">
              <span className="gmf-avatar" style={{ background: "linear-gradient(135deg,#34d399,#5cc8ff)", width: 28, height: 28, fontSize: 10 }}>BM</span>
              <span>Bandi Maya<br /><span style={{ color: "#68738a", fontSize: 11 }}>Pro workspace</span></span>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   12 - AnchoredPopover
   ============================================================ */
export function AnchoredPopover({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Users size={14} /> Assign to...</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-pop-ov" label="Assign member" plain onBackdrop={close}>
          <div className="gmf-pop-anchor">
            <div className="gmf-pop-panel">
              {[
                ["BM", "Bandi Maya", "Owner - online", "#4d8dff,#77a5f4", true],
                ["AR", "Ananya Rao", "Design - 2h ago", "#34d399,#5cc8ff", false],
                ["VK", "Vikram K", "Engineering - 5m ago", "#fbbf24,#fb923c", false],
              ].map(([ini, name, meta, grad, dot]) => (
                <button type="button" className="gmf-pop-item" key={name as string} onClick={close}>
                  <span className="gmf-avatar" style={{ background: `linear-gradient(135deg,${grad})`, width: 30, height: 30, fontSize: 10.5 }}>{ini}</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{name}<span className="sub">{meta}</span></span>
                  {dot ? <span className="gmf-pop-dot" aria-label="online" /> : null}
                </button>
              ))}
              <div className="gmf-pop-sep" />
              <button type="button" className="gmf-pop-item" onClick={close}>
                <span className="gmf-cmd-ico" style={{ width: 30, height: 30 }}><Plus size={13} /></span>
                Invite someone new
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   13 - FanContextMenu (radial fan)
   ============================================================ */
const FAN = [
  { a: "-72deg", d: "96px", icon: <Heart size={13} color="#fb4d6d" />, t: "Like" },
  { a: "-36deg", d: "104px", icon: <Bookmark size={13} color="#fbbf24" />, t: "Save" },
  { a: "0deg", d: "108px", icon: <Copy size={13} color="#5cc8ff" />, t: "Copy" },
  { a: "36deg", d: "104px", icon: <Share2 size={13} color="#34d399" />, t: "Share" },
  { a: "72deg", d: "96px", icon: <Flag size={13} color="#fb923c" />, t: "Report" },
];
export function FanContextMenu({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Plus size={14} /> Fan menu</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-fan-ov" label="Quick actions" onBackdrop={close}>
          <div className="gmf-fan-root">
            <div className="gmf-fan-core"><Sparkles size={20} /></div>
            {FAN.map((f) => (
              <button
                type="button" key={f.t}
                className="gmf-fan-item"
                style={{ "--a": f.a, "--dist": f.d } as React.CSSProperties}
                onClick={close}
              >
                {f.icon}{f.t}
              </button>
            ))}
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   14 - WizardStepsModal
   ============================================================ */
const WIZ_STEPS = ["Project", "Details", "Review"];
export function WizardStepsModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [step, setStep] = useState(0);
  const close = useCallback(() => { setOpen(false); setStep(0); }, []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><ListChecks size={14} /> New project</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-wiz" label="Create project wizard" onBackdrop={close}>
          <div className="gmf-wiz-panel" ref={ref} tabIndex={-1}>
            <CloseBtn onClose={close} className="gmf-cs-close" />
            <div className="gmf-wiz-rail" aria-label={`Step ${step + 1} of 3`}>
              {WIZ_STEPS.map((s, n) => (
                <React.Fragment key={s}>
                  <span className={`gmf-wiz-stepdot ${n === step ? "on" : ""} ${n < step ? "done" : ""}`}>
                    <span className="n num">{n < step ? <Check size={11} /> : n + 1}</span>{s}
                  </span>
                  {n < WIZ_STEPS.length - 1 && (
                    <span className="gmf-wiz-bar"><i style={{ "--p": n < step ? 1 : 0 } as React.CSSProperties} /></span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="gmf-wiz-viewport">
              <div className="gmf-wiz-track" style={{ transform: `translateX(-${step * 100}%)` }}>
                <div className="gmf-wiz-pane">
                  <h3>Name your project</h3>
                  <p>This is how it appears across your workspace.</p>
                  <div className="gmf-wiz-field">
                    <label htmlFor="gmf-wiz-name">Project name</label>
                    <input id="gmf-wiz-name" placeholder="e.g. GOAT UI Library" defaultValue="GOAT UI Library" />
                  </div>
                  <div className="gmf-wiz-field">
                    <label htmlFor="gmf-wiz-slug">Slug</label>
                    <input id="gmf-wiz-slug" placeholder="goat-ui" defaultValue="goat-ui" />
                  </div>
                </div>
                <div className="gmf-wiz-pane">
                  <h3>Pick a starter</h3>
                  <p>Preload your project with a component set.</p>
                  <div className="gmf-wiz-choices">
                    {["Modals - 30 variants", "Cards - 30 variants", "Tabs - 30 variants", "Blank canvas"].map((c, n) => (
                      <button type="button" key={c} className={`gmf-wiz-choice ${n === 0 ? "sel" : ""}`}>
                        <b>{c.split(" - ")[0]}</b><span>{c.split(" - ")[1] ?? "Start empty"}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="gmf-wiz-pane">
                  <h3>Review & create</h3>
                  <p>Everything look right?</p>
                  <div className="gmf-wiz-choices" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="gmf-wiz-choice sel"><b>GOAT UI Library</b><span>goat-ui - Modals starter (30 variants)</span></div>
                    <div className="gmf-wiz-choice"><b>Visibility</b><span>Private to your workspace</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="gmf-wiz-foot">
              <button type="button" className="gmf-btn ghost" disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft size={13} /> Back
              </button>
              {step < 2 ? (
                <button type="button" className="gmf-btn primary" onClick={() => setStep((s) => Math.min(2, s + 1))}>
                  Continue <ArrowRight size={13} />
                </button>
              ) : (
                <button type="button" className="gmf-btn primary" onClick={close}>
                  <Check size={13} /> Create project
                </button>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   15 - CookieConsentBar
   ============================================================ */
export function CookieConsentBar({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [toggles, setToggles] = useState([true, true, false]);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const labels = ["Essential", "Analytics", "Marketing"];
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Lock size={14} /> Cookie preferences</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-cck" label="Cookie preferences" plain onBackdrop={close}>
          <div className="gmf-cck-panel" role="region" aria-label="Cookie consent">
            <div className="gmf-cck-text">
              <b>We use cookies</b>
              <span>Essential cookies keep you signed in. Analytics help us improve the library. No tracking outside goatui.dev.</span>
            </div>
            <div className="gmf-cck-toggles" role="group" aria-label="Cookie categories">
              {labels.map((l, n) => (
                <button
                  type="button" key={l}
                  className={`gmf-cck-pill ${toggles[n] ? "on" : ""}`}
                  aria-pressed={toggles[n]}
                  aria-disabled={n === 0}
                  onClick={() => n !== 0 && setToggles((t) => t.map((v, i) => (i === n ? !v : v)))}
                >
                  <i aria-hidden="true" />{l}
                </button>
              ))}
            </div>
            <div className="gmf-cck-btns">
              <button type="button" className="gmf-btn ghost" onClick={close}>Reject all</button>
              <button type="button" className="gmf-btn primary" onClick={close}>Save choices</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   16 - PaywallGradientModal
   ============================================================ */
export function PaywallGradientModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Crown size={14} /> Upgrade</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-pay" label="Upgrade to Pro" onBackdrop={close}>
          <div className="gmf-pay-panel">
            <div className="gmf-pay-inner" ref={ref} tabIndex={-1}>
              <CloseBtn onClose={close} className="gmf-cs-close" />
              <div className="gmf-pay-crown"><Crown size={14} /> GOAT UI Pro</div>
              <h3 className="gmf-pay-title">Unlock every variant</h3>
              <div className="gmf-pay-price">
                <span className="amt num">$0</span>
                <span className="per">/ forever - free & open</span>
              </div>
              <div className="gmf-pay-feats">
                {["All 150+ copy-paste variants", "Spring motion presets", "Figma tokens & themes", "Lifetime updates"].map((f) => (
                  <div className="gmf-pay-feat" key={f}>
                    <span className="gmf-pay-check"><Check size={11} strokeWidth={3} /></span>{f}
                  </div>
                ))}
              </div>
              <button type="button" className="gmf-pay-cta" onClick={close}>Claim Pro access</button>
              <div className="gmf-pay-note">No card required. Cancel anytime (there's nothing to cancel).</div>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   17 - CinemaVideoModal
   ============================================================ */
export function CinemaVideoModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Play size={14} /> Watch intro</Trigger>
      {pres.mounted && (
        <div className={`gmf-overlay gmf-cin ${contained ? "is-contained" : ""} ${pres.closing ? "is-closing" : ""}`} role="dialog" onClick={(e) => { if (e.target === e.currentTarget) close(); }} aria-modal="true" aria-label="Video player">
          <div className="gmf-cin-panel">
            <div className="gmf-cin-screen">
              <button type="button" className="gmf-cin-play" aria-label="Play video" onClick={close}>
                <Play size={26} fill="currentColor" />
              </button>
              <div className="gmf-cin-hud">
                <Volume2 size={13} color="#a7b0c3" />
                <div className="gmf-cin-track" aria-hidden="true"><i /></div>
                <span className="gmf-cin-time num">01:12 / 03:48</span>
                <Maximize2 size={13} color="#a7b0c3" />
              </div>
            </div>
            <div className="gmf-cin-title">
              <b>Designing spring physics for UI</b>
              <span className="num">128K views - 4K</span>
            </div>
            <CloseBtn onClose={close} className="gmf-cin-close" />
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   18 - SpotlightSearch
   ============================================================ */
export function SpotlightSearch({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLInputElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Search size={14} /> Spotlight</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-spt" label="Spotlight search" onBackdrop={close}>
          <div className="gmf-spt-panel">
            <div className="gmf-spt-field">
              <Search size={19} color="#95b8f6" />
              <input ref={ref} placeholder="Search components, docs, tokens..." aria-label="Spotlight search" />
              <span className="gmf-kbd">esc</span>
            </div>
            <div className="gmf-spt-chips" aria-label="Recent searches">
              {["bottom sheet", "command palette", "spring easing", "lightbox"].map((c) => (
                <button type="button" className="gmf-spt-chip" key={c} onClick={close}>{c}</button>
              ))}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   19 - ShareSheet
   ============================================================ */
const SHARE_APPS = [
  { n: "Copy link", g: "linear-gradient(135deg,#4d8dff,#95b8f6)", icon: <Link2 size={20} /> },
  { n: "Messages", g: "linear-gradient(135deg,#34d399,#0ea5e9)", icon: <MessageCircle size={20} /> },
  { n: "Mail", g: "linear-gradient(135deg,#5cc8ff,#4d8dff)", icon: <Mail size={20} /> },
  { n: "X / Post", g: "linear-gradient(135deg,#334155,#0f172a)", icon: <Share2 size={20} /> },
  { n: "WhatsApp", g: "linear-gradient(135deg,#22c55e,#15803d)", icon: <MessageCircle size={20} /> },
  { n: "Save file", g: "linear-gradient(135deg,#fbbf24,#fb923c)", icon: <Download size={20} /> },
  { n: "AirDrop", g: "linear-gradient(135deg,#94a3b8,#475569)", icon: <Globe size={20} /> },
  { n: "More", g: "linear-gradient(135deg,#475569,#1e293b)", icon: <Plus size={20} /> },
];
export function ShareSheet({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Share2 size={14} /> Share</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-shr" label="Share component" onBackdrop={close}>
          <div className="gmf-shr-wrap">
            <div className="gmf-shr-card">
              <div className="gmf-shr-grid">
                {SHARE_APPS.map((a) => (
                  <button type="button" className="gmf-shr-app" key={a.n} onClick={close}>
                    <span className="gmf-shr-appico" style={{ background: a.g }}>{a.icon}</span>
                    {a.n}
                  </button>
                ))}
              </div>
            </div>
            <div className="gmf-shr-card gmf-shr-actions">
              <button type="button" className="gmf-shr-action" onClick={close}><Copy size={15} /> Copy embed code</button>
              <button type="button" className="gmf-shr-action" onClick={close}><Star size={15} /> Add to favorites</button>
              <button type="button" className="gmf-shr-action" onClick={close}><Flag size={15} /> Report issue</button>
            </div>
            <button type="button" className="gmf-shr-cancel" onClick={close}>Cancel</button>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   20 - CoachmarkTour
   ============================================================ */
const COA_STEPS = [
  { t: "Welcome to the lab", p: "Every variant on this page is live. Press replay to watch its entrance physics again." },
  { t: "Copy in one click", p: "Open any variant and hit Copy to grab the exact TSX + CSS. No install step." },
  { t: "Tune the springs", p: "Every easing token is a CSS variable. Override --spring once and the whole family follows." },
];
export function CoachmarkTour({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [step, setStep] = useState(0);
  const close = useCallback(() => { setOpen(false); setStep(0); }, []);
  useEscape(open, close);
  const s = COA_STEPS[step];
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Sparkles size={14} /> Start tour</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-coa-ov" label="Product tour" plain onBackdrop={close}>
          <div className="gmf-coa-ring" aria-hidden="true" />
          <div className="gmf-coa-tip" role="status">
            <b>{s.t}</b>
            <p>{s.p}</p>
            <div className="gmf-coa-foot">
              <span className="gmf-coa-dots" aria-label={`Step ${step + 1} of ${COA_STEPS.length}`}>
                {COA_STEPS.map((_, n) => <i key={n} className={n === step ? "on" : ""} />)}
              </span>
              <button type="button" className="gmf-coa-next" onClick={() => (step < COA_STEPS.length - 1 ? setStep(step + 1) : close())}>
                {step < COA_STEPS.length - 1 ? "Next" : "Done"}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   21 - NeoBrutalistModal
   ============================================================ */
export function NeoBrutalistModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Zap size={14} /> Brutalist confirm</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-bru" label="Confirm publish" plain onBackdrop={close}>
          <div className="gmf-bru-panel" ref={ref} tabIndex={-1}>
            <span className="gmf-bru-tag">Heads up</span>
            <h3 className="gmf-bru-title">SHIP IT TO PROD?</h3>
            <p className="gmf-bru-sub">
              <span className="num">47</span> commits are about to go live. No take-backs. Well, okay, rollbacks exist. But still.
            </p>
            <div className="gmf-bru-actions">
              <button type="button" className="gmf-bru-btn yes" onClick={close}>Ship it</button>
              <button type="button" className="gmf-bru-btn no" onClick={close}>Wait</button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   22 - GlassOrbitModal
   ============================================================ */
export function GlassOrbitModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Gem size={14} /> Glass stats</Trigger>
      {pres.mounted && (
        <div className={`gmf-overlay gmf-gls ${contained ? "is-contained" : ""} ${pres.closing ? "is-closing" : ""}`} role="dialog" onClick={(e) => { if (e.target === e.currentTarget) close(); }} aria-modal="true" aria-label="Workspace stats">
          <div className="gmf-backdrop" onClick={close} aria-hidden="true" />
          <div className="gmf-gls-stage">
            <div className="gmf-gls-blob" aria-hidden="true" />
            <div className="gmf-gls-panel" ref={ref} tabIndex={-1}>
              <CloseBtn onClose={close} className="gmf-cs-close" />
              <h3 className="gmf-gls-title">This week in GOAT UI</h3>
              <p className="gmf-gls-sub">Your library is trending with the community.</p>
              <div className="gmf-gls-stats">
                <div className="gmf-gls-stat"><b className="num">4.2k</b><span>copies</span></div>
                <div className="gmf-gls-stat"><b className="num">312</b><span>stars</span></div>
                <div className="gmf-gls-stat"><b className="num">98%</b><span>a11y score</span></div>
              </div>
              <button type="button" className="gmf-gls-cta" onClick={close}>View analytics</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   23 - Tilt3DModal (lerped pointer tilt)
   ============================================================ */
export function Tilt3DModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, raf: 0 });

  const tick = useCallback(() => {
    const s = state.current;
    // critically-damped-ish lerp toward target
    s.rx += (s.tx - s.rx) * 0.14;
    s.ry += (s.ty - s.ry) * 0.14;
    const el = cardRef.current;
    if (el) el.style.transform = `rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)`;
    if (Math.abs(s.tx - s.rx) > 0.02 || Math.abs(s.ty - s.ry) > 0.02) {
      s.raf = requestAnimationFrame(tick);
    } else { s.raf = 0; }
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const s = state.current;
    s.ty = (px - 0.5) * 14;
    s.tx = (0.5 - py) * 12;
    const card = cardRef.current;
    if (card) {
      const shine = card.querySelector<HTMLElement>(".gmf-tlt-shine");
      if (shine) { shine.style.setProperty("--mx", `${px * 100}%`); shine.style.setProperty("--my", `${py * 100}%`); }
    }
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };
  const onLeave = () => {
    const s = state.current;
    s.tx = 0; s.ty = 0;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Gem size={14} /> 3D tilt card</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-tlt" label="Pro member card" onBackdrop={close}>
          <div className="gmf-tlt-panel" ref={panelRef} onPointerMove={onMove} onPointerLeave={onLeave}>
            <div className="gmf-tlt-card" ref={cardRef}>
              <div className="gmf-tlt-shine" aria-hidden="true" />
              <div className="gmf-tlt-layer">
                <div className="gmf-tlt-gem"><Gem size={22} /></div>
                <h3 className="gmf-tlt-title">Holographic member card</h3>
                <p className="gmf-tlt-sub">Move your pointer across the card. Layers sit at 24px and 40px of real Z depth.</p>
              </div>
              <div className="gmf-tlt-layer-2 gmf-tlt-actions">
                <button type="button" className="gmf-btn primary" onClick={close}>Activate</button>
                <button type="button" className="gmf-btn ghost" onClick={close}>Later</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   24 - MorphFabModal
   ============================================================ */
export function MorphFabModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Plus size={14} /> Quick create</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-fab-ov" label="Quick create" plain onBackdrop={close}>
          <div className="gmf-fab-root">
            <div className="gmf-fab-panel">
              <h3 className="gmf-fab-title">Quick create</h3>
              <p className="gmf-fab-sub">Morphed from the FAB - same origin, new shape.</p>
              <div className="gmf-fab-rows">
                <button type="button" className="gmf-fab-row" onClick={close}><Plus size={13} color="#95b8f6" /> New component</button>
                <button type="button" className="gmf-fab-row" onClick={close}><Folder size={13} color="#5cc8ff" /> New project</button>
                <button type="button" className="gmf-fab-row" onClick={close}><Users size={13} color="#34d399" /> Invite teammate</button>
              </div>
            </div>
            <button type="button" className="gmf-fab-btn" onClick={close} aria-label="Close quick create">
              <X size={20} />
            </button>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   25 - NotificationCenter
   ============================================================ */
const NTC = [
  { g: "Today", items: [
    { ini: "AR", grad: "#34d399,#5cc8ff", b: "Ananya starred GOAT UI", s: "Your repo just hit 312 stars.", t: "2m ago", unread: true },
    { ini: "VK", grad: "#fbbf24,#fb923c", b: "Vikram mentioned you", s: "\"these spring curves are unreal\"", t: "26m ago", unread: true },
  ]},
  { g: "Earlier", items: [
    { ini: "GH", grad: "#94a3b8,#475569", b: "Build succeeded", s: "goatui.vercel.app deployed in 41s.", t: "3h ago", unread: false },
    { ini: "BM", grad: "#4d8dff,#77a5f4", b: "You shipped v2.3", s: "Tabs family - 30 variants.", t: "1d ago", unread: false },
  ]},
];
export function NotificationCenter({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Bell size={14} /> Notifications</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-ntc" label="Notification center" onBackdrop={close}>
          <div className="gmf-ntc-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-ntc-head">
              <div><h3>Notifications</h3><span className="num">2 unread</span></div>
              <CloseBtn onClose={close} />
            </div>
            <div className="gmf-ntc-body">
              {NTC.map((grp) => (
                <div key={grp.g}>
                  <div className="gmf-ntc-label">{grp.g}</div>
                  {grp.items.map((n) => (
                    <div className="gmf-ntc-item" key={n.b}>
                      <span className="gmf-avatar" style={{ background: `linear-gradient(135deg,${n.grad})` }}>{n.ini}</span>
                      <span className="txt"><b>{n.b}</b><span>{n.s}</span><time>{n.t}</time></span>
                      {n.unread && <span className="gmf-ntc-unread" aria-label="unread" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   26 - ShortcutsDialog
   ============================================================ */
const KBD_ROWS: [string, string[]][] = [
  ["Open command palette", ["⌘", "K"]],
  ["Copy component", ["⌘", "C"]],
  ["Toggle theme", ["⌘", "D"]],
  ["Next variant", ["→"]],
  ["Previous variant", ["←"]],
  ["Replay animation", ["R"]],
  ["Close overlay", ["Esc"]],
  ["Search docs", ["/"]],
  ["Open lab", ["G", "L"]],
  ["Fullscreen preview", ["F"]],
];
export function ShortcutsDialog({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Keyboard size={14} /> Shortcuts</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-kb" label="Keyboard shortcuts" onBackdrop={close}>
          <div className="gmf-kb-panel" ref={ref} tabIndex={-1}>
            <div className="gmf-kb-head">
              <h3><Keyboard size={16} color="#95b8f6" /> Keyboard shortcuts</h3>
              <CloseBtn onClose={close} />
            </div>
            <div className="gmf-kb-cols">
              {KBD_ROWS.map(([label, keys]) => (
                <div className="gmf-kb-row" key={label}>
                  <span>{label}</span>
                  <span className="gmf-kb-keys">{keys.map((k) => <span className="gmf-kbd" key={k}>{k}</span>)}</span>
                </div>
              ))}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   27 - TaskProgressModal
   ============================================================ */
export function TaskProgressModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  const pct = 68;
  const off = 226.19 * (1 - pct / 100);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><ListChecks size={14} /> Sprint progress</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-prg" label="Sprint progress" onBackdrop={close}>
          <div className="gmf-prg-panel" ref={ref} tabIndex={-1}>
            <CloseBtn onClose={close} className="gmf-cs-close" />
            <div className="gmf-prg-top">
              <div className="gmf-prg-ring" role="img" aria-label={`${pct} percent complete`}>
                <svg width="84" height="84" viewBox="0 0 84 84">
                  <defs>
                    <linearGradient id="gmfPrgGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4d8dff" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                  <circle className="track" cx="42" cy="42" r="36" fill="none" strokeWidth="7" />
                  <circle className="val" cx="42" cy="42" r="36" fill="none" strokeWidth="7"
                    style={{ "--off": off } as React.CSSProperties} />
                </svg>
                <span className="gmf-prg-pct num">{pct}%</span>
              </div>
              <div>
                <h3>Modal family sprint</h3>
                <p><span className="num">20</span> of <span className="num">30</span> variants shipped this week.</p>
              </div>
            </div>
            <div className="gmf-prg-tasks">
              <div className="gmf-prg-task done"><span className="gmf-prg-check"><Check size={11} strokeWidth={3.5} /></span> Dialogs & confirmations</div>
              <div className="gmf-prg-task done"><span className="gmf-prg-check"><Check size={11} strokeWidth={3.5} /></span> Sheets & drawers</div>
              <div className="gmf-prg-task now"><span className="gmf-prg-check" /> Command overlays</div>
              <div className="gmf-prg-task"><span className="gmf-prg-check" /> Lightboxes & players</div>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   28 - RatingFeedbackModal
   ============================================================ */
const FACE_COLORS = ["#fb4d6d", "#fb923c", "#fbbf24", "#a3e635", "#34d399"];
const FACE_MOUTHS = [
  "M9.5 18 Q15 13.2 20.5 18",
  "M9.5 17 Q15 15.6 20.5 17",
  "M9.5 16.2 Q15 16.6 20.5 16.2",
  "M9.5 15 Q15 19.4 20.5 15",
  "M9 14.5 Q15 21.5 21 14.5",
];
function RatingFace({ level }: { level: number }) {
  const c = FACE_COLORS[level];
  return (
    <svg viewBox="0 0 30 30" width="26" height="26" aria-hidden="true">
      <circle cx="15" cy="15" r="11.5" fill="none" stroke={c} strokeWidth="2" />
      <circle cx="10.5" cy="12" r="1.7" fill={c} />
      <circle cx="19.5" cy="12" r="1.7" fill={c} />
      <path d={FACE_MOUTHS[level]} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function RatingFeedbackModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [sel, setSel] = useState<number | null>(4);
  const close = useCallback(() => { setOpen(false); }, []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Star size={14} /> Give feedback</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-rat" label="Rate your experience" onBackdrop={close}>
          <div className="gmf-rat-panel" ref={ref} tabIndex={-1}>
            <h3 className="gmf-rat-title">How's the modal family?</h3>
            <p className="gmf-rat-sub">Your taste shapes the next batch of variants.</p>
            <div className="gmf-rat-emojis" role="radiogroup" aria-label="Rating">
              {FACE_COLORS.map((_, n) => (
                <button
                  type="button" key={n}
                  role="radio" aria-checked={sel === n}
                  aria-label={`${n + 1} out of 5`}
                  className={`gmf-rat-emoji ${sel === n ? "sel" : ""}`}
                  onClick={() => setSel(n)}
                ><RatingFace level={n} /></button>
              ))}
            </div>
            {sel !== null && sel >= 3 && (
              <textarea className="gmf-rat-note" placeholder="What should we build next?" aria-label="Feedback" />
            )}
            <button type="button" className="gmf-btn primary gmf-rat-cta" onClick={close}>Send feedback</button>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   29 - SplitPreviewModal
   ============================================================ */
const SPL_ITEMS = [
  { n: "Aurora", sw: "linear-gradient(135deg,#4d8dff,#5cc8ff)", h: "linear-gradient(120deg,#1e3a8a,#0e7490)", d: "Cool violet-to-cyan sweep with a soft inner glow. Ships as the default theme.", tags: ["Dark", "Default", "v2.4"] },
  { n: "Ember", sw: "linear-gradient(135deg,#fb923c,#fb4d6d)", h: "linear-gradient(120deg,#7c2d12,#9f1239)", d: "Warm ember gradient for marketing surfaces. Pairs with cream type.", tags: ["Dark", "Warm"] },
  { n: "Meadow", sw: "linear-gradient(135deg,#34d399,#a3e635)", h: "linear-gradient(120deg,#064e3b,#3f6212)", d: "Fresh green system tuned for dashboards and data-dense overlays.", tags: ["Dark", "Data"] },
  { n: "Mono", sw: "linear-gradient(135deg,#e2e8f0,#64748b)", h: "linear-gradient(120deg,#1e293b,#0f172a)", d: "Pure grayscale. Zero hue, maximum contrast, editorial feel.", tags: ["Neutral", "axe AAA"] },
];
export function SplitPreviewModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [sel, setSel] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  const ref = useAutofocus<HTMLDivElement>(open);
  const item = SPL_ITEMS[sel];
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><ImageIcon size={14} /> Browse themes</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-spl" label="Theme browser" onBackdrop={close}>
          <div className="gmf-spl-panel" ref={ref} tabIndex={-1}>
            <CloseBtn onClose={close} className="gmf-spl-close" />
            <div className="gmf-spl-list" role="listbox" aria-label="Themes">
              {SPL_ITEMS.map((t, n) => (
                <button
                  type="button" key={t.n} role="option" aria-selected={n === sel}
                  className={`gmf-spl-item ${n === sel ? "sel" : ""}`}
                  onClick={() => setSel(n)}
                >
                  <span className="swatch" style={{ background: t.sw }} />
                  {t.n}
                </button>
              ))}
            </div>
            <div className="gmf-spl-detail">
              <div className="gmf-spl-hero" style={{ background: item.h }} />
              <h3>{item.n}</h3>
              <p>{item.d}</p>
              <div className="gmf-spl-meta">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="gmf-btn primary" onClick={close}>Apply theme</button>
                <button type="button" className="gmf-btn ghost" onClick={close}>Preview tokens</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   30 - MiniPlayerModal
   ============================================================ */
export function MiniPlayerModal({ contained, defaultOpen }: ModalVariantProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const pres = usePresence(open);
  const [playing, setPlaying] = useState(true);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  return (
    <>
      <Trigger onOpen={() => setOpen(true)}><Play size={14} /> Mini player</Trigger>
      {pres.mounted && (
        <Overlay closing={pres.closing} contained={contained} className="gmf-mpl" label="Now playing" plain onBackdrop={close}>
          <div className="gmf-mpl-panel" role="region" aria-label="Mini music player">
            <span className="gmf-mpl-art"><Volume2 size={17} /></span>
            <span className="gmf-mpl-meta">
              <b>Spring Physics (Lo-Fi Mix)</b>
              <span>GOAT FM - Episode <span className="num">30</span></span>
            </span>
            <span className="gmf-mpl-eq" aria-hidden="true" style={{ opacity: playing ? 1 : 0.3 }}>
              <i /><i /><i /><i />
            </span>
            <span className="gmf-mpl-ctl">
              <button type="button" className="gmf-iconbtn" aria-label="Previous track"><SkipBack size={14} /></button>
              <button type="button" className="gmf-iconbtn play" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
              <button type="button" className="gmf-iconbtn" aria-label="Next track"><SkipForward size={14} /></button>
              <CloseBtn onClose={close} />
            </span>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ============================================================
   Registry (used by app/lab/modals/page.tsx)
   ============================================================ */
export const MODAL_VARIANTS: { name: string; tag: string; C: React.ComponentType<ModalVariantProps> }[] = [
  { name: "CenterSpringModal", tag: "dialog", C: CenterSpringModal },
  { name: "SlideOverRight", tag: "drawer", C: SlideOverRight },
  { name: "BottomSheetSnap", tag: "sheet - draggable", C: BottomSheetSnap },
  { name: "TopDropBanner", tag: "banner", C: TopDropBanner },
  { name: "CommandPalette", tag: "command overlay", C: CommandPalette },
  { name: "LightboxGallery", tag: "lightbox", C: LightboxGallery },
  { name: "ConfirmDestructive", tag: "confirmation", C: ConfirmDestructive },
  { name: "IOSAlertDialog", tag: "alert", C: IOSAlertDialog },
  { name: "ActionToastDialog", tag: "toast dialog", C: ActionToastDialog },
  { name: "FullScreenTakeover", tag: "takeover", C: FullScreenTakeover },
  { name: "LeftDockDrawer", tag: "dock drawer", C: LeftDockDrawer },
  { name: "AnchoredPopover", tag: "popover", C: AnchoredPopover },
  { name: "FanContextMenu", tag: "radial menu", C: FanContextMenu },
  { name: "WizardStepsModal", tag: "multi-step", C: WizardStepsModal },
  { name: "CookieConsentBar", tag: "consent bar", C: CookieConsentBar },
  { name: "PaywallGradientModal", tag: "paywall", C: PaywallGradientModal },
  { name: "CinemaVideoModal", tag: "media lightbox", C: CinemaVideoModal },
  { name: "SpotlightSearch", tag: "search overlay", C: SpotlightSearch },
  { name: "ShareSheet", tag: "share sheet", C: ShareSheet },
  { name: "CoachmarkTour", tag: "tour", C: CoachmarkTour },
  { name: "NeoBrutalistModal", tag: "brutalist", C: NeoBrutalistModal },
  { name: "GlassOrbitModal", tag: "glassmorphism", C: GlassOrbitModal },
  { name: "Tilt3DModal", tag: "3D tilt", C: Tilt3DModal },
  { name: "MorphFabModal", tag: "FAB morph", C: MorphFabModal },
  { name: "NotificationCenter", tag: "drawer", C: NotificationCenter },
  { name: "ShortcutsDialog", tag: "cheat sheet", C: ShortcutsDialog },
  { name: "TaskProgressModal", tag: "progress", C: TaskProgressModal },
  { name: "RatingFeedbackModal", tag: "feedback", C: RatingFeedbackModal },
  { name: "SplitPreviewModal", tag: "split pane", C: SplitPreviewModal },
  { name: "MiniPlayerModal", tag: "mini player", C: MiniPlayerModal },
];
