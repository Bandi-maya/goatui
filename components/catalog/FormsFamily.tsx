"use client";
import React, { useEffect, useId, useMemo, useRef, useState, type ReactElement } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./FormsFamily.css";

/* ------------------------------------------------------------------ */
/* shared                                                              */
/* ------------------------------------------------------------------ */

/** rAF damped oscillator toward a target number (used for counting data). */
function useSpring(target: number, stiffness = 170, damping = 24): number {
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

const SPRING = { type: "spring" as const, stiffness: 380, damping: 30 };
const fmtMoney = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

/* small inline icon set */
const I = {
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m4 12.5 5 5L20 6.5" /></svg>,
  arrowR: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14m-6-6 6 6-6 6" /></svg>,
  arrowL: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5m6 6-6-6 6-6" /></svg>,
  x: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M5 5l14 14M19 5 5 19" /></svg>,
  chevD: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>,
  swap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" /></svg>,
  plane: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M21 15.5v-2l-8-4.5V4a1.5 1.5 0 0 0-3 0v5L2 13.5v2l8-2v5l-2.5 2v1.5L12 20.5l4.5 1.5V20L14 18.5v-5l7 2Z" /></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3 7 9 6 9-6" /></svg>,
  pen: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" /></svg>,
  plus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>,
  minus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M5 12h14" /></svg>,
  star: (filled: boolean) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M12 1.5 14.36 8.76 21.99 8.76 15.81 13.24 18.17 20.49 12 16.01 5.83 20.49 8.19 13.24 2.01 8.76 9.64 8.76Z" />
    </svg>
  ),
};

/* shared field shell ------------------------------------------------ */
function Field({ label, htmlFor, error, hint, children }: { label: string; htmlFor: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="ffx-field" data-invalid={!!error}>
      <label className="ffx-label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="ffx-err" id={`${htmlFor}-err`} role="alert">{error}</p>}
      {!error && hint && <p className="ffx-hint">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v01 · Split auth card — sliding mode thumb, fields swap             */
/* ------------------------------------------------------------------ */
export function SplitAuthSwitch() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [done, setDone] = useState(false);
  const uid = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || pass.length < 8 || (mode === "up" && !name.trim())) return;
    setDone(true);
    window.setTimeout(() => setDone(false), 1800);
  };

  return (
    <div className="ffx-auth">
      <div className="ffx-auth-seg" role="tablist" aria-label="Choose sign in or sign up">
        {(["in", "up"] as const).map((m) => (
          <button
            key={m} type="button" role="tab" aria-selected={mode === m}
            className={`ffx-auth-tab ${mode === m ? "is-on" : ""}`}
            onClick={() => setMode(m)}
          >
            {mode === m && <motion.span layoutId="ffx-auth-thumb" className="ffx-auth-thumb" transition={reduce ? { duration: 0 } : SPRING} />}
            <span className="ffx-auth-tab-t">{m === "in" ? "Sign in" : "Sign up"}</span>
          </button>
        ))}
      </div>
      <form className="ffx-form" onSubmit={submit} noValidate>
        <AnimatePresence initial={false}>
          {mode === "up" && (
            <motion.div key="name" initial={reduce ? false : { opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }} transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
              <Field label="Full name" htmlFor={`${uid}-n`}>
                <input id={`${uid}-n`} className="ffx-in" value={name} autoComplete="name" placeholder="Ada Lovelace" onChange={(e) => setName(e.target.value)} />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
        <Field label="Email" htmlFor={`${uid}-e`}>
          <input id={`${uid}-e`} className="ffx-in" type="email" value={email} autoComplete="email" placeholder="ada@analytical.dev" onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor={`${uid}-p`} hint="At least 8 characters">
          <input id={`${uid}-p`} className="ffx-in" type="password" value={pass} autoComplete={mode === "in" ? "current-password" : "new-password"} placeholder="••••••••" onChange={(e) => setPass(e.target.value)} />
        </Field>
        <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit">
          {done ? <span className="ffx-btn-check ffx-pop">{I.check} Done</span> : mode === "in" ? "Sign in" : "Create account"}
        </motion.button>
      </form>
      <p className="ffx-foot">{mode === "in" ? "New here? Switch to Sign up above." : "Already have an account? Switch to Sign in."}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v02 · Onboarding wizard — sliding steps, spring progress            */
/* ------------------------------------------------------------------ */
const WIZ_STEPS = ["Profile", "Workspace", "Done"] as const;
export function OnboardingWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Designer");
  const [ws, setWs] = useState("");
  const [size, setSize] = useState("2-10");
  const [err, setErr] = useState("");
  const uid = useId();

  const go = (n: number) => { setDir(n > step ? 1 : -1); setErr(""); setStep(n); };
  const next = () => {
    if (step === 0 && !name.trim()) { setErr("Tell us your name to continue"); return; }
    if (step === 1 && !ws.trim()) { setErr("Name your workspace to continue"); return; }
    go(Math.min(step + 1, 2));
  };

  const panel = (s: number) => {
    if (s === 0) return (
      <div className="ffx-wiz-body">
        <Field label="Your name" htmlFor={`${uid}-n`} error={err || undefined}>
          <input id={`${uid}-n`} className="ffx-in" value={name} autoComplete="name" placeholder="Grace Hopper"
            onChange={(e) => { setName(e.target.value); setErr(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); next(); } }} />
        </Field>
        <Field label="Role" htmlFor={`${uid}-r`}>
          <div className="ffx-sel-wrap">
            <select id={`${uid}-r`} className="ffx-in ffx-sel" value={role} onChange={(e) => setRole(e.target.value)}>
              {["Designer", "Engineer", "Founder", "Product", "Other"].map((r) => <option key={r}>{r}</option>)}
            </select>
            {I.chevD}
          </div>
        </Field>
      </div>
    );
    if (s === 1) return (
      <div className="ffx-wiz-body">
        <Field label="Workspace name" htmlFor={`${uid}-w`} error={err || undefined}>
          <input id={`${uid}-w`} className="ffx-in" value={ws} placeholder="Compiler Co"
            onChange={(e) => { setWs(e.target.value); setErr(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); next(); } }} />
        </Field>
        <fieldset className="ffx-fieldset">
          <legend className="ffx-label">Team size</legend>
          <div className="ffx-chiprow" role="radiogroup" aria-label="Team size">
            {["Just me", "2-10", "11-50", "50+"].map((s2) => (
              <button key={s2} type="button" role="radio" aria-checked={size === s2}
                className={`ffx-chip ${size === s2 ? "is-on" : ""}`}
                onClick={() => setSize(s2)}
                onKeyDown={(e) => {
                  const arr = ["Just me", "2-10", "11-50", "50+"];
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const d = e.key === "ArrowRight" ? 1 : -1;
                    setSize(arr[(arr.indexOf(size) + d + arr.length) % arr.length]);
                  }
                }}>
                {size === s2 && <motion.span layoutId="ffx-wiz-chip" className="ffx-chip-dot" transition={reduce ? { duration: 0 } : SPRING} />}
                {s2}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
    return (
      <div className="ffx-wiz-done">
        <motion.span className="ffx-done-ring" initial={reduce ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 17 }}>{I.check}</motion.span>
        <h3>You're all set{name ? `, ${name.split(" ")[0]}` : ""}</h3>
        <p>{ws || "Your workspace"} · {role} · {size}</p>
      </div>
    );
  };

  return (
    <div className="ffx-wiz">
      <div className="ffx-wiz-rail" aria-hidden={false}>
        {WIZ_STEPS.map((label, i) => (
          <button key={label} type="button" className={`ffx-wiz-dotwrap ${i === step ? "is-on" : ""} ${i < step ? "is-done" : ""}`}
            aria-label={`Step ${i + 1}: ${label}`} aria-current={i === step ? "step" : undefined}
            onClick={() => { if (i < step) go(i); }}>
            <motion.span className="ffx-wiz-dot" animate={reduce ? undefined : { scale: i === step ? 1.35 : 1 }} transition={SPRING}>
              {i < step ? I.check : i + 1}
            </motion.span>
            <span className="ffx-wiz-lab">{label}</span>
          </button>
        ))}
        <motion.span className="ffx-wiz-bar" animate={{ width: `${(step / (WIZ_STEPS.length - 1)) * 100}%` }} transition={reduce ? { duration: 0 } : SPRING} />
      </div>
      <div className="ffx-wiz-view">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 44 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -44 * dir }}
            transition={reduce ? { duration: 0.12 } : SPRING}>
            {panel(step)}
          </motion.div>
        </AnimatePresence>
      </div>
      {step < 2 && (
        <div className="ffx-wiz-nav">
          <button type="button" className="ffx-ghost" onClick={() => go(Math.max(step - 1, 0))} disabled={step === 0}>{I.arrowL} Back</button>
          <motion.button whileTap={reduce ? undefined : { scale: 0.96 }} type="button" className="ffx-btn" onClick={next}>
            {step === 1 ? "Finish" : "Continue"} {I.arrowR}
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v03 · Settings form — sticky save bar appears when dirty            */
/* ------------------------------------------------------------------ */
export function DirtySaveBar() {
  const reduce = useReducedMotion();
  const committed0 = { name: "Studio Marrow", handle: "marrow", bio: "A tiny ceramics studio shipping twice a month." };
  const [committed, setCommitted] = useState(committed0);
  const [draft, setDraft] = useState(committed0);
  const [saved, setSaved] = useState(false);
  const uid = useId();
  const dirty = draft.name !== committed.name || draft.handle !== committed.handle || draft.bio !== committed.bio;

  return (
    <div className="ffx-card ffx-settings">
      <h3 className="ffx-h3">Studio settings</h3>
      <div className="ffx-form">
        <Field label="Display name" htmlFor={`${uid}-n`}>
          <input id={`${uid}-n`} className="ffx-in" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </Field>
        <Field label="Handle" htmlFor={`${uid}-h`} hint="studio-marq.com/@handle">
          <div className="ffx-affix"><span aria-hidden>@</span>
            <input id={`${uid}-h`} className="ffx-in" value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase() })} />
          </div>
        </Field>
        <Field label="Short bio" htmlFor={`${uid}-b`}>
          <textarea id={`${uid}-b`} className="ffx-in ffx-ta" rows={2} maxLength={120} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
        </Field>
      </div>
      <AnimatePresence>
        {dirty && (
          <motion.div className="ffx-savebar" role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : SPRING}>
            <span className="ffx-savebar-t">Unsaved changes</span>
            <button type="button" className="ffx-ghost" onClick={() => setDraft(committed)}>Discard</button>
            <button type="button" className="ffx-btn ffx-btn-sm" onClick={() => { setCommitted(draft); setSaved(true); window.setTimeout(() => setSaved(false), 1600); }}>Save</button>
          </motion.div>
        )}
        {saved && !dirty && (
          <motion.p className="ffx-saved" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span> Settings saved
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v04 · Accordion checkout — sections collapse into summaries         */
/* ------------------------------------------------------------------ */
type AccSection = { title: string; summary: string; done: boolean };
export function AccordionCheckout() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);
  const [secs, setSecs] = useState<AccSection[]>([
    { title: "Contact", summary: "", done: false },
    { title: "Delivery", summary: "", done: false },
    { title: "Payment", summary: "", done: false },
  ]);
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState("");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState("UPI");
  const uid = useId();

  const complete = (i: number) => {
    const summary = i === 0 ? email : i === 1 ? `${addr}${city ? `, ${city}` : ""}` : method;
    if (!summary.trim()) return;
    setSecs((p) => p.map((s, j) => (j === i ? { ...s, done: true, summary } : s)));
    setOpen(Math.min(i + 1, 2));
  };

  const bodies = [
    <div className="ffx-form" key="b0">
      <Field label="Email for receipts" htmlFor={`${uid}-e`}>
        <input id={`${uid}-e`} type="email" className="ffx-in" value={email} placeholder="you@studio.com" onChange={(e) => setEmail(e.target.value)} />
      </Field>
    </div>,
    <div className="ffx-form" key="b1">
      <Field label="Street address" htmlFor={`${uid}-a`}>
        <input id={`${uid}-a`} className="ffx-in" value={addr} placeholder="12 Wheelhouse Lane" onChange={(e) => setAddr(e.target.value)} />
      </Field>
      <Field label="City" htmlFor={`${uid}-c`}>
        <input id={`${uid}-c`} className="ffx-in" value={city} placeholder="Pune" onChange={(e) => setCity(e.target.value)} />
      </Field>
    </div>,
    <div className="ffx-form" key="b2">
      <div className="ffx-chiprow" role="radiogroup" aria-label="Payment method">
        {["UPI", "Card", "Cash on delivery"].map((m) => (
          <button key={m} type="button" role="radio" aria-checked={method === m} className={`ffx-chip ${method === m ? "is-on" : ""}`} onClick={() => setMethod(m)}>{m}</button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="ffx-acc">
      {secs.map((s, i) => (
        <div key={s.title} className={`ffx-acc-sec ${open === i ? "is-open" : ""} ${s.done ? "is-done" : ""}`}>
          <button type="button" className="ffx-acc-head" aria-expanded={open === i} aria-controls={`${uid}-p${i}`}
            onClick={() => setOpen(i)}>
            <span className={`ffx-acc-idx ${s.done ? "is-done" : ""}`}>{s.done ? <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span> : i + 1}</span>
            <span className="ffx-acc-t">{s.title}</span>
            {s.done && <span className="ffx-acc-sum">{s.summary}</span>}
            <motion.span className="ffx-acc-chev" animate={{ rotate: open === i ? 180 : 0 }} transition={reduce ? { duration: 0 } : SPRING}>{I.chevD}</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div id={`${uid}-p${i}`} className="ffx-acc-panel"
                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
                {bodies[i]}
                <div className="ffx-acc-actions">
                  <button type="button" className="ffx-btn ffx-btn-sm"
                    disabled={i === 0 ? !email.includes("@") : i === 1 ? !addr.trim() : false}
                    onClick={() => complete(i)}>
                    {i === 2 ? "Place order" : "Continue"} {I.arrowR}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      {secs.every((s) => s.done) && (
        <motion.p className="ffx-saved" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span> Order placed - receipt sent to {email}
        </motion.p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v05 · Conversational form — one question at a time                  */
/* ------------------------------------------------------------------ */
const CONV_Q = [
  { key: "name", q: "First things first - what's your name?", ph: "Type your name…" },
  { key: "email", q: "Nice to meet you. Where should we send the invite?", ph: "you@email.com" },
  { key: "use", q: "Last one - what will you build with it?", ph: "A dashboard, a shop, …" },
] as const;
export function ConversationalForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [val, setVal] = useState("");
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const uid = useId();
  const done = step >= CONV_Q.length;

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const a = val.trim();
    if (!a || typing) return;
    if (CONV_Q[step].key === "email" && !/^\S+@\S+\.\S+$/.test(a)) return;
    setAnswers((p) => [...p, { q: CONV_Q[step].q, a }]);
    setVal("");
    setTyping(true);
    window.setTimeout(() => { setTyping(false); setStep((s) => s + 1); }, reduce ? 60 : 620);
  };

  return (
    <div className="ffx-conv" aria-live="polite">
      <div className="ffx-conv-log">
        <div className="ffx-conv-bubble is-q">Let's get you on the beta list. Three quick questions.</div>
        {answers.map((r, i) => (
          <div key={i} className="ffx-conv-pair">
            <div className="ffx-conv-bubble is-q">{r.q}</div>
            <motion.div className="ffx-conv-bubble is-a" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>{r.a}</motion.div>
          </div>
        ))}
        {!done && (
          <motion.div key={`q${step}`} className="ffx-conv-bubble is-q" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : SPRING}>
            {CONV_Q[step].q}
          </motion.div>
        )}
        {typing && <div className="ffx-conv-bubble is-q ffx-typing" aria-label="Typing"><span /><span /><span /></div>}
        {done && (
          <motion.div className="ffx-conv-bubble is-q is-final" initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>
            <span className="ffx-done-ring ffx-done-sm">{I.check}</span> You're on the list, {answers[0]?.a.split(" ")[0]}. Invite goes out this week.
          </motion.div>
        )}
      </div>
      {!done && (
        <form className="ffx-conv-bar" onSubmit={send}>
          <span className="ffx-conv-count" aria-hidden>{step + 1}<i>/</i>{CONV_Q.length}</span>
          <label className="ffx-sr" htmlFor={`${uid}-a`}>{CONV_Q[step].q}</label>
          <input id={`${uid}-a`} className="ffx-in" value={val} placeholder={CONV_Q[step].ph} onChange={(e) => setVal(e.target.value)} disabled={typing} autoComplete="off" />
          <motion.button whileTap={reduce ? undefined : { scale: 0.92 }} className="ffx-send" type="submit" aria-label="Send answer" disabled={!val.trim() || typing}>{I.arrowR}</motion.button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v06 · Live validation register — per-field status icons             */
/* ------------------------------------------------------------------ */
type FState = "idle" | "checking" | "ok" | "bad";
export function LiveValidateForm() {
  const reduce = useReducedMotion();
  const [user, setUser] = useState("");
  const [userSt, setUserSt] = useState<FState>("idle");
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [joined, setJoined] = useState(false);
  const uid = useId();
  const timer = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!user) { setUserSt("idle"); setUserMsg(""); return; }
    if (!/^[a-z0-9_]{3,}$/i.test(user)) { setUserSt("bad"); setUserMsg("3+ letters, numbers or _"); return; }
    setUserSt("checking"); setUserMsg("");
    timer.current = window.setTimeout(() => {
      const taken = ["admin", "goat", "root", "test", "demo"].includes(user.toLowerCase());
      setUserSt(taken ? "bad" : "ok");
      setUserMsg(taken ? "That one is taken" : "");
    }, 650);
    return () => window.clearTimeout(timer.current);
  }, [user]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const passOk = pass.length >= 8;
  const matchOk = pass2.length > 0 && pass === pass2;
  const allOk = userSt === "ok" && emailOk && passOk && matchOk;

  const icon = (st: FState | boolean) => {
    const s: FState = typeof st === "boolean" ? (st ? "ok" : "idle") : st;
    if (s === "checking") return <span className="ffx-spin" aria-label="Checking" />;
    if (s === "ok") return <motion.span key="ok" className="ffx-ic is-ok" initial={reduce ? false : { scale: 0.3 }} animate={{ scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>{I.check}</motion.span>;
    if (s === "bad") return <motion.span key="bad" className="ffx-ic is-bad" initial={reduce ? false : { scale: 0.3 }} animate={{ scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>{I.x}</motion.span>;
    return null;
  };

  const statusIcon = (st: FState, has: boolean) => (has ? icon(st) : null);

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (allOk) setJoined(true); }} noValidate>
      <h3 className="ffx-h3">Create your handle</h3>
      <Field label="Username" htmlFor={`${uid}-u`} error={userSt === "bad" ? userMsg : undefined} hint={userSt === "ok" ? "Available" : " "}>
        <div className="ffx-icfield">
          <input id={`${uid}-u`} className="ffx-in" value={user} autoComplete="username" placeholder="marrow_makes"
            aria-invalid={userSt === "bad"} onChange={(e) => setUser(e.target.value)} />
          {statusIcon(userSt, userSt !== "idle")}
        </div>
      </Field>
      <Field label="Email" htmlFor={`${uid}-e`} error={email && !emailOk ? "Enter a valid email" : undefined}>
        <div className="ffx-icfield">
          <input id={`${uid}-e`} type="email" className="ffx-in" value={email} placeholder="you@studio.com" autoComplete="email"
            aria-invalid={!!email && !emailOk} onChange={(e) => setEmail(e.target.value)} />
          {email ? icon(emailOk) : null}
        </div>
      </Field>
      <Field label="Password" htmlFor={`${uid}-p`} error={pass && !passOk ? "At least 8 characters" : undefined}>
        <div className="ffx-icfield">
          <input id={`${uid}-p`} type="password" className="ffx-in" value={pass} autoComplete="new-password"
            aria-invalid={!!pass && !passOk} onChange={(e) => setPass(e.target.value)} />
          {pass ? icon(passOk) : null}
        </div>
      </Field>
      <Field label="Repeat password" htmlFor={`${uid}-p2`} error={pass2 && !matchOk ? "Does not match" : undefined}>
        <div className="ffx-icfield">
          <input id={`${uid}-p2`} type="password" className="ffx-in" value={pass2} autoComplete="new-password"
            aria-invalid={!!pass2 && !matchOk} onChange={(e) => setPass2(e.target.value)} />
          {pass2 ? icon(matchOk) : null}
        </div>
      </Field>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!allOk}>
        {joined ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Welcome in</span> : "Create account"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v07 · Smart address — PIN autofills city/state with a tag           */
/* ------------------------------------------------------------------ */
const PIN_DB: Record<string, { city: string; state: string }> = {
  "411004": { city: "Pune", state: "Maharashtra" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
};
export function SmartAddressForm() {
  const reduce = useReducedMotion();
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [filled, setFilled] = useState(false);
  const [looking, setLooking] = useState(false);
  const uid = useId();
  const timer = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!/^\d{6}$/.test(pin)) { setLooking(false); return; }
    setLooking(true);
    timer.current = window.setTimeout(() => {
      const hit = PIN_DB[pin];
      setLooking(false);
      if (hit) { setCity(hit.city); setState(hit.state); setFilled(true); window.setTimeout(() => setFilled(false), 2600); }
    }, reduce ? 60 : 550);
    return () => window.clearTimeout(timer.current);
  }, [pin, reduce]);

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => e.preventDefault()}>
      <h3 className="ffx-h3">Delivery address</h3>
      <Field label="Full name" htmlFor={`${uid}-n`}>
        <input id={`${uid}-n`} className="ffx-in" placeholder="Meera Iyer" autoComplete="name" />
      </Field>
      <Field label="Street" htmlFor={`${uid}-s`}>
        <input id={`${uid}-s`} className="ffx-in" placeholder="14, Rose Society, Lane 5" autoComplete="street-address" />
      </Field>
      <div className="ffx-row">
        <Field label="PIN code" htmlFor={`${uid}-p`} hint={looking ? "Looking up…" : "Try 411004, 560001, 110001 or 400001"}>
          <div className="ffx-icfield">
            <input id={`${uid}-p`} className="ffx-in ffx-num" inputMode="numeric" maxLength={6} value={pin}
              placeholder="6 digits" onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); }} />
            {looking && <span className="ffx-spin" />}
          </div>
        </Field>
        <Field label="City" htmlFor={`${uid}-c`}>
          <div className="ffx-autofill" data-flash={filled}>
            <input id={`${uid}-c`} className="ffx-in" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            <AnimatePresence>{filled && <motion.span className="ffx-autotag" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={reduce ? { duration: 0 } : SPRING}>Autofilled</motion.span>}</AnimatePresence>
          </div>
        </Field>
      </div>
      <Field label="State" htmlFor={`${uid}-st`}>
        <div className="ffx-autofill" data-flash={filled}>
          <input id={`${uid}-st`} className="ffx-in" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
        </div>
      </Field>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v08 · Appointment booking — day strip + slot grid                   */
/* ------------------------------------------------------------------ */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["09:00", "09:40", "10:20", "11:00", "13:30", "14:10", "15:30", "16:20"];
export function AppointmentBooking() {
  const reduce = useReducedMotion();
  const [day, setDay] = useState(2);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [booked, setBooked] = useState(false);
  const uid = useId();
  const base = 17; // Nov 2026 week starting Tue 17
  const taken = useMemo(() => new Set([`${(day + 1) % 7}-09:40`, `${day % 7}-14:10`, `${(day + 3) % 7}-11:00`]), [day]);
  const dateLabel = (d: number) => `Nov ${base + d}`;

  return (
    <form className="ffx-card" onSubmit={(e) => { e.preventDefault(); if (slot && name.trim()) setBooked(true); }}>
      <h3 className="ffx-h3">Book a fitting</h3>
      <div className="ffx-days" role="radiogroup" aria-label="Choose a day">
        {DAYS.map((d, i) => (
          <button key={d} type="button" role="radio" aria-checked={day === i}
            className={`ffx-day ${day === i ? "is-on" : ""}`}
            onClick={() => { setDay(i); setSlot(null); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dd = e.key === "ArrowRight" ? 1 : -1;
                setDay((p) => { const n = (p + dd + 7) % 7; return n; }); setSlot(null);
              }
            }}>
            <span className="ffx-day-d">{d}</span>
            <span className="ffx-day-n ffx-num">{base + i}</span>
            {day === i && <motion.span layoutId="ffx-day-ring" className="ffx-day-ring" transition={reduce ? { duration: 0 } : SPRING} />}
          </button>
        ))}
      </div>
      <fieldset className="ffx-fieldset">
        <legend className="ffx-label">Time on {dateLabel(day)}</legend>
        <div className="ffx-slots">
          {SLOTS.map((s) => {
            const isTaken = taken.has(`${day}-${s}`);
            return (
              <motion.button key={s} type="button" whileTap={reduce ? undefined : { scale: 0.94 }}
                className={`ffx-slot ffx-num ${slot === s ? "is-on" : ""}`} disabled={isTaken}
                aria-pressed={slot === s} onClick={() => setSlot(s)}>{s}</motion.button>
            );
          })}
        </div>
      </fieldset>
      <Field label="Name" htmlFor={`${uid}-n`}>
        <input id={`${uid}-n`} className="ffx-in" value={name} placeholder="Your name" onChange={(e) => setName(e.target.value)} />
      </Field>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!slot || !name.trim()}>
        {booked ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Booked</span> : slot ? `Book ${dateLabel(day)}, ${slot}` : "Pick a time"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v09 · Profile form — avatar initials preview + banner swatches      */
/* ------------------------------------------------------------------ */
const BANNERS = ["#5b6cff", "#0ea5a5", "#e0637c", "#8a5cf6", "#d97706"];
export function ProfileCardForm() {
  const reduce = useReducedMotion();
  const [first, setFirst] = useState("Meera");
  const [last, setLast] = useState("Iyer");
  const [title, setTitle] = useState("Ceramicist");
  const [banner, setBanner] = useState(BANNERS[1]);
  const [saved, setSaved] = useState(false);
  const uid = useId();
  const initials = `${(first[0] || "?").toUpperCase()}${(last[0] || "").toUpperCase()}`;

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 1600); }}>
      <div className="ffx-prof">
        <motion.div key={banner} className="ffx-prof-banner" style={{ background: `linear-gradient(120deg, ${banner}, ${banner}cc 60%, #1c1c22)` }}
          initial={reduce ? false : { opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
        <motion.div key={initials} className="ffx-prof-av" initial={reduce ? false : { scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={reduce ? { duration: 0 } : SPRING}>
          {initials}
        </motion.div>
        <div className="ffx-prof-meta">
          <b>{(first || "Your") + " " + (last || "Name")}</b>
          <span>{title || "Title"}</span>
        </div>
      </div>
      <div className="ffx-row">
        <Field label="First name" htmlFor={`${uid}-f`}>
          <input id={`${uid}-f`} className="ffx-in" value={first} onChange={(e) => setFirst(e.target.value)} />
        </Field>
        <Field label="Last name" htmlFor={`${uid}-l`}>
          <input id={`${uid}-l`} className="ffx-in" value={last} onChange={(e) => setLast(e.target.value)} />
        </Field>
      </div>
      <Field label="Title" htmlFor={`${uid}-t`}>
        <input id={`${uid}-t`} className="ffx-in" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <fieldset className="ffx-fieldset">
        <legend className="ffx-label">Banner colour</legend>
        <div className="ffx-swatchrow" role="radiogroup" aria-label="Banner colour">
          {BANNERS.map((c) => (
            <motion.button key={c} type="button" whileTap={reduce ? undefined : { scale: 0.85 }}
              className={`ffx-swatch ${banner === c ? "is-on" : ""}`} style={{ background: c }}
              role="radio" aria-checked={banner === c} aria-label={`Colour ${c}`}
              onClick={() => setBanner(c)}>
              {banner === c && <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span>}
            </motion.button>
          ))}
        </div>
      </fieldset>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit">
        {saved ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Profile saved</span> : "Save profile"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v10 · Feedback morph — rating reveals a matching follow-up          */
/* ------------------------------------------------------------------ */
const FACES = ["Terrible", "Bad", "Okay", "Good", "Great"];
export function FeedbackMorphForm() {
  const reduce = useReducedMotion();
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const uid = useId();

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (score) setSent(true); }}>
      <h3 className="ffx-h3">How was your order?</h3>
      <div className="ffx-faces" role="radiogroup" aria-label="Rating">
        {FACES.map((f, i) => {
          const v = i + 1;
          return (
            <motion.button key={f} type="button" role="radio" aria-checked={score === v} aria-label={f}
              className={`ffx-face s${v} ${score === v ? "is-on" : ""}`}
              animate={reduce ? undefined : { scale: score === v ? 1.18 : 1, y: score === v ? -3 : 0 }}
              transition={SPRING}
              onClick={() => setScore(v)}>
              <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
                <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="11" cy="13" r="1.8" fill="currentColor" />
                <circle cx="21" cy="13" r="1.8" fill="currentColor" />
                <path d={v <= 2 ? "M10 22c2-2.5 10-2.5 12 0" : v === 3 ? "M10 21h12" : "M10 19.5c2 3 10 3 12 0"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="ffx-face-l">{f}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence initial={false}>
        {score > 0 && !sent && (
          <motion.div key={score <= 3 ? "neg" : "pos"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
            <Field label={score <= 3 ? "What went wrong?" : "What did you love?"} htmlFor={`${uid}-t`}>
              <textarea id={`${uid}-t`} className="ffx-in ffx-ta" rows={3} value={text}
                placeholder={score <= 3 ? "Tell us so we can fix it…" : "Tell us so we keep doing it…"}
                onChange={(e) => setText(e.target.value)} />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!score || sent}>
        {sent ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Thanks for the feedback</span> : "Send feedback"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v11 · Expanding newsletter — focus unfolds extra fields             */
/* ------------------------------------------------------------------ */
const TOPICS = ["Releases", "Tutorials", "Offers"];
export function NewsletterExpandForm() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [topics, setTopics] = useState<string[]>(["Releases"]);
  const [inList, setInList] = useState(false);
  const uid = useId();

  if (inList) return (
    <motion.div className="ffx-news-done" role="status"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>
      <span className="ffx-done-ring ffx-done-sm">{I.check}</span>
      You're in{name ? `, ${name.split(" ")[0]}` : ""}. First letter lands Friday.
      <button type="button" className="ffx-link" onClick={() => { setInList(false); setEmail(""); setName(""); }}>Undo</button>
    </motion.div>
  );

  return (
    <motion.form layout className="ffx-news" onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) setInList(true); }} transition={reduce ? { duration: 0 } : SPRING}>
      <div className="ffx-news-bar">
        <span className="ffx-news-ico" aria-hidden>{I.mail}</span>
        <label className="ffx-sr" htmlFor={`${uid}-e`}>Email for the newsletter</label>
        <input id={`${uid}-e`} className="ffx-news-in" type="email" value={email} placeholder="Get the Friday letter"
          onFocus={() => setOpen(true)} onChange={(e) => setEmail(e.target.value)} />
        {!open && <span className="ffx-news-hint">Weekly, no spam</span>}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="ffx-news-more"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
            <Field label="First name (optional)" htmlFor={`${uid}-n`}>
              <input id={`${uid}-n`} className="ffx-in" value={name} onChange={(e) => setName(e.target.value)} placeholder="Meera" />
            </Field>
            <fieldset className="ffx-fieldset">
              <legend className="ffx-label">Topics</legend>
              <div className="ffx-chiprow">
                {TOPICS.map((t) => {
                  const on = topics.includes(t);
                  return (
                    <button key={t} type="button" className={`ffx-chip ${on ? "is-on" : ""}`} aria-pressed={on}
                      onClick={() => setTopics((p) => (on ? p.filter((x) => x !== t) : [...p, t]))}>{t}</button>
                  );
                })}
              </div>
            </fieldset>
            <div className="ffx-news-actions">
              <button type="button" className="ffx-ghost" onClick={() => setOpen(false)}>Maybe later</button>
              <motion.button whileTap={reduce ? undefined : { scale: 0.96 }} className="ffx-btn ffx-btn-sm" type="submit" disabled={!/^\S+@\S+\.\S+$/.test(email)}>
                Subscribe {topics.length > 0 && <span className="ffx-btn-meta ffx-num">{topics.length} topic{topics.length > 1 ? "s" : ""}</span>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

/* ------------------------------------------------------------------ */
/* v12 · RSVP — segmented answer reveals matching fields               */
/* ------------------------------------------------------------------ */
export function RsvpConditionalForm() {
  const reduce = useReducedMotion();
  const [going, setGoing] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(0);
  const [diet, setDiet] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const uid = useId();

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (going) setSent(true); }}>
      <h3 className="ffx-h3">Studio open house - Sat Dec 6</h3>
      <div className="ffx-seg2" role="radiogroup" aria-label="Are you coming?">
        {(["yes", "no"] as const).map((v) => (
          <button key={v} type="button" role="radio" aria-checked={going === v}
            className={`ffx-seg2-b ${going === v ? "is-on" : ""}`}
            onClick={() => setGoing(v)}>
            {going === v && <motion.span layoutId="ffx-rsvp-thumb" className="ffx-seg2-thumb" data-kind={v} transition={reduce ? { duration: 0 } : SPRING} />}
            <span className="ffx-seg2-t">{v === "yes" ? "Count me in" : "Can't make it"}</span>
          </button>
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {going === "yes" && (
          <motion.div key="yes" className="ffx-form"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0 } : SPRING}>
            <div className="ffx-stepper-row">
              <span className="ffx-label" id={`${uid}-g`}>Bringing guests?</span>
              <div className="ffx-stepper" role="group" aria-labelledby={`${uid}-g`}>
                <motion.button whileTap={reduce ? undefined : { scale: 0.88 }} type="button" aria-label="One fewer guest" onClick={() => setGuests((g) => Math.max(0, g - 1))}>{I.minus}</motion.button>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={guests} className="ffx-stepper-v ffx-num"
                    initial={reduce ? { opacity: 0 } : { y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: -8, opacity: 0 }} transition={reduce ? { duration: 0 } : SPRING}>{guests}</motion.span>
                </AnimatePresence>
                <motion.button whileTap={reduce ? undefined : { scale: 0.88 }} type="button" aria-label="One more guest" onClick={() => setGuests((g) => Math.min(4, g + 1))}>{I.plus}</motion.button>
              </div>
            </div>
            <fieldset className="ffx-fieldset">
              <legend className="ffx-label">Dietary needs</legend>
              <div className="ffx-chiprow">
                {["Vegetarian", "Vegan", "Nut-free"].map((d) => {
                  const on = diet.includes(d);
                  return (
                    <motion.button layout key={d} type="button" className={`ffx-chip ${on ? "is-on" : ""}`} aria-pressed={on}
                      transition={reduce ? { duration: 0 } : SPRING}
                      onClick={() => setDiet((p) => (on ? p.filter((x) => x !== d) : [...p, d]))}>{d}</motion.button>
                  );
                })}
              </div>
            </fieldset>
          </motion.div>
        )}
        {going === "no" && (
          <motion.div key="no"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0 } : SPRING}>
            <Field label="Leave a note for the hosts (optional)" htmlFor={`${uid}-note`}>
              <textarea id={`${uid}-note`} className="ffx-in ffx-ta" rows={2} value={note} placeholder="Sorry to miss it…" onChange={(e) => setNote(e.target.value)} />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!going || sent}>
        {sent ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} RSVP sent</span> : "Send RSVP"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v13 · Checkout with coupon — total counts down                      */
/* ------------------------------------------------------------------ */
export function CouponCheckoutForm() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const [bad, setBad] = useState(false);
  const uid = useId();
  const subtotal = 3499;
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const total = useSpring(subtotal - discount, 140, 20);

  const apply = () => {
    if (coupon.trim().toUpperCase() === "GOAT10") { setApplied(true); setBad(false); }
    else { setBad(true); window.setTimeout(() => setBad(false), 1400); }
  };

  return (
    <div className="ffx-coupon">
      <form className="ffx-form" onSubmit={(e) => e.preventDefault()}>
        <h3 className="ffx-h3">Your details</h3>
        <Field label="Email" htmlFor={`${uid}-e`}>
          <input id={`${uid}-e`} type="email" className="ffx-in" value={email} placeholder="you@studio.com" onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Coupon" htmlFor={`${uid}-c`} error={bad ? "Code not recognised - try GOAT10" : undefined} hint={applied ? undefined : "Hint: GOAT10 takes 10% off"}>
          <div className="ffx-coupon-row">
            <input id={`${uid}-c`} className="ffx-in" value={coupon} placeholder="GOAT10" disabled={applied}
              onChange={(e) => setCoupon(e.target.value)} />
            {applied
              ? <span className="ffx-coupon-ok ffx-pop">{I.check} Applied</span>
              : <button type="button" className="ffx-ghost" onClick={apply} disabled={!coupon.trim()}>Apply</button>}
          </div>
        </Field>
      </form>
      <div className="ffx-sum" aria-live="polite">
        <div className="ffx-sum-row"><span>Subtotal</span><span className="ffx-num">₹{fmtMoney(subtotal)}</span></div>
        <AnimatePresence>
          {applied && (
            <motion.div className="ffx-sum-row is-disc" key="disc"
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }} animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }} exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
              <span>Coupon GOAT10</span><span className="ffx-num">−₹{fmtMoney(discount)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="ffx-sum-row is-total"><span>Total</span><span className="ffx-num ffx-total-v">₹{fmtMoney(total)}</span></div>
        <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="button" disabled={!email.includes("@")}>
          Pay ₹{fmtMoney(Math.round(total))}
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v14 · Application with progress rail                                */
/* ------------------------------------------------------------------ */
export function ApplicationRailForm() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [years, setYears] = useState("3-5");
  const [stack, setStack] = useState("");
  const [link, setLink] = useState("");
  const uid = useId();
  const secDone = [
    name.trim().length > 1 && /\S+@\S+\.\S+/.test(email),
    stack.trim().length > 3,
    /^https?:\/\/.+\..+/.test(link),
  ];
  const doneCount = secDone.filter(Boolean).length;
  const barW = useSpring((doneCount / 3) * 100, 160, 22);

  return (
    <div className="ffx-app">
      <div className="ffx-app-rail" aria-hidden>
        <span className="ffx-app-count ffx-num">{doneCount}/3</span>
        <div className="ffx-app-track"><motion.span style={{ height: `${barW}%` }} className="ffx-app-fill" /></div>
        {["Contact", "Experience", "Links"].map((s, i) => (
          <span key={s} className={`ffx-app-dot ${secDone[i] ? "is-done" : ""}`}>{secDone[i] ? I.check : null}</span>
        ))}
      </div>
      <form className="ffx-form ffx-app-form" onSubmit={(e) => e.preventDefault()}>
        <h3 className="ffx-h3">Apply: Studio potter</h3>
        <div className="ffx-row">
          <Field label="Name" htmlFor={`${uid}-n`}>
            <input id={`${uid}-n`} className="ffx-in" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rao Kumar" />
          </Field>
          <Field label="Email" htmlFor={`${uid}-e`}>
            <input id={`${uid}-e`} type="email" className="ffx-in" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rao@clay.in" />
          </Field>
        </div>
        <Field label="Experience" htmlFor={`${uid}-y`}>
          <div className="ffx-chiprow" role="radiogroup" aria-label="Years of experience">
            {["0-2", "3-5", "6-10", "10+"].map((y) => (
              <button key={y} type="button" role="radio" aria-checked={years === y} className={`ffx-chip ${years === y ? "is-on" : ""}`} onClick={() => setYears(y)}>{y} yrs</button>
            ))}
          </div>
        </Field>
        <Field label="What have you made?" htmlFor={`${uid}-s`}>
          <textarea id={`${uid}-s`} className="ffx-in ffx-ta" rows={2} value={stack} placeholder="Tableware lines, commissions…" onChange={(e) => setStack(e.target.value)} />
        </Field>
        <Field label="Portfolio link" htmlFor={`${uid}-l`} hint="https://…">
          <input id={`${uid}-l`} className="ffx-in" value={link} placeholder="https://rao.clay" onChange={(e) => setLink(e.target.value)} />
        </Field>
        <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" disabled={doneCount < 3}>
          {doneCount < 3 ? `${3 - doneCount} section${doneCount === 2 ? "" : "s"} to go` : "Submit application"}
        </motion.button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v15 · Filter panel — collapsible groups, chips row                  */
/* ------------------------------------------------------------------ */
const FILTER_GROUPS: { name: string; opts: string[] }[] = [
  { name: "Role", opts: ["Thrower", "Glazer", "Kiln tech"] },
  { name: "Level", opts: ["Junior", "Mid", "Senior"] },
  { name: "Work", opts: ["On-site", "Hybrid", "Remote"] },
];
export function FilterPanelForm() {
  const reduce = useReducedMotion();
  const [openGroups, setOpenGroups] = useState<string[]>(["Role"]);
  const [sel, setSel] = useState<string[]>(["Mid"]);
  const uid = useId();
  const count = 18 + sel.length * 7;

  return (
    <div className="ffx-card ffx-filter">
      <div className="ffx-filter-head">
        <h3 className="ffx-h3">Filter roles</h3>
        <span className="ffx-filter-count ffx-num" role="status">{count} matches</span>
      </div>
      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div className="ffx-activechips"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }} animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }} exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
            <motion.div layout className="ffx-chiprow">
              <AnimatePresence mode="popLayout">
                {sel.map((s) => (
                  <motion.button layout key={s} type="button" className="ffx-chip is-on"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                    transition={reduce ? { duration: 0 } : SPRING}
                    onClick={() => setSel((p) => p.filter((x) => x !== s))}
                    aria-label={`Remove filter ${s}`}>
                    {s} {I.x}
                  </motion.button>
                ))}
              </AnimatePresence>
              <button type="button" className="ffx-link" onClick={() => setSel([])}>Clear all</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {FILTER_GROUPS.map((g) => {
        const open = openGroups.includes(g.name);
        return (
          <div key={g.name} className="ffx-fgroup">
            <button type="button" className="ffx-fgroup-head" aria-expanded={open} aria-controls={`${uid}-${g.name}`}
              onClick={() => setOpenGroups((p) => (open ? p.filter((x) => x !== g.name) : [...p, g.name]))}>
              {g.name}
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={reduce ? { duration: 0 } : SPRING} style={{ display: "inline-flex" }}>{I.chevD}</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div id={`${uid}-${g.name}`} className="ffx-fgroup-body"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
                  {g.opts.map((o) => {
                    const on = sel.includes(o);
                    return (
                      <label key={o} className={`ffx-check ${on ? "is-on" : ""}`}>
                        <input type="checkbox" checked={on} onChange={() => setSel((p) => (on ? p.filter((x) => x !== o) : [...p, o]))} />
                        <span className="ffx-check-box">{on && <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span>}</span>
                        {o}
                      </label>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v16 · Contact — subject pills swap the secondary fields             */
/* ------------------------------------------------------------------ */
const SUBJECTS = ["Support", "Sales", "Press"] as const;
export function ContactSubjectForm() {
  const reduce = useReducedMotion();
  const [subj, setSubj] = useState<(typeof SUBJECTS)[number]>("Support");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const uid = useId();
  const max = 280;

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (msg.trim()) setSent(true); }}>
      <h3 className="ffx-h3">Talk to us</h3>
      <div className="ffx-chiprow" role="radiogroup" aria-label="Subject">
        {SUBJECTS.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={subj === s} className={`ffx-chip ${subj === s ? "is-on" : ""}`} onClick={() => setSubj(s)}>
            {subj === s && <motion.span layoutId="ffx-subj-dot" className="ffx-chip-dot" transition={reduce ? { duration: 0 } : SPRING} />}
            {s}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={subj} className="ffx-form"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={reduce ? { duration: 0.1 } : SPRING}>
          {subj === "Support" && (
            <Field label="Order number" htmlFor={`${uid}-o`} hint="On your receipt, starts with MW-">
              <input id={`${uid}-o`} className="ffx-in" placeholder="MW-1042" />
            </Field>
          )}
          {subj === "Sales" && (
            <div className="ffx-row">
              <Field label="Team size" htmlFor={`${uid}-ts`}>
                <div className="ffx-sel-wrap">
                  <select id={`${uid}-ts`} className="ffx-in ffx-sel" defaultValue="2-10">
                    {["Just me", "2-10", "11-50", "50+"].map((o) => <option key={o}>{o}</option>)}
                  </select>{I.chevD}
                </div>
              </Field>
              <Field label="Budget" htmlFor={`${uid}-b`}>
                <div className="ffx-sel-wrap">
                  <select id={`${uid}-b`} className="ffx-in ffx-sel" defaultValue="< ₹50k">
                    {["< ₹50k", "₹50k-2L", "₹2L+"].map((o) => <option key={o}>{o}</option>)}
                  </select>{I.chevD}
                </div>
              </Field>
            </div>
          )}
          {subj === "Press" && (
            <Field label="Publication" htmlFor={`${uid}-pub`}>
              <input id={`${uid}-pub`} className="ffx-in" placeholder="Design Weekly" />
            </Field>
          )}
          <div className="ffx-field">
            <label className="ffx-label" htmlFor={`${uid}-m`}>Message</label>
            <div className="ffx-ta-wrap">
              <textarea id={`${uid}-m`} className="ffx-in ffx-ta" rows={3} maxLength={max} value={msg}
                placeholder={subj === "Support" ? "What happened?" : subj === "Sales" ? "What are you planning?" : "What's the story?"}
                onChange={(e) => setMsg(e.target.value)} />
              <span className="ffx-ta-count ffx-num" aria-hidden>{max - msg.length}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!msg.trim() || sent}>
        {sent ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Sent - we reply within a day</span> : `Send to ${subj.toLowerCase()}`}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v17 · Donation — presets, impact line counts                        */
/* ------------------------------------------------------------------ */
const IMPACT: Record<number, string> = { 100: "20 kiln-fired bricks for the community kiln", 250: "a full day of open studio access", 500: "a beginner wheel class for one student", 1000: "a month of clay for the workshop" };
export function DonationForm() {
  const reduce = useReducedMotion();
  const [amount, setAmount] = useState(250);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(true);
  const [given, setGiven] = useState(false);
  const shown = useSpring(amount, 150, 22);

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); setGiven(true); }}>
      <h3 className="ffx-h3">Keep the kiln lit</h3>
      <div className="ffx-seg2 ffx-seg2-slim" role="radiogroup" aria-label="Frequency">
        {([true, false] as const).map((m) => (
          <button key={String(m)} type="button" role="radio" aria-checked={monthly === m}
            className={`ffx-seg2-b ${monthly === m ? "is-on" : ""}`} onClick={() => setMonthly(m)}>
            {monthly === m && <motion.span layoutId="ffx-don-thumb" className="ffx-seg2-thumb" transition={reduce ? { duration: 0 } : SPRING} />}
            <span className="ffx-seg2-t">{m ? "Monthly" : "Once"}</span>
          </button>
        ))}
      </div>
      <div className="ffx-amounts" role="radiogroup" aria-label="Amount">
        {[100, 250, 500, 1000].map((a) => (
          <motion.button key={a} type="button" role="radio" aria-checked={amount === a && !custom}
            className={`ffx-amt ffx-num ${amount === a && !custom ? "is-on" : ""}`}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            onClick={() => { setAmount(a); setCustom(""); }}>₹{a}</motion.button>
        ))}
        <input className="ffx-amt ffx-amt-custom ffx-num" placeholder="Custom" inputMode="numeric" aria-label="Custom amount"
          value={custom}
          onFocus={() => setCustom((c) => c || "")}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCustom(v);
            if (v) setAmount(Number(v));
          }} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={IMPACT[amount] ? amount : "custom"} className="ffx-impact" aria-live="polite"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={reduce ? { duration: 0 } : SPRING}>
          <b className="ffx-num">₹{fmtInt(shown)}</b>{monthly ? "/mo" : ""} {IMPACT[amount] ? `covers ${IMPACT[amount]}` : "goes straight to the studio fund"}
        </motion.p>
      </AnimatePresence>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={given}>
        {given ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Thank you</span> : `Give ₹${fmtInt(Math.round(shown))}${monthly ? " monthly" : ""}`}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v18 · Quiz cards — answer advances, score ring at the end           */
/* ------------------------------------------------------------------ */
const QUIZ = [
  { q: "Which firing gives the glassy surface?", opts: ["Bisque", "Glaze", "Raku smoke"], a: 1 },
  { q: "What does 'wedging' do?", opts: ["Adds colour", "Removes air bubbles", "Dries clay"], a: 1 },
  { q: "A 'throwing' wheel is used to…", opts: ["Shape clay", "Glaze pots", "Fire pots"], a: 0 },
];
export function QuizCardForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const done = step >= QUIZ.length;
  const scoreDeg = useSpring(done ? (score / QUIZ.length) * 360 : 0, 120, 20);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === QUIZ[step].a) setScore((s) => s + 1);
    window.setTimeout(() => { setPicked(null); setStep((s) => s + 1); }, reduce ? 120 : 750);
  };

  return (
    <div className="ffx-quiz" aria-live="polite">
      <div className="ffx-quiz-track">
        <motion.span className="ffx-quiz-bar" animate={{ width: `${(Math.min(step, QUIZ.length) / QUIZ.length) * 100}%` }} transition={reduce ? { duration: 0 } : SPRING} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div key={step} className="ffx-quiz-card"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 60, rotate: 1.5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -60, rotate: -1.5 }}
            transition={reduce ? { duration: 0 } : SPRING}>
            <span className="ffx-quiz-n ffx-num">{step + 1} / {QUIZ.length}</span>
            <h3 className="ffx-h3">{QUIZ[step].q}</h3>
            <div className="ffx-quiz-opts" role="radiogroup" aria-label="Answers">
              {QUIZ[step].opts.map((o, i) => {
                const state = picked === null ? "" : i === QUIZ[step].a ? "is-right" : i === picked ? "is-wrong" : "is-dim";
                return (
                  <motion.button key={o} type="button" className={`ffx-quiz-opt ${state}`} onClick={() => pick(i)}
                    whileTap={reduce ? undefined : { scale: 0.98 }}>
                    <span>{o}</span>
                    {state === "is-right" && <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span>}
                    {state === "is-wrong" && <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.x}</span>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" className="ffx-quiz-card ffx-quiz-result"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>
            <svg viewBox="0 0 80 80" width="88" height="88" aria-hidden>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e7e7ea" strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#17171c" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${(scoreDeg / 360) * 213.6} 213.6`} transform="rotate(-90 40 40)" />
              <text x="40" y="45" textAnchor="middle" fontSize="17" fontWeight="700" fill="#17171c" className="ffx-num">{score}/{QUIZ.length}</text>
            </svg>
            <h3 className="ffx-h3">{score === QUIZ.length ? "Kiln master." : score >= 2 ? "Solid thrower." : "Back to the wheel."}</h3>
            <button type="button" className="ffx-ghost" onClick={() => { setStep(0); setScore(0); setPicked(null); }}>Retake quiz</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v19 · Event composer — live preview card updates as you type        */
/* ------------------------------------------------------------------ */
const DURATIONS = [30, 60, 90, 120];
export function EventComposerForm() {
  const reduce = useReducedMotion();
  const [title, setTitle] = useState("Glaze night");
  const [date, setDate] = useState("2026-12-06");
  const [time, setTime] = useState("18:00");
  const [dur, setDur] = useState(90);
  const [loc, setLoc] = useState("Studio Marrow, Koregaon Park");
  const [created, setCreated] = useState(false);
  const uid = useId();
  const endMin = (() => { const [h, m] = time.split(":").map(Number); return h * 60 + m + dur; })();
  const endLabel = `${String(Math.floor(endMin / 60) % 24).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); setCreated(true); window.setTimeout(() => setCreated(false), 1800); }}>
      <motion.div layout className="ffx-ev-preview" transition={reduce ? { duration: 0 } : SPRING} aria-live="polite">
        <motion.span layout className="ffx-ev-date" transition={reduce ? { duration: 0 } : SPRING}>
          <b className="ffx-num">{date.split("-")[2]}</b>
          <small>{dateLabel.split(",")[0] || dateLabel.split(" ")[0]}</small>
        </motion.span>
        <div className="ffx-ev-meta">
          <AnimatePresence mode="wait" initial={false}>
            <motion.b key={title} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }} transition={reduce ? { duration: 0 } : { duration: 0.22 }}>{title || "Untitled event"}</motion.b>
          </AnimatePresence>
          <span className="ffx-num">{time}-{endLabel} · {loc || "Location TBD"}</span>
        </div>
      </motion.div>
      <Field label="Event title" htmlFor={`${uid}-t`}>
        <input id={`${uid}-t`} className="ffx-in" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name the event" />
      </Field>
      <div className="ffx-row">
        <Field label="Date" htmlFor={`${uid}-d`}>
          <input id={`${uid}-d`} type="date" className="ffx-in ffx-num" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Starts" htmlFor={`${uid}-s`}>
          <input id={`${uid}-s`} type="time" className="ffx-in ffx-num" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>
      <fieldset className="ffx-fieldset">
        <legend className="ffx-label">Duration</legend>
        <div className="ffx-chiprow" role="radiogroup" aria-label="Duration">
          {DURATIONS.map((d) => (
            <button key={d} type="button" role="radio" aria-checked={dur === d} className={`ffx-chip ffx-num ${dur === d ? "is-on" : ""}`} onClick={() => setDur(d)}>
              {dur === d && <motion.span layoutId="ffx-ev-dur" className="ffx-chip-dot" transition={reduce ? { duration: 0 } : SPRING} />}
              {d >= 60 ? `${d / 60}h${d % 60 ? ` ${d % 60}m` : ""}` : `${d}m`}
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Location" htmlFor={`${uid}-l`}>
        <input id={`${uid}-l`} className="ffx-in" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Where is it?" />
      </Field>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!title.trim()}>
        {created ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Event created</span> : "Create event"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v20 · Invoice builder — line items with layout animation            */
/* ------------------------------------------------------------------ */
type Line = { id: number; desc: string; qty: number; rate: number };
export function InvoiceBuilderForm() {
  const reduce = useReducedMotion();
  const nextId = useRef(4);
  const [lines, setLines] = useState<Line[]>([
    { id: 1, desc: "Dinner plate, amber", qty: 12, rate: 420 },
    { id: 2, desc: "Serving bowl, large", qty: 4, rate: 950 },
  ]);
  const uid = useId();
  const total = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const shown = useSpring(total, 140, 20);

  const patch = (id: number, p: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));

  return (
    <div className="ffx-card ffx-inv">
      <h3 className="ffx-h3">Invoice #1043</h3>
      <div className="ffx-inv-head" aria-hidden><span>Item</span><span>Qty</span><span>Rate</span><span /></div>
      <motion.ul layout className="ffx-inv-list">
        <AnimatePresence mode="popLayout" initial={false}>
          {lines.map((l) => (
            <motion.li layout key={l.id} className="ffx-inv-line"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
              transition={reduce ? { duration: 0 } : SPRING}>
              <input className="ffx-in" aria-label="Item description" value={l.desc} onChange={(e) => patch(l.id, { desc: e.target.value })} />
              <input className="ffx-in ffx-num" aria-label={`Quantity for ${l.desc || "item"}`} inputMode="numeric" value={l.qty}
                onChange={(e) => patch(l.id, { qty: Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
              <input className="ffx-in ffx-num" aria-label={`Rate for ${l.desc || "item"}`} inputMode="numeric" value={l.rate}
                onChange={(e) => patch(l.id, { rate: Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
              <motion.button whileTap={reduce ? undefined : { scale: 0.85 }} type="button" className="ffx-iconbtn" aria-label={`Remove ${l.desc || "line"}`}
                onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} disabled={lines.length <= 1}>{I.x}</motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <button type="button" className="ffx-ghost" onClick={() => setLines((ls) => [...ls, { id: nextId.current++, desc: "", qty: 1, rate: 0 }])}>
        {I.plus} Add line
      </button>
      <div className="ffx-inv-total" aria-live="polite">
        <span>Total due</span>
        <motion.span layout className="ffx-num ffx-total-v" transition={reduce ? { duration: 0 } : SPRING}>₹{fmtMoney(shown)}</motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v21 · Shipping rates — cards stagger in after lookup                */
/* ------------------------------------------------------------------ */
const RATES = [
  { name: "Surface", days: "5-7 days", price: 79 },
  { name: "Express", days: "2-3 days", price: 189 },
  { name: "Priority", days: "Next day", price: 349 },
];
export function ShippingRatesForm() {
  const reduce = useReducedMotion();
  const [weight, setWeight] = useState("2.5");
  const [pin, setPin] = useState("411004");
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const [choice, setChoice] = useState(1);
  const uid = useId();

  const lookup = () => {
    setPhase("busy");
    window.setTimeout(() => setPhase("done"), reduce ? 80 : 700);
  };

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); lookup(); }}>
      <h3 className="ffx-h3">Shipping rates</h3>
      <div className="ffx-row">
        <Field label="Weight (kg)" htmlFor={`${uid}-w`}>
          <input id={`${uid}-w`} className="ffx-in ffx-num" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, ""))} />
        </Field>
        <Field label="Deliver to PIN" htmlFor={`${uid}-p`}>
          <input id={`${uid}-p`} className="ffx-in ffx-num" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
        </Field>
      </div>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={phase === "busy" || pin.length !== 6 || !weight}>
        {phase === "busy" ? <><span className="ffx-spin ffx-spin-light" /> Checking…</> : "Get rates"}
      </motion.button>
      <AnimatePresence>
        {phase === "done" && (
          <div className="ffx-rates" role="radiogroup" aria-label="Choose a rate">
            {RATES.map((r, i) => {
              const price = r.price + Math.round(Number(weight || 1) * 12);
              return (
                <motion.button key={r.name} type="button" role="radio" aria-checked={choice === i}
                  className={`ffx-rate ${choice === i ? "is-on" : ""}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={reduce ? { duration: 0 } : { ...SPRING, delay: i * 0.09 }}
                  onClick={() => setChoice(i)}>
                  <span className="ffx-rate-name">{r.name}</span>
                  <span className="ffx-rate-days">{r.days}</span>
                  <span className="ffx-rate-price ffx-num">₹{fmtInt(price)}</span>
                  {choice === i && <span className="ffx-rate-check ffx-pop">{I.check}</span>}
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v22 · Magic link login — button morphs into sent state              */
/* ------------------------------------------------------------------ */
export function MagicLinkForm() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [count, setCount] = useState(0);
  const uid = useId();

  useEffect(() => {
    if (phase !== "sent" || count <= 0) return;
    const t = window.setTimeout(() => setCount((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, count]);

  const send = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setPhase("sending");
    window.setTimeout(() => { setPhase("sent"); setCount(30); }, reduce ? 120 : 900);
  };

  return (
    <form className="ffx-card ffx-form ffx-magic" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div className="ffx-magic-ico" aria-hidden>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={phase}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.8 }}
            transition={reduce ? { duration: 0 } : SPRING} style={{ display: "inline-flex" }}>
            {phase === "sent" ? <span className="ffx-done-ring ffx-done-sm">{I.check}</span> : I.mail}
          </motion.span>
        </AnimatePresence>
      </div>
      <h3 className="ffx-h3">{phase === "sent" ? "Check your inbox" : "Sign in without a password"}</h3>
      {phase !== "sent" ? (
        <>
          <p className="ffx-sub2">We email you a one-tap link. No password to forget.</p>
          <Field label="Email" htmlFor={`${uid}-e`}>
            <input id={`${uid}-e`} type="email" className="ffx-in" value={email} autoComplete="email" placeholder="you@studio.com"
              onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={phase === "sending" || !/^\S+@\S+\.\S+$/.test(email)}>
            {phase === "sending" ? <><span className="ffx-spin ffx-spin-light" /> Sending…</> : "Email me a link"}
          </motion.button>
        </>
      ) : (
        <>
          <p className="ffx-sub2">We sent a sign-in link to <b>{email}</b>. It works once, for 15 minutes.</p>
          <button type="button" className="ffx-ghost" disabled={count > 0}
            onClick={() => { setPhase("sending"); window.setTimeout(() => { setPhase("sent"); setCount(30); }, reduce ? 120 : 800); }}>
            {count > 0 ? <>Resend in <span className="ffx-num">{count}s</span></> : "Resend link"}
          </button>
          <button type="button" className="ffx-link" onClick={() => { setPhase("idle"); setEmail(""); }}>Use a different email</button>
        </>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v23 · Reset password flow — code then new password                  */
/* ------------------------------------------------------------------ */
export function ResetPasswordFlow() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<0 | 1>(0);
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [done, setDone] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const good = /^\d{5}$/.test(code.join(""));
  const strong = p1.length >= 8 && /\d/.test(p1);
  const match = p1 === p2 && p2.length > 0;

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => { const n = [...c]; n[i] = d; return n; });
    if (d && i < 4) refs.current[i + 1]?.focus();
  };

  return (
    <div className="ffx-card ffx-reset">
      <AnimatePresence mode="wait" initial={false}>
        {phase === 0 ? (
          <motion.form key="code" className="ffx-form"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -36 }}
            transition={reduce ? { duration: 0 } : SPRING}
            onSubmit={(e) => {
              e.preventDefault();
              if (code.join("") === "24680") setPhase(1);
              else { setShakeKey((k) => k + 1); setCode(["", "", "", "", ""]); refs.current[0]?.focus(); }
            }}>
            <h3 className="ffx-h3">Enter the 5-digit code</h3>
            <p className="ffx-sub2">Sent to m•••@clay.in. (Demo code: 24680)</p>
            <div className="ffx-otp" role="group" aria-label="Verification code" key={shakeKey}>
              {code.map((d, i) => (
                <input key={`${i}-${shakeKey}`} ref={(el) => { refs.current[i] = el; }}
                  className={`ffx-otp-box ffx-num ${shakeKey ? "ffx-shake" : ""}`}
                  inputMode="numeric" maxLength={1} value={d} aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
                  onPaste={(e) => {
                    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
                    if (t) { e.preventDefault(); const arr = t.split(""); setCode([...arr, ...Array(5 - arr.length).fill("")].slice(0, 5)); refs.current[Math.min(t.length, 4)]?.focus(); }
                  }} />
              ))}
            </div>
            <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!good}>Verify code</motion.button>
          </motion.form>
        ) : (
          <motion.form key="pw" className="ffx-form"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -36 }}
            transition={reduce ? { duration: 0 } : SPRING}
            onSubmit={(e) => { e.preventDefault(); if (strong && match) setDone(true); }}>
            <h3 className="ffx-h3">Choose a new password</h3>
            <Field label="New password" htmlFor={`${uid}-p1`} hint={p1 && !strong ? "8+ characters with a number" : " "}>
              <input id={`${uid}-p1`} type="password" className="ffx-in" value={p1} autoComplete="new-password" onChange={(e) => setP1(e.target.value)} />
            </Field>
            <Field label="Repeat it" htmlFor={`${uid}-p2`} error={p2 && !match ? "Does not match yet" : undefined}>
              <div className="ffx-icfield">
                <input id={`${uid}-p2`} type="password" className="ffx-in" value={p2} autoComplete="new-password" onChange={(e) => setP2(e.target.value)} />
                {match && <motion.span className="ffx-ic is-ok" initial={reduce ? false : { scale: 0.3 }} animate={{ scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>{I.check}</motion.span>}
              </div>
            </Field>
            <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!strong || !match || done}>
              {done ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Password updated</span> : "Set new password"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v24 · Waitlist — position counts up after joining                   */
/* ------------------------------------------------------------------ */
export function WaitlistForm() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [use, setUse] = useState("My shop");
  const [joined, setJoined] = useState(false);
  const uid = useId();
  const pos = useSpring(joined ? 128 : 0, 90, 20);

  if (joined) return (
    <motion.div className="ffx-wait-done" role="status"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={reduce ? { duration: 0 } : SPRING}>
      <span className="ffx-wait-pos ffx-num">#{fmtInt(pos)}</span>
      <p>in line for <b>{use}</b> access. We move about 40 spots a week.</p>
      <div className="ffx-wait-share">
        <button type="button" className="ffx-ghost" onClick={() => navigator.clipboard?.writeText("https://goatui.local/waitlist?ref=128").catch(() => {})}>Copy referral link</button>
        <button type="button" className="ffx-link" onClick={() => setJoined(false)}>Back</button>
      </div>
    </motion.div>
  );

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) setJoined(true); }}>
      <h3 className="ffx-h3">Join the waitlist</h3>
      <p className="ffx-sub2">Doors open in batches. Earlier is earlier.</p>
      <Field label="Email" htmlFor={`${uid}-e`}>
        <input id={`${uid}-e`} type="email" className="ffx-in" value={email} autoComplete="email" placeholder="you@studio.com" onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="You'll use it for" htmlFor={`${uid}-u`}>
        <div className="ffx-sel-wrap">
          <select id={`${uid}-u`} className="ffx-in ffx-sel" value={use} onChange={(e) => setUse(e.target.value)}>
            {["My shop", "A client project", "Learning", "Just curious"].map((o) => <option key={o}>{o}</option>)}
          </select>{I.chevD}
        </div>
      </Field>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!/^\S+@\S+\.\S+$/.test(email)}>
        Save my spot {I.arrowR}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v25 · Payment tabs — method panels with sliding underline           */
/* ------------------------------------------------------------------ */
const METHODS = ["UPI", "Card", "Cash on delivery"] as const;
export function PaymentTabsForm() {
  const reduce = useReducedMotion();
  const [method, setMethod] = useState<(typeof METHODS)[number]>("UPI");
  const [vpa, setVpa] = useState("");
  const [paid, setPaid] = useState(false);
  const uid = useId();
  const valid = method === "UPI" ? /^[\w.-]+@[a-z]+$/i.test(vpa) : true;

  return (
    <div className="ffx-card ffx-paytabs">
      <h3 className="ffx-h3">Pay ₹1,899.00</h3>
      <div className="ffx-paytabs-head" role="tablist" aria-label="Payment method">
        {METHODS.map((m) => (
          <button key={m} type="button" role="tab" aria-selected={method === m} id={`${uid}-tab-${m}`} aria-controls={`${uid}-panel-${m}`}
            className={`ffx-paytab ${method === m ? "is-on" : ""}`} onClick={() => setMethod(m)}>
            {m}
            {method === m && <motion.span layoutId="ffx-paytab-line" className="ffx-paytab-line" transition={reduce ? { duration: 0 } : SPRING} />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.form key={method} id={`${uid}-panel-${method}`} role="tabpanel" aria-labelledby={`${uid}-tab-${method}`} className="ffx-form"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={reduce ? { duration: 0.1 } : SPRING}
          onSubmit={(e) => { e.preventDefault(); if (valid) setPaid(true); }}>
          {method === "UPI" && (
            <Field label="UPI ID" htmlFor={`${uid}-vpa`} error={vpa && !valid ? "Looks off - name@bank" : undefined} hint="e.g. meera@okhdfc">
              <input id={`${uid}-vpa`} className="ffx-in" value={vpa} placeholder="meera@okhdfc" inputMode="email"
                onChange={(e) => setVpa(e.target.value)} />
            </Field>
          )}
          {method === "Card" && (
            <>
              <Field label="Name on card" htmlFor={`${uid}-cn`}>
                <input id={`${uid}-cn`} className="ffx-in" autoComplete="cc-name" placeholder="MEERA IYER" />
              </Field>
              <div className="ffx-row">
                <Field label="Expiry" htmlFor={`${uid}-ex`}>
                  <input id={`${uid}-ex`} className="ffx-in ffx-num" placeholder="MM/YY" inputMode="numeric" />
                </Field>
                <Field label="CVV" htmlFor={`${uid}-cv`}>
                  <input id={`${uid}-cv`} type="password" className="ffx-in ffx-num" placeholder="•••" inputMode="numeric" maxLength={4} />
                </Field>
              </div>
            </>
          )}
          {method === "Cash on delivery" && (
            <p className="ffx-sub2">Pay the courier by cash or UPI when the parcel arrives. Please keep change handy - couriers carry limited float.</p>
          )}
          <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!valid || paid}>
            {paid ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Done</span>
              : method === "UPI" ? "Request payment" : method === "Card" ? "Pay securely" : "Confirm order"}
          </motion.button>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v26 · Preference cards — pick topics, Continue springs in           */
/* ------------------------------------------------------------------ */
const PREF_TOPICS = [
  { k: "tableware", label: "Tableware", icon: "◉" },
  { k: "sculpture", label: "Sculpture", icon: "◆" },
  { k: "glazes", label: "Glazes", icon: "✦" },
  { k: "kilns", label: "Kilns", icon: "▲" },
  { k: "business", label: "Selling", icon: "◍" },
  { k: "teaching", label: "Teaching", icon: "✚" },
];
export function PreferenceCardsForm() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  return (
    <div className="ffx-card ffx-prefs">
      <h3 className="ffx-h3">What should we show you first?</h3>
      <div className="ffx-prefs-grid" role="group" aria-label="Topics">
        {PREF_TOPICS.map((t) => {
          const on = picked.includes(t.k);
          return (
            <motion.button key={t.k} type="button" layout
              className={`ffx-pref ${on ? "is-on" : ""}`} aria-pressed={on}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              animate={reduce ? undefined : { scale: on ? 1.02 : 1 }}
              transition={SPRING}
              onClick={() => setPicked((p) => (on ? p.filter((x) => x !== t.k) : [...p, t.k]))}>
              <span className="ffx-pref-ico" aria-hidden>{t.icon}</span>
              <span>{t.label}</span>
              {on && <span className="ffx-pref-check ffx-pop">{I.check}</span>}
            </motion.button>
          );
        })}
      </div>
      <div className="ffx-prefs-foot">
        <span className="ffx-num" role="status">{picked.length} selected</span>
        <AnimatePresence>
          {picked.length > 0 && (
            <motion.button type="button" className="ffx-btn ffx-btn-sm"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={reduce ? { duration: 0 } : SPRING}
              onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1600); }}>
              {saved ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{I.check} Saved</span> : <>Continue {I.arrowR}</>}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v27 · Review composer — stars unlock the submit bar                 */
/* ------------------------------------------------------------------ */
export function ReviewComposerForm() {
  const reduce = useReducedMotion();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState(false);
  const uid = useId();
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (stars) setPosted(true); }}>
      <h3 className="ffx-h3">Review: Amber dinner set</h3>
      <div className="ffx-stars" role="radiogroup" aria-label="Star rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((v) => (
          <motion.button key={v} type="button" role="radio" aria-checked={stars === v} aria-label={`${v} star${v > 1 ? "s" : ""}`}
            className={`ffx-star ${(hover || stars) >= v ? "is-lit" : ""}`}
            animate={reduce ? undefined : { scale: stars === v ? 1.25 : 1, rotate: stars === v ? [0, -8, 0] : 0 }}
            transition={SPRING}
            onMouseEnter={() => setHover(v)}
            onFocus={() => setHover(v)}
            onClick={() => setStars(v)}>
            {I.star((hover || stars) >= v)}
          </motion.button>
        ))}
      </div>
      <AnimatePresence initial={false}>
        {stars > 0 && (
          <motion.div className="ffx-form"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }} animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }} exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduce ? { duration: 0 } : SPRING} style={{ overflow: "hidden" }}>
            <Field label="Headline" htmlFor={`${uid}-t`}>
              <input id={`${uid}-t`} className="ffx-in" value={title} placeholder="Sums it up in a line" onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <div className="ffx-field">
              <label className="ffx-label" htmlFor={`${uid}-b`}>Your review</label>
              <div className="ffx-ta-wrap">
                <textarea id={`${uid}-b`} className="ffx-in ffx-ta" rows={3} value={body} placeholder="How is the glaze holding up?" onChange={(e) => setBody(e.target.value)} />
                <span className="ffx-ta-count ffx-num" aria-hidden>{words} words</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!stars || posted}>
        {posted ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Review posted</span> : stars ? `Post ${stars}-star review` : "Rate it first"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v28 · Flight search — swap button rotates, travellers popover       */
/* ------------------------------------------------------------------ */
export function FlightSearchForm() {
  const reduce = useReducedMotion();
  const [from, setFrom] = useState("PNQ");
  const [to, setTo] = useState("DEL");
  const [date, setDate] = useState("2026-12-12");
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const uid = useId();
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <form className="ffx-card ffx-flight" onSubmit={(e) => e.preventDefault()}>
      <h3 className="ffx-h3">Find flights</h3>
      <div className="ffx-flight-route">
        <Field label="From" htmlFor={`${uid}-f`}>
          <input id={`${uid}-f`} className="ffx-in ffx-num" value={from} maxLength={3}
            onChange={(e) => setFrom(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))} />
        </Field>
        <motion.button type="button" className="ffx-swap" aria-label="Swap origin and destination"
          whileTap={reduce ? undefined : { scale: 0.88 }}
          onClick={() => { const t = from; setFrom(to); setTo(t); }}>
          <motion.span key={`${from}-${to}`} initial={reduce ? false : { rotate: -180 }} animate={{ rotate: 0 }} transition={reduce ? { duration: 0 } : SPRING} style={{ display: "inline-flex" }}>
            {I.swap}
          </motion.span>
        </motion.button>
        <Field label="To" htmlFor={`${uid}-t`}>
          <input id={`${uid}-t`} className="ffx-in ffx-num" value={to} maxLength={3}
            onChange={(e) => setTo(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))} />
        </Field>
      </div>
      <div className="ffx-row">
        <Field label="Departure" htmlFor={`${uid}-d`}>
          <input id={`${uid}-d`} type="date" className="ffx-in ffx-num" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <div className="ffx-field" ref={popRef}>
          <span className="ffx-label" id={`${uid}-pax-l`}>Travellers</span>
          <button type="button" className="ffx-in ffx-paxbtn" aria-haspopup="dialog" aria-expanded={open} aria-labelledby={`${uid}-pax-l`} onClick={() => setOpen((o) => !o)}>
            <span className="ffx-num">{adults + kids}</span> traveller{adults + kids > 1 ? "s" : ""} {I.chevD}
          </button>
          <AnimatePresence>
            {open && (
              <motion.div className="ffx-paxpop" role="dialog" aria-label="Choose travellers"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                transition={reduce ? { duration: 0 } : SPRING}>
                {([["Adults", adults, setAdults, 1], ["Children", kids, setKids, 0]] as const).map(([label, v, set, min]) => (
                  <div key={label} className="ffx-stepper-row">
                    <span className="ffx-label">{label}</span>
                    <div className="ffx-stepper">
                      <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} onClick={() => set(Math.max(min, v - 1))}>{I.minus}</button>
                      <span className="ffx-stepper-v ffx-num">{v}</span>
                      <button type="button" aria-label={`More ${label.toLowerCase()}`} onClick={() => set(Math.min(9, v + 1))}>{I.plus}</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="ffx-btn ffx-btn-sm" onClick={() => setOpen(false)}>Done</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn ffx-flight-go" type="submit" disabled={from.length < 3 || to.length < 3 || from === to}>
        <motion.span aria-hidden animate={reduce ? undefined : { x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>{I.plane}</motion.span>
        Search {from && to && from.length === 3 && to.length === 3 ? `${from} → ${to}` : "flights"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v29 · Support ticket — severity ladder changes the SLA badge        */
/* ------------------------------------------------------------------ */
const SEVERITIES = [
  { k: "low", label: "Low", sla: "Replies in 2 days", color: "#0e9f6e" },
  { k: "normal", label: "Normal", sla: "Replies in 8 hours", color: "#2563eb" },
  { k: "high", label: "High", sla: "Replies in 2 hours", color: "#d97706" },
  { k: "urgent", label: "Urgent", sla: "Replies in 30 min", color: "#dc2626" },
];
export function TicketSeverityForm() {
  const reduce = useReducedMotion();
  const [sev, setSev] = useState(1);
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [filed, setFiled] = useState(false);
  const uid = useId();
  const max = 400;

  return (
    <form className="ffx-card ffx-form" onSubmit={(e) => { e.preventDefault(); if (subject.trim() && desc.trim()) setFiled(true); }}>
      <h3 className="ffx-h3">File a ticket</h3>
      <Field label="Subject" htmlFor={`${uid}-s`}>
        <input id={`${uid}-s`} className="ffx-in" value={subject} placeholder="Kiln shelf arrived cracked" onChange={(e) => setSubject(e.target.value)} />
      </Field>
      <fieldset className="ffx-fieldset">
        <legend className="ffx-label">Severity</legend>
        <div className="ffx-ladder" role="radiogroup" aria-label="Severity">
          {SEVERITIES.map((s, i) => (
            <button key={s.k} type="button" role="radio" aria-checked={sev === i}
              className={`ffx-rung ${sev === i ? "is-on" : ""}`} style={{ ["--rung" as string]: s.color }}
              onClick={() => setSev(i)}>
              {sev === i && <motion.span layoutId="ffx-rung-thumb" className="ffx-rung-thumb" transition={reduce ? { duration: 0 } : SPRING} />}
              <span className="ffx-rung-t">{s.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={sev} className="ffx-sla" style={{ color: SEVERITIES[sev].color }} role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}>
            ● {SEVERITIES[sev].sla}
          </motion.p>
        </AnimatePresence>
      </fieldset>
      <div className="ffx-field">
        <label className="ffx-label" htmlFor={`${uid}-d`}>What happened?</label>
        <div className="ffx-ta-wrap">
          <textarea id={`${uid}-d`} className="ffx-in ffx-ta" rows={3} maxLength={max} value={desc} placeholder="Photos help. So do order numbers." onChange={(e) => setDesc(e.target.value)} />
          <span className="ffx-ta-count ffx-num" data-hot={max - desc.length < 40} aria-hidden>{max - desc.length}</span>
        </div>
      </div>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-btn" type="submit" disabled={!subject.trim() || !desc.trim() || filed}>
        {filed ? <span className="ffx-pop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.check} Ticket #2041 filed</span> : "File ticket"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* v30 · Underline login — minimal, Enter advances, underline errors   */
/* ------------------------------------------------------------------ */
export function UnderlineLoginForm() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const uid = useId();
  const passRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email"); return; }
    if (pass.length < 8) { setErr("pass"); passRef.current?.focus(); return; }
    setErr("");
    setPhase("busy");
    window.setTimeout(() => setPhase("done"), reduce ? 150 : 900);
  };

  return (
    <form className="ffx-ulogin" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      <h3 className="ffx-ulogin-h">marrow<span aria-hidden>.</span></h3>
      <div className={`ffx-uline ${err === "email" ? "is-err" : ""}`}>
        <label htmlFor={`${uid}-e`}>Email</label>
        <input id={`${uid}-e`} type="email" value={email} autoComplete="email" placeholder="you@studio.com"
          aria-invalid={err === "email"} aria-describedby={err === "email" ? `${uid}-e-err` : undefined}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); passRef.current?.focus(); } }} />
        {err === "email" && <em id={`${uid}-e-err`} role="alert">Valid email, please</em>}
      </div>
      <div className={`ffx-uline ${err === "pass" ? "is-err" : ""}`}>
        <label htmlFor={`${uid}-p`}>Password</label>
        <input ref={passRef} id={`${uid}-p`} type="password" value={pass} autoComplete="current-password" placeholder="8+ characters"
          aria-invalid={err === "pass"} aria-describedby={err === "pass" ? `${uid}-p-err` : undefined}
          onChange={(e) => { setPass(e.target.value); setErr(""); }} />
        {err === "pass" && <em id={`${uid}-p-err`} role="alert">At least 8 characters</em>}
      </div>
      <motion.button whileTap={reduce ? undefined : { scale: 0.97 }} className="ffx-ulogin-btn" type="submit" disabled={phase === "busy"}>
        {phase === "busy" ? <span className="ffx-spin" /> : phase === "done" ? <span className="ffx-pop" style={{ display: "inline-flex" }}>{I.check}</span> : I.arrowR}
        <span className="ffx-sr">{phase === "done" ? "Signed in" : "Sign in"}</span>
      </motion.button>
      <a className="ffx-link" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* manifest + gallery                                                  */
/* ------------------------------------------------------------------ */
export const FORMS_FAMILY: { id: string; name: string; note: string; span?: 2 | 3; Component: () => ReactElement }[] = [
  { id: "v01", name: "Split auth switch", note: "Sign in/up segmented thumb, fields spring in and out", Component: SplitAuthSwitch },
  { id: "v02", name: "Onboarding wizard", note: "Sliding steps, spring progress rail, per-step validation", Component: OnboardingWizard },
  { id: "v03", name: "Dirty save bar", note: "Sticky save pill rises only when the form is dirty", Component: DirtySaveBar },
  { id: "v04", name: "Accordion checkout", note: "Done sections collapse into editable summary rows", Component: AccordionCheckout },
  { id: "v05", name: "Conversational form", note: "Chat-style, one question at a time, typing dots", Component: ConversationalForm },
  { id: "v06", name: "Live validation register", note: "Username availability check, per-field status icons", Component: LiveValidateForm },
  { id: "v07", name: "Smart address", note: "PIN lookup autofills city and state with a flash tag", Component: SmartAddressForm },
  { id: "v08", name: "Appointment booking", note: "Day strip with sliding ring, slot grid, live CTA", Component: AppointmentBooking },
  { id: "v09", name: "Profile card form", note: "Avatar initials and banner preview update live", Component: ProfileCardForm },
  { id: "v10", name: "Feedback morph", note: "Emoji rating reveals a matching follow-up question", Component: FeedbackMorphForm },
  { id: "v11", name: "Expanding newsletter", note: "Slim bar unfolds name and topic fields on focus", Component: NewsletterExpandForm },
  { id: "v12", name: "RSVP conditional", note: "Yes/no thumb reveals guests or a farewell note", Component: RsvpConditionalForm },
  { id: "v13", name: "Coupon checkout", note: "GOAT10 slides in a discount row, total counts down", Component: CouponCheckoutForm },
  { id: "v14", name: "Application progress rail", note: "Side rail fills as sections become valid", Component: ApplicationRailForm },
  { id: "v15", name: "Filter panel", note: "Collapsible groups, selections become removable chips", Component: FilterPanelForm },
  { id: "v16", name: "Contact subject switch", note: "Subject pills swap the secondary fields", Component: ContactSubjectForm },
  { id: "v17", name: "Donation impact", note: "Amount presets, impact line and total count up", Component: DonationForm },
  { id: "v18", name: "Quiz cards", note: "Answer cards slide sideways, score ring at the end", Component: QuizCardForm },
  { id: "v19", name: "Event composer", note: "Live preview card updates while you type", Component: EventComposerForm },
  { id: "v20", name: "Invoice builder", note: "Line items add/remove with layout spring, totals count", Component: InvoiceBuilderForm },
  { id: "v21", name: "Shipping rates", note: "Rate cards stagger in after a lookup", Component: ShippingRatesForm },
  { id: "v22", name: "Magic link login", note: "Button morphs into a sent state with resend timer", Component: MagicLinkForm },
  { id: "v23", name: "Reset password flow", note: "Code boxes auto-advance, then new password phase", Component: ResetPasswordFlow },
  { id: "v24", name: "Waitlist position", note: "Joining reveals a counting queue position", Component: WaitlistForm },
  { id: "v25", name: "Payment method tabs", note: "Sliding underline, each method its own mini-form", Component: PaymentTabsForm },
  { id: "v26", name: "Preference cards", note: "Topic cards toggle, Continue springs in", Component: PreferenceCardsForm },
  { id: "v27", name: "Review composer", note: "Stars unlock the form, word count, post bar", Component: ReviewComposerForm },
  { id: "v28", name: "Flight search", note: "Rotating swap button, travellers popover", Component: FlightSearchForm },
  { id: "v29", name: "Severity ticket", note: "Severity ladder repaints the SLA badge", Component: TicketSeverityForm },
  { id: "v30", name: "Underline login", note: "Borderless inputs, Enter advances, drawn errors", Component: UnderlineLoginForm },
];

export default function FormsFamily({ batch = 0, only = "" }: { batch?: number; only?: string }) {
  let items = FORMS_FAMILY;
  if (only) items = items.filter((i) => i.id === only);
  else if (batch >= 1 && batch <= 5) items = items.slice((batch - 1) * 6, batch * 6);
  return (
    <div className="ffx">
      <div className="ffx-grid">
        {items.map(({ id, name, note, Component }) => (
          <div key={id} className="ffx-cell">
            <span className="ffx-cell-id ffx-num">{id}</span>
            <div className="ffx-item"><Component /></div>
            <div className="ffx-cap"><b>{name}</b><span>{note}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
        }
