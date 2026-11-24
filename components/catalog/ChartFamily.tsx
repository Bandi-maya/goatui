"use client";

import React, { useEffect, useId, useState } from "react";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Damped-spring number: springs from 0 to target on mount / target change. */
function useSpringNumber(target: number, stiffness = 110, damping = 18) {
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    let x = 0;
    let v = 0;
    const dt = 1 / 60;
    // Fixed-timestep damped spring. setInterval (not rAF) keeps the motion
    // running even when frames are throttled (occluded tabs, headless).
    const timer = setInterval(() => {
      const f = -stiffness * (x - target) - damping * v;
      v += f * dt;
      x += v * dt;
      if (Math.abs(x - target) < 0.4 && Math.abs(v) < 0.4) {
        setVal(target);
        clearInterval(timer);
        return;
      }
      setVal(x);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, stiffness, damping, reduced]);
  return val;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a1);
  const e = polar(cx, cy, r, a0);
  const large = a1 - a0 <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

function donutSeg(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number
) {
  const p1 = polar(cx, cy, rOuter, a0);
  const p2 = polar(cx, cy, rOuter, a1);
  const p3 = polar(cx, cy, rInner, a1);
  const p4 = polar(cx, cy, rInner, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

function pointsToPath(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

function seriesPoints(
  data: number[],
  w: number,
  h: number,
  pad = 4
): { x: number; y: number }[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((d - min) / span) * (h - pad * 2),
  }));
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function ChartCard({
  title,
  sub,
  index = 0,
  children,
  className = "",
}: {
  title: string;
  sub?: string;
  index?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`gf-card ${className}`}
      style={{ ["--gf-i" as string]: index }}
      aria-label={title}
    >
      <header className="gf-card-head">
        <h3 className="gf-card-title">{title}</h3>
        {sub ? <p className="gf-card-sub">{sub}</p> : null}
      </header>
      <div className="gf-card-body">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 1. StatDeltaCard — KPI with delta chip over a backdrop sparkline    */
/* ------------------------------------------------------------------ */
export function StatDeltaCard() {
  const data = [12, 18, 14, 22, 19, 28, 24, 32, 30, 38, 35, 44];
  const pts = seriesPoints(data, 260, 72);
  return (
    <ChartCard title="Monthly recurring revenue" sub="vs previous period" index={0}>
      <div className="gf-statdelta">
        <div className="gf-statdelta-top">
          <span className="gf-stat-num">$48.2k</span>
          <span className="gf-delta gf-delta-up" aria-label="Up 12.4 percent">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M5 1 9 7H1Z" fill="currentColor" />
            </svg>
            12.4%
          </span>
        </div>
        <svg className="gf-spark-bg" viewBox="0 0 260 72" role="img" aria-label="Twelve month revenue trend rising">
          <path d={`${pointsToPath(pts)} L 260 72 L 0 72 Z`} className="gf-spark-bg-fill" />
          <path d={pointsToPath(pts)} className="gf-spark-bg-line" />
        </svg>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 2. SparklineGradient — compact gradient sparkline with pulsing tip  */
/* ------------------------------------------------------------------ */
export function SparklineGradient() {
  const gid = useId();
  const data = [4, 6, 5, 9, 8, 12, 10, 14, 13, 17, 16, 21];
  const pts = seriesPoints(data, 240, 56, 6);
  const last = pts[pts.length - 1];
  return (
    <ChartCard title="Active sessions" sub="live, last 12 hours" index={1}>
      <div className="gf-sparkgrad">
        <svg viewBox="0 0 240 56" role="img" aria-label="Sessions trend rising to 21 thousand">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gf-accent)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--gf-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pointsToPath(pts)} L ${last.x} 56 L ${pts[0].x} 56 Z`} fill={`url(#${gid})`} />
          <path d={pointsToPath(pts)} className="gf-draw-line" pathLength={1} />
          <circle cx={last.x} cy={last.y} r="3.5" className="gf-tip-dot" />
          <circle cx={last.x} cy={last.y} r="3.5" className="gf-tip-halo" />
        </svg>
        <div className="gf-sparkgrad-row">
          <span className="gf-stat-num-sm">21,408</span>
          <span className="gf-muted">+8.1% WoW</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 3. RoundedBars — vertical bars with rounded caps, hover spring grow */
/* ------------------------------------------------------------------ */
export function RoundedBars() {
  const data = [34, 52, 41, 66, 58, 74, 88];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const [hot, setHot] = useState<number | null>(null);
  return (
    <ChartCard title="Weekly orders" sub="hover a bar" index={2}>
      <div className="gf-vbars" role="list" aria-label="Orders per weekday">
        {data.map((d, i) => (
          <button
            key={i}
            type="button"
            role="listitem"
            className="gf-vbar-col"
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            aria-label={`${labels[i]}: ${d} orders`}
          >
            <span className={`gf-vbar-val ${hot === i ? "on" : ""}`}>{d}</span>
            <span
              className={`gf-vbar ${hot === i ? "hot" : ""}`}
              style={{ ["--gf-h" as string]: `${d}%`, ["--gf-d" as string]: `${i * 55}ms` }}
            />
            <span className="gf-vbar-lab">{labels[i]}</span>
          </button>
        ))}
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 4. GradientHBars — horizontal gradient bars, staggered fill         */
/* ------------------------------------------------------------------ */
export function GradientHBars() {
  const rows = [
    { k: "Search", v: 82, c: "var(--gf-accent)" },
    { k: "Social", v: 61, c: "#f472b6" },
    { k: "Email", v: 47, c: "#fbbf24" },
    { k: "Direct", v: 33, c: "#34d399" },
  ];
  return (
    <ChartCard title="Traffic sources" sub="share of sessions" index={3}>
      <div className="gf-hbars">
        {rows.map((r, i) => (
          <div className="gf-hbar-row" key={r.k}>
            <span className="gf-hbar-k">{r.k}</span>
            <span className="gf-hbar-track" role="img" aria-label={`${r.k} ${r.v} percent`}>
              <span
                className="gf-hbar-fill"
                style={{
                  ["--gf-w" as string]: `${r.v}%`,
                  ["--gf-d" as string]: `${i * 90}ms`,
                  background: `linear-gradient(90deg, ${r.c}, color-mix(in srgb, ${r.c} 55%, white))`,
                }}
              />
            </span>
            <span className="gf-hbar-v">{r.v}%</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 5. DonutCenter — sweep-in donut with total in the middle            */
/* ------------------------------------------------------------------ */
export function DonutCenter() {
  const parts = [
    { k: "Starter", v: 38, c: "#818cf8" },
    { k: "Pro", v: 34, c: "#38bdf8" },
    { k: "Scale", v: 28, c: "#a78bfa" },
  ];
  const total = parts.reduce((a, b) => a + b.v, 0);
  const R = 54;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <ChartCard title="Plan mix" sub="active subscriptions" index={4}>
      <div className="gf-donut-wrap">
        <svg viewBox="0 0 140 140" className="gf-donut" role="img" aria-label="Plan mix donut: Starter 38, Pro 34, Scale 28">
          <circle cx="70" cy="70" r={R} className="gf-donut-track" />
          {parts.map((p) => {
            const frac = p.v / total;
            const off = acc;
            acc += frac;
            return (
              <circle
                key={p.k}
                cx="70"
                cy="70"
                r={R}
                className="gf-donut-seg"
                stroke={p.c}
                strokeDasharray={`${frac * C} ${C}`}
                strokeDashoffset={-off * C + C / 4}
                pathLength={C}
              />
            );
          })}
        </svg>
        <div className="gf-donut-center">
          <span className="gf-stat-num-sm">{fmt(total * 124)}</span>
          <span className="gf-muted">subs</span>
        </div>
      </div>
      <ul className="gf-legend">
        {parts.map((p) => (
          <li key={p.k}>
            <i style={{ background: p.c }} />
            {p.k}
            <b>{p.v}%</b>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 6. SegmentedDonut — gapped segments that spring outward on hover    */
/* ------------------------------------------------------------------ */
export function SegmentedDonut() {
  const parts = [
    { k: "Design", v: 30, c: "#f472b6" },
    { k: "Eng", v: 42, c: "#818cf8" },
    { k: "Ops", v: 16, c: "#34d399" },
    { k: "G&A", v: 12, c: "#fbbf24" },
  ];
  const total = parts.reduce((a, b) => a + b.v, 0);
  const [hot, setHot] = useState<number | null>(null);
  const GAP = 3;
  let acc = 0;
  return (
    <ChartCard title="Headcount by team" sub="hover a segment" index={5}>
      <div className="gf-donut-wrap">
        <svg viewBox="0 0 140 140" className="gf-donut" role="img" aria-label="Team share donut">
          {parts.map((p, i) => {
            const span = (p.v / total) * 360;
            const a0 = acc + GAP / 2;
            const a1 = acc + span - GAP / 2;
            const mid = acc + span / 2;
            acc += span;
            const out = hot === i ? 6 : 0;
            return (
              <path
                key={p.k}
                d={donutSeg(70, 70, 58, 38, a0, a1)}
                fill={p.c}
                className="gf-seg"
                style={{ transform: `translate(${polar(0, 0, out, mid).x}px, ${polar(0, 0, out, mid).y}px)` }}
              >
                <title>{`${p.k}: ${p.v}%`}</title>
              </path>
            );
          })}
        </svg>
        <div className="gf-donut-center">
          <span className="gf-stat-num-sm">{hot === null ? fmt(total * 3) : `${parts[hot].v}%`}</span>
          <span className="gf-muted">{hot === null ? "people" : parts[hot].k}</span>
        </div>
      </div>
      <div className="gf-seg-keys">
        {parts.map((p, i) => (
          <button
            key={p.k}
            type="button"
            className={`gf-chip ${hot === i ? "on" : ""}`}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
          >
            <i style={{ background: p.c }} />
            {p.k}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 7. RadialProgress — 240-degree arc gauge, spring count-up           */
/* ------------------------------------------------------------------ */
export function RadialProgress() {
  const pct = 76;
  const shown = useSpringNumber(pct);
  const R = 52;
  const A0 = -120;
  const A1 = 120;
  const span = A1 - A0;
  return (
    <ChartCard title="Storage used" sub="of 256 GB plan" index={6}>
      <div className="gf-gauge-wrap">
        <svg viewBox="0 0 140 120" role="img" aria-label={`Storage ${pct} percent used`}>
          <path d={arcPath(70, 66, R, A0, A1)} className="gf-gauge-track" />
          <path
            d={arcPath(70, 66, R, A0, A0 + (span * shown) / 100)}
            className="gf-gauge-fill"
          />
          {[0, 25, 50, 75, 100].map((t) => {
            const a = A0 + (span * t) / 100;
            const p1 = polar(70, 66, R + 10, a);
            const p2 = polar(70, 66, R + 14, a);
            return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="gf-gauge-tick" />;
          })}
        </svg>
        <div className="gf-gauge-num">
          <span className="gf-stat-num">{fmt(shown)}%</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 8. SemicircleGauge — needle gauge with colored zones                */
/* ------------------------------------------------------------------ */
export function SemicircleGauge() {
  const score = 68;
  const v = useSpringNumber(score);
  const ang = -90 + (v / 100) * 180;
  const tip = polar(70, 78, 38, ang + 90);
  return (
    <ChartCard title="Performance score" sub="Lighthouse, mobile" index={7}>
      <div className="gf-gauge-wrap">
        <svg viewBox="0 0 140 88" role="img" aria-label={`Performance score ${score} of 100`}>
          <path d={arcPath(70, 78, 52, -90, -30)} stroke="#f87171" className="gf-zone" />
          <path d={arcPath(70, 78, 52, -30, 30)} stroke="#fbbf24" className="gf-zone" />
          <path d={arcPath(70, 78, 52, 30, 90)} stroke="#34d399" className="gf-zone" />
          <line x1="70" y1="78" x2={tip.x} y2={tip.y} className="gf-needle" />
          <circle cx="70" cy="78" r="5" className="gf-needle-hub" />
        </svg>
        <div className="gf-gauge-num low">
          <span className="gf-stat-num-sm">{fmt(v)}</span>
          <span className="gf-muted">/ 100</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 9. HeatmapGrid — contribution-style calendar heatmap                */
/* ------------------------------------------------------------------ */
export function HeatmapGrid() {
  const weeks = 15;
  const days = 7;
  const cells: number[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < weeks * days; i++) {
    const wave = Math.sin(i / 9) * 0.5 + 0.5;
    cells.push(Math.round(Math.min(4, Math.floor(rand() * 3 + wave * 2.4))));
  }
  return (
    <ChartCard title="Commit activity" sub="last 15 weeks" index={8}>
      <div className="gf-heat" role="img" aria-label="Commit activity heatmap, most active mid-week">
        {Array.from({ length: weeks }).map((_, w) => (
          <div className="gf-heat-col" key={w}>
            {Array.from({ length: days }).map((_, d) => {
              const lvl = cells[w * days + d];
              return (
                <span
                  key={d}
                  className={`gf-heat-cell l${lvl}`}
                  style={{ ["--gf-d" as string]: `${(w * days + d) * 8}ms` }}
                >
                  <title>{`${lvl * 3} commits`}</title>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="gf-heat-key">
        <span className="gf-muted">Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`gf-heat-cell l${l}`} />
        ))}
        <span className="gf-muted">More</span>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 10. AreaLineChart — drawn line + area with hover crosshair          */
/* ------------------------------------------------------------------ */
export function AreaLineChart() {
  const gid = useId();
  const data = [22, 30, 26, 40, 36, 52, 48, 60, 57, 70, 66, 82];
  const W = 260;
  const H = 96;
  const pts = seriesPoints(data, W, H, 8);
  const [hot, setHot] = useState<number | null>(null);
  return (
    <ChartCard title="Revenue trend" sub="trailing 12 months" index={9}>
      <div className="gf-area">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Revenue rising across 12 months"
          onMouseLeave={() => setHot(null)}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gf-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--gf-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="8" x2={W - 8} y1={H * f} y2={H * f} className="gf-grid-line" />
          ))}
          <path d={`${pointsToPath(pts)} L ${W - 8} ${H} L 8 ${H} Z`} fill={`url(#${gid})`} className="gf-fade-in" />
          <path d={pointsToPath(pts)} className="gf-draw-line" pathLength={1} />
          {pts.map((p, i) => (
            <rect
              key={i}
              x={p.x - W / pts.length / 2}
              y={0}
              width={W / pts.length}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHot(i)}
            />
          ))}
          {hot !== null && (
            <g className="gf-cross">
              <line x1={pts[hot].x} x2={pts[hot].x} y1={0} y2={H} className="gf-cross-line" />
              <circle cx={pts[hot].x} cy={pts[hot].y} r="4" className="gf-cross-dot" />
              <text x={pts[hot].x} y={Math.max(10, pts[hot].y - 10)} className="gf-cross-text" textAnchor="middle">
                {data[hot]}k
              </text>
            </g>
          )}
        </svg>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 11. StackedBars — stacked columns with legend                        */
/* ------------------------------------------------------------------ */
export function StackedBars() {
  const rows = [
    { k: "Q1", a: 24, b: 18, c: 10 },
    { k: "Q2", a: 30, b: 22, c: 14 },
    { k: "Q3", a: 26, b: 28, c: 18 },
    { k: "Q4", a: 38, b: 30, c: 22 },
  ];
  const max = Math.max(...rows.map((r) => r.a + r.b + r.c));
  const seg = (v: number, color: string, d: number, roundTop: boolean) => (
    <span
      className={`gf-stack-seg ${roundTop ? "top" : ""}`}
      style={{ ["--gf-h" as string]: `${(v / max) * 100}%`, ["--gf-d" as string]: `${d}ms`, background: color }}
    />
  );
  return (
    <ChartCard title="Revenue by line" sub="per quarter, $k" index={10}>
      <div className="gf-stacks" role="img" aria-label="Stacked quarterly revenue, growing each quarter">
        {rows.map((r, i) => (
          <div className="gf-stack-col" key={r.k}>
            <div className="gf-stack-bars">
              {seg(r.c, "#a78bfa", i * 90 + 180, true)}
              {seg(r.b, "#38bdf8", i * 90 + 90, false)}
              {seg(r.a, "#818cf8", i * 90, false)}
            </div>
            <span className="gf-vbar-lab">{r.k}</span>
          </div>
        ))}
      </div>
      <ul className="gf-legend">
        <li><i style={{ background: "#818cf8" }} />Product</li>
        <li><i style={{ background: "#38bdf8" }} />Services</li>
        <li><i style={{ background: "#a78bfa" }} />Other</li>
      </ul>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 12. ActivityRings — three concentric progress rings                 */
/* ------------------------------------------------------------------ */
export function ActivityRings() {
  const rings = [
    { k: "Move", v: 84, c: "#f472b6", r: 50 },
    { k: "Exercise", v: 62, c: "#a3e635", r: 38 },
    { k: "Stand", v: 90, c: "#38bdf8", r: 26 },
  ];
  const v1 = useSpringNumber(rings[0].v);
  const v2 = useSpringNumber(rings[1].v);
  const v3 = useSpringNumber(rings[2].v);
  const vs = [v1, v2, v3];
  return (
    <ChartCard title="Daily goals" sub="close your rings" index={11}>
      <div className="gf-rings-wrap">
        <svg viewBox="0 0 130 130" role="img" aria-label="Move 84, exercise 62, stand 90 percent">
          {rings.map((g, i) => {
            const C = 2 * Math.PI * g.r;
            return (
              <g key={g.k}>
                <circle cx="65" cy="65" r={g.r} className="gf-ring-track" stroke={g.c} />
                <circle
                  cx="65"
                  cy="65"
                  r={g.r}
                  className="gf-ring-fill"
                  stroke={g.c}
                  strokeDasharray={`${(vs[i] / 100) * C} ${C}`}
                  transform="rotate(-90 65 65)"
                />
              </g>
            );
          })}
        </svg>
        <ul className="gf-legend col">
          {rings.map((g, i) => (
            <li key={g.k}>
              <i style={{ background: g.c }} />
              {g.k}
              <b>{fmt(vs[i])}%</b>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 13. BulletChart — actual vs target over qualitative bands           */
/* ------------------------------------------------------------------ */
export function BulletChart() {
  const bands = [100, 80, 55];
  const actual = 68;
  const target = 75;
  return (
    <ChartCard title="Quota attainment" sub="sales, this quarter" index={12}>
      <div className="gf-bullet" role="img" aria-label={`Actual 68, target 75, on a 0 to 100 scale`}>
        <div className="gf-bullet-track">
          {bands.map((b, i) => (
            <span key={b} className={`gf-bullet-band b${i}`} style={{ width: `${b}%` }} />
          ))}
          <span className="gf-bullet-actual" style={{ ["--gf-w" as string]: `${actual}%` }} />
          <span className="gf-bullet-target" style={{ left: `${target}%` }}>
            <title>{`Target ${target}`}</title>
          </span>
        </div>
        <div className="gf-bullet-scale">
          {[0, 25, 50, 75, 100].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <p className="gf-muted center">
          <b className="gf-strong">{actual}</b> vs target <b className="gf-strong">{target}</b>
        </p>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 14. SparkBarMini — stat row with inline micro bars                  */
/* ------------------------------------------------------------------ */
export function SparkBarMini() {
  const rows = [
    { k: "Signups", v: "1,204", d: [3, 5, 4, 7, 6, 9, 8] },
    { k: "Trials", v: "862", d: [4, 3, 6, 5, 8, 7, 9] },
    { k: "Churn", v: "1.9%", d: [8, 7, 6, 7, 5, 4, 3] },
  ];
  return (
    <ChartCard title="Funnel health" sub="last 7 days" index={13}>
      <div className="gf-sparkbars">
        {rows.map((r, ri) => (
          <div className="gf-sparkbar-row" key={r.k}>
            <span className="gf-sparkbar-k">{r.k}</span>
            <span className="gf-sparkbar-vals" role="img" aria-label={`${r.k} 7 day trend`}>
              {r.d.map((d, i) => (
                <i
                  key={i}
                  style={{
                    ["--gf-h" as string]: `${d * 10}%`,
                    ["--gf-d" as string]: `${ri * 120 + i * 40}ms`,
                  }}
                />
              ))}
            </span>
            <span className="gf-sparkbar-v">{r.v}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 15. CountUpStat — big spring count-up with unit                     */
/* ------------------------------------------------------------------ */
export function CountUpStat() {
  const v = useSpringNumber(128430, 60, 14);
  return (
    <ChartCard title="Total downloads" sub="all time" index={14}>
      <div className="gf-countup">
        <span className="gf-stat-num-xl">{fmt(v)}</span>
        <span className="gf-pill">+2,318 this week</span>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 16. IconStatCard — gradient icon chip with stat                     */
/* ------------------------------------------------------------------ */
export function IconStatCard() {
  return (
    <ChartCard title="New customers" sub="this month" index={15}>
      <div className="gf-iconstat">
        <span className="gf-iconchip" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
        </span>
        <div>
          <span className="gf-stat-num">3,482</span>
          <div className="gf-iconstat-sub">
            <span className="gf-delta gf-delta-up">+18.2%</span>
            <span className="gf-muted">vs Oct</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 17. GroupedBars — two-series grouped columns                        */
/* ------------------------------------------------------------------ */
export function GroupedBars() {
  const cats = ["Jan", "Feb", "Mar", "Apr", "May"];
  const a = [42, 55, 48, 66, 72];
  const b = [30, 41, 38, 52, 60];
  return (
    <ChartCard title="Online vs retail" sub="revenue, $k" index={16}>
      <div className="gf-grouped" role="img" aria-label="Online revenue beats retail every month">
        {cats.map((c, i) => (
          <div className="gf-grouped-col" key={c}>
            <div className="gf-grouped-pair">
              <span className="ga" style={{ ["--gf-h" as string]: `${a[i]}%`, ["--gf-d" as string]: `${i * 80}ms` }}>
                <title>{`Online ${a[i]}k`}</title>
              </span>
              <span className="gb" style={{ ["--gf-h" as string]: `${b[i]}%`, ["--gf-d" as string]: `${i * 80 + 45}ms` }}>
                <title>{`Retail ${b[i]}k`}</title>
              </span>
            </div>
            <span className="gf-vbar-lab">{c}</span>
          </div>
        ))}
      </div>
      <ul className="gf-legend">
        <li><i style={{ background: "var(--gf-accent)" }} />Online</li>
        <li><i style={{ background: "#f472b6" }} />Retail</li>
      </ul>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 18. TrendBadgeCard — stat with trend badge row and sparkline        */
/* ------------------------------------------------------------------ */
export function TrendBadgeCard() {
  const up = [5, 8, 7, 10, 12, 11, 14];
  const pts = seriesPoints(up, 96, 28, 3);
  return (
    <ChartCard title="Conversion rate" sub="checkout funnel" index={17}>
      <div className="gf-trendbadge">
        <div className="gf-trendbadge-row">
          <span className="gf-stat-num">4.9%</span>
          <span className="gf-trendpill">
            <svg viewBox="0 0 96 28" aria-hidden>
              <path d={pointsToPath(pts)} className="gf-trendpill-line" />
            </svg>
            +0.8pt
          </span>
        </div>
        <p className="gf-muted">Industry median is 3.1%. You are in the top decile of stores.</p>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 19. CandlestickChart — mini OHLC candles                            */
/* ------------------------------------------------------------------ */
export function CandlestickChart() {
  const candles = [
    { o: 40, c: 52, h: 58, l: 36 },
    { o: 52, c: 47, h: 56, l: 42 },
    { o: 47, c: 58, h: 62, l: 44 },
    { o: 58, c: 66, h: 70, l: 55 },
    { o: 66, c: 60, h: 69, l: 56 },
    { o: 60, c: 71, h: 76, l: 58 },
    { o: 71, c: 78, h: 84, l: 68 },
  ];
  const max = 90;
  const H = 104;
  const y = (v: number) => H - (v / max) * H;
  return (
    <ChartCard title="ACME weekly" sub="7 sessions, USD" index={18}>
      <svg viewBox="0 0 252 104" className="gf-candles" role="img" aria-label="Price rising from 40 to 78 over 7 sessions">
        {candles.map((c, i) => {
          const x = 18 + i * 36;
          const upDay = c.c >= c.o;
          return (
            <g key={i} className="gf-candle" style={{ ["--gf-d" as string]: `${i * 70}ms` }}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} className={`gf-wick ${upDay ? "up" : "down"}`} />
              <rect
                x={x - 8}
                y={y(Math.max(c.o, c.c))}
                width={16}
                height={Math.max(2, Math.abs(y(c.o) - y(c.c)))}
                rx={3}
                className={`gf-body ${upDay ? "up" : "down"}`}
              />
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 20. FunnelChart — trapezoid funnel with stage conversion            */
/* ------------------------------------------------------------------ */
export function FunnelChart() {
  const stages = [
    { k: "Visited", v: 100 },
    { k: "Signed up", v: 64 },
    { k: "Activated", v: 38 },
    { k: "Paid", v: 17 },
  ];
  const W = 240;
  const H = 34;
  const GAP = 6;
  const path = (topIn: number, botIn: number, i: number) => {
    const top = Math.max(topIn, 40);
    const bot = Math.max(botIn, 40);
    const t = ((W - (top / 100) * W) / 2);
    const b = ((W - (bot / 100) * W) / 2);
    const y0 = i * (H + GAP);
    const y1 = y0 + H;
    return `M ${t} ${y0} L ${W - t} ${y0} L ${W - b} ${y1} L ${b} ${y1} Z`;
  };
  return (
    <ChartCard title="Signup funnel" sub="visitor to paid" index={19}>
      <svg viewBox={`0 0 ${W} ${stages.length * (H + GAP)}`} role="img" aria-label="Funnel from 100 percent visited to 17 percent paid">
        {stages.map((s, i) => {
          const next = stages[i + 1] ? stages[i + 1].v : s.v;
          return (
            <g key={s.k} className="gf-funnel-stage" style={{ ["--gf-d" as string]: `${i * 90}ms` }}>
              <path d={path(s.v, next, i)} className={`gf-funnel-shape f${i}`} />
              <text x={W / 2} y={i * (H + GAP) + H / 2 + 4} textAnchor="middle" className="gf-funnel-text">
                {`${s.k} · ${s.v}%`}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 21. ScatterPlot — dot cloud with axes and stagger pop               */
/* ------------------------------------------------------------------ */
export function ScatterPlot() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const pts = Array.from({ length: 26 }, (_, i) => {
    const x = 10 + rand() * 80;
    return { x, y: 15 + x * 0.55 + (rand() - 0.5) * 30, i };
  });
  const H = 120;
  const W = 250;
  const px = (x: number) => 14 + (x / 100) * (W - 24);
  const py = (y: number) => H - 10 - (y / 110) * (H - 24);
  return (
    <ChartCard title="Spend vs revenue" sub="each dot is a campaign" index={20}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Scatter plot showing positive correlation">
        <line x1="14" y1={H - 10} x2={W - 10} y2={H - 10} className="gf-axis" />
        <line x1="14" y1="6" x2="14" y2={H - 10} className="gf-axis" />
        {pts.map((p) => (
          <circle
            key={p.i}
            cx={px(p.x)}
            cy={py(p.y)}
            r={3 + ((p.i * 7) % 4)}
            className="gf-scatter-dot"
            style={{ ["--gf-d" as string]: `${p.i * 45}ms` }}
          />
        ))}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 22. RadarChart — five-axis radar polygon, spring scale-in           */
/* ------------------------------------------------------------------ */
export function RadarChart() {
  const axes = ["Speed", "Quality", "Reach", "Cost", "Trust"];
  const vals = [80, 64, 72, 55, 88];
  const v = useSpringNumber(100, 90, 16);
  const cx = 80;
  const cy = 76;
  const R = 56;
  const pt = (i: number, frac: number) => polar(cx, cy, R * frac, (i / axes.length) * 360);
  const poly = (frac: number) =>
    axes.map((_, i) => `${pt(i, frac).x},${pt(i, frac).y}`).join(" ");
  const scaled = vals.map((x) => (x / 100) * (v / 100));
  const dataPoly = scaled.map((f, i) => `${pt(i, f).x},${pt(i, f).y}`).join(" ");
  return (
    <ChartCard title="Launch readiness" sub="five dimensions" index={21}>
      <svg viewBox="0 0 160 150" role="img" aria-label="Radar chart, strongest on trust and speed">
        {[0.33, 0.66, 1].map((f) => (
          <polygon key={f} points={poly(f)} className="gf-radar-grid" />
        ))}
        {axes.map((a, i) => {
          const p = pt(i, 1);
          const lp = pt(i, 1.22);
          return (
            <g key={a}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} className="gf-radar-spoke" />
              <text x={lp.x} y={lp.y + 3} textAnchor="middle" className="gf-radar-lab">
                {a}
              </text>
            </g>
          );
        })}
        <polygon points={dataPoly} className="gf-radar-fill" />
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 23. StepLineChart — step-after line with soft area                  */
/* ------------------------------------------------------------------ */
export function StepLineChart() {
  const data = [10, 14, 14, 22, 22, 30, 26, 34, 34, 42];
  const W = 250;
  const H = 84;
  const max = Math.max(...data);
  const stepX = (W - 16) / (data.length - 1);
  const X = (i: number) => 8 + i * stepX;
  const Y = (v: number) => H - 8 - (v / max) * (H - 20);
  let d = `M ${X(0)} ${Y(data[0])}`;
  for (let i = 1; i < data.length; i++) {
    d += ` L ${X(i)} ${Y(data[i - 1])} L ${X(i)} ${Y(data[i])}`;
  }
  return (
    <ChartCard title="Seats provisioned" sub="cumulative" index={22}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Stepped growth to 42 seats">
        <path d={`${d} L ${W - 8} ${H} L 8 ${H} Z`} className="gf-step-area" />
        <path d={d} className="gf-draw-line" pathLength={1} />
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 24. DotGauge — ring of dots, lit fraction                           */
/* ------------------------------------------------------------------ */
export function DotGauge() {
  const N = 28;
  const pct = 0.64;
  const lit = Math.round(N * pct);
  return (
    <ChartCard title="Sprint completion" sub="18 of 28 tickets done" index={23}>
      <div className="gf-dotgauge">
        <svg viewBox="0 0 120 120" role="img" aria-label="64 percent of sprint complete">
          {Array.from({ length: N }).map((_, i) => {
            const p = polar(60, 60, 48, (i / N) * 360);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i < lit ? 4.5 : 3}
                className={`gf-dot ${i < lit ? "lit" : ""}`}
                style={{ ["--gf-d" as string]: `${i * 28}ms` }}
              />
            );
          })}
        </svg>
        <div className="gf-donut-center">
          <span className="gf-stat-num-sm">{Math.round(pct * 100)}%</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 25. FlipStatCard — 3D flip: front stat, back breakdown              */
/* ------------------------------------------------------------------ */
export function FlipStatCard() {
  const [flip, setFlip] = useState(false);
  return (
    <ChartCard title="Server uptime" sub="activate to flip" index={24}>
      <button
        type="button"
        className={`gf-flip ${flip ? "on" : ""}`}
        onClick={() => setFlip(!flip)}
        aria-pressed={flip}
        aria-label="Flip card for uptime breakdown"
      >
        <span className="gf-flip-inner">
          <span className="gf-flip-face gf-flip-front">
            <span className="gf-stat-num">99.98%</span>
            <span className="gf-muted">last 90 days</span>
          </span>
          <span className="gf-flip-face gf-flip-back">
            <span className="gf-back-row"><b>1</b> incident</span>
            <span className="gf-back-row"><b>11m</b> downtime</span>
            <span className="gf-back-row"><b>0</b> SLA breaches</span>
          </span>
        </span>
      </button>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 26. WaterfallChart — running-total bridge                           */
/* ------------------------------------------------------------------ */
export function WaterfallChart() {
  const steps = [
    { k: "Start", v: 40, type: "abs" },
    { k: "Sales", v: 28, type: "up" },
    { k: "Refunds", v: -12, type: "down" },
    { k: "Upsell", v: 18, type: "up" },
    { k: "Costs", v: -20, type: "down" },
    { k: "End", v: 54, type: "abs" },
  ] as const;
  const H = 110;
  const scale = 1.1;
  let run = 0;
  const bars = steps.map((s) => {
    if (s.type === "abs") {
      const from = 0;
      const to = s.v;
      run = s.v;
      return { ...s, from, to };
    }
    const from = run;
    run += s.v;
    return { ...s, from, to: run };
  });
  const y = (v: number) => H - v * scale;
  return (
    <ChartCard title="Cash bridge" sub="this month, $k" index={25}>
      <svg viewBox="0 0 264 118" role="img" aria-label="Cash bridge from 40 to 54 thousand">
        {bars.map((b, i) => {
          const x = 12 + i * 42;
          const top = Math.min(y(b.from), y(b.to));
          const h = Math.max(3, Math.abs(y(b.from) - y(b.to)));
          const cls = b.type === "abs" ? "abs" : b.v >= 0 ? "up" : "down";
          return (
            <g key={b.k} className="gf-wf" style={{ ["--gf-d" as string]: `${i * 80}ms` }}>
              {i < bars.length - 1 && (
                <line x1={x + 32} x2={x + 42 + 10} y1={y(b.to)} y2={y(b.to)} className="gf-wf-link" />
              )}
              <rect x={x} y={top} width={32} height={h} rx={4} className={`gf-wf-bar ${cls}`} />
              <text x={x + 16} y={116} textAnchor="middle" className="gf-wf-lab">
                {b.k}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 27. MiniPieLegend — compact pie with aligned legend                 */
/* ------------------------------------------------------------------ */
export function MiniPieLegend() {
  const parts = [
    { k: "Mobile", v: 58, c: "var(--gf-accent)" },
    { k: "Desktop", v: 34, c: "#38bdf8" },
    { k: "Tablet", v: 8, c: "#fbbf24" },
  ];
  const total = parts.reduce((a, b) => a + b.v, 0);
  let acc = 0;
  return (
    <ChartCard title="Sessions by device" sub="last 30 days" index={26}>
      <div className="gf-minipie">
        <svg viewBox="0 0 72 72" className="gf-minipie-svg" role="img" aria-label="Mobile 58, desktop 34, tablet 8 percent">
          {parts.map((p) => {
            const span = (p.v / total) * 360;
            const a0 = acc;
            const a1 = acc + span;
            acc += span;
            const s = polar(36, 36, 30, a0);
            const e = polar(36, 36, 30, a1);
            const large = span > 180 ? 1 : 0;
            return (
              <path
                key={p.k}
                d={`M 36 36 L ${s.x} ${s.y} A 30 30 0 ${large} 1 ${e.x} ${e.y} Z`}
                fill={p.c}
                className="gf-pie-seg"
              />
            );
          })}
          <circle cx="36" cy="36" r="14" className="gf-pie-hole" />
        </svg>
        <ul className="gf-legend col grow">
          {parts.map((p) => (
            <li key={p.k}>
              <i style={{ background: p.c }} />
              {p.k}
              <b>{p.v}%</b>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 28. RangeStatBar — min to max range with current marker             */
/* ------------------------------------------------------------------ */
export function RangeStatBar() {
  const min = 12;
  const max = 88;
  const cur = 61;
  const avg = 44;
  const pos = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <ChartCard title="Latency window" sub="p50 vs fleet range, ms" index={27}>
      <div className="gf-range">
        <span className="gf-stat-num">{cur}ms</span>
        <div className="gf-range-track" role="img" aria-label={`Current ${cur} milliseconds within a range of ${min} to ${max}`}>
          <span className="gf-range-band" />
          <span className="gf-range-avg" style={{ left: `${pos(avg)}%` }}>
            <title>{`Fleet average ${avg}ms`}</title>
          </span>
          <span className="gf-range-cur" style={{ ["--gf-x" as string]: `${pos(cur)}%` }} />
        </div>
        <div className="gf-range-scale">
          <span>{min}ms</span>
          <span className="gf-muted">avg {avg}ms</span>
          <span>{max}ms</span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 29. PulseLiveStat — live counter with pulsing beacon                */
/* ------------------------------------------------------------------ */
export function PulseLiveStat() {
  const [n, setN] = useState(342);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setN((x) => x + Math.floor(Math.random() * 5) - 1), 2400);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <ChartCard title="On site now" sub="updates in real time" index={28}>
      <div className="gf-live">
        <span className="gf-beacon" aria-hidden>
          <i />
        </span>
        <span className="gf-stat-num" aria-live="polite">{n}</span>
        <span className="gf-pill green">live</span>
      </div>
      <p className="gf-muted">Peak today was 511 at 2:40 PM. Currently 68% of daily average.</p>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* 30. ProgressList — labeled progress rows with stagger               */
/* ------------------------------------------------------------------ */
export function ProgressList() {
  const rows = [
    { k: "Design system", v: 92, c: "#34d399" },
    { k: "Docs site", v: 74, c: "var(--gf-accent)" },
    { k: "Charts family", v: 55, c: "#fbbf24" },
    { k: "Templates", v: 31, c: "#f472b6" },
  ];
  return (
    <ChartCard title="Roadmap progress" sub="Q4 deliverables" index={29}>
      <div className="gf-proglist">
        {rows.map((r, i) => (
          <div className="gf-prog-row" key={r.k}>
            <div className="gf-prog-head">
              <span>{r.k}</span>
              <b>{r.v}%</b>
            </div>
            <div
              className="gf-prog-track"
              role="progressbar"
              aria-valuenow={r.v}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={r.k}
            >
              <span
                className="gf-prog-fill"
                style={{ ["--gf-w" as string]: `${r.v}%`, ["--gf-d" as string]: `${i * 110}ms`, background: r.c }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
                                                     }
