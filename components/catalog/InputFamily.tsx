"use client";
import React, {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type ReactElement,
} from "react";
import "./InputFamily.css";

/* ------------------------------------------------------------------ */
/* shared                                                              */
/* ------------------------------------------------------------------ */

/** Physics spring toward a target number (rAF damped oscillator). */
function useSpring(target: number, stiffness = 190, damping = 22): number {
  const [value, setValue] = useState(target);
  const s = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.current.x = target; s.current.v = 0; setValue(target); return;
    }
    let last = performance.now();
    const step = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.064); last = t;
      const o = s.current;
      const F = -stiffness * (o.x - target) - damping * o.v;
      o.v += F * dt; o.x += o.v * dt;
      if (Math.abs(o.x - target) < 0.05 && Math.abs(o.v) < 0.05) {
        o.x = target; o.v = 0; setValue(target); return;
      }
      setValue(o.x);
      o.raf = requestAnimationFrame(step);
    };
    s.current.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.current.raf);
  }, [target, stiffness, damping]);
  return value;
}

/** Count-up animation for money totals. */
function useCountUp(target: number): number {
  return useSpring(target, 140, 20);
}

function useOutside(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);
  return ref;
}

/* icons */
const I = {
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  eye: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>,
  eyeOff: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16" /><path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a17.6 17.6 0 0 1-2.7 3.4M6.4 6.9C3.6 8.8 2 12 2 12s3.5 6.5 10 6.5c1.5 0 2.9-.4 4.1-1" /></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12.5 5 5L20 6.5" /></svg>,
  calendar: <svg className="ifx-date-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>,
  chevron: <svg className="ifx-sel-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0 4 4m-4-4-4 4" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>,
  send: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21.8 12 3.4 3.6l2.3 6.9L16 12 5.7 13.5l-2.3 6.9Z" /></svg>,
  pencil: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" /></svg>,
  star: (filled: boolean) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 1.5 14.36 8.76 21.99 8.76 15.81 13.24 18.17 20.49 12 16.01 5.83 20.49 8.19 13.24 2.01 8.76 9.64 8.76Z" />
    </svg>
  ),
};

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/* 1 · Sign-in card — floating labels, validation, show/hide           */
/* ------------------------------------------------------------------ */
export function SignInCard() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; pass?: string }>({});
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = "Enter a valid email address";
    if (pass.length < 8) errs.pass = "At least 8 characters";
    setErrors(errs);
    if (Object.keys(errs).length) { setShakeKey((k) => k + 1); return; }
    setPhase("busy");
    window.setTimeout(() => setPhase("done"), 1100);
  };

  return (
    <form className="ifx-signin" onSubmit={submit} noValidate key={shakeKey}>
      <div className="ifx-signin-head">
        <span className="ifx-signin-logo">N</span>
        <div>
          <h2 className="ifx-h">Welcome back</h2>
          <p className="ifx-sub">Sign in to Northwind to continue</p>
        </div>
      </div>
      <div className="ifx-stack" style={{ display: "grid", gap: 10 }}>
        <div className={shakeKey ? "ifx-shake" : undefined} key={`e${shakeKey}`}>
          <div className="ifx-float" data-invalid={!!errors.email}>
            <input
              id="ifx-si-email" type="email" placeholder=" " autoComplete="email"
              value={email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "ifx-si-email-err" : undefined}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
            />
            <label htmlFor="ifx-si-email">Email address</label>
            {phase === "done" && <span className="ifx-eye ifx-pop" style={{ color: "var(--green)" }} aria-hidden>{I.check}</span>}
          </div>
          {errors.email && <p className="ifx-err" id="ifx-si-email-err" role="alert">{errors.email}</p>}
        </div>
        <div className={shakeKey ? "ifx-shake" : undefined} key={`p${shakeKey}`}>
          <div className="ifx-float" data-invalid={!!errors.pass}>
            <input
              id="ifx-si-pass" type={show ? "text" : "password"} placeholder=" " autoComplete="current-password"
              value={pass} aria-invalid={!!errors.pass} aria-describedby={errors.pass ? "ifx-si-pass-err" : undefined}
              onChange={(e) => { setPass(e.target.value); if (errors.pass) setErrors((p) => ({ ...p, pass: undefined })); }}
            />
            <label htmlFor="ifx-si-pass">Password</label>
            <button type="button" className="ifx-eye" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
              {show ? I.eyeOff : I.eye}
            </button>
          </div>
          {errors.pass && <p className="ifx-err" id="ifx-si-pass-err" role="alert">{errors.pass}</p>}
        </div>
      </div>
      <div className="ifx-signin-row">
        <label><input type="checkbox" defaultChecked /> Remember me</label>
        <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
      </div>
      <button className="ifx-btn" type="submit" disabled={phase !== "idle"}>
        {phase === "busy" ? <><span className="ifx-spin" /> Signing in…</> : phase === "done" ? <>✓ Signed in</> : "Sign in"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · OTP verify — six boxes, paste, auto-advance, wrong-code shake   */
/* ------------------------------------------------------------------ */
export function OtpVerify() {
  const CODE = "428193";
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev]; next[i] = d; return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  useEffect(() => {
    const code = digits.join("");
    if (code.length === 6) {
      if (code === CODE) setState("done");
      else {
        setState("error"); setShakeKey((k) => k + 1);
        window.setTimeout(() => { setDigits(Array(6).fill("")); setState("idle"); refs.current[0]?.focus(); }, 700);
      }
    }
  }, [digits]);

  return (
    <div className="ifx-otp ifx-stack" style={{ display: "grid", gap: 14 }}>
      <div className="ifx-otp-mail ifx-rise">
        <span className="ifx-avatar">N</span>
        <div>
          <b>Northwind · no-reply</b>
          <p>Your verification code is <b>{CODE.split("").join(" ")}</b>. It expires in 10 minutes.</p>
        </div>
      </div>
      <div>
        <h2 className="ifx-h">Check your inbox</h2>
        <p className="ifx-sub">We sent a 6-digit code to jamie@northwind.app</p>
      </div>
      {state === "done" ? (
        <div className="ifx-otp-done ifx-pop" role="status">
          <span className="ifx-otp-check">{I.check}</span> Email verified — you're in.
        </div>
      ) : (
        <>
          <div className={`ifx-otp-row ${shakeKey ? "ifx-shake" : ""}`} key={shakeKey} role="group" aria-label="6-digit verification code" data-error={state === "error"}>
            {digits.map((d, i) => (
              <input
                key={i} ref={(el) => { refs.current[i] = el; }}
                value={d} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`} maxLength={1}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[i] && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus(); setDigit(i - 1, ""); }
                  if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
                  if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                  if (!t) return;
                  setDigits((prev) => { const next = [...prev]; for (let k = 0; k < t.length; k++) next[k] = t[k]; return next; });
                  refs.current[Math.min(t.length, 5)]?.focus();
                }}
              />
            ))}
          </div>
          {state === "error" && <p className="ifx-err" role="alert">That code doesn't match — try the one in the email.</p>}
          <p className="ifx-sub" style={{ fontSize: 12 }}>
            Didn't get it? <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--blue)", fontWeight: 600 }}>Resend code</a> · 0:42
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Search with suggestions — combobox, recents, highlight          */
/* ------------------------------------------------------------------ */
const COMPONENTS = [
  "Accordion", "Alert dialog", "Avatar", "Badge", "Button", "Calendar", "Card",
  "Carousel", "Checkbox", "Combobox", "Command", "Data table", "Date picker",
  "Dialog", "Drawer", "Dropdown menu", "Hover card", "Input", "Menubar",
  "Popover", "Progress", "Radio group", "Scroll area", "Select", "Separator",
  "Skeleton", "Slider", "Switch", "Table", "Tabs", "Toast", "Toggle", "Tooltip",
];
export function SearchSuggest() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>(["Date picker", "Toast"]);
  const [status, setStatus] = useState("");
  const id = useId().replace(/:/g, "");
  const listRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return COMPONENTS.filter((c) => c.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);

  const list = q.trim() ? matches : recents;

  const pick = (name: string) => {
    setQ(name); setOpen(false);
    setRecents((r) => [name, ...r.filter((x) => x !== name)].slice(0, 3));
    setStatus(`Showing docs for ${name}`);
  };

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const highlight = (name: string) => {
    const s = q.trim().toLowerCase();
    const i = name.toLowerCase().indexOf(s);
    if (!s || i < 0) return name;
    return <>{name.slice(0, i)}<mark>{name.slice(i, i + s.length)}</mark>{name.slice(i + s.length)}</>;
  };

  return (
    <div className="ifx-search">
      <div className="ifx-searchbox" role="combobox" aria-expanded={open && list.length > 0} aria-haspopup="listbox">
        {I.search}
        <input
          placeholder="Search components…" value={q} aria-label="Search components"
          aria-autocomplete="list" aria-controls={open && list.length > 0 ? `${id}-lb` : undefined} aria-activedescendant={open && list.length > 0 ? `${id}-o-${active}` : undefined}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); setStatus(""); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, list.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter" && open && list[active]) pick(list[active]);
            if (e.key === "Escape") setOpen(false);
          }}
        />
        <kbd className="ifx-kbd">⌘K</kbd>
      </div>
      {open && (
        <div className="ifx-search-panel ifx-rise" role="listbox" id={`${id}-lb`} aria-label="Component results" ref={listRef}>
          <div className="ifx-search-sec">{q.trim() ? "Components" : "Recent searches"}</div>
          {list.length === 0 && <div className="ifx-empty">Nothing found for “{q}”. Try “dialog” or “menu”.</div>}
          {list.map((c, i) => (
            <button
              key={c} role="option" id={`${id}-o-${i}`} aria-selected={i === active} data-active={i === active}
              className="ifx-opt" onMouseEnter={() => setActive(i)} onClick={() => pick(c)}
            >
              {q.trim() ? I.search : <span style={{ color: "var(--faint)", fontSize: 13.5 }}>↺</span>}
              <span>{highlight(c)}</span>
              <span className="ifx-opt-kind">Component</span>
            </button>
          ))}
        </div>
      )}
      <p className="ifx-search-status" role="status">{status || "32 components in the library"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Price slider — histogram, spring bubble, auxiliary toggle       */
/* ------------------------------------------------------------------ */
const HIST = [8, 14, 22, 30, 38, 34, 26, 20, 15, 10, 6, 3];
export function PriceSlider() {
  const MAX = 750;
  const [v, setV] = useState(320);
  const [sale, setSale] = useState(false);
  const smooth = useSpring(v);
  const pct = (v / MAX) * 100;
  const litBars = HIST.filter((_, i) => (i / HIST.length) * MAX <= v).length;

  return (
    <div className="ifx-price ifx-stack" style={{ display: "grid", gap: 4 }}>
      <div className="ifx-price-head">
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Price</h2>
        <span className="ifx-price-val">Up to ${Math.round(smooth)}</span>
      </div>
      <div className="ifx-hist" aria-hidden>
        {HIST.map((h, i) => <i key={i} className={i < litBars ? "on" : ""} style={{ height: `${(h / 38) * 100}%` }} />)}
      </div>
      <div className="ifx-range-wrap">
        <div className="ifx-bubble" style={{ left: `${(smooth / MAX) * 100}%` }} aria-hidden>${Math.round(smooth)}</div>
        <input
          type="range" className="ifx-range" min={0} max={MAX} step={10} value={v}
          aria-label="Maximum price" style={{ ["--fill" as string]: `${pct}%` } as React.CSSProperties}
          onChange={(e) => setV(Number(e.target.value))}
        />
      </div>
      <div className="ifx-price-foot">
        <label><input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} /> On sale only</label>
        <span role="status">{sale ? "48 items" : `${Math.max(4, Math.round((v / MAX) * 212))} items`}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Budget range — dual thumbs, synced inputs                       */
/* ------------------------------------------------------------------ */
export function BudgetRange() {
  const MAX = 2000;
  const [lo, setLo] = useState(300);
  const [hi, setHi] = useState(1200);
  const loPct = (lo / MAX) * 100, hiPct = (hi / MAX) * 100;

  const setLoSafe = (n: number) => setLo(Math.min(Math.max(0, n), hi - 50));
  const setHiSafe = (n: number) => setHi(Math.max(Math.min(MAX, n), lo + 50));

  return (
    <div className="ifx-budget ifx-stack" style={{ display: "grid", gap: 14 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Budget per night</h2>
        <p className="ifx-sub">Drag both ends, or type exact amounts</p>
      </div>
      <div className="ifx-dual">
        <div className="ifx-dual-track" />
        <div className="ifx-dual-fill" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
        <input type="range" min={0} max={MAX} step={50} value={lo} aria-label="Minimum budget"
          onChange={(e) => setLoSafe(Number(e.target.value))} />
        <input type="range" min={0} max={MAX} step={50} value={hi} aria-label="Maximum budget"
          onChange={(e) => setHiSafe(Number(e.target.value))} />
      </div>
      <div className="ifx-budget-vals">
        <label>Min
          <input type="number" value={lo} min={0} max={hi - 50} step={50} aria-label="Minimum budget amount"
            onChange={(e) => setLoSafe(Number(e.target.value) || 0)} />
        </label>
        <label>Max
          <input type="number" value={hi} min={lo + 50} max={MAX} step={50} aria-label="Maximum budget amount"
            onChange={(e) => setHiSafe(Number(e.target.value) || 0)} />
        </label>
      </div>
      <p className="ifx-budget-note" role="status">Showing stays between <b>${lo}</b> and <b>${hi}</b> · 18 places</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Quantity stepper — cart line with live total                    */
/* ------------------------------------------------------------------ */
export function QtyStepper() {
  const PRICE = 48;
  const [qty, setQty] = useState(2);
  const [removed, setRemoved] = useState(false);
  const total = useCountUp(qty * PRICE);

  if (removed) return (
    <div className="ifx-cart ifx-stack" style={{ display: "grid", gap: 10 }}>
      <p className="ifx-sub" role="status">Terracotta vase removed from your bag.</p>
      <button className="ifx-btn ghost" style={{ height: 34, fontSize: 12 }} onClick={() => { setRemoved(false); setQty(2); }}>Undo</button>
    </div>
  );

  return (
    <div className="ifx-cart ifx-stack" style={{ display: "grid", gap: 13 }}>
      <div className="ifx-cart-row">
        <div className="ifx-cart-thumb" role="img" aria-label="Terracotta vase" />
        <div className="ifx-cart-info">
          <b>Terracotta vase</b>
          <span>Hand-thrown · Sand</span>
        </div>
        <span className="ifx-cart-price">${fmtMoney(PRICE)}</span>
      </div>
      <div className="ifx-cart-foot">
        <div className="ifx-step" role="group" aria-label="Quantity">
          <button aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <output key={qty} aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</output>
          <button aria-label="Increase quantity" disabled={qty >= 9} onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
        </div>
        <span className="ifx-cart-total"><b>${fmtMoney(Math.round(total * 100) / 100)}</b></span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="ifx-sub" style={{ fontSize: 12 }}>Free returns for 30 days</span>
        <button className="ifx-remove" onClick={() => setRemoved(true)}>Remove</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · Date picker — popover calendar with full keyboard support       */
/* ------------------------------------------------------------------ */
const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export function DeliveryDatePicker() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(() => { const d = new Date(today); d.setDate(d.getDate() + 2); return d; });
  const [cursor, setCursor] = useState<Date>(new Date(selected!));
  const [view, setView] = useState({ y: selected!.getFullYear(), m: selected!.getMonth() });
  const wrapRef = useOutside(open, () => setOpen(false));
  const btnRef = useRef<HTMLButtonElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) calRef.current?.querySelector<HTMLElement>('[data-cursor="true"]')?.focus();
  }, [open]);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const out: (Date | null)[] = Array(first.getDay()).fill(null);
    const days = new Date(view.y, view.m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) out.push(new Date(view.y, view.m, d));
    while (out.length % 7) out.push(null);
    return out;
  }, [view]);

  const choose = (d: Date) => {
    setSelected(d); setCursor(d); setOpen(false);
    btnRef.current?.focus();
  };
  const moveView = (dir: number) => setView((v) => {
    const n = new Date(v.y, v.m + dir, 1);
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const moveCursor = (delta: number) => setCursor((c) => {
    const n = new Date(c); n.setDate(n.getDate() + delta);
    if (n.getMonth() !== view.m || n.getFullYear() !== view.y) setView({ y: n.getFullYear(), m: n.getMonth() });
    return n;
  });
  const quick = (label: string, days: number) => (
    <button key={label} className="ifx-chip-btn" onClick={() => { const d = new Date(today); d.setDate(d.getDate() + days); choose(d); }}>{label}</button>
  );

  return (
    <div className="ifx-date ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Reschedule delivery</h2>
        <p className="ifx-sub">Order #1042 · terracotta vase</p>
      </div>
      <div className="ifx-popwrap" ref={wrapRef}>
        <button
          ref={btnRef} className="ifx-date-btn" aria-haspopup="dialog" aria-expanded={open}
          onClick={() => { setOpen((o) => !o); if (selected) { setCursor(selected); setView({ y: selected.getFullYear(), m: selected.getMonth() }); } }}
        >
          {I.calendar}
          {selected ? <b>{fmtDate(selected)}</b> : <span className="ifx-date-ph">Pick a delivery day</span>}
        </button>
        {open && (
          <div ref={calRef} className="ifx-menu ifx-cal" role="dialog" aria-label="Choose a delivery date"
            onKeyDown={(e) => {
              const k = e.key;
              if (k === "ArrowLeft") { e.preventDefault(); moveCursor(-1); }
              if (k === "ArrowRight") { e.preventDefault(); moveCursor(1); }
              if (k === "ArrowUp") { e.preventDefault(); moveCursor(-7); }
              if (k === "ArrowDown") { e.preventDefault(); moveCursor(7); }
              if (k === "Home") { e.preventDefault(); const n = new Date(cursor); n.setDate(n.getDate() - n.getDay()); setCursor(n); }
              if (k === "End") { e.preventDefault(); const n = new Date(cursor); n.setDate(n.getDate() + (6 - n.getDay())); setCursor(n); }
              if (k === "Enter" || k === " ") { e.preventDefault(); if (cursor >= today) choose(cursor); }
              if (k === "Escape") { setOpen(false); btnRef.current?.focus(); }
            }}
          >
            <div className="ifx-cal-head">
              <b>{MONTHS[view.m]} {view.y}</b>
              <div className="ifx-cal-nav">
                <button aria-label="Previous month" onClick={() => moveView(-1)}>‹</button>
                <button aria-label="Next month" onClick={() => moveView(1)}>›</button>
              </div>
            </div>
            <div className="ifx-cal-grid" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`}>
              {DOW.map((d, i) => <span key={i} className="ifx-cal-dow" role="columnheader">{d}</span>)}
              {cells.map((d, i) => d ? (
                <button
                  key={i} role="gridcell" className="ifx-cal-day" tabIndex={sameDay(d, cursor) ? 0 : -1}
                  disabled={d < today} aria-selected={selected ? sameDay(d, selected) : false}
                  data-today={sameDay(d, today)} data-cursor={sameDay(d, cursor)}
                  aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  onClick={() => choose(d)} onFocus={() => setCursor(d)}
                >{d.getDate()}</button>
              ) : <span key={i} />)}
            </div>
            <div className="ifx-cal-chips">{quick("Tomorrow", 1)}{quick("In 3 days", 3)}{quick("Next week", 7)}</div>
          </div>
        )}
      </div>
      <p className="ifx-sub" style={{ fontSize: 12 }} role="status">
        {selected ? <>Arriving <b style={{ color: "var(--t)" }}>{fmtDate(selected)}</b> between 9 AM and 1 PM</> : "No date selected"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · Country select — custom listbox in a shipping fragment          */
/* ------------------------------------------------------------------ */
const COUNTRIES = [
  { flag: "🇮🇳", name: "India", dial: "+91", postal: "PIN code" },
  { flag: "🇺🇸", name: "United States", dial: "+1", postal: "ZIP code" },
  { flag: "🇬🇧", name: "United Kingdom", dial: "+44", postal: "Postcode" },
  { flag: "🇦🇪", name: "United Arab Emirates", dial: "+971", postal: "PO Box" },
  { flag: "🇩🇪", name: "Germany", dial: "+49", postal: "Postal code" },
  { flag: "🇯🇵", name: "Japan", dial: "+81", postal: "Postal code" },
  { flag: "🇦🇺", name: "Australia", dial: "+61", postal: "Postcode" },
];
export function CountrySelect() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(0);
  const [postal, setPostal] = useState("");
  const [postalErr, setPostalErr] = useState(false);
  const id = useId().replace(/:/g, "");
  const wrapRef = useOutside(open, () => setOpen(false));
  const c = COUNTRIES[idx];

  return (
    <div className="ifx-ship ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Shipping address</h2>
        <p className="ifx-sub">Where should we send it?</p>
      </div>
      <div className="ifx-popwrap" ref={wrapRef}>
        <label htmlFor={`${id}-btn`} className="ifx-sub" style={{ fontSize: 12, display: "block", marginBottom: 5 }}>Country / region</label>
        <button
          id={`${id}-btn`} className="ifx-sel-btn" aria-haspopup="listbox" aria-expanded={open}
          onClick={() => { setOpen((o) => !o); setActive(idx); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, COUNTRIES.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActive((a) => Math.max(a - 1, 0)); }
            if ((e.key === "Enter" || e.key === " ") && open) { e.preventDefault(); setIdx(active); setOpen(false); }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span className="ifx-flag" aria-hidden>{c.flag}</span> {c.name}
          <span className="ifx-dial">{c.dial}</span>
          {I.chevron}
        </button>
        {open && (
          <div className="ifx-menu ifx-sel-menu" role="listbox" aria-label="Country or region" tabIndex={-1}>
            {COUNTRIES.map((co, i) => (
              <button
                key={co.name} role="option" aria-selected={i === idx} data-active={i === active}
                className="ifx-opt" onMouseEnter={() => setActive(i)}
                onClick={() => { setIdx(i); setOpen(false); }}
              >
                <span className="ifx-flag" aria-hidden>{co.flag}</span> {co.name}
                <span className="ifx-opt-kind">{co.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="ifx-ship-grid">
        <label className="ifx-sub" style={{ fontSize: 12, display: "grid", gap: 5 }}>{c.postal}
          <input
            className="ifx-field" value={postal} placeholder="560 001"
            aria-invalid={postalErr}
            onChange={(e) => { setPostal(e.target.value); setPostalErr(false); }}
            onBlur={() => setPostalErr(!!postal && postal.trim().length < 4)}
          />
        </label>
        <label className="ifx-sub" style={{ fontSize: 12, display: "grid", gap: 5 }}>City
          <input className="ifx-field" placeholder="Bengaluru" />
        </label>
      </div>
      {postalErr && <p className="ifx-err" role="alert">That {c.postal.toLowerCase()} looks too short.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · Size chips — radio chips in a product fragment                  */
/* ------------------------------------------------------------------ */
const SWATCHES = [
  { name: "Sand", css: "#d9c6a5" },
  { name: "Moss", css: "#5a6448" },
  { name: "Ink", css: "#2c2c34" },
];
export function SizeChips() {
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const sizes = [
    { s: "S", note: "" }, { s: "M", note: "" }, { s: "L", note: "2 left" }, { s: "XL", note: "", gone: true },
  ];
  return (
    <div className="ifx-size ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div className="ifx-size-head">
        <div>
          <b>Overshirt · {SWATCHES[color].name}</b>
          <p className="ifx-sub" style={{ marginTop: 2 }}>Brushed cotton, relaxed fit</p>
        </div>
        <span className="ifx-price-tag">$86</span>
      </div>
      <div className="ifx-swatches" role="group" aria-label="Colour">
        {SWATCHES.map((s, i) => (
          <button key={s.name} className="ifx-swatch" style={{ background: s.css }} aria-pressed={i === color}
            aria-label={s.name} onClick={() => setColor(i)} />
        ))}
      </div>
      <div>
        <div className="ifx-size-label"><span>Size</span><a href="#" onClick={(e) => e.preventDefault()}>Size guide</a></div>
        <div className="ifx-chips" role="radiogroup" aria-label="Size" style={{ marginTop: 8 }}>
          {sizes.map((x) => (
            <button
              key={x.s} role="radio" aria-checked={size === x.s} disabled={!!x.gone}
              className="ifx-sizechip"
              onClick={() => { setSize(x.s); setAdded(false); }}
              onKeyDown={(e) => {
                const avail = sizes.filter((s) => !s.gone);
                const i = size ? avail.findIndex((s) => s.s === size) : -1;
                if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); const n = avail[(i + 1) % avail.length]; setSize(n.s); setAdded(false); }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); const n = avail[(i - 1 + avail.length) % avail.length]; setSize(n.s); setAdded(false); }
              }}
            >
              {x.s}{x.note && <small>{x.note}</small>}
            </button>
          ))}
        </div>
      </div>
      <div className="ifx-size-cta">
        <button
          className="ifx-btn" disabled={!size && !added}
          onClick={() => setAdded(true)}
        >
          {added ? "✓ Added to bag" : size ? `Add ${size} to bag · $86` : "Pick a size"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · Filter checkboxes — jobs filter with live count                */
/* ------------------------------------------------------------------ */
const JOB_FILTERS = [
  { name: "Full-time", count: 24 }, { name: "Contract", count: 9 },
  { name: "Part-time", count: 4 }, { name: "Internship", count: 2 },
];
export function FilterCheckboxes() {
  const [on, setOn] = useState<boolean[]>([true, false, false, false]);
  const any = on.some(Boolean);
  const total = JOB_FILTERS.reduce((n, f, i) => n + (on[i] ? f.count : 0), 0);
  return (
    <div className="ifx-jobs ifx-stack" style={{ display: "grid", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Employment type</h2>
      </div>
      {JOB_FILTERS.map((f, i) => (
        <label key={f.name} className="ifx-checkrow">
          <input type="checkbox" checked={on[i]} onChange={() => setOn((p) => p.map((v, k) => (k === i ? !v : v)))} />
          <span className="ifx-box" aria-hidden>
            <svg viewBox="0 0 24 24"><path d="m4 12.5 5 5L20 6.5" /></svg>
          </span>
          <span className="ifx-check-label">{f.name}</span>
          <span className="ifx-count">{f.count}</span>
        </label>
      ))}
      <div className="ifx-jobs-foot">
        <b role="status">{any ? `${total} roles match` : "Nothing selected"}</b>
        <button className="ifx-jobs-clear" disabled={!any} onClick={() => setOn(JOB_FILTERS.map(() => false))}>Clear</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11 · File drop — drag/drop, real File data, fake upload progress    */
/* ------------------------------------------------------------------ */
type DropFile = { id: number; name: string; size: number; progress: number; error?: string };
const fmtSize = (n: number) => n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
export function FileDrop() {
  const [files, setFiles] = useState<DropFile[]>([
    { id: -1, name: "brand-guidelines.pdf", size: 2_400_000, progress: 100 },
  ]);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const t = window.setInterval(() => {
      setFiles((fs) => fs.map((f) => (!f.error && f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 7 + Math.random() * 9) } : f)));
    }, 160);
    return () => window.clearInterval(t);
  }, []);

  const add = (list: FileList | null) => {
    if (!list) return;
    const added: DropFile[] = Array.from(list).slice(0, 4).map((f) => ({
      id: nextId.current++, name: f.name, size: f.size, progress: 0,
      error: f.size > 10 * 1048576 ? "Over 10 MB" : undefined,
    }));
    setFiles((fs) => [...fs, ...added].slice(-4));
  };

  const badge = (name: string) => {
    const ext = (name.split(".").pop() || "file").slice(0, 3).toUpperCase();
    const colors: Record<string, string> = { PDF: "#dc2626", PNG: "#0e7490", JPG: "#0e7490", ZIP: "#7c3aed", DOC: "#1d4ed8" };
    return <span className="ifx-file-badge" style={{ background: colors[ext] || "#52525b" }}>{ext}</span>;
  };

  return (
    <div className="ifx-files ifx-stack" style={{ display: "grid", gap: 10 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Attachments</h2>
        <p className="ifx-sub">PDF, PNG or ZIP · up to 10 MB each</p>
      </div>
      <div
        className="ifx-drop-zone" data-over={over} role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
      >
        <span className="ifx-drop-ico">{I.upload}</span>
        <b>{over ? "Drop to attach" : "Drag files here"}</b>
        <span>or <u>browse your device</u></span>
        <input ref={inputRef} type="file" multiple hidden aria-hidden tabIndex={-1}
          onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>
      {files.map((f) => (
        <div className="ifx-file" key={f.id}>
          {badge(f.name)}
          <div className="ifx-file-meta">
            <b>{f.name}</b>
            {f.error
              ? <small style={{ color: "var(--red)" }}>{f.error} — file wasn't added</small>
              : f.progress >= 100
                ? <small>Uploaded · {fmtSize(f.size)}</small>
                : <span className="ifx-file-bar" aria-hidden><i style={{ width: `${f.progress}%` }} /></span>}
          </div>
          {f.progress < 100 && !f.error
            ? <small style={{ color: "var(--faint)", fontVariantNumeric: "tabular-nums" }}>{Math.round(f.progress)}%</small>
            : <button className="ifx-file-x" aria-label={`Remove ${f.name}`} onClick={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))}>✕</button>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 12 · Star rating — radiogroup with hover preview and word           */
/* ------------------------------------------------------------------ */
const RATE_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
export function StarRating() {
  const [val, setVal] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);
  const shown = hover || val;
  return (
    <div className="ifx-rate ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div className="ifx-rate-top">
        <div className="ifx-rate-thumb" role="img" aria-label="Harbor House cabin" />
        <div>
          <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Rate your stay</h2>
          <p className="ifx-sub">Harbor House · Nov 14 – 17</p>
        </div>
      </div>
      {sent ? (
        <div className="ifx-rate-done ifx-pop" role="status">
          <span className="ifx-otp-check" style={{ width: 24, height: 24 }}>{I.check}</span>
          Thanks — {val} out of 5. Your review helps other guests.
          <button className="ifx-jobs-clear" style={{ marginLeft: "auto" }} onClick={() => setSent(false)}>Edit</button>
        </div>
      ) : (
        <>
          <div
            className="ifx-stars" role="radiogroup" aria-label="Your rating"
            onMouseLeave={() => setHover(0)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setVal((v) => Math.min(5, v + 1)); }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setVal((v) => Math.max(1, v - 1)); }
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n} role="radio" aria-checked={val === n} tabIndex={val === n || (val === 0 && n === 1) ? 0 : -1}
                className={`ifx-star ${n <= shown ? "lit" : ""}`} aria-label={`${n} star${n > 1 ? "s" : ""} — ${RATE_WORDS[n]}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setVal(n)}
              >{I.star(n <= shown)}</button>
            ))}
          </div>
          <p className="ifx-rate-word" role="status">{shown ? RATE_WORDS[shown] : "Tap a star"}</p>
          <button className="ifx-btn" disabled={!val} onClick={() => setSent(true)} style={{ alignSelf: "flex-start", height: 34, fontSize: 13.5 }}>
            Submit rating
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13 · Color picker — swatches + validated hex + live preview         */
/* ------------------------------------------------------------------ */
const SWATCH_HEX = ["#17171c", "#0033ff", "#0e7490", "#15803d", "#b45309", "#dc2626", "#7c3aed", "#db2777"];
export function ColorPicker() {
  const [hex, setHex] = useState("#0033FF");
  const [input, setInput] = useState("0033FF");
  const [bad, setBad] = useState(false);

  const apply = (raw: string) => {
    const clean = raw.replace("#", "").trim();
    setInput(clean.toUpperCase());
    if (/^[0-9a-fA-F]{6}$/.test(clean)) { setHex("#" + clean.toUpperCase()); setBad(false); }
    else if (/^[0-9a-fA-F]{3}$/.test(clean)) { setHex("#" + clean.split("").map((c) => c + c).join("").toUpperCase()); setBad(false); }
    else setBad(clean.length > 0);
  };

  return (
    <div className="ifx-color ifx-stack" style={{ display: "grid", gap: 13 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Accent color</h2>
        <p className="ifx-sub">Used for buttons and links across your workspace</p>
      </div>
      <div className="ifx-color-grid" role="group" aria-label="Preset colors">
        {SWATCH_HEX.map((c) => (
          <button
            key={c} className="ifx-cdot" style={{ background: c, color: c }} aria-pressed={hex === c}
            aria-label={`Color ${c}`}
            onClick={() => { setHex(c); setInput(c.slice(1)); setBad(false); }}
          >{hex === c ? I.check : null}</button>
        ))}
      </div>
      <div className="ifx-hexrow">
        <div className="ifx-hexwrap">
          <span aria-hidden>#</span>
          <input value={input} aria-label="Custom hex color" maxLength={7} spellCheck={false}
            onChange={(e) => apply(e.target.value)} />
        </div>
        <span className="ifx-hex-preview" style={{ background: bad ? "repeating-linear-gradient(45deg,#fff 0 5px,#f0f0f2 5px 10px)" : hex }} aria-hidden />
      </div>
      {bad && <p className="ifx-err" role="alert">Use 3 or 6 hex digits, like 0E7490</p>}
      <div className="ifx-color-demo" style={{ background: bad ? "var(--soft)" : hex, color: bad ? "var(--faint)" : "#fff" }}>
        {bad ? "Pick a color to preview" : "Button preview"}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14 · Tag input — chips, suggestions, backspace, max                 */
/* ------------------------------------------------------------------ */
const ALL_TAGS = ["design", "frontend", "urgent", "research", "bug", "docs", "mobile", "api"];
export function TagInput() {
  const MAXT = 5;
  const [tags, setTags] = useState<string[]>(["design", "mobile"]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId().replace(/:/g, "");

  const sugg = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ALL_TAGS.filter((t) => !tags.includes(t) && (!s || t.includes(s))).slice(0, 5);
  }, [q, tags]);

  const add = (t: string) => {
    const clean = t.trim().toLowerCase().replace(/\s+/g, "-");
    if (!clean || tags.includes(clean) || tags.length >= MAXT) return;
    setTags((p) => [...p, clean]); setQ(""); setActive(0);
  };

  return (
    <div className="ifx-tags ifx-stack" style={{ display: "grid", gap: 9 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Labels</h2>
        <p className="ifx-sub">Help the team find this later</p>
      </div>
      <div className="ifx-popwrap">
        <div className="ifx-tagbox" onClick={() => inputRef.current?.focus()}>
          {tags.map((t) => (
            <span className="ifx-tag" key={t}>
              {t}
              <button aria-label={`Remove label ${t}`} onClick={(e) => { e.stopPropagation(); setTags((p) => p.filter((x) => x !== t)); }}>✕</button>
            </span>
          ))}
          <input
            ref={inputRef} value={q} aria-label="Add a label" role="combobox" aria-expanded={focus && sugg.length > 0}
            aria-controls={focus && sugg.length > 0 ? `${id}-lb` : undefined} aria-activedescendant={focus && sugg.length > 0 ? `${id}-s-${active}` : undefined}
            placeholder={tags.length ? "" : "Add a label…"}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onFocus={() => setFocus(true)} onBlur={() => window.setTimeout(() => setFocus(false), 140)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") ) { e.preventDefault(); add(focus && sugg[active] && q.trim() === "" ? sugg[active] : (q.trim() && sugg[active] === q.trim().toLowerCase() ? sugg[active] : q)); }
              if (e.key === "Tab" && focus && sugg[active] && q.trim()) { add(sugg[active]); }
              if (e.key === "Backspace" && !q && tags.length) setTags((p) => p.slice(0, -1));
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, sugg.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            }}
          />
        </div>
        {focus && sugg.length > 0 && (
          <div className="ifx-menu" role="listbox" id={`${id}-lb`} aria-label="Label suggestions">
            {sugg.map((s, i) => (
              <button key={s} role="option" id={`${id}-s-${i}`} aria-selected={i === active} data-active={i === active}
                className="ifx-opt" onMouseDown={(e) => { e.preventDefault(); add(s); inputRef.current?.focus(); }}
                onMouseEnter={() => setActive(i)}>
                <span style={{ color: "var(--faint)", fontSize: 12 }}>#</span> {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="ifx-tags-hint">
        <span>Enter to add · backspace to remove</span>
        <span style={{ color: tags.length >= MAXT ? "var(--amber)" : undefined }} role="status">{tags.length}/{MAXT}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 15 · Password strength — meter + requirements checklist             */
/* ------------------------------------------------------------------ */
export function PasswordStrength() {
  const [v, setV] = useState("");
  const [show, setShow] = useState(false);
  const req = [
    { label: "At least 8 characters", met: v.length >= 8 },
    { label: "Upper and lower case", met: /[a-z]/.test(v) && /[A-Z]/.test(v) },
    { label: "A number", met: /\d/.test(v) },
    { label: "A symbol (!?#…)", met: /[^A-Za-z0-9]/.test(v) },
  ];
  const score = req.filter((r) => r.met).length;
  const words = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["var(--red)", "var(--red)", "var(--amber)", "#65a30d", "var(--green)"];
  return (
    <div className="ifx-pass ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Choose a password</h2>
        <p className="ifx-sub">For jamie@northwind.app</p>
      </div>
      <div className="ifx-float">
        <input
          id="ifx-pw" type={show ? "text" : "password"} placeholder=" " autoComplete="new-password"
          value={v} onChange={(e) => setV(e.target.value)}
          aria-describedby="ifx-pw-req"
        />
        <label htmlFor="ifx-pw">New password</label>
        <button type="button" className="ifx-eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
          {show ? I.eyeOff : I.eye}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="ifx-pass-meter" style={{ flex: 1 }} aria-hidden>
          {[0, 1, 2, 3].map((i) => <i key={i} className={i < score ? "on" : ""} style={{ background: i < score ? colors[score] : undefined }} />)}
        </div>
        <span className="ifx-pass-word" style={{ color: v ? colors[score] : "var(--faint)" }} role="status">{v ? words[score] : "—"}</span>
      </div>
      <div className="ifx-req" id="ifx-pw-req">
        {req.map((r) => (
          <span key={r.label} className={r.met ? "met" : ""}>
            <span className="ifx-reqdot" aria-hidden><svg viewBox="0 0 24 24"><path d="m5 13 4 4 10-11" /></svg></span>
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 16 · Currency field — grouped formatting, presets, limits           */
/* ------------------------------------------------------------------ */
export function CurrencyField() {
  const [raw, setRaw] = useState("1,250.00");
  const [err, setErr] = useState("");
  const num = parseFloat(raw.replace(/,/g, ""));

  const onBlur = () => {
    if (isNaN(num) || raw.trim() === "") { setErr("Enter an amount"); return; }
    if (num <= 0) { setErr("Must be more than $0"); return; }
    if (num > 99999) { setErr("Keep it under $100,000"); return; }
    setErr(""); setRaw(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  return (
    <div className="ifx-money ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Invoice total</h2>
        <p className="ifx-sub">North Studio · April retainer</p>
      </div>
      <div className="ifx-money-wrap" data-invalid={!!err}>
        <span aria-hidden>$</span>
        <input
          value={raw} inputMode="decimal" aria-label="Invoice amount in US dollars" aria-invalid={!!err}
          aria-describedby={err ? "ifx-money-err" : undefined}
          onChange={(e) => { setRaw(e.target.value.replace(/[^0-9.,]/g, "")); setErr(""); }}
          onBlur={onBlur}
          onFocus={() => setRaw((r) => r.replace(/,/g, ""))}
        />
        <span className="ifx-money-ccy">USD</span>
      </div>
      {err && <p className="ifx-err" id="ifx-money-err" role="alert">{err}</p>}
      <div className="ifx-money-chips">
        {[500, 1250, 2400].map((n) => (
          <button key={n} className="ifx-chip-btn" onClick={() => { setRaw(String(n)); setErr(""); }}>${n.toLocaleString()}</button>
        ))}
      </div>
      <p className="ifx-money-note">Billed in USD. Your client sees this exact amount.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 17 · Phone field — dial code select + grouped formatting            */
/* ------------------------------------------------------------------ */
const DIALS = [
  { flag: "🇮🇳", dial: "+91", len: 10, groups: [5, 5], label: "India" },
  { flag: "🇺🇸", dial: "+1", len: 10, groups: [3, 3, 4], label: "United States" },
  { flag: "🇬🇧", dial: "+44", len: 10, groups: [4, 3, 3], label: "United Kingdom" },
  { flag: "🇦🇪", dial: "+971", len: 9, groups: [2, 3, 4], label: "UAE" },
];
export function PhoneField() {
  const [di, setDi] = useState(0);
  const [num, setNum] = useState("");
  const [touched, setTouched] = useState(false);
  const d = DIALS[di];
  const digits = num.replace(/\D/g, "").slice(0, d.len);
  const pretty = (() => {
    let out: string[] = [], rest = digits;
    for (const g of d.groups) { if (!rest) break; out.push(rest.slice(0, g)); rest = rest.slice(g); }
    if (rest) out.push(rest);
    return out.join(" ");
  })();
  const bad = touched && digits.length > 0 && digits.length < d.len;

  return (
    <div className="ifx-ship ifx-stack" style={{ display: "grid", gap: 11 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Phone number</h2>
        <p className="ifx-sub">For delivery updates only</p>
      </div>
      <div className="ifx-phone-row">
        <select
          className="ifx-field ifx-phone-code" value={di} aria-label="Country calling code"
          onChange={(e) => { setDi(Number(e.target.value)); setNum(""); }}
        >
          {DIALS.map((x, i) => <option key={x.dial} value={i}>{x.flag} {x.dial}</option>)}
        </select>
        <div className="ifx-phone-num">
          <input
            className="ifx-field" value={pretty} inputMode="tel" aria-label={`Phone number, ${d.len} digits`}
            aria-invalid={bad} aria-describedby={bad ? "ifx-ph-err" : undefined}
            placeholder={d.groups.map((g) => "·".repeat(g)).join(" ")}
            onChange={(e) => setNum(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
      </div>
      {bad
        ? <p className="ifx-err" id="ifx-ph-err" role="alert">{d.label} numbers have {d.len} digits — {d.len - digits.length} to go</p>
        : <p className="ifx-sub" style={{ fontSize: 12 }}>{digits.length === d.len ? <span className="ifx-ok">✓ Looks right — {d.dial} {pretty}</span> : `${digits.length}/${d.len} digits`}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 18 · URL field — scheme prefix, format validation state            */
/* ------------------------------------------------------------------ */
export function UrlField() {
  const [v, setV] = useState("northwind.app/studio");
  const [touched, setTouched] = useState(false);
  const valid = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(\/[^\s]*)?$/i.test(v.trim());
  const state = !v.trim() ? "idle" : valid ? "good" : "bad";
  return (
    <div className="ifx-ship ifx-stack" style={{ display: "grid", gap: 11 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Portfolio link</h2>
        <p className="ifx-sub">Shown on your public profile</p>
      </div>
      <div className="ifx-url-wrap" data-state={touched ? state : "idle"}>
        <span>https://</span>
        <input
          value={v} aria-label="Website URL" aria-invalid={touched && state === "bad"}
          spellCheck={false} autoCapitalize="off" placeholder="yoursite.com"
          onChange={(e) => setV(e.target.value)} onBlur={() => setTouched(true)}
        />
      </div>
      {touched && state === "bad" && <p className="ifx-err" role="alert">That doesn't look like a web address</p>}
      {touched && state === "good" && (
        <p className="ifx-url-status"><i className="ifx-url-dot good" aria-hidden /><span className="ifx-ok">Looks good — format checks out</span></p>
      )}
      {!touched && <p className="ifx-sub" style={{ fontSize: 12 }}>We check the format when you leave the field</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 19 · Time picker — listbox of slots                                 */
/* ------------------------------------------------------------------ */
const SLOTS = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 18; h++) for (const m of [0, 30]) {
    const hr = ((h - 1) % 12) + 1;
    out.push(`${hr}:${m === 0 ? "00" : "30"} ${h < 12 ? "AM" : "PM"}`);
  }
  return out;
})();
export function TimePicker() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("9:30 AM");
  const [active, setActive] = useState(SLOTS.indexOf("9:30 AM"));
  const [daily, setDaily] = useState(true);
  const wrapRef = useOutside(open, () => setOpen(false));
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div className="ifx-time ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Standup time</h2>
        <p className="ifx-sub">Team Northwind · 15 minutes</p>
      </div>
      <div className="ifx-popwrap" ref={wrapRef}>
        <button
          className="ifx-sel-btn" aria-haspopup="listbox" aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, SLOTS.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActive((a) => Math.max(a - 1, 0)); }
            if ((e.key === "Enter" || e.key === " ") && open) { e.preventDefault(); setVal(SLOTS[active]); setOpen(false); }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span style={{ color: "var(--faint)", display: "inline-flex" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg></span> <b style={{ fontWeight: 600 }}>{val}</b> {I.chevron}
        </button>
        {open && (
          <div className="ifx-menu ifx-time-menu" role="listbox" aria-label="Standup time" ref={listRef}>
            {SLOTS.map((s, i) => (
              <button key={s} role="option" aria-selected={s === val} data-active={i === active}
                className="ifx-opt" onMouseEnter={() => setActive(i)}
                onClick={() => { setVal(s); setOpen(false); }}>
                {s}{s === val && <span className="ifx-opt-kind" style={{ color: "var(--blue)" }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <label className="ifx-time-check">
        <input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} />
        Repeat every weekday
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 20 · Notification toggles — switches with master pause              */
/* ------------------------------------------------------------------ */
const TOG_ROWS = [
  { name: "Comments", sub: "When someone replies to you" },
  { name: "Mentions", sub: "When someone @mentions you" },
  { name: "Product news", sub: "New components, about monthly" },
];
export function NotificationToggles() {
  const [paused, setPaused] = useState(false);
  const [on, setOn] = useState([true, true, false]);
  return (
    <div className="ifx-togs">
      <div className="ifx-togs-head">
        <div>
          <b>Notifications</b>
          <p className="ifx-sub" style={{ marginTop: 1 }}>{paused ? "All paused — nothing will reach you" : "Email and push"}</p>
        </div>
        <button
          role="switch" aria-checked={paused} aria-label="Pause all notifications"
          className="ifx-switch" style={{ background: paused ? "var(--red)" : undefined }}
          onClick={() => setPaused((p) => !p)}
        />
      </div>
      {TOG_ROWS.map((r, i) => (
        <div className="ifx-tog-row" key={r.name} data-off={paused}>
          <div className="ifx-tog-copy"><b>{r.name}</b><span>{r.sub}</span></div>
          <button
            role="switch" aria-checked={on[i]} aria-label={r.name} disabled={paused}
            className="ifx-switch"
            onClick={() => setOn((p) => p.map((v, k) => (k === i ? !v : v)))}
          />
        </div>
      ))}
      <p className="ifx-sub" style={{ fontSize: 12 }} role="status">
        {paused ? "Paused" : `${on.filter(Boolean).length} of ${TOG_ROWS.length} on`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 21 · Billing segmented control — sliding pill, price swap           */
/* ------------------------------------------------------------------ */
export function BillingSegmented() {
  const [yearly, setYearly] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const btnM = useRef<HTMLButtonElement>(null);
  const btnY = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ left: 3, width: 0 });

  useLayoutEffect(() => {
    const b = yearly ? btnY.current : btnM.current;
    if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
  }, [yearly]);

  const price = useCountUp(yearly ? 9 : 12);
  return (
    <div className="ifx-bill ifx-stack" style={{ display: "grid", gap: 13, justifyItems: "center" }}>
      <div className="ifx-seg" role="radiogroup" aria-label="Billing period" ref={wrap}>
        <span className="ifx-seg-pill" style={{ left: pill.left, width: pill.width }} aria-hidden />
        <button ref={btnM} role="radio" aria-checked={!yearly} onClick={() => setYearly(false)}>Monthly</button>
        <button ref={btnY} role="radio" aria-checked={yearly} onClick={() => setYearly(true)}>
          Yearly <span className="ifx-save">−25%</span>
        </button>
      </div>
      <div>
        <div className="ifx-bill-price"><span key={price}>${Math.round(price)}</span><small> / seat / month</small></div>
        <p className="ifx-bill-note" role="status">{yearly ? "Billed yearly · $108 per seat" : "Billed monthly · switch to yearly to save"}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 22 · Reply composer — autogrow, char ring, send into thread         */
/* ------------------------------------------------------------------ */
const LIMIT = 280;
export function ReplyComposer() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const ta = useRef<HTMLTextAreaElement>(null);
  const left = LIMIT - text.length;
  const C = 2 * Math.PI * 9;

  useLayoutEffect(() => {
    const el = ta.current;
    if (el) { el.style.height = "0px"; el.style.height = `${Math.min(el.scrollHeight, 130)}px`; }
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    setSent((s) => [...s, text.trim()]);
    setText("");
    ta.current?.focus();
  };

  return (
    <div className="ifx-compose ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div className="ifx-thread">
        <div className="ifx-their">Pushed the quieter route to staging — have a look when you're back?</div>
        {sent.map((m, i) => <div key={i} className="ifx-bubblemsg">{m}</div>)}
      </div>
      <div className="ifx-compose-row">
        <div className="ifx-compose-box">
          <textarea
            ref={ta} rows={1} value={text} placeholder="Reply to Ava…"
            aria-label="Reply to Ava" maxLength={LIMIT}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <svg className="ifx-ring" viewBox="0 0 22 22" aria-hidden>
            <circle className="ifx-ring-bg" cx="11" cy="11" r="9" />
            <circle
              className="ifx-ring-fg" cx="11" cy="11" r="9"
              strokeDasharray={C} strokeDashoffset={C * (1 - text.length / LIMIT)}
              style={{ stroke: left <= 20 ? (left <= 0 ? "var(--red)" : "var(--amber)") : undefined }}
            />
          </svg>
        </div>
        <button className="ifx-send" aria-label="Send reply" disabled={!text.trim()} onClick={send}>{I.send}</button>
      </div>
      <p className="ifx-sub" style={{ fontSize: 12 }} role="status">{left <= 20 ? `${left} characters left` : "Enter to send · Shift+Enter for a new line"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 23 · Card number — live mini card, brand detect, Luhn               */
/* ------------------------------------------------------------------ */
function luhn(n: string) {
  let s = 0, alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = Number(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    s += d; alt = !alt;
  }
  return n.length > 0 && s % 10 === 0;
}
export function CardNumberField() {
  const [v, setV] = useState("");
  const [touched, setTouched] = useState(false);
  const digits = v.replace(/\D/g, "");
  const amex = /^3[47]/.test(digits);
  const brand = amex ? "Amex" : /^4/.test(digits) ? "Visa" : /^5[1-5]/.test(digits) ? "Mastercard" : digits ? "Card" : "";
  const maxLen = amex ? 15 : 16;
  const grouped = (() => {
    const d = digits.slice(0, maxLen);
    if (amex) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
    return d.replace(/(.{4})/g, "$1 ").trim();
  })();
  const complete = digits.length === maxLen;
  const ok = complete && luhn(digits);
  const shown = grouped.padEnd(amex ? 17 : 19, "•").replace(/ /g, " ");

  return (
    <div className="ifx-cardf ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div className="ifx-minicard" aria-hidden>
        <div className="ifx-mc-top"><span className="ifx-mc-chip" /><span className="ifx-mc-brand">{brand || "Card"}</span></div>
        <div className="ifx-mc-num">{shown || "•••• •••• •••• ••••"}</div>
        <div className="ifx-mc-row"><span>Card holder<b>JAMIE LANE</b></span><span>Expires<b>09/29</b></span></div>
      </div>
      <label className="ifx-sub" style={{ fontSize: 12, display: "grid", gap: 5 }}>Card number
        <input
          className="ifx-field" value={grouped} inputMode="numeric" autoComplete="off"
          placeholder="4242 4242 4242 4242" aria-invalid={touched && complete && !ok}
          onChange={(e) => setV(e.target.value)} onBlur={() => setTouched(true)}
          style={{ letterSpacing: ".06em" }}
        />
      </label>
      <p style={{ fontSize: 12 }} role="status">
        {complete
          ? ok ? <span className="ifx-ok">✓ {brand} number checks out</span> : <span className="ifx-err">That number doesn't add up — check the digits</span>
          : <span className="ifx-sub">{brand ? `${brand} · ` : ""}{digits.length}/{maxLen} digits · try 4242 4242 4242 4242</span>}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 24 · Expiry + CVC — auto-slash, future-date validation              */
/* ------------------------------------------------------------------ */
export function ExpiryCvcFields() {
  const [ex, setEx] = useState("");
  const [cvc, setCvc] = useState("");
  const [touched, setTouched] = useState({ ex: false, cvc: false });

  const fmtEx = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };
  const exBad = (() => {
    if (!touched.ex || ex.length < 5) return false;
    const m = Number(ex.slice(0, 2)), y = 2000 + Number(ex.slice(3));
    if (m < 1 || m > 12) return true;
    const now = new Date();
    return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
  })();
  const cvcBad = touched.cvc && cvc.length > 0 && cvc.length < 3;

  return (
    <div className="ifx-cardf ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Security check</h2>
        <p className="ifx-sub">Visa ending 4242</p>
      </div>
      <div className="ifx-cardrow">
        <label>Expiry
          <input
            className="ifx-field" value={ex} inputMode="numeric" placeholder="MM/YY"
            autoComplete="off" aria-invalid={exBad}
            onChange={(e) => setEx(fmtEx(e.target.value))}
            onBlur={() => setTouched((t) => ({ ...t, ex: true }))}
          />
        </label>
        <label>Security code
          <input
            className="ifx-field" value={cvc} inputMode="numeric" placeholder="CVC" maxLength={4}
            autoComplete="off" aria-invalid={cvcBad}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onBlur={() => setTouched((t) => ({ ...t, cvc: true }))}
          />
        </label>
      </div>
      {exBad && <p className="ifx-err" role="alert">That expiry is in the past</p>}
      {cvcBad && <p className="ifx-err" role="alert">The 3 digits on the back of the card</p>}
      {ex.length === 5 && !exBad && cvc.length >= 3 && (
        <p className="ifx-ok ifx-pop" role="status">✓ Card verified for this payment</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 25 · Assignee combobox — people picker with search                  */
/* ------------------------------------------------------------------ */
const PEOPLE = [
  { name: "Ava Lewis", init: "AL", color: "#b45309", role: "Design" },
  { name: "Miles Chen", init: "MC", color: "#0e7490", role: "Engineering" },
  { name: "Priya Nair", init: "PN", color: "#7c3aed", role: "Product" },
  { name: "Tom Okafor", init: "TO", color: "#15803d", role: "Engineering" },
  { name: "Sana Iqbal", init: "SI", color: "#db2777", role: "Research" },
];
export function AssigneeCombobox() {
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<number | null>(1);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const wrapRef = useOutside(open, () => setOpen(false));
  const id = useId().replace(/:/g, "");

  const list = PEOPLE.map((p, i) => ({ ...p, i })).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const sel = pick !== null ? PEOPLE[pick] : null;

  return (
    <div className="ifx-assign ifx-stack" style={{ display: "grid", gap: 12 }}>
      <div className="ifx-issue">
        <span className="ifx-issue-key">NW-318</span>
        <span style={{ fontWeight: 600 }}>Empty state for the new dashboard</span>
      </div>
      <div className="ifx-popwrap" ref={wrapRef}>
        <label htmlFor={`${id}-btn`} className="ifx-sub" style={{ fontSize: 12, display: "block", marginBottom: 5 }}>Assignee</label>
        <button
          id={`${id}-btn`} className="ifx-sel-btn" aria-haspopup="listbox" aria-expanded={open}
          onClick={() => { setOpen((o) => !o); setQ(""); setActive(0); }}
        >
          {sel ? <><span className="ifx-avatar" style={{ background: sel.color, width: 24, height: 24, fontSize: 10 }}>{sel.init}</span> {sel.name}</> : <span style={{ color: "var(--faint)" }}>Unassigned</span>}
          {I.chevron}
        </button>
        {open && (
          <div className="ifx-menu ifx-assign-menu" role="listbox" aria-label="Assign to" aria-activedescendant={`${id}-p-${active}`}>
            <div className="ifx-assign-search">
              {I.search}
              <input
                autoFocus value={q} placeholder="Search people…" aria-label="Search people"
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  if (e.key === "Enter" && list[active]) { setPick(list[active].i); setOpen(false); }
                  if (e.key === "Escape") setOpen(false);
                }}
              />
            </div>
            {list.length === 0 && <div className="ifx-empty">No one named “{q}” on this team.</div>}
            {list.map((p, i) => (
              <button key={p.name} role="option" id={`${id}-p-${i}`} aria-selected={pick === p.i} data-active={i === active}
                className="ifx-opt" onMouseEnter={() => setActive(i)}
                onClick={() => { setPick(p.i); setOpen(false); }}>
                <span className="ifx-avatar" style={{ background: p.color, width: 26, height: 26, fontSize: 10 }}>{p.init}</span>
                <span>{p.name} <span style={{ color: "var(--faint)", fontSize: 12 }}>· {p.role}</span></span>
                {pick === p.i && <span className="ifx-tick">{I.check}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="ifx-sub" style={{ fontSize: 12 }} role="status">
        {sel ? <>{sel.name} will get a notification</> : "Nobody is assigned yet"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 26 · Skills multi-select — chip field + checkbox panel              */
/* ------------------------------------------------------------------ */
const SKILLS = ["Product design", "Motion", "TypeScript", "Design systems", "User research", "Prototyping", "Accessibility"];
export function SkillsMultiSelect() {
  const MAXS = 4;
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>(["Design systems", "TypeScript"]);
  const wrapRef = useOutside(open, () => setOpen(false));

  const toggle = (s: string) => setSel((p) =>
    p.includes(s) ? p.filter((x) => x !== s) : p.length < MAXS ? [...p, s] : p);

  return (
    <div className="ifx-skills ifx-stack" style={{ display: "grid", gap: 11 }}>
      <div>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Skills</h2>
        <p className="ifx-sub">Pick up to {MAXS} for your profile</p>
      </div>
      <div className="ifx-popwrap" ref={wrapRef}>
        <button
          className="ifx-sel-btn ifx-skills-btn" aria-haspopup="listbox" aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {sel.length === 0 && <span className="ifx-ph">Choose skills…</span>}
          {sel.map((s) => (
            <span className="ifx-tag" key={s}>{s}
              <span
                aria-hidden style={{ cursor: "pointer", color: "var(--faint)" }}
                onClick={(e) => { e.stopPropagation(); toggle(s); }}
              >✕</span>
            </span>
          ))}
          {I.chevron}
        </button>
        {open && (
          <div className="ifx-menu" role="listbox" aria-multiselectable="true" aria-label="Skills">
            {SKILLS.map((s) => {
              const on = sel.includes(s);
              const full = !on && sel.length >= MAXS;
              return (
                <button key={s} role="option" aria-selected={on} className="ifx-checkrow" disabled={full}
                  style={{ opacity: full ? .4 : 1, width: "100%" }}
                  onClick={() => toggle(s)}>
                  <span className="ifx-box" aria-hidden style={on ? { background: "var(--blue)", borderColor: "var(--blue)" } : undefined}>
                    <svg viewBox="0 0 24 24"><path d="m4 12.5 5 5L20 6.5" style={on ? { strokeDashoffset: 0 } : undefined} /></svg>
                  </span>
                  <span className="ifx-check-label">{s}</span>
                </button>
              );
            })}
            <div className="ifx-menu-foot">
              <small role="status">{sel.length} of {MAXS} selected</small>
              <button className="ifx-jobs-clear" onClick={() => setOpen(false)}>Done</button>
            </div>
          </div>
        )}
      </div>
      <p className="ifx-sub" style={{ fontSize: 12 }}>These appear on your team page card.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 27 · Guests counter — rows of steppers                              */
/* ------------------------------------------------------------------ */
export function GuestsCounter() {
  const [vals, setVals] = useState([2, 1, 0]);
  const rows = [
    { name: "Adults", sub: "Ages 16+", min: 1, max: 8 },
    { name: "Children", sub: "Ages 2 – 12", min: 0, max: 6 },
    { name: "Infants", sub: "Under 2", min: 0, max: 3 },
  ];
  const total = vals.reduce((a, b) => a + b, 0);
  return (
    <div className="ifx-guests ifx-stack" style={{ display: "grid", gap: 2 }}>
      <div style={{ marginBottom: 8 }}>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Who's coming?</h2>
        <p className="ifx-sub">Harbor House · sleeps 8</p>
      </div>
      {rows.map((r, i) => (
        <div className="ifx-guest-row" key={r.name}>
          <div className="ifx-tog-copy" style={{ flex: 1 }}><b>{r.name}</b><span>{r.sub}</span></div>
          <div className="ifx-step olive" role="group" aria-label={r.name}>
            <button aria-label={`Fewer ${r.name.toLowerCase()}`} disabled={vals[i] <= r.min}
              onClick={() => setVals((p) => p.map((v, k) => (k === i ? Math.max(r.min, v - 1) : v)))}>−</button>
            <output key={vals[i]} aria-live="polite">{vals[i]}</output>
            <button aria-label={`More ${r.name.toLowerCase()}`} disabled={vals[i] >= r.max}
              onClick={() => setVals((p) => p.map((v, k) => (k === i ? Math.min(r.max, v + 1) : v)))}>+</button>
          </div>
        </div>
      ))}
      <p className="ifx-guests-total" role="status">{total} guest{total === 1 ? "" : "s"} · {vals[2] > 0 ? "infants stay free" : "no infants"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 28 · Plan radio cards — pricing picker with arrow keys              */
/* ------------------------------------------------------------------ */
const PLANS = [
  { name: "Hobby", price: 0, per: "forever", feats: ["3 projects", "Community support"] },
  { name: "Pro", price: 9, per: "per seat / mo", feats: ["Unlimited projects", "Priority support", "Custom domains"], pop: true },
  { name: "Team", price: 19, per: "per seat / mo", feats: ["Everything in Pro", "SSO & audit log"] },
];
export function PlanRadioCards() {
  const [sel, setSel] = useState(1);
  return (
    <div className="ifx-plans ifx-stack" style={{ display: "grid", gap: 13 }}>
      <div className="ifx-plan-grid" role="radiogroup" aria-label="Choose a plan">
        {PLANS.map((p, i) => (
          <button
            key={p.name} role="radio" aria-checked={sel === i} className="ifx-plan"
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % PLANS.length); }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + PLANS.length) % PLANS.length); }
            }}
          >
            {p.pop && <span className="ifx-badge-pop">Most popular</span>}
            <span className="ifx-plan-check" aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="m4 12.5 5 5L20 6.5" /></svg></span>
            <b>{p.name}</b>
            <span className="ifx-plan-price">{p.price === 0 ? "Free" : `$${p.price}`} <small>{p.per}</small></span>
            <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
          </button>
        ))}
      </div>
      <button className="ifx-btn blue" style={{ justifySelf: "start" }}>Continue with {PLANS[sel].name}{PLANS[sel].price ? ` · $${PLANS[sel].price}` : ""}</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 29 · Addon check cards — checkout extras with live total            */
/* ------------------------------------------------------------------ */
const ADDONS = [
  { name: "Gift wrap", sub: "Kraft paper, cotton ribbon", price: 4 },
  { name: "Express delivery", sub: "Arrives in 2 days", price: 9 },
  { name: "Damage protection", sub: "Covers 12 months", price: 12 },
];
export function AddonCheckCards() {
  const BASE = 86;
  const [on, setOn] = useState([false, true, false]);
  const total = useCountUp(BASE + ADDONS.reduce((n, a, i) => n + (on[i] ? a.price : 0), 0));
  return (
    <div className="ifx-addons ifx-stack" style={{ display: "grid", gap: 9 }}>
      <div style={{ marginBottom: 3 }}>
        <h2 className="ifx-h" style={{ fontSize: 15.5 }}>Make it yours</h2>
        <p className="ifx-sub">Overshirt · Sand · M</p>
      </div>
      {ADDONS.map((a, i) => (
        <label key={a.name} className="ifx-addon" data-on={on[i]}>
          <input type="checkbox" checked={on[i]} onChange={() => setOn((p) => p.map((v, k) => (k === i ? !v : v)))} />
          <span className="ifx-box" aria-hidden><svg viewBox="0 0 24 24"><path d="m4 12.5 5 5L20 6.5" /></svg></span>
          <span className="ifx-addon-copy"><b>{a.name}</b><span>{a.sub}</span></span>
          <span className="ifx-addon-price">+${a.price}</span>
        </label>
      ))}
      <div className="ifx-addons-total">
        <span style={{ color: "var(--mut)" }}>Total</span>
        <b role="status">${fmtMoney(Math.round(total * 100) / 100)}</b>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 30 · Inline rename — click to edit, Enter saves, Esc reverts        */
/* ------------------------------------------------------------------ */
export function InlineRename() {
  const [name, setName] = useState("Northwind redesign");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [editing]);

  const commit = () => {
    if (!draft.trim()) { setShakeKey((k) => k + 1); return; }
    setName(draft.trim()); setEditing(false);
    setSavedAt(true); window.setTimeout(() => setSavedAt(false), 1800);
  };

  return (
    <div className="ifx-rename ifx-stack" style={{ display: "grid", gap: 8 }}>
      <span className="ifx-sub" style={{ fontSize: 12 }}>Project name</span>
      <div className="ifx-rename-row" key={shakeKey}>
        {editing ? (
          <input
            ref={inputRef} value={draft} aria-label="Project name" className={shakeKey ? "ifx-shake" : undefined}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") { setDraft(name); setEditing(false); }
            }}
            onBlur={commit}
          />
        ) : (
          <>
            <span className="ifx-rename-val" role="button" tabIndex={0}
              onClick={() => { setDraft(name); setEditing(true); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDraft(name); setEditing(true); } }}
            >{name}</span>
            <button className="ifx-rename-edit" aria-label="Edit project name" onClick={() => { setDraft(name); setEditing(true); }}>{I.pencil}</button>
            {savedAt && <span className="ifx-rename-saved ifx-pop" role="status">✓ Saved</span>}
          </>
        )}
      </div>
      <p className="ifx-rename-meta">Click the name to rename it · Enter saves · Esc reverts</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* manifest + gallery                                                  */
/* ------------------------------------------------------------------ */
export const INPUT_FAMILY: { id: string; name: string; note: string; span?: 2 | 3 | 4 | 6; Component: () => ReactElement }[] = [
  { id: "sign-in", name: "Floating label sign-in", note: "Labels lift on focus, errors shake, show/hide password", span: 2, Component: SignInCard },
  { id: "otp", name: "Verification code", note: "Six boxes, paste anywhere, wrong code shakes", span: 2, Component: OtpVerify },
  { id: "price-slider", name: "Price slider", note: "Histogram behind the track, spring bubble", span: 2, Component: PriceSlider },
  { id: "search", name: "Search with suggestions", note: "Combobox with recents and ⌘K", span: 3, Component: SearchSuggest },
  { id: "budget-range", name: "Budget range", note: "Two thumbs, one track, typed values stay in sync", span: 3, Component: BudgetRange },
  { id: "cart-stepper", name: "Cart quantity", note: "Stepper with a total that counts up", span: 3, Component: QtyStepper },
  { id: "size-chips", name: "Size & colour picker", note: "Radio chips, low-stock flags, live CTA", span: 3, Component: SizeChips },
  { id: "date-picker", name: "Delivery date picker", note: "Calendar popover, arrows move the day", span: 2, Component: DeliveryDatePicker },
  { id: "country", name: "Country select", note: "Listbox with flags and dial codes", span: 2, Component: CountrySelect },
  { id: "job-filters", name: "Filter checkboxes", note: "Animated checks, live match count", span: 2, Component: FilterCheckboxes },
  { id: "file-drop", name: "File drop zone", note: "Drag in real files, progress and size errors", span: 4, Component: FileDrop },
  { id: "star-rating", name: "Star rating", note: "Radiogroup stars with a word for each level", span: 2, Component: StarRating },
  { id: "color-picker", name: "Accent color picker", note: "Swatches plus a validated hex field", span: 2, Component: ColorPicker },
  { id: "tag-input", name: "Label input", note: "Chips with suggestions and a hard limit", span: 2, Component: TagInput },
  { id: "password", name: "Password strength", note: "Meter and a checklist that ticks itself", span: 2, Component: PasswordStrength },
  { id: "currency", name: "Invoice amount", note: "Groups thousands on blur, presets below", span: 2, Component: CurrencyField },
  { id: "phone", name: "Phone number", note: "Dial code select, per-country grouping", span: 2, Component: PhoneField },
  { id: "url", name: "Website URL", note: "Scheme prefix with a format check", span: 2, Component: UrlField },
  { id: "time-picker", name: "Time picker", note: "Half-hour slots in a listbox", span: 2, Component: TimePicker },
  { id: "toggles", name: "Notification switches", note: "Master pause dims the whole group", span: 2, Component: NotificationToggles },
  { id: "billing", name: "Billing period", note: "Sliding pill, price follows", span: 2, Component: BillingSegmented },
  { id: "composer", name: "Reply composer", note: "Autogrowing text, character ring, send", span: 4, Component: ReplyComposer },
  { id: "card-number", name: "Card number", note: "Live mini card, brand detect, Luhn check", span: 3, Component: CardNumberField },
  { id: "expiry-cvc", name: "Expiry & CVC", note: "Auto-slash MM/YY, past dates rejected", span: 3, Component: ExpiryCvcFields },
  { id: "assignee", name: "Assignee picker", note: "Searchable people listbox with avatars", span: 3, Component: AssigneeCombobox },
  { id: "skills", name: "Skills multi-select", note: "Chips in the field, checkboxes in the panel", span: 3, Component: SkillsMultiSelect },
  { id: "guests", name: "Guest counter", note: "Steppers per age group, one total", span: 2, Component: GuestsCounter },
  { id: "plans", name: "Plan cards", note: "Radiogroup cards, arrows move the choice", span: 4, Component: PlanRadioCards },
  { id: "addons", name: "Checkout add-ons", note: "Check cards with a counting total", span: 3, Component: AddonCheckCards },
  { id: "rename", name: "Inline rename", note: "Click to edit, Enter saves, Esc reverts", span: 3, Component: InlineRename },
];

export default function InputFamily() {
  return (
    <div className="ifx">
      <div className="ifx-grid">
        {INPUT_FAMILY.map(({ id, name, note, span, Component }) => (
          <div key={id} className={`ifx-cell ${span ? `ifx-s${span}` : ""}`}>
            <div className="ifx-item">
              <Component />
            </div>
            <div className="ifx-cap"><b>{name}</b><span>{note}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
