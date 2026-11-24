"use client";

import * as React from "react";
import "./CardFamily.css";

/* ================================================================
   CardFamily - 30 product-object cards for GOAT UI.
   Every card is a real object (boarding pass, receipt, vinyl...)
   with its own composition, material and interaction model.
   Physics: springs drive tilt, drag, flip and stack motion.
   ================================================================ */

/* ---------------- motion primitives ---------------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type SpringCfg = { stiffness?: number; damping?: number };

/** A single spring-driven scalar. Snaps instantly under reduced motion. */
function useSpring(target: number, cfg: SpringCfg = {}): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = React.useState(target);
  const stateRef = React.useRef({ x: target, v: 0 });
  const targetRef = React.useRef(target);
  targetRef.current = target;
  const k = cfg.stiffness ?? 170;
  const d = cfg.damping ?? 22;

  React.useEffect(() => {
    if (reduced) {
      stateRef.current = { x: targetRef.current, v: 0 };
      setValue(targetRef.current);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.034);
      last = now;
      const s = stateRef.current;
      const t = targetRef.current;
      const a = -k * (s.x - t) - d * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - t) < 0.005 && Math.abs(s.v) < 0.005) {
        s.x = t;
        s.v = 0;
        setValue(t);
        return;
      }
      setValue(s.x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, k, d, reduced]);
  return value;
}

/** Pointer tilt: rotateX/rotateY springs plus a glare position. */
function useTilt(maxDeg = 9, scale = 1.015) {
  const [t, setT] = React.useState({ nx: 0, ny: 0, lift: 0 });
  const rx = useSpring(-t.ny * maxDeg, { stiffness: 320, damping: 26 });
  const ry = useSpring(t.nx * maxDeg, { stiffness: 320, damping: 26 });
  const lift = useSpring(t.lift, { stiffness: 300, damping: 24 });
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTargetSafe({
      nx: ((e.clientX - r.left) / r.width) * 2 - 1,
      ny: ((e.clientY - r.top) / r.height) * 2 - 1,
      lift: 1,
    });
  };
  const setTargetSafe = (v: { nx: number; ny: number; lift: number }) =>
    setT({ nx: Math.max(-1, Math.min(1, v.nx)), ny: Math.max(-1, Math.min(1, v.ny)), lift: v.lift });
  const onPointerLeave = () => setT({ nx: 0, ny: 0, lift: 0 });
  const style: React.CSSProperties = {
    transform: `perspective(950px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${(1 + (scale - 1) * lift).toFixed(4)})`,
  };
  const glareStyle: React.CSSProperties = {
    opacity: lift * 0.55,
    background: `radial-gradient(circle at ${((t.nx * 0.5 + 0.5) * 100).toFixed(1)}% ${((t.ny * 0.5 + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,.6), rgba(255,255,255,0) 62%)`,
  };
  return { tiltStyle: style, glareStyle, lift, handlers: { onPointerMove, onPointerLeave } };
}

/** Pointer drag with springy follow and spring return. */
function useDrag(onRelease?: (x: number, y: number) => { x: number; y: number } | void) {
  const [target, setTarget] = React.useState({ x: 0, y: 0 });
  const [held, setHeld] = React.useState(false);
  const drag = React.useRef<{ id: number; sx: number; sy: number; bx: number; by: number } | null>(null);
  const moved = React.useRef(false);
  const x = useSpring(target.x, { stiffness: 200, damping: 16 });
  const y = useSpring(target.y, { stiffness: 200, damping: 16 });
  const rot = useSpring(target.x * 0.02, { stiffness: 200, damping: 16 });

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, bx: target.x, by: target.y };
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setHeld(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const nx = d.bx + (e.clientX - d.sx);
    const ny = d.by + (e.clientY - d.sy);
    if (Math.abs(nx - d.bx) + Math.abs(ny - d.by) > 6) moved.current = true;
    setTarget({ x: nx, y: ny });
  };
  const end = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setHeld(false);
    const next = onRelease ? onRelease(target.x, target.y) : undefined;
    setTarget(next ?? { x: 0, y: 0 });
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const step = 12;
    if (e.key === "ArrowLeft") setTarget((t) => ({ ...t, x: t.x - step }));
    else if (e.key === "ArrowRight") setTarget((t) => ({ ...t, x: t.x + step }));
    else if (e.key === "ArrowUp") setTarget((t) => ({ ...t, y: t.y - step }));
    else if (e.key === "ArrowDown") setTarget((t) => ({ ...t, y: t.y + step }));
    else if (e.key === "Escape" || e.key === "Enter" || e.key === " ") setTarget({ x: 0, y: 0 });
    else return;
    e.preventDefault();
  };
  return {
    x, y, rot, held, moved,
    setTarget,
    dragProps: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onKeyDown },
  };
}

/** Spring flip between two faces (0 / 180 deg). */
function useFlip() {
  const [flipped, setFlipped] = React.useState(false);
  const ry = useSpring(flipped ? 180 : 0, { stiffness: 150, damping: 14 });
  const frontOpacity = Math.cos((ry * Math.PI) / 180) > 0 ? 1 : 0;
  return { flipped, setFlipped, toggle: () => setFlipped((f) => !f), ry, frontOpacity };
}

/* ---------------- seeded random + fake codes ---------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Barcode({ seed, dark = "#1c1a17" }: { seed: number; dark?: string }) {
  const rnd = React.useMemo(() => mulberry32(seed), [seed]);
  const bars = React.useMemo(() => Array.from({ length: 42 }, () => 1 + Math.floor(rnd() * 4)), [rnd]);
  return (
    <span className="cf-barcode" aria-hidden="true">
      {bars.map((w, i) => (
        <i key={i} style={{ width: w, background: dark }} />
      ))}
    </span>
  );
}

function QrCode({ seed, size = 84, dark = "#1c1a17", light = "#ffffff" }: { seed: number; size?: number; dark?: string; light?: string }) {
  const cells = React.useMemo(() => {
    const rnd = mulberry32(seed);
    const n = 21;
    const g: boolean[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => rnd() > 0.52));
    const finder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        g[r0 + r][c0 + c] = edge || core;
      }
    };
    finder(0, 0); finder(0, 14); finder(14, 0);
    return g;
  }, [seed]);
  return (
    <svg className="cf-qr" width={size} height={size} viewBox="0 0 21 21" role="img" aria-label="QR code">
      <rect width="21" height="21" fill={light} />
      {cells.flatMap((row, r) => row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={dark} /> : null)))}
    </svg>
  );
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ================================================================
   01 - Boarding pass. Flip to scan side. Spring flip, tilt.
   ================================================================ */
export function BoardingPass() {
  const flip = useFlip();
  const tilt = useTilt(4, 1.008);
  return (
    <div className="cf-stage">
      <div className="cf-bp-wrap" {...tilt.handlers}>
        <div className="cf-bp" style={tilt.tiltStyle}>
          <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
            <div className="cf-face cf-bp-front">
              <div className="cf-bp-top">
                <span className="cf-bp-airline"><i className="cf-bp-logo" />Meridian Air</span>
                <span className="cf-bp-class">Economy</span>
              </div>
              <div className="cf-bp-route">
                <div><strong>BLR</strong><span>Bengaluru</span><time>21:45</time></div>
                <div className="cf-bp-path"><i /><em>✈</em><i /></div>
                <div><strong>SFO</strong><span>San Francisco</span><time>06:10</time></div>
              </div>
              <div className="cf-bp-meta">
                <span><label>Passenger</label>Jamie Lane</span>
                <span><label>Flight</label>MX 418</span>
                <span><label>Date</label>07 DEC</span>
                <span><label>Seat</label><b className="cf-bp-seat">14A</b></span>
                <span><label>Gate</label>C7</span>
                <span><label>Group</label>2</span>
              </div>
              <div className="cf-bp-perf" aria-hidden="true" />
              <div className="cf-bp-stub">
                <span>Boarding closes 21:15</span>
                <button type="button" className="cf-bp-scan" onClick={flip.toggle} aria-pressed={flip.flipped}>
                  {flip.flipped ? "Back to pass" : "Show barcode"}
                </button>
              </div>
            </div>
            <div className="cf-face cf-bp-back">
              <div className="cf-bp-back-inner">
                <Barcode seed={418} />
                <span className="cf-bp-code">M1LANE/JAMIE MX418 BLRSFO 14A</span>
                <button type="button" className="cf-bp-scan" onClick={flip.toggle}>Back to pass</button>
              </div>
            </div>
          </div>
          <i className="cf-glare" style={tilt.glareStyle} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   02 - Vinyl record. Disc slides out and spins while playing.
   ================================================================ */
export function VinylRecord() {
  const [playing, setPlaying] = React.useState(false);
  const out = useSpring(playing ? 1 : 0, { stiffness: 120, damping: 14 });
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setSeconds((s) => (s + 1) % 305), 1000);
    return () => window.clearInterval(id);
  }, [playing]);
  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="cf-stage">
      <div className="cf-vinyl">
        <div className="cf-vinyl-disc" style={{ transform: `translateX(${(out * 46).toFixed(2)}%)` }}>
          <div className={cx("cf-vinyl-platter", playing && "spinning")}>
            <i className="cf-vinyl-groove" />
            <span className="cf-vinyl-label"><b>Sundown</b><i>A side · 33⅓</i></span>
          </div>
        </div>
        <div className="cf-vinyl-sleeve">
          <div className="cf-vinyl-art" aria-hidden="true"><i className="sun" /><i className="hill h1" /><i className="hill h2" /></div>
          <div className="cf-vinyl-info">
            <strong>Sundown</strong>
            <span>Khruangbin · Con Todo El Mundo</span>
            <div className="cf-vinyl-controls">
              <button type="button" className={cx("cf-vinyl-play", playing && "on")} onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
                {playing ? "❚❚ Pause" : "▶ Play"}
              </button>
              <span className="cf-vinyl-time" aria-live="off">{mm}:{ss} / 5:05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   03 - Match ticket. Drag the stub to tear it off. Holo sheen.
   ================================================================ */
export function MatchTicket() {
  const [torn, setTorn] = React.useState(false);
  const tilt = useTilt(6, 1.01);
  const drag = useDrag((x) => {
    if (x > 78) { setTorn(true); return { x: 210, y: 26 }; }
    if (torn) return { x: 210, y: 26 };
    return { x: 0, y: 0 };
  });
  React.useEffect(() => { if (!torn) drag.setTarget({ x: 0, y: 0 }); }, [torn]); // eslint-disable-line
  return (
    <div className="cf-stage">
      <div className="cf-mt-wrap" {...tilt.handlers}>
        <div className="cf-mt" style={tilt.tiltStyle}>
          <div className="cf-mt-main">
            <div className="cf-mt-head"><span className="cf-mt-league">Coastal Premier League</span><span className="cf-mt-round">Matchday 17</span></div>
            <div className="cf-mt-teams">
              <div className="cf-mt-team"><i className="cf-mt-crest a">HC</i><strong>Harbour City</strong></div>
              <span className="cf-mt-vs">v</span>
              <div className="cf-mt-team"><i className="cf-mt-crest b">NU</i><strong>Northgate Utd</strong></div>
            </div>
            <div className="cf-mt-meta">
              <span><label>Date</label>Sat 07 Dec · 19:30</span>
              <span><label>Venue</label>Tidebreak Stadium</span>
              <span><label>Stand</label>East B · Row 12 · Seat 34</span>
            </div>
            <i className="cf-mt-holo" style={tilt.glareStyle} />
          </div>
          <div
            className={cx("cf-mt-stub", drag.held && "held", torn && "torn")}
            style={{ transform: `translate(${drag.x.toFixed(1)}px, ${drag.y.toFixed(1)}px) rotate(${drag.rot.toFixed(2)}deg)` }}
            role="button" tabIndex={0} aria-label={torn ? "Admit one B·12·34. Stub torn off. Press to reattach." : "Admit one B·12·34. Drag right to tear, or press Enter."}
            onClick={() => { if (drag.moved.current) return; if (torn) { setTorn(false); drag.setTarget({ x: 0, y: 0 }); } }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTorn((t) => !t); if (!torn) drag.setTarget({ x: 210, y: 26 }); else drag.setTarget({ x: 0, y: 0 }); } else drag.dragProps.onKeyDown(e); }}
            onPointerDown={drag.dragProps.onPointerDown}
            onPointerMove={drag.dragProps.onPointerMove}
            onPointerUp={drag.dragProps.onPointerUp}
            onPointerCancel={drag.dragProps.onPointerCancel}
          >
            <span className="cf-mt-stub-title">Admit one</span>{" "}
            <Barcode seed={1712} dark="#3d3626" />
            <span className="cf-mt-stub-seat">B·12·34</span>
          </div>
        </div>
      </div>
      <p className="cf-hint">{torn ? "Stub torn. Tap it to reattach." : "Drag the stub to tear it off."}</p>
    </div>
  );
}

/* ================================================================
   04 - Thermal receipt. Free drag with wobble, curl shadow.
   ================================================================ */
export function ThermalReceipt() {
  const drag = useDrag();
  return (
    <div className="cf-stage">
      <div
        className={cx("cf-rc", drag.held && "held")}
        style={{ transform: `translate(${drag.x.toFixed(1)}px, ${drag.y.toFixed(1)}px) rotate(${drag.rot.toFixed(2)}deg)` }}
        role="group" aria-roledescription="Draggable card" aria-label="Receipt. Arrow keys move it, Escape returns it." tabIndex={0}
        {...drag.dragProps}
      >
        <div className="cf-rc-paper">
          <header>
            <strong>KIOSK COFFEE CO.</strong>
            <span>214 Rosewood Ave, Portland</span>
            <span>Sat 07 Dec · 08:52 · Till 3</span>
          </header>
          <table>
            <tbody>
              <tr><td>Flat white, oat</td><td>4.80</td></tr>
              <tr><td>Cardamom bun</td><td>4.20</td></tr>
              <tr><td>Filter refill</td><td>2.50</td></tr>
              <tr><td>Beans, 250g - Yirgacheffe</td><td>14.00</td></tr>
            </tbody>
            <tfoot>
              <tr><td>Subtotal</td><td>25.50</td></tr>
              <tr><td>Card ···· 4471</td><td>25.50</td></tr>
              <tr className="cf-rc-total"><td>Total</td><td>$25.50</td></tr>
            </tfoot>
          </table>
          <div className="cf-rc-thanks">
            <span>Thanks - see you tomorrow?</span>
            <Barcode seed={4471} dark="#2b2620" />
            <span className="cf-rc-no">#04217</span>
          </div>
        </div>
        <i className="cf-rc-edge" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ================================================================
   05 - Payment card. Tilt glare, spring flip to CVV side.
   ================================================================ */
export function PaymentCard() {
  const flip = useFlip();
  const tilt = useTilt(11, 1.02);
  return (
    <div className="cf-stage">
      <div className="cf-pc-wrap" {...tilt.handlers}>
        <div className="cf-pc" style={tilt.tiltStyle}>
          <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
            <div className="cf-face cf-pc-front">
              <div className="cf-pc-top"><span className="cf-pc-bank">North Bank</span><span className="cf-pc-type">Debit</span></div>
              <i className="cf-pc-chip" />
              <span className="cf-pc-num">5312&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;4471</span>
              <div className="cf-pc-bottom">
                <span><label>Card holder</label>JAMIE LANE</span>
                <span><label>Expires</label>09/29</span>
                <i className="cf-pc-mark" aria-hidden="true" />
              </div>
              <i className="cf-glare" style={tilt.glareStyle} />
            </div>
            <div className="cf-face cf-pc-back">
              <i className="cf-pc-mag" />
              <div className="cf-pc-sig"><span>Jamie Lane</span><b>CVV 318</b></div>
              <p>Lost card? Freeze it instantly in the North Bank app, any hour.</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="cf-btn" onClick={flip.toggle} aria-pressed={flip.flipped}>{flip.flipped ? "Show front" : "Flip for CVV"}</button>
    </div>
  );
}

/* ================================================================
   06 - Weather tile. Drag horizontally to scrub the day.
   ================================================================ */
const WEATHER_HOURS = [
  { h: "Now", t: 27, sky: 0.9, icon: "sun" }, { h: "12", t: 29, sky: 1, icon: "sun" },
  { h: "13", t: 30, sky: 1, icon: "sun" }, { h: "14", t: 30, sky: 0.85, icon: "sun" },
  { h: "15", t: 29, sky: 0.7, icon: "cloud" }, { h: "16", t: 28, sky: 0.6, icon: "cloud" },
  { h: "17", t: 27, sky: 0.45, icon: "cloud" }, { h: "18", t: 25, sky: 0.25, icon: "dusk" },
  { h: "19", t: 24, sky: 0.1, icon: "moon" },
];
export function WeatherTile() {
  const [idx, setIdx] = React.useState(0);
  const prog = useSpring(idx, { stiffness: 210, damping: 24 });
  const drag = useDrag((x) => {
    const next = Math.max(0, Math.min(WEATHER_HOURS.length - 1, idx - Math.round(x / 46)));
    setIdx(next);
    return { x: 0, y: 0 };
  });
  const cur = WEATHER_HOURS[idx];
  const skyPos = (prog / (WEATHER_HOURS.length - 1)) * 100;
  const light = 0.35 + cur.sky * 0.65;
  return (
    <div className="cf-stage">
      <div
        className={cx("cf-wx", drag.held && "held")}
        onPointerDown={drag.dragProps.onPointerDown}
        onPointerMove={drag.dragProps.onPointerMove}
        onPointerUp={drag.dragProps.onPointerUp}
        onPointerCancel={drag.dragProps.onPointerCancel}
      >
      <div
        className="cf-wx-scrub"
        role="slider" tabIndex={0} aria-label="Hour of day" aria-valuemin={0} aria-valuemax={WEATHER_HOURS.length - 1} aria-valuenow={idx} aria-valuetext={`${cur.h === "Now" ? "Now" : `${cur.h}:00`}, ${cur.t} degrees`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { setIdx((i) => Math.min(WEATHER_HOURS.length - 1, i + 1)); e.preventDefault(); }
          else if (e.key === "ArrowLeft") { setIdx((i) => Math.max(0, i - 1)); e.preventDefault(); }
          else if (e.key === "Home") { setIdx(0); e.preventDefault(); }
          else if (e.key === "End") { setIdx(WEATHER_HOURS.length - 1); e.preventDefault(); }
        }}
      >
        <div className="cf-wx-sky" style={{ filter: `brightness(${light.toFixed(2)})` }}>
          <i className="cf-wx-orb" style={{ left: `${(8 + skyPos * 0.84).toFixed(2)}%`, opacity: 0.35 + cur.sky * 0.65 }} />
          <i className="cf-wx-cloud c1" style={{ opacity: 1 - cur.sky * 0.6 }} />
          <i className="cf-wx-cloud c2" style={{ opacity: 1 - cur.sky * 0.75 }} />
        </div>
        <div className="cf-wx-body">
          <div className="cf-wx-place"><strong>Bengaluru</strong><span>Mostly sunny · H31° L21°</span></div>
          <div className="cf-wx-temp"><strong>{cur.t}°</strong><span>{cur.h === "Now" ? "Now" : `${cur.h}:00`}</span></div>
        </div>
      </div>
        <div className="cf-wx-strip" role="group" aria-label="Hour">
          {WEATHER_HOURS.map((w, i) => (
            <button type="button" key={w.h} className={cx(i === idx && "on")} aria-pressed={i === idx} onClick={() => setIdx(i)} aria-label={`${w.h} ${w.t}°`}>
              <span>{w.h}</span>{" "}<b>{w.t}°</b>
            </button>
          ))}
        </div>
      </div>
      <p className="cf-hint">Drag across the tile, or use arrow keys, to scrub the day.</p>
    </div>
  );
}

/* ================================================================
   07 - Recipe card. Flip between ingredients and method. Timer.
   ================================================================ */
export function RecipeCard() {
  const flip = useFlip();
  const [timer, setTimer] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) { setTimer(null); return; }
    const id = window.setInterval(() => setTimer((t) => (t === null ? null : t - 1)), 1000);
    return () => window.clearInterval(id);
  }, [timer]);
  const tmm = timer === null ? "10:00" : `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;
  return (
    <div className="cf-stage">
      <div className="cf-rcp-wrap">
        <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
          <div className="cf-face cf-rcp-front">
            <div className="cf-rcp-art" aria-hidden="true"><i className="bowl" /><i className="steam s1" /><i className="steam s2" /></div>
            <div className="cf-rcp-body">
              <span className="cf-rcp-tag">Weeknight</span>
              <h2>Miso butter pasta</h2>
              <div className="cf-rcp-facts"><span>25 min</span><span>Serves 2</span><span>One pan</span></div>
              <div className="cf-rcp-actions">
                <button type="button" className="cf-btn dark" onClick={flip.toggle}>Ingredients</button>
                <button type="button" className={cx("cf-btn", timer !== null && "timing")} onClick={() => setTimer(timer === null ? 600 : null)} aria-pressed={timer !== null}>
                  {timer === null ? "Start timer" : `◉ ${tmm}`}
                </button>
              </div>
            </div>
          </div>
          <div className="cf-face cf-rcp-back">
            <h2>Ingredients</h2>
            <ul>
              <li>180 g spaghetti</li>
              <li>2 tbsp white miso</li>
              <li>40 g butter, cold cubes</li>
              <li>1 garlic clove, grated</li>
              <li>Black pepper, lots</li>
              <li>Parmesan, to finish</li>
            </ul>
            <button type="button" className="cf-btn" onClick={flip.toggle}>Back to recipe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   08 - Revenue stat. Range chips morph the sparkline.
   ================================================================ */
const STAT_SERIES: Record<string, { pts: number[]; label: string; delta: string; up: boolean }> = {
  "1D": { pts: [12, 14, 13, 18, 17, 22, 21, 26, 25, 30], label: "$48,210", delta: "+12.4% vs yesterday", up: true },
  "1W": { pts: [20, 16, 22, 18, 26, 31, 27, 34, 30, 38], label: "$312,400", delta: "+8.1% vs last week", up: true },
  "1M": { pts: [30, 24, 18, 26, 20, 14, 22, 16, 24, 19], label: "$1.21M", delta: "-3.6% vs October", up: false },
};
export function StatCard() {
  const [range, setRange] = React.useState<keyof typeof STAT_SERIES>("1D");
  const s = STAT_SERIES[range];
  const w = 260, h = 72;
  const path = s.pts.map((p, i) => `${(i / (s.pts.length - 1)) * w},${h - (p / 38) * h}`).join(" ");
  return (
    <div className="cf-stage">
      <div className="cf-stat">
        <div className="cf-stat-head">
          <span className="cf-stat-title">Revenue</span>
          <div className="cf-stat-chips" role="group" aria-label="Range">
            {(Object.keys(STAT_SERIES) as Array<keyof typeof STAT_SERIES>).map((r) => (
              <button type="button" key={r} className={cx(r === range && "on")} aria-pressed={r === range} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
        </div>
        <strong className="cf-stat-value" key={range + "-v"}>{s.label}</strong>
        <span className={cx("cf-stat-delta", s.up ? "up" : "down")} key={range + "-d"}>{s.delta}</span>
        <svg className="cf-stat-spark" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Sparkline for ${range}`}>
          <polyline key={range} points={path} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={s.up ? "up" : "down"} />
        </svg>
        <div className="cf-stat-foot"><span>Updated 4 min ago</span><span>Stripe · live</span></div>
      </div>
    </div>
  );
}

/* ================================================================
   09 - Sticky note. Pinned to a cork strip; drag, spring wobble.
   ================================================================ */
export function StickyNote() {
  const [pinned, setPinned] = React.useState(true);
  const drag = useDrag();
  return (
    <div className="cf-stage">
      <div className="cf-sn-board">
        <i className="cf-sn-cork" aria-hidden="true" />
        <div
          className={cx("cf-sn", drag.held && "held", !pinned && "loose")}
          style={{ transform: `translate(${drag.x.toFixed(1)}px, ${drag.y.toFixed(1)}px) rotate(${(drag.rot - (pinned ? 1.5 : 4)).toFixed(2)}deg)` }}
          role="group" aria-roledescription="Draggable card" aria-label="Sticky note. Arrow keys move it, Escape returns it." tabIndex={0}
          {...drag.dragProps}
        >
          <button
            type="button"
            className={cx("cf-sn-pin", pinned && "in")}
            aria-pressed={pinned}
            aria-label={pinned ? "Unpin note" : "Pin note"}
            onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <p>Pick up the frames from the print shop — <b>matte</b>, not gloss. They close at six.</p>
          <span className="cf-sn-sig">— J</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   10 - Case file. Cover springs open, papers fan out of the folder.
   ================================================================ */
export function CaseFile() {
  const [open, setOpen] = React.useState(false);
  const p = useSpring(open ? 1 : 0, { stiffness: 130, damping: 15 });
  const papers = [
    { rot: -7, x: -26, y: -6, title: "Site survey", body: "North wall holds a full signal. The old beacon is intact behind the plaster." },
    { rot: 0, x: 0, y: -16, title: "Interview 04", body: "She remembers the bell ringing twice, then the lights along the pier going dark." },
    { rot: 7, x: 26, y: -4, title: "Tide table", body: "Low water at 04:40. The causeway is walkable for ninety minutes either side." },
  ];
  return (
    <div className="cf-stage">
      <div className={cx("cf-cf", open && "open")}>
        <div className="cf-cf-papers" aria-hidden={!open}>
          {papers.map((pp, i) => (
            <div key={pp.title} className="cf-cf-paper" style={{ transform: `translate(${(pp.x * p).toFixed(1)}px, ${(pp.y * p).toFixed(1)}px) rotate(${(pp.rot * p).toFixed(2)}deg)`, transitionDelay: `${i * 30}ms`, zIndex: i }}>
              <strong>{pp.title}</strong>
              <span>{pp.body}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="cf-cf-cover"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{ transform: `rotateX(${(-58 * p).toFixed(2)}deg)` }}
        >
          <i className="cf-cf-tab">N-041</i>
          <div className="cf-cf-cover-in">
            <span className="cf-cf-stamp">FIELD OFFICE · TIDEBREAK</span>
            <h3>Project Nightjar</h3>
            <span className="cf-cf-sub">Field notes · Oct – Dec</span>
            <span className="cf-cf-open-hint">{open ? "Close file" : "Open file"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   11 - Profile card. Follow toggle with spring pop; tilt.
   ================================================================ */
export function ProfileCard() {
  const [following, setFollowing] = React.useState(false);
  const tilt = useTilt(7, 1.012);
  return (
    <div className="cf-stage">
      <div className="cf-pr" {...tilt.handlers} style={tilt.tiltStyle}>
        <div className="cf-pr-banner" aria-hidden="true"><i /><i /><i /></div>
        <div className="cf-pr-head">
          <span className="cf-pr-avatar">MV<i className="cf-pr-dot" role="img" aria-label="Available now" /></span>
          <div>
            <strong>Mara Voss</strong>
            <span>Type designer · Porto</span>
          </div>
        </div>
        <p className="cf-pr-bio">Draws quiet grotesques and loud serifs. Currently lettering a railway archive.</p>
        <div className="cf-pr-stats">
          <span><b>128</b>typefaces</span>
          <span><b>14k</b>followers</span>
          <span><b>6</b>awards</span>
        </div>
        <div className="cf-pr-actions">
          <button type="button" className={cx("cf-btn dark cf-pop", following && "on")} aria-pressed={following} onClick={() => setFollowing((f) => !f)}>
            {following ? "Following ✓" : "Follow"}
          </button>
          <button type="button" className="cf-btn">Message</button>
        </div>
        <i className="cf-glare" style={tilt.glareStyle} />
      </div>
    </div>
  );
}

/* ================================================================
   12 - Product card. Swatches recolor, size chips, add to bag.
   ================================================================ */
const SHOE_COLORS = [
  { name: "Bone", hue: 0, bg: "#d8d2c4" },
  { name: "Moss", hue: 70, bg: "#a9b39a" },
  { name: "Ember", hue: -40, bg: "#c99b7d" },
];
export function ProductCard() {
  const [color, setColor] = React.useState(0);
  const [size, setSize] = React.useState<number | null>(null);
  const [added, setAdded] = React.useState(false);
  const pop = useSpring(added ? 1 : 0, { stiffness: 300, damping: 14 });
  const c = SHOE_COLORS[color];
  return (
    <div className="cf-stage">
      <div className="cf-pd">
        <div className="cf-pd-art" style={{ background: `linear-gradient(150deg, ${c.bg}, #efece4)` }}>
          <svg className="cf-pd-shoe" viewBox="0 0 220 120" style={{ filter: `hue-rotate(${c.hue}deg)` }} role="img" aria-label={`Court Low sneaker in ${c.name}`}>
            <path d="M22 74 C16 66 20 52 34 47 C48 42 58 40 70 30 C80 22 88 14 100 15 C112 16 116 26 128 32 C144 40 168 44 186 50 C202 55 208 64 207 74 L206 80 L24 80 Z" fill="#f4f1e9" stroke="#c6bfae" strokeWidth="2.5" />
            <path d="M70 30 C80 22 88 14 100 15 C112 16 116 26 128 32 L120 44 C108 38 100 30 92 30 C84 30 78 36 70 42 Z" fill="#e9e4d6" />
            <path d="M118 34 L138 30 M112 42 L134 37 M108 50 L130 45" stroke="#b7af9c" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M186 50 C196 54 205 61 206 70 L186 72 C184 62 180 56 172 52 Z" fill="#d9d2c0" />
            <path d="M22 74 L207 74 L206 84 C205 92 197 96 186 96 L38 96 C27 96 20 90 21 82 Z" fill="#ffffff" stroke="#c6bfae" strokeWidth="2" />
            <path d="M24 84 L205 84" stroke="#e0dacb" strokeWidth="2" strokeDasharray="6 5" />
            <path d="M196 74 L207 74 L206 84 L197 84 Z" fill="#c96a3f" />
          </svg>
          <span className="cf-pd-badge">New colorway</span>
        </div>
        <div className="cf-pd-body">
          <div className="cf-pd-title"><strong>Court Low ’86</strong><span>$128</span></div>
          <div className="cf-pd-row">
            <div className="cf-pd-swatches" role="group" aria-label="Color">
              {SHOE_COLORS.map((s, i) => (
                <button type="button" key={s.name} className={cx(i === color && "on")} style={{ background: s.bg }} aria-label={s.name} aria-pressed={i === color} onClick={() => setColor(i)} />
              ))}
            </div>
            <span className="cf-pd-colorname">{c.name}</span>
          </div>
          <div className="cf-pd-sizes" role="group" aria-label="Size, UK">
            {[7, 8, 9, 10, 11].map((n) => (
              <button type="button" key={n} className={cx(n === size && "on")} aria-pressed={n === size} onClick={() => setSize(n)}>{n}</button>
            ))}
          </div>
          <button
            type="button"
            className={cx("cf-pd-add", added && "added")}
            style={{ transform: `scale(${(1 + pop * 0.03).toFixed(3)})` }}
            onClick={() => setAdded((a) => !a)}
            aria-pressed={added}
          >
            {added ? "In your bag ✓" : size === null ? "Pick a size" : `Add to bag · $128`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   13 - Movie poster. Layered parallax tilt; watchlist toggle.
   ================================================================ */
export function MoviePoster() {
  const [saved, setSaved] = React.useState(false);
  const tilt = useTilt(12, 1.02);
  const px = tilt.lift;
  return (
    <div className="cf-stage">
      <div className="cf-mv" {...tilt.handlers}>
        <div className="cf-mv-inner" style={tilt.tiltStyle}>
          <i className="cf-mv-sky" aria-hidden="true" />
          <i className="cf-mv-sun" aria-hidden="true" style={{ transform: `translate(${(-tilt.lift * 0).toFixed(1)}px,0)` }} />
          <i className="cf-mv-ridge r1" aria-hidden="true" />
          <i className="cf-mv-ridge r2" aria-hidden="true" />
          <div className="cf-mv-title" style={{ transform: `translateZ(40px)` }}>
            <span>A film by Elin Marsh</span>
            <h3>The Long Quiet</h3>
          </div>
          <i className="cf-glare" style={tilt.glareStyle} />
        </div>
        <div className="cf-mv-meta">
          <span className="cf-mv-rating">★ 8.2</span>
          <span>2h 04m · Drama · 2025</span>
        </div>
        <button type="button" className={cx("cf-btn cf-pop cf-mv-watch", saved && "on")} aria-pressed={saved} onClick={() => setSaved((s) => !s)}>
          {saved ? "In watchlist ✓" : "+ Watchlist"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   14 - Transit pass. Flip for balance; riding decrements fare.
   ================================================================ */
export function TransitPass() {
  const flip = useFlip();
  const [balance, setBalance] = React.useState(236.5);
  const [flash, setFlash] = React.useState(false);
  const ride = () => {
    setBalance((b) => Math.max(0, b - 42.5));
    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
  };
  return (
    <div className="cf-stage">
      <div className={cx("cf-tp-wrap", flash && "flash")}>
        <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
          <div className="cf-face cf-tp-front">
            <div className="cf-tp-head"><span className="cf-tp-brand"><i />Citylink Metro</span><span>Adult</span></div>
            <span className="cf-tp-name">JAMIE LANE</span>
            <div className="cf-tp-foot"><span className="cf-tp-num">№ 0417 8823 1190</span><span className="cf-tp-chip">tap &amp; go</span></div>
          </div>
          <div className="cf-face cf-tp-back">
            <span className="cf-tp-bal-label">Balance</span>
            <strong className="cf-tp-bal">₹{balance.toFixed(2)}</strong>
            <div className="cf-tp-actions">
              <button type="button" className="cf-btn dark" onClick={ride}>Take a ride · ₹42.50</button>
            </div>
            <span className="cf-tp-small">Auto top-up on · ₹200 when below ₹100</span>
          </div>
        </div>
      </div>
      <button type="button" className="cf-btn" onClick={flip.toggle} aria-pressed={flip.flipped}>{flip.flipped ? "Show card" : "Balance"}</button>
    </div>
  );
}

/* ================================================================
   15 - Podcast episode. Play advances; chapters jump.
   ================================================================ */
const POD_CHAPTERS = [
  { t: "Cold open", at: 0 }, { t: "The map room", at: 64 }, { t: "A border that moved", at: 183 }, { t: "Fieldwork", at: 296 },
];
export function PodcastEpisode() {
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const total = 372;
  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPos((p) => (p + 1) % total), 500);
    return () => window.clearInterval(id);
  }, [playing]);
  const sprog = useSpring((pos / total) * 100, { stiffness: 200, damping: 28 });
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className="cf-stage">
      <div className="cf-pod">
        <div className="cf-pod-top">
          <span className={cx("cf-pod-art", playing && "live")} aria-hidden="true"><i /><i /><i /></span>
          <div className="cf-pod-info">
            <span className="cf-pod-show">Field Notes · #88</span>
            <strong>How maps lie</strong>
            <span className="cf-pod-sub">With cartographer Ines Duarte</span>
          </div>
          <button type="button" className={cx("cf-pod-play", playing && "on")} aria-pressed={playing} aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
            {playing ? "❚❚" : "▶"}
          </button>
        </div>
        <div className="cf-pod-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.floor(pos)} aria-label="Episode progress">
          <i style={{ width: `${sprog.toFixed(2)}%` }} />
        </div>
        <div className="cf-pod-time"><span>{fmt(pos)}</span><span>-{fmt(total - pos)}</span></div>
        <div className="cf-pod-chapters">
          {POD_CHAPTERS.map((c) => (
            <button type="button" key={c.t} className={cx(pos >= c.at && "on")} onClick={() => setPos(c.at)}>
              <span>{c.t}</span><time>{fmt(c.at)}</time>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   16 - Crypto token card. Candle chart, timeframe chips.
   ================================================================ */
const CANDLE_SETS: Record<string, number[][]> = {
  "24H": [[100, 108, 96, 104], [104, 112, 101, 110], [110, 115, 106, 108], [108, 118, 107, 116], [116, 120, 111, 113], [113, 122, 112, 121], [121, 126, 118, 124], [124, 129, 120, 127]],
  "7D": [[92, 104, 88, 99], [99, 110, 95, 107], [107, 112, 100, 103], [103, 114, 99, 112], [112, 119, 106, 109], [109, 121, 105, 118], [118, 127, 112, 124], [124, 130, 119, 127]],
  "1M": [[120, 128, 110, 114], [114, 118, 102, 106], [106, 112, 98, 101], [101, 110, 96, 108], [108, 116, 100, 104], [104, 114, 99, 112], [112, 124, 108, 121], [121, 129, 117, 127]],
};
export function CryptoToken() {
  const [tf, setTf] = React.useState<keyof typeof CANDLE_SETS>("24H");
  const [alert, setAlert] = React.useState(false);
  const candles = CANDLE_SETS[tf];
  const lo = Math.min(...candles.map((c) => c[2]));
  const hi = Math.max(...candles.map((c) => c[1]));
  const y = (v: number) => 84 - ((v - lo) / (hi - lo)) * 76 - 4;
  return (
    <div className="cf-stage">
      <div className="cf-cr">
        <div className="cf-cr-head">
          <span className="cf-cr-coin" aria-hidden="true">◎</span>
          <div className="cf-cr-name"><strong>Solana</strong><span>SOL / USD</span></div>
          <button type="button" className={cx("cf-cr-bell", alert && "on")} aria-pressed={alert} aria-label={alert ? "Price alert on" : "Set price alert"} onClick={() => setAlert((a) => !a)}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a4.2 4.2 0 0 0-4.2 4.2c0 3-.9 4-1.6 4.7-.3.3-.1.8.4.8h10.8c.5 0 .7-.5.4-.8-.7-.7-1.6-1.7-1.6-4.7A4.2 4.2 0 0 0 8 1.5Z" fill={alert ? "#f2c14e" : "none"} stroke={alert ? "#f2c14e" : "#7d8894"} strokeWidth="1.4"/><path d="M6.4 13.2a1.7 1.7 0 0 0 3.2 0" fill="none" stroke={alert ? "#f2c14e" : "#7d8894"} strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="cf-cr-price"><strong>$127.44</strong><span className="up">▲ 4.8%</span></div>
        <svg className="cf-cr-chart" viewBox="0 0 240 90" role="img" aria-label={`Candle chart, ${tf}`}>
          {candles.map((c, i) => {
            const xx = 12 + i * 29;
            const up = c[3] >= c[0];
            return (
              <g key={`${tf}-${i}`} className={up ? "up" : "down"}>
                <line x1={xx + 6} y1={y(c[1])} x2={xx + 6} y2={y(c[2])} />
                <rect x={xx} y={y(Math.max(c[0], c[3]))} width="12" height={Math.max(3, Math.abs(y(c[0]) - y(c[3])))} rx="2" />
              </g>
            );
          })}
        </svg>
        <div className="cf-cr-chips" role="group" aria-label="Timeframe">
          {(Object.keys(CANDLE_SETS) as Array<keyof typeof CANDLE_SETS>).map((k) => (
            <button type="button" key={k} className={cx(k === tf && "on")} aria-pressed={k === tf} onClick={() => setTf(k)}>{k}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   17 - Hotel booking. Night stepper reprices; tilt.
   ================================================================ */
export function HotelBooking() {
  const [nights, setNights] = React.useState(3);
  const tilt = useTilt(5, 1.01);
  const total = nights * 14200;
  return (
    <div className="cf-stage">
      <div className="cf-hb" {...tilt.handlers} style={tilt.tiltStyle}>
        <div className="cf-hb-photo" aria-hidden="true">
          <i className="cf-hb-sky" /><i className="cf-hb-roof" /><i className="cf-hb-house" /><i className="cf-hb-win w1" /><i className="cf-hb-win w2" />
          <span className="cf-hb-score">9.1 · Superb</span>
        </div>
        <div className="cf-hb-body">
          <div className="cf-hb-title"><strong>Hale House</strong><span>Gion, Kyoto · Machiya stay</span></div>
          <div className="cf-hb-dates"><span>Thu 12 Dec</span><i>→</i><span>Sun {12 + nights} Dec</span></div>
          <div className="cf-hb-row">
            <div className="cf-stepper" role="group" aria-label="Nights">
              <button type="button" aria-label="One night fewer" disabled={nights <= 1} onClick={() => setNights((n) => Math.max(1, n - 1))}>−</button>
              <span>{nights} night{nights > 1 ? "s" : ""}</span>
              <button type="button" aria-label="One night more" disabled={nights >= 7} onClick={() => setNights((n) => Math.min(7, n + 1))}>+</button>
            </div>
            <div className="cf-hb-price"><strong>₹{total.toLocaleString("en-IN")}</strong><span>incl. taxes</span></div>
          </div>
          <button type="button" className="cf-btn dark">Reserve · pay at stay</button>
        </div>
        <i className="cf-glare" style={tilt.glareStyle} />
      </div>
    </div>
  );
}

/* ================================================================
   18 - Flight status. Plane springs along the route; legs toggle.
   ================================================================ */
export function FlightStatus() {
  const [live, setLive] = React.useState(true);
  const prog = useSpring(live ? 62 : 0, { stiffness: 40, damping: 12 });
  return (
    <div className="cf-stage">
      <div className="cf-fs">
        <div className="cf-fs-head">
          <span className="cf-fs-flight">MX 418 · Meridian Air</span>
          <span className="cx cf-fs-pill ontime">On time</span>
        </div>
        <div className="cf-fs-route">
          <div><strong>BLR</strong><span>21:45</span></div>
          <div className="cf-fs-track">
            <i className="cf-fs-line" />
            <i className="cf-fs-fill" style={{ width: `${prog.toFixed(1)}%` }} />
            <i className="cf-fs-plane" style={{ left: `${prog.toFixed(1)}%` }}>✈</i>
          </div>
          <div><strong>SFO</strong><span>06:10</span></div>
        </div>
        <div className="cf-fs-grid">
          <span><label>Terminal</label>T2 → Intl</span>
          <span><label>Gate</label>C7</span>
          <span><label>Baggage</label>Belt 4</span>
          <span><label>Duration</label>16h 55m</span>
        </div>
        <button type="button" className="cf-btn" onClick={() => setLive((l) => !l)} aria-pressed={live}>
          {live ? "Replay departure" : "Back to live"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   19 - Restaurant reservation. Party stepper + slot chips.
   ================================================================ */
export function ReservationCard() {
  const [party, setParty] = React.useState(2);
  const [slot, setSlot] = React.useState<string | null>(null);
  const slots = ["19:00", "19:30", "20:15", "21:00"];
  return (
    <div className="cf-stage">
      <div className="cf-rs">
        <div className="cf-rs-head">
          <div><strong>Osteria Nove</strong><span>Handmade pasta · Indiranagar</span></div>
          <span className="cf-rs-rating">★ 4.7</span>
        </div>
        <div className="cf-rs-date"><span>Friday, 12 December</span><i aria-hidden="true" /><span>Dinner</span></div>
        <div className="cf-rs-row">
          <div className="cf-stepper" role="group" aria-label="Party size">
            <button type="button" aria-label="Fewer guests" disabled={party <= 1} onClick={() => setParty((p) => Math.max(1, p - 1))}>−</button>
            <span>{party} {party === 1 ? "guest" : "guests"}</span>
            <button type="button" aria-label="More guests" disabled={party >= 8} onClick={() => setParty((p) => Math.min(8, p + 1))}>+</button>
          </div>
        </div>
        <div className="cf-rs-slots" role="group" aria-label="Available times">
          {slots.map((s) => (
            <button type="button" key={s} className={cx(s === slot && "on")} aria-pressed={s === slot} onClick={() => setSlot(s)}>{s}</button>
          ))}
        </div>
        <button type="button" className="cf-btn dark" disabled={slot === null}>
          {slot ? `Request table · ${slot}` : "Choose a time"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   20 - Workout card. Activity rings; logging sets fills the ring.
   ================================================================ */
export function WorkoutCard() {
  const target = 12;
  const [sets, setSets] = React.useState(7);
  const ring = useSpring(sets / target, { stiffness: 90, damping: 14 });
  const C = 2 * Math.PI * 34;
  return (
    <div className="cf-stage">
      <div className="cf-wo">
        <div className="cf-wo-head"><strong>Upper body A</strong><span>Push day · 48 min</span></div>
        <div className="cf-wo-mid">
          <svg viewBox="0 0 90 90" className="cf-wo-ring" role="img" aria-label={`${sets} of ${target} sets done`}>
            <circle cx="45" cy="45" r="34" className="bg" />
            <circle cx="45" cy="45" r="34" className="fg" strokeDasharray={C} strokeDashoffset={(C * (1 - Math.min(1, ring))).toFixed(1)} />
            <text x="45" y="42" textAnchor="middle" className="n">{sets}</text>
            <text x="45" y="56" textAnchor="middle" className="d">of {target} sets</text>
          </svg>
          <ul className="cf-wo-list">
            <li><span>Bench press</span><b>4 × 8</b></li>
            <li><span>Incline DB press</span><b>3 × 10</b></li>
            <li><span>Seated row</span><b>3 × 12</b></li>
            <li><span>Face pull</span><b>2 × 15</b></li>
          </ul>
        </div>
        <button type="button" className="cf-btn dark" onClick={() => setSets((s) => (s >= target ? 0 : s + 1))}>
          {sets >= target ? "Done — restart" : "Log a set"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   21 - Book cover. Hover/focus springs the cover open.
   ================================================================ */
export function BookCover() {
  const [open, setOpen] = React.useState(false);
  const p = useSpring(open ? 1 : 0, { stiffness: 150, damping: 16 });
  return (
    <div className="cf-stage">
      <div
        className="cf-bk"
        role="button" tabIndex={0}
        aria-expanded={open}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}
      >
        <div className="cf-bk-page">
          <p>Chapter One</p>
          <span>The road began where the sea gave up. Mara counted forty salt pans before the hills, each one a mirror holding a square of sky.</span>
        </div>
        <div className="cf-bk-cover" style={{ transform: `rotateY(${(-132 * p).toFixed(2)}deg)` }}>
          <span className="cf-bk-author">Amara Osei</span>
          <h3>The Salt<br />Road</h3>
          <i className="cf-bk-band" aria-hidden="true" />
          <span className="cf-bk-quote">“A quiet marvel.” — The Meridian Ledger</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   22 - News article. Broadsheet card; save + reading time.
   ================================================================ */
export function NewsArticle() {
  const [saved, setSaved] = React.useState(false);
  return (
    <div className="cf-stage">
      <article className="cf-nw">
        <header>
          <span className="cf-nw-paper">The Meridian Ledger</span>
          <span className="cf-nw-date">Saturday 7 December · City</span>
        </header>
        <h3>The night ferry gets its old bell back</h3>
        <p className="cf-nw-standfirst">After forty years in a harbourmaster&rsquo;s shed, the bronze bell of the <em>Melusine</em> was hoisted home on Thursday, and rung twice for the evening crossing.</p>
        <div className="cf-nw-foot">
          <span>By Priya Nair · 4 min read</span>
          <button type="button" className={cx("cf-nw-save", saved && "on")} aria-pressed={saved} onClick={() => setSaved((s) => !s)}>
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </article>
    </div>
  );
}

/* ================================================================
   23 - Package tracker. Courier dot springs along the stops.
   ================================================================ */
const PKG_STOPS = [
  { t: "Label created", d: "Portland, OR · Tue", done: true },
  { t: "Left origin depot", d: "Portland, OR · Wed", done: true },
  { t: "Arrived at hub", d: "Memphis, TN · Thu", done: true },
  { t: "Out for delivery", d: "Bengaluru · Today, 08:12", done: true },
  { t: "Delivered", d: "Expected by 13:00", done: false },
];
export function PackageTracker() {
  const [notify, setNotify] = React.useState(true);
  const done = PKG_STOPS.filter((s) => s.done).length;
  const prog = useSpring(((done - 1) / (PKG_STOPS.length - 1)) * 100, { stiffness: 110, damping: 18 });
  return (
    <div className="cf-stage">
      <div className="cf-pk">
        <div className="cf-pk-head">
          <div><strong>Parcel from Portland</strong><span>№ 1Z-8842-09 · BlueDart</span></div>
          <span className="cf-pk-pill">Out for delivery</span>
        </div>
        <ol className="cf-pk-line">
          <i className="cf-pk-rail" aria-hidden="true" />
          <i className="cf-pk-railfill" aria-hidden="true" style={{ height: `${prog.toFixed(1)}%` }} />
          {PKG_STOPS.map((s) => (
            <li key={s.t} className={cx(s.done && "done")}>
              <i />
              <div><strong>{s.t}</strong><span>{s.d}</span></div>
            </li>
          ))}
        </ol>
        <label className="cf-pk-notify">
          <button type="button" role="switch" aria-checked={notify} className={cx("cf-switch", notify && "on")} onClick={() => setNotify((n) => !n)}><i /></button>
          Text me when it&rsquo;s outside
        </label>
      </div>
    </div>
  );
}

/* ================================================================
   24 - Job posting. Bookmark toggle; apply button state.
   ================================================================ */
export function JobPosting() {
  const [saved, setSaved] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  return (
    <div className="cf-stage">
      <div className="cf-jb">
        <div className="cf-jb-head">
          <span className="cf-jb-logo">F</span>
          <div><strong>Senior Product Designer</strong><span>Fieldnote · Remote, IST overlap</span></div>
          <button type="button" className={cx("cf-jb-bm", saved && "on")} aria-pressed={saved} aria-label={saved ? "Remove bookmark" : "Bookmark this role"} onClick={() => setSaved((s) => !s)}>
            {saved ? "★" : "☆"}
          </button>
        </div>
        <div className="cf-jb-tags"><span>Design systems</span><span>Prototyping</span><span>₹38–46L</span></div>
        <p className="cf-jb-blurb">Own the component language behind a field-research tool used by 400 teams. Small team, long memory.</p>
        <div className="cf-jb-foot">
          <span>Posted 3 days ago · 41 applicants</span>
          <button type="button" className={cx("cf-btn dark", applied && "done")} disabled={applied} onClick={() => setApplied(true)}>
            {applied ? "Applied ✓" : "Easy apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   25 - Launch countdown. Flip-clock digits on springs.
   ================================================================ */
function FlipDigit({ value, label }: { value: string; label: string }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="cf-cd-cell">
      <div className={cx("cf-cd-flap", !reduced && "anim")} key={value}>
        <span>{value}</span>
      </div>
      <label>{label}</label>
    </div>
  );
}
export function CountdownCard() {
  const [secs, setSecs] = React.useState(2 * 86400 + 14 * 3600 + 9 * 60 + 41);
  React.useEffect(() => {
    const id = window.setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cf-stage">
      <div className="cf-cd">
        <span className="cf-cd-title">Nightjar 1.0 launches in</span>
        <div className="cf-cd-grid" role="timer" aria-label={`${d} days, ${h} hours, ${m} minutes, ${s} seconds`}>
          <FlipDigit value={pad(d)} label="days" />
          <FlipDigit value={pad(h)} label="hrs" />
          <FlipDigit value={pad(m)} label="min" />
          <FlipDigit value={pad(s)} label="sec" />
        </div>
        <span className="cf-cd-sub">Tuesday, 10 December · 09:00 IST</span>
      </div>
    </div>
  );
}

/* ================================================================
   26 - Course card. Progress ring; modules accordion.
   ================================================================ */
const COURSE_MODS = [
  { t: "Anatomy of a letterform", len: "38 min", done: true },
  { t: "Spacing is the voice", len: "44 min", done: true },
  { t: "Drawing contrast", len: "51 min", done: false },
  { t: "From sketch to beziers", len: "47 min", done: false },
];
export function CourseCard() {
  const [open, setOpen] = React.useState(false);
  const done = COURSE_MODS.filter((m) => m.done).length;
  const p = useSpring(done / COURSE_MODS.length, { stiffness: 100, damping: 16 });
  const C = 2 * Math.PI * 26;
  return (
    <div className="cf-stage">
      <div className="cf-co">
        <div className="cf-co-top">
          <svg viewBox="0 0 64 64" className="cf-co-ring" role="img" aria-label={`${done} of ${COURSE_MODS.length} modules complete`}>
            <circle cx="32" cy="32" r="26" className="bg" />
            <circle cx="32" cy="32" r="26" className="fg" strokeDasharray={C} strokeDashoffset={(C * (1 - p)).toFixed(1)} />
            <text x="32" y="37" textAnchor="middle">{Math.round(done / COURSE_MODS.length * 100)}%</text>
          </svg>
          <div>
            <span className="cf-co-kicker">Type design</span>
            <strong>Fundamentals of the Latin skeleton</strong>
            <span className="cf-co-sub">With Mara Voss · 12 modules</span>
          </div>
        </div>
        <button type="button" className="cf-co-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Hide modules ▴" : "Show modules ▾"}
        </button>
        <div className="cf-co-mods" hidden={!open}>
          {COURSE_MODS.map((m, i) => (
            <div key={m.t} className={cx("cf-co-mod", m.done && "done")}>
              <i>{m.done ? "✓" : i + 1}</i>
              <span>{m.t}</span>
              <time>{m.len}</time>
            </div>
          ))}
        </div>
        <button type="button" className="cf-btn dark">Resume · Drawing contrast</button>
      </div>
    </div>
  );
}

/* ================================================================
   27 - Postcard. Flip between scene and handwritten note.
   ================================================================ */
export function Postcard() {
  const flip = useFlip();
  return (
    <div className="cf-stage">
      <div className="cf-po">
        <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
          <div className="cf-face cf-po-front">
            <div className="cf-po-scene" aria-hidden="true">
              <i className="sun" /><i className="temple t1" /><i className="temple t2" /><i className="palms" />
              <span className="cf-po-caption">HAMPI · golden hour</span>
            </div>
          </div>
          <div className="cf-face cf-po-back">
            <div className="cf-po-msg">
              <p>The boulders here look stacked by giants. Cycled the river road at six, mist on the water. Wish you&rsquo;d come.</p>
              <span>— Jamie</span>
            </div>
            <div className="cf-po-right">
              <span className="cf-po-stamp"><i>₹25</i></span>
              <span className="cf-po-mark" aria-hidden="true">HAMPI GPO<br />07 DEC</span>
              <address>Asha Rao<br />14 Fig Tree Lane<br />Alvito 601302</address>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="cf-btn" onClick={flip.toggle} aria-pressed={flip.flipped}>{flip.flipped ? "See the view" : "Read the note"}</button>
    </div>
  );
}

/* ================================================================
   28 - Trading card. Holo foil follows tilt; deck fans behind.
   ================================================================ */
export function TradingCard() {
  const [binder, setBinder] = React.useState(false);
  const [fan, setFan] = React.useState(false);
  const tilt = useTilt(13, 1.03);
  const fanP = useSpring(fan ? 1 : 0, { stiffness: 140, damping: 14 });
  return (
    <div className="cf-stage">
      <div className="cf-tc-scene"
        onPointerEnter={() => setFan(true)}
        onPointerLeave={() => setFan(false)}
      >
        {[2, 1].map((n) => (
          <i key={n} className="cf-tc-back" aria-hidden="true" style={{ transform: `rotate(${(-6 * n * fanP).toFixed(2)}deg) translate(${(-10 * n * fanP).toFixed(1)}px, ${(4 * n * fanP).toFixed(1)}px)` }} />
        ))}
        <div className="cf-tc" {...tilt.handlers}>
          <div className="cf-tc-inner" style={tilt.tiltStyle}>
            <i className="cf-tc-foil" style={tilt.glareStyle} />
            <header><span>Harbour City · #24</span><b>ROOKIE</b></header>
            <div className="cf-tc-photo" aria-hidden="true">
              <i className="cf-tc-bgnum">24</i>
              <svg width="86" height="112" viewBox="0 0 86 112" style={{ position: "relative" }}>
                <rect x="38" y="26" width="10" height="10" fill="#e8c9a8" />
                <circle cx="43" cy="19" r="12" fill="#e8c9a8" />
                <path d="M43 32 C49 32 54 34 58 38 L73 46 C76 48 78 51 77 55 L72 72 C71 75 68 77 65 76 L60 74 L60 105 C60 108 58 110 55 110 L31 110 C28 110 26 108 26 105 L26 74 L21 76 C18 77 15 75 14 72 L9 55 C8 51 10 48 13 46 L28 38 C32 34 37 32 43 32 Z" fill="#c9302c" />
                <path d="M26 50 L60 50 L60 57 L26 57 Z" fill="#a32623" />
                <text x="43" y="94" textAnchor="middle" fontFamily="ui-monospace,Menlo,monospace" fontWeight="800" fontSize="24" fill="#f5f2ea">24</text>
              </svg>
            </div>
            <strong className="cf-tc-name">Kai Tanaka</strong>
            <div className="cf-tc-stats"><span>PAC 91</span><span>SHO 84</span><span>DEF 62</span></div>
          </div>
        </div>
      </div>
      <button type="button" className={cx("cf-btn", binder && "on")} aria-pressed={binder} onClick={() => setBinder((b) => !b)}>
        {binder ? "In binder ✓" : "Add to binder"}
      </button>
    </div>
  );
}

/* ================================================================
   29 - Invoice card. Line items expand; mark as paid.
   ================================================================ */
export function InvoiceCard() {
  const [open, setOpen] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const h = useSpring(open ? 1 : 0, { stiffness: 160, damping: 20 });
  return (
    <div className="cf-stage">
      <div className={cx("cf-in", paid && "paid")}>
        <div className="cf-in-head">
          <div><strong>INV-2041</strong><span>North Studio → Lane Workshop</span></div>
          <span className={cx("cf-in-pill", paid ? "paid" : "due")}>{paid ? "Paid" : "Due 14 Dec"}</span>
        </div>
        <div className="cf-in-amount"><span>Amount due</span><strong>$4,860.00</strong></div>
        <button type="button" className="cf-in-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Hide line items ▴" : "3 line items ▾"}
        </button>
        <div className="cf-in-lines" style={{ maxHeight: `${(h * 190).toFixed(0)}px`, opacity: Math.min(1, h * 1.4) }}>
          <div><span>Identity refresh, phase two</span><b>$2,800</b></div>
          <div><span>Print artwork, 6 plates</span><b>$1,460</b></div>
          <div><span>Type licence, retail</span><b>$600</b></div>
        </div>
        <button type="button" className={cx("cf-btn dark", paid && "done")} onClick={() => setPaid((p) => !p)} aria-pressed={paid}>
          {paid ? "Marked paid ✓" : "Mark as paid"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   30 - Membership card. Flip to the check-in code.
   ================================================================ */
export function MembershipCard() {
  const flip = useFlip();
  const tilt = useTilt(6, 1.01);
  return (
    <div className="cf-stage">
      <div className="cf-mm-wrap" {...tilt.handlers}>
        <div className="cf-mm" style={tilt.tiltStyle}>
          <div className="cf-flip" style={{ transform: `rotateY(${flip.ry.toFixed(2)}deg)` }}>
            <div className="cf-face cf-mm-front">
              <div className="cf-mm-head"><span className="cf-mm-brand">Foundry Athletic Club</span><span className="cf-mm-tier">Iron tier</span></div>
              <span className="cf-mm-name">Jamie Lane</span>
              <div className="cf-mm-foot"><span>Member since 2021</span><span>№ 00841</span></div>
            </div>
            <div className="cf-face cf-mm-back">
              <QrCode seed={841} size={92} dark="#efe6d4" light="#33302a" />
              <span className="cf-mm-scan">Scan at the desk</span>
            </div>
          </div>
          <i className="cf-glare" style={tilt.glareStyle} />
        </div>
      </div>
      <button type="button" className="cf-btn" onClick={flip.toggle} aria-pressed={flip.flipped}>{flip.flipped ? "Show card" : "Check in"}</button>
    </div>
  );
}

/* ---------------- registry ---------------- */

export const CARD_FAMILY: Array<{ name: string; label: string; wide?: boolean; Component: React.ComponentType }> = [
  { name: "BoardingPass", label: "Boarding pass", Component: BoardingPass, wide: true },
  { name: "VinylRecord", label: "Vinyl record", Component: VinylRecord },
  { name: "MatchTicket", label: "Match ticket", Component: MatchTicket, wide: true },
  { name: "ThermalReceipt", label: "Thermal receipt", Component: ThermalReceipt },
  { name: "PaymentCard", label: "Payment card", Component: PaymentCard },
  { name: "WeatherTile", label: "Weather tile", Component: WeatherTile },
  { name: "RecipeCard", label: "Recipe", Component: RecipeCard },
  { name: "StatCard", label: "Revenue stat", Component: StatCard },
  { name: "StickyNote", label: "Sticky note", Component: StickyNote },
  { name: "CaseFile", label: "Case file", Component: CaseFile },
  { name: "ProfileCard", label: "Profile", Component: ProfileCard },
  { name: "ProductCard", label: "Product", Component: ProductCard },
  { name: "MoviePoster", label: "Movie poster", Component: MoviePoster },
  { name: "TransitPass", label: "Transit pass", Component: TransitPass },
  { name: "PodcastEpisode", label: "Podcast episode", Component: PodcastEpisode, wide: true },
  { name: "CryptoToken", label: "Token chart", Component: CryptoToken },
  { name: "HotelBooking", label: "Hotel booking", Component: HotelBooking },
  { name: "FlightStatus", label: "Flight status", Component: FlightStatus, wide: true },
  { name: "ReservationCard", label: "Reservation", Component: ReservationCard },
  { name: "WorkoutCard", label: "Workout", Component: WorkoutCard },
  { name: "BookCover", label: "Book cover", Component: BookCover },
  { name: "NewsArticle", label: "News article", Component: NewsArticle },
  { name: "PackageTracker", label: "Package tracker", Component: PackageTracker },
  { name: "JobPosting", label: "Job posting", Component: JobPosting },
  { name: "CountdownCard", label: "Countdown", Component: CountdownCard },
  { name: "CourseCard", label: "Course", Component: CourseCard },
  { name: "Postcard", label: "Postcard", Component: Postcard },
  { name: "TradingCard", label: "Trading card", Component: TradingCard },
  { name: "InvoiceCard", label: "Invoice", Component: InvoiceCard },
  { name: "MembershipCard", label: "Membership", Component: MembershipCard },
];
