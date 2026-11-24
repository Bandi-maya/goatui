"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./ToastFamily.css";

/* ------------------------------------------------------------------ */
/* shared demo scaffolding: stage wrapper with replay                  */
/* ------------------------------------------------------------------ */

function Stage({
  index,
  name,
  tall,
  children,
}: {
  index: number;
  name: string;
  tall?: boolean;
  children: React.ReactNode;
}) {
  const [replayKey, setReplayKey] = useState(0);
  return (
    <div className="tf-cell">
      <p className="tf-label">
        <span>{String(index).padStart(2, "0")}</span>
        <b>{name}</b>
      </p>
      <div className={tall ? "tf-demo tf-demo-tall" : "tf-demo"}>
        <div key={replayKey} style={{ display: "contents" }}>
          {children}
        </div>
        <button
          type="button"
          className="tf-replay"
          onClick={() => setReplayKey((k) => k + 1)}
          aria-label={`Replay ${name} animation`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* tiny inline icon set                                                */
/* ------------------------------------------------------------------ */

const I = {
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  warn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 4.8 3.2 7.4 8 8-4.8.6-7.4 3.2-8 8-.6-4.8-3.2-7.4-8-8 4.8-.6 7.4-3.2 8-8Z" />
    </svg>
  ),
  trash: (
    <svg className="ic-trash" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  ),
  play: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  ),
  trophy: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a2 2 0 0 0 2 4h1M17 6h3a2 2 0 0 1-2 4h-1" />
    </svg>
  ),
  cloud: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.6 4.5 4.5 0 0 0 6.5 19h11Z" />
    </svg>
  ),
  zap: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  ),
  chat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.4-.7L3 21l1.8-4.6A8.4 8.4 0 0 1 3 11.5a8.38 8.38 0 0 1 9-8.4 8.38 8.38 0 0 1 9 8.4Z" />
    </svg>
  ),
  music: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

/* count-up hook (tabular numerals) */
function useCountUp(target: number, duration = 1600, delay = 300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return val;
}

/* ============================================================
   01 — Aurora Glass
   ============================================================ */
export function ToastAuroraGlass() {
  return (
    <Stage index={1} name="Aurora Glass">
      <div className="tf-aurora">
        <div className="tf-aurora-card" role="status">
          <div className="tf-aurora-icon">{I.sparkle}</div>
          <div className="tf-aurora-body">
            <div className="tf-aurora-title">Design synced</div>
            <div className="tf-aurora-text">
              All 24 components were published to your team library.
            </div>
          </div>
          <button type="button" className="tf-iconbtn tf-aurora-close" aria-label="Dismiss notification">
            {I.x}
          </button>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   02 — Slide Stack
   ============================================================ */
const STACK_SEED = [
  { id: "a", color: "#5b5bd6", title: "New comment", text: "Riya replied in #goat-ui" },
  { id: "b", color: "#17a05e", title: "Deploy passed", text: "goatui.vercel.app is live" },
  { id: "c", color: "#f5a524", title: "Review needed", text: "PR #128 is waiting on you" },
];
export function ToastSlideStack() {
  const [items, setItems] = useState(STACK_SEED);
  const [exiting, setExiting] = useState<string | null>(null);
  const dismiss = (id: string) => {
    if (exiting) return;
    setExiting(id);
    window.setTimeout(() => {
      setItems((list) => list.filter((i) => i.id !== id));
      setExiting(null);
    }, 420);
  };
  return (
    <Stage index={2} name="Slide Stack">
      <div className="tf-stack" role="log" aria-label="Stacked notifications">
        {items.length > 1 && <span className="tf-stack-count">{items.length}</span>}
        {items.slice(0, 3).map((item, depth) => (
          <div
            className="tf-stack-card"
            data-depth={depth}
            data-exit={exiting === item.id ? 1 : 0}
            key={item.id}
            role="status"
          >
            <span className="tf-stack-dot" style={{ background: item.color }} />
            <div className="tf-stack-body">
              <div className="tf-stack-title">{item.title}</div>
              <div className="tf-stack-text">{item.text}</div>
            </div>
            {depth === 0 && (
              <button type="button" className="tf-iconbtn tf-stack-x" aria-label="Dismiss top notification" onClick={() => dismiss(item.id)}>
                {I.x}
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="tf-stack-card" data-depth="0" role="status">
            <span className="tf-stack-dot" style={{ background: "#17a05e" }} />
            <div className="tf-stack-body">
              <div className="tf-stack-title">All caught up</div>
              <div className="tf-stack-text">Hit replay to restack the deck.</div>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
}

/* ============================================================
   03 — Progress Line
   ============================================================ */
export function ToastProgressLine() {
  return (
    <Stage index={3} name="Progress Line">
      <div className="tf-line" role="status">
        <div className="tf-line-icon">{I.check}</div>
        <div className="tf-line-body">
          <b>Saved.</b> Auto-dismissing in 6s, hover to keep it.
        </div>
        <span className="tf-line-bar" aria-hidden="true" />
      </div>
    </Stage>
  );
}

/* ============================================================
   04 — Flip Card
   ============================================================ */
export function ToastFlipCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <Stage index={4} name="Flip Card">
      <div className="tf-flip" data-flipped={flipped ? 1 : 0}>
        <div className="tf-flip-inner">
          <div className="tf-flip-face" role="status">
            <div className="tf-flip-badge">{I.bell}</div>
            <div>
              <div className="tf-flip-title">Pro plan renews soon</div>
              <div className="tf-flip-text">Billing cycle ends in 5 days.</div>
            </div>
            <button type="button" className="tf-flip-hint" onClick={() => setFlipped(true)}>
              Details
            </button>
          </div>
          <div className="tf-flip-face tf-flip-back">
            <div>
              <div className="tf-flip-title">₹1,999 / year</div>
              <div className="tf-flip-text">Charged on Dec 1 to card ·· 4021.</div>
            </div>
            <button type="button" className="tf-btn tf-flip-act" onClick={() => setFlipped(false)}>
              Manage
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   05 — Terminal
   ============================================================ */
export function ToastTerminal() {
  const cmd = "npx goatui deploy --prod";
  const [n, setN] = useState(0);
  const done = n >= cmd.length;
  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => setN((v) => v + 1), 34);
    return () => window.clearTimeout(t);
  }, [n, done]);
  return (
    <Stage index={5} name="Terminal">
      <div className="tf-term" role="status" aria-label="Deployment succeeded">
        <div className="tf-term-head" aria-hidden="true"><i /><i /><i /></div>
        <div className="tf-term-row">
          <span className="tf-term-prompt">$</span>
          <span className="tf-term-cmd">
            {cmd.slice(0, n)}
            {!done && <span className="tf-term-cursor" />}
          </span>
        </div>
        {done && (
          <>
            <div className="tf-term-row">
              <span className="tf-term-ok">✔ build 1482 passed in 21.4s</span>
            </div>
            <div className="tf-term-row">
              <span className="tf-term-ok">✔ live at goatui.vercel.app</span>
              <span className="tf-term-cursor" />
            </div>
          </>
        )}
      </div>
    </Stage>
  );
}

/* ============================================================
   06 — Neubrutalist
   ============================================================ */
export function ToastNeubrutalist() {
  return (
    <Stage index={6} name="Neubrutalist">
      <div className="tf-brut" role="alert">
        <div className="tf-brut-icon">{I.warn}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tf-brut-title">Heads up!</div>
          <div className="tf-brut-text">
            Free tier covers 100 exports / month. You are at 94.
          </div>
        </div>
        <button type="button" className="tf-brut-x" aria-label="Dismiss warning">
          ✕
        </button>
      </div>
    </Stage>
  );
}

/* ============================================================
   07 — Orbit Badge
   ============================================================ */
export function ToastOrbitBadge() {
  return (
    <Stage index={7} name="Orbit Badge">
      <div className="tf-orbit" role="status">
        <div className="tf-orbit-avatarwrap">
          <div className="tf-orbit-avatar">RK</div>
          <svg className="tf-orbit-ring" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#c3c9dc" strokeWidth="1.6" strokeDasharray="4 5" />
            <circle cx="26" cy="2" r="3.4" fill="#17a05e" stroke="#fff" strokeWidth="1.6" />
          </svg>
        </div>
        <div className="tf-orbit-body">
          <div className="tf-orbit-title"><b>Riya Kapoor</b> mentioned you</div>
          <div className="tf-orbit-text">“Can we ship the toast family today?”</div>
        </div>
        <span className="tf-orbit-time">09:41</span>
      </div>
    </Stage>
  );
}

/* ============================================================
   08 — Ticket Stub
   ============================================================ */
export function ToastTicketStub() {
  return (
    <Stage index={8} name="Ticket Stub">
      <div className="tf-ticket" role="status">
        <div className="tf-ticket-stub">
          <span className="tf-ticket-cur">Paid</span>
          <span className="tf-ticket-amt">₹499</span>
          <span className="tf-ticket-code" aria-hidden="true" />
        </div>
        <div className="tf-ticket-tear" aria-hidden="true" />
        <div className="tf-ticket-main">
          <div className="tf-ticket-title">Payment receipt</div>
          <div className="tf-ticket-text">Invoice #INV-2041 settled via UPI.</div>
          <div className="tf-ticket-meta">
            <span className="tf-ticket-chip">UPI</span>
            <span className="tf-ticket-chip">Nov 24</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   09 — Liquid Blob
   ============================================================ */
export function ToastLiquidBlob() {
  return (
    <Stage index={9} name="Liquid Blob">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="tf-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="tf-goo-stage" role="status" aria-label="Four updates merged">
        <div className="tf-goo-blobs" aria-hidden="true">
          <i className="tf-goo-dot" /><i className="tf-goo-dot" /><i className="tf-goo-dot" /><i className="tf-goo-dot" />
        </div>
        <div className="tf-goo-card">
          <b>4 updates merged</b>
          <span>into one digest</span>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   10 — Rail Snackbar
   ============================================================ */
export function ToastRailSnackbar() {
  return (
    <Stage index={10} name="Rail Snackbar">
      <div className="tf-rail" role="status">
        <div className="tf-rail-text">
          <b>Event removed.</b> “Sprint retro” was deleted.
        </div>
        <button type="button" className="tf-rail-undo" aria-label="Undo delete, 6 seconds remaining">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle className="track" cx="20" cy="20" r="15.9" pathLength={100} />
            <circle className="prog" cx="20" cy="20" r="15.9" pathLength={100} />
          </svg>
          Undo
        </button>
      </div>
    </Stage>
  );
}

/* ============================================================
   11 — Expand Pill
   ============================================================ */
export function ToastExpandPill() {
  const [open, setOpen] = useState(false);
  return (
    <Stage index={11} name="Expand Pill">
      <button
        type="button"
        className="tf-pill"
        data-open={open ? 1 : 0}
        aria-expanded={open}
        aria-label={open ? "Notification: backup complete" : "Open notification"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tf-pill-bell">
          {I.bell}
          <span className="tf-pill-dot" aria-hidden="true" />
        </span>
        <span className="tf-pill-body" role="status">
          <span className="tf-pill-mini">{I.cloud}</span>
          <span>
            <span className="tf-pill-title" style={{ display: "block" }}>Backup complete</span>
            <span className="tf-pill-text" style={{ display: "block" }}>2.4 GB synced to Drive just now.</span>
          </span>
        </span>
      </button>
    </Stage>
  );
}

/* ============================================================
   12 — Notification Center
   ============================================================ */
const NC_SEED = [
  { id: 1, icon: I.chat, bg: "#eef0ff", color: "#5b5bd6", title: "New comment", text: "Aarav: “Ship it.”", time: "2m", read: false },
  { id: 2, icon: I.check, bg: "#e8f7ef", color: "#17a05e", title: "Build passed", text: "main @ 9f3c2d1 deployed", time: "18m", read: false },
  { id: 3, icon: I.warn, bg: "#fff4dd", color: "#d98e04", title: "Usage at 80%", text: "Bandwidth resets Dec 1", time: "1h", read: false },
  { id: 4, icon: I.info, bg: "#e8f0fe", color: "#1f7ae0", title: "New follower", text: "@pixelpriya started following", time: "3h", read: true },
];
export function NotificationCenterToast() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState(NC_SEED);
  const unread = items.filter((i) => !i.read).length;
  return (
    <Stage index={12} name="Notification Center" tall>
      <div className="tf-nc">
        <button
          type="button"
          className="tf-iconbtn tf-nc-bell"
          aria-expanded={open}
          aria-label={open ? "Close notification center" : `Open notification center, ${unread} unread`}
          onClick={() => setOpen((v) => !v)}
        >
          {I.bell}
          {unread > 0 && <span className="tf-nc-count">{unread}</span>}
        </button>
        {open && (
          <div className="tf-nc-panel" role="log" aria-label="Notifications">
            <div className="tf-nc-head">
              <b>Notifications</b>
              <button
                type="button"
                className="tf-btn tf-nc-clear"
                onClick={() => setItems((list) => list.map((i) => ({ ...i, read: true })))}
              >
                Mark all read
              </button>
            </div>
            <div className="tf-nc-list">
              {items.map((item, idx) => (
                <div className="tf-nc-item" data-read={item.read ? 1 : 0} key={item.id} style={{ ["--i" as string]: idx }}>
                  <span className="tf-nc-ic" style={{ background: item.bg, color: item.color }}>{item.icon}</span>
                  <div className="tf-nc-itembody">
                    <div className="tf-nc-itemtitle">{item.title}</div>
                    <div className="tf-nc-itemtext">{item.text}</div>
                  </div>
                  <span className="tf-nc-itemtime">{item.time}</span>
                  <span className="tf-nc-unread" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
}

/* ============================================================
   13 — Banner Announcement
   ============================================================ */
export function BannerAnnouncement() {
  return (
    <Stage index={13} name="Announcement Banner">
      <div className="tf-banner" role="status">
        <span className="tf-banner-chip">New</span>
        <div className="tf-banner-text">
          <b>GOAT UI v2 is live</b> — 120 new components.
        </div>
        <button type="button" className="tf-btn tf-banner-cta">Explore</button>
        <button type="button" className="tf-iconbtn tf-banner-x" aria-label="Dismiss announcement">{I.x}</button>
      </div>
    </Stage>
  );
}

/* ============================================================
   14 — Inline Field Alert
   ============================================================ */
export function InlineFieldAlert() {
  return (
    <Stage index={14} name="Inline Field Alert">
      <div className="tf-field">
        <label className="tf-field-label" htmlFor="tf-email">Work email</label>
        <div className="tf-field-wrap">
          <input
            id="tf-email"
            className="tf-field-input"
            defaultValue="bandi@goat"
            aria-invalid="true"
            aria-describedby="tf-email-err"
          />
          <span className="tf-field-icon">{I.warn}</span>
        </div>
        <p className="tf-field-msg" id="tf-email-err" role="alert">
          That domain looks incomplete. Did you mean bandi@goatui.dev?
        </p>
      </div>
    </Stage>
  );
}

/* ============================================================
   15 — Confetti Success
   ============================================================ */
const CONFETTI = [
  { c: "#5b5bd6", tx: "-92px", ty: "-64px", rot: "220deg", d: "0s" },
  { c: "#17a05e", tx: "-70px", ty: "-96px", rot: "-160deg", d: "0.03s" },
  { c: "#f5a524", tx: "-36px", ty: "-112px", rot: "300deg", d: "0.06s" },
  { c: "#ef5da8", tx: "0px", ty: "-120px", rot: "-240deg", d: "0s" },
  { c: "#1f7ae0", tx: "38px", ty: "-110px", rot: "180deg", d: "0.05s" },
  { c: "#e5484d", tx: "72px", ty: "-92px", rot: "-300deg", d: "0.02s" },
  { c: "#7c6cf0", tx: "94px", ty: "-60px", rot: "260deg", d: "0.07s" },
  { c: "#17a05e", tx: "-98px", ty: "-18px", rot: "-200deg", d: "0.04s" },
  { c: "#f5a524", tx: "100px", ty: "-14px", rot: "140deg", d: "0.01s" },
  { c: "#5b5bd6", tx: "-52px", ty: "-132px", rot: "320deg", d: "0.08s" },
  { c: "#ef5da8", tx: "56px", ty: "-128px", rot: "-280deg", d: "0.06s" },
  { c: "#1f7ae0", tx: "8px", ty: "-88px", rot: "200deg", d: "0.09s" },
];
export function ToastConfetti() {
  return (
    <Stage index={15} name="Confetti Success">
      <div className="tf-confetti">
        <div className="tf-confetti-bits" aria-hidden="true">
          {CONFETTI.map((p, i) => (
            <i key={i} style={{ ["--c" as string]: p.c, ["--tx" as string]: p.tx, ["--ty" as string]: p.ty, ["--rot" as string]: p.rot, ["--d" as string]: p.d }} />
          ))}
        </div>
        <div className="tf-confetti-card" role="status">
          <div className="tf-confetti-check">{I.check}</div>
          <div>
            <div className="tf-confetti-title">Payment successful</div>
            <div className="tf-confetti-text">₹2,499 sent to Priya Sharma.</div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   16 — Neon Cyber
   ============================================================ */
export function ToastNeonCyber() {
  return (
    <Stage index={16} name="Neon Cyber">
      <div className="tf-neon" role="alert">
        <span className="tf-neon-tag">SYS//ALERT</span>
        <div className="tf-neon-title">Rate limit at 92%</div>
        <div className="tf-neon-text">API quota resets in 00:14:52. Throttling workers.</div>
      </div>
    </Stage>
  );
}

/* ============================================================
   17 — Minimal Dot
   ============================================================ */
export function ToastMinimalDot() {
  return (
    <Stage index={17} name="Minimal Dot">
      <div className="tf-mini" role="status">
        <span className="tf-mini-dot" aria-hidden="true" />
        <span className="tf-mini-text">3 tasks synced</span>
        <span className="tf-mini-time">09:42</span>
        <button type="button" className="tf-mini-act">View</button>
      </div>
    </Stage>
  );
}

/* ============================================================
   18 — Gauge Toast
   ============================================================ */
export function ToastGauge() {
  const pct = useCountUp(75, 2400, 300);
  return (
    <Stage index={18} name="Gauge Progress">
      <div className="tf-gauge" role="status" aria-label="Uploading design assets, 75 percent">
        <div className="tf-gauge-dial">
          <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
            <circle className="track" cx="26" cy="26" r="22" />
            <circle className="prog" cx="26" cy="26" r="22" />
          </svg>
          <span className="tf-gauge-pct">{pct}%</span>
        </div>
        <div>
          <div className="tf-gauge-title">Uploading design assets</div>
          <div className="tf-gauge-text">18 of 24 files, 42 MB/s</div>
          <div className="tf-gauge-bar" aria-hidden="true"><i /></div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   19 — Chat Bubble
   ============================================================ */
export function ToastChatBubble() {
  const [typed, setTyped] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setTyped(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <Stage index={19} name="Chat Bubble">
      <div className="tf-chat" role="status" aria-live="polite">
        <div className="tf-chat-avatar">AR</div>
        <div className="tf-chat-bubble">
          <div className="tf-chat-name">Aarav</div>
          {typed ? (
            <div className="tf-chat-msg">Lunch at the new place on 12th? 1:30 works for me.</div>
          ) : (
            <span className="tf-chat-typing" aria-label="Aarav is typing">
              <i /><i /><i />
            </span>
          )}
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   20 — Achievement Unlock
   ============================================================ */
export function ToastAchievement() {
  const xp = useCountUp(50, 1400, 500);
  return (
    <Stage index={20} name="Achievement Unlock">
      <div className="tf-achieve" role="status">
        <div className="tf-achieve-medal">{I.trophy}</div>
        <div>
          <div className="tf-achieve-kicker">Achievement unlocked</div>
          <div className="tf-achieve-title">Component Crafter</div>
          <div className="tf-achieve-xp">+<b>{xp} XP</b> · 30 variants shipped</div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   21 — Desktop Window Alert
   ============================================================ */
export function AlertWindow() {
  return (
    <Stage index={21} name="Window Alert">
      <div className="tf-win" role="alertdialog" aria-labelledby="tf-win-t" aria-describedby="tf-win-d">
        <div className="tf-win-bar" aria-hidden="true"><i /><i /><i /><span>goat-ui — System</span></div>
        <div className="tf-win-body">
          <div className="tf-win-icon">{I.zap}</div>
          <div>
            <div className="tf-win-title" id="tf-win-t">Update ready to install</div>
            <div className="tf-win-text" id="tf-win-d">
              GOAT UI 2.1.4 includes 6 patched components. Restart to apply.
            </div>
          </div>
        </div>
        <div className="tf-win-actions">
          <button type="button" className="tf-btn tf-win-ghost">Later</button>
          <button type="button" className="tf-btn tf-win-primary">Restart now</button>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   22 — Skeleton to Ready
   ============================================================ */
export function ToastSkeleton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1700);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <Stage index={22} name="Skeleton to Ready">
      <div className="tf-skel" role="status" aria-busy={!ready} aria-label={ready ? "Report ready" : "Generating report"}>
        {ready ? (
          <div className="tf-skel-live">
            <div className="tf-skel-liveicon">{I.cloud}</div>
            <div>
              <div className="tf-skel-livetitle">Weekly report is ready</div>
              <div className="tf-skel-livetext">Nov 17 – Nov 24 · 38 metrics compiled</div>
            </div>
          </div>
        ) : (
          <div className="tf-skel-row" aria-hidden="true">
            <span className="tf-skel-avatar" />
            <div className="tf-skel-bars">
              <span className="tf-skel-bar w60" />
              <span className="tf-skel-bar w85" />
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
}

/* ============================================================
   23 — Split Diagonal
   ============================================================ */
export function BannerSplitDiagonal() {
  return (
    <Stage index={23} name="Split Diagonal">
      <div className="tf-split" role="status">
        <div className="tf-split-zone">{I.sparkle}</div>
        <div className="tf-split-body">
          <div className="tf-split-title">Invite accepted</div>
          <div className="tf-split-text">meera@studio.co joined your workspace.</div>
          <a className="tf-split-link" href="#" onClick={(e) => e.preventDefault()}>Say hello →</a>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   24 — Sticky Note
   ============================================================ */
export function AlertStickyNote() {
  return (
    <Stage index={24} name="Sticky Note">
      <div className="tf-sticky" role="note" aria-label="Reminder note">
        <button type="button" className="tf-sticky-pin" aria-label="Dismiss note">✕</button>
        <div className="tf-sticky-title">Don't forget!</div>
        <div className="tf-sticky-text">Push the toast family to the registry before standup.</div>
      </div>
    </Stage>
  );
}

/* ============================================================
   25 — Pixel Retro
   ============================================================ */
export function AlertPixelRetro() {
  return (
    <Stage index={25} name="Pixel Retro">
      <div className="tf-pixel" role="status">
        <div className="tf-pixel-title">★ Level cleared</div>
        <div className="tf-pixel-text">SCORE 12,450 · HI-SCORE 18,200<br />BONUS +500 FOR NO-MISS RUN</div>
        <button type="button" className="tf-pixel-ok">▶ PRESS OK TO CONTINUE</button>
      </div>
    </Stage>
  );
}

/* ============================================================
   26 — Weather Alert
   ============================================================ */
export function BannerWeatherAlert() {
  return (
    <Stage index={26} name="Weather Alert">
      <div className="tf-weather" role="alert">
        <div className="tf-weather-tape" aria-hidden="true" />
        <div className="tf-weather-body">
          <div className="tf-weather-icon">{I.warn}</div>
          <div>
            <div className="tf-weather-title">Heat advisory · Hyderabad</div>
            <div className="tf-weather-text">
              High of <b>41°C</b> expected 12:00–16:00. Outdoor deploy freeze in effect.
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   27 — Media Rich
   ============================================================ */
export function ToastMediaRich() {
  return (
    <Stage index={27} name="Media Rich">
      <div className="tf-media" role="status">
        <div className="tf-media-thumb">{I.music}</div>
        <div className="tf-media-body">
          <div className="tf-media-title">Now playing</div>
          <div className="tf-media-text">Midnight Render — Synthwaves Vol. 2</div>
          <div className="tf-media-meta">Shared by Kiran · 04:12</div>
        </div>
        <button type="button" className="tf-iconbtn tf-media-play" aria-label="Play preview">{I.play}</button>
      </div>
    </Stage>
  );
}

/* ============================================================
   28 — Destructive Undo (icon morph)
   ============================================================ */
export function SnackbarDestructiveUndo() {
  return (
    <Stage index={28} name="Destructive Undo">
      <div className="tf-morph" role="alert">
        <div className="tf-morph-top">
          <div className="tf-morph-icon">
            {I.trash}
            <svg className="ic-warn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v4M12 17h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div className="tf-morph-title">Deleting 3 components…</div>
          <div className="tf-morph-actions">
            <button type="button" className="tf-btn tf-morph-undo">Undo</button>
            <button type="button" className="tf-iconbtn tf-morph-x" aria-label="Dismiss">{I.x}</button>
          </div>
        </div>
        <div className="tf-morph-bar" aria-hidden="true"><i /></div>
      </div>
    </Stage>
  );
}

/* ============================================================
   29 — Step Tracker
   ============================================================ */
const STEP_LABELS = ["Queued", "Uploading", "Processing", "Done"];
export function ToastStepTracker() {
  const [step, setStep] = useState(1); // 1-based active step
  useEffect(() => {
    if (step >= 4) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1000);
    return () => window.clearTimeout(t);
  }, [step]);
  const done = step >= 4;
  return (
    <Stage index={29} name="Step Tracker">
      <div className="tf-steps" role="status" aria-live="polite">
        <div className="tf-steps-head">
          <span className="tf-steps-title">Publishing package</span>
          <span className="tf-steps-of">Step {Math.min(step, 4)} of 4</span>
        </div>
        <div className="tf-steps-track" aria-hidden="true">
          <span className="tf-steps-line"><i style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }} /></span>
          {STEP_LABELS.map((label, i) => (
            <span
              className="tf-steps-dot"
              key={label}
              data-state={i + 1 < step || done ? "done" : i + 1 === step ? "active" : "todo"}
              title={label}
            >
              {(i + 1 < step || done) && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>
          ))}
        </div>
        <div className="tf-steps-label">
          {done ? <b>goat-ui@2.1.4 is live on the registry.</b> : <>Running <b>{STEP_LABELS[Math.min(step, 4) - 1].toLowerCase()}</b>…</>}
        </div>
      </div>
    </Stage>
  );
}

/* ============================================================
   30 — Swipe Dismiss
   ============================================================ */
export function ToastSwipeDismiss() {
  const [gone, setGone] = useState(false);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setDx(e.clientX - startX.current);
    },
    [dragging]
  );
  const endDrag = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) > 120) {
      setDx(Math.sign(dx) * 520);
      setGone(true);
    } else {
      setDx(0);
    }
  }, [dragging, dx]);

  const opacity = Math.max(0.25, 1 - Math.abs(dx) / 260);
  return (
    <Stage index={30} name="Swipe Dismiss">
      <div className="tf-swipe-cell">
        {!gone ? (
          <div
            ref={nodeRef}
            className={`tf-swipe${dragging ? " dragging" : " released"}`}
            role="status"
            aria-label="Draggable notification, swipe sideways to dismiss"
            style={{ transform: `translateX(${dx}px) rotate(${dx * 0.02}deg)`, opacity }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="tf-swipe-grip" aria-hidden="true"><i /><i /><i /></span>
            <span className="tf-swipe-text"><b>2 invites sent.</b> Drag to dismiss.</span>
            <span className="tf-swipe-hint">← swipe →</span>
          </div>
        ) : (
          <button type="button" className="tf-btn tf-swipe-reset" onClick={() => { setGone(false); setDx(0); }}>
            Bring it back
          </button>
        )}
      </div>
    </Stage>
  );
}

/* export roster (used by the lab page) */
export const TOAST_FAMILY = [
  { key: "aurora-glass", name: "Aurora Glass", Component: ToastAuroraGlass },
  { key: "slide-stack", name: "Slide Stack", Component: ToastSlideStack },
  { key: "progress-line", name: "Progress Line", Component: ToastProgressLine },
  { key: "flip-card", name: "Flip Card", Component: ToastFlipCard },
  { key: "terminal", name: "Terminal", Component: ToastTerminal },
  { key: "neubrutalist", name: "Neubrutalist", Component: ToastNeubrutalist },
  { key: "orbit-badge", name: "Orbit Badge", Component: ToastOrbitBadge },
  { key: "ticket-stub", name: "Ticket Stub", Component: ToastTicketStub },
  { key: "liquid-blob", name: "Liquid Blob", Component: ToastLiquidBlob },
  { key: "rail-snackbar", name: "Rail Snackbar", Component: ToastRailSnackbar },
  { key: "expand-pill", name: "Expand Pill", Component: ToastExpandPill },
  { key: "notification-center", name: "Notification Center", Component: NotificationCenterToast },
  { key: "announcement-banner", name: "Announcement Banner", Component: BannerAnnouncement },
  { key: "inline-field-alert", name: "Inline Field Alert", Component: InlineFieldAlert },
  { key: "confetti", name: "Confetti Success", Component: ToastConfetti },
  { key: "neon-cyber", name: "Neon Cyber", Component: ToastNeonCyber },
  { key: "minimal-dot", name: "Minimal Dot", Component: ToastMinimalDot },
  { key: "gauge", name: "Gauge Progress", Component: ToastGauge },
  { key: "chat-bubble", name: "Chat Bubble", Component: ToastChatBubble },
  { key: "achievement", name: "Achievement Unlock", Component: ToastAchievement },
  { key: "window-alert", name: "Window Alert", Component: AlertWindow },
  { key: "skeleton", name: "Skeleton to Ready", Component: ToastSkeleton },
  { key: "split-diagonal", name: "Split Diagonal", Component: BannerSplitDiagonal },
  { key: "sticky-note", name: "Sticky Note", Component: AlertStickyNote },
  { key: "pixel-retro", name: "Pixel Retro", Component: AlertPixelRetro },
  { key: "weather-alert", name: "Weather Alert", Component: BannerWeatherAlert },
  { key: "media-rich", name: "Media Rich", Component: ToastMediaRich },
  { key: "destructive-undo", name: "Destructive Undo", Component: SnackbarDestructiveUndo },
  { key: "step-tracker", name: "Step Tracker", Component: ToastStepTracker },
  { key: "swipe-dismiss", name: "Swipe Dismiss", Component: ToastSwipeDismiss },
] as const;
