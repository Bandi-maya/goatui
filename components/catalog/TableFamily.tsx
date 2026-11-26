"use client";

import React, { useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* shared demo data                                                    */
/* ------------------------------------------------------------------ */

const PEOPLE = [
  { id: 1, name: "Asha Verma", role: "Design Lead", team: "Studio", age: 31, salary: 128000, status: "Active", email: "asha@goatui.dev" },
  { id: 2, name: "Rohan Iyer", role: "Engineer", team: "Platform", age: 27, salary: 142500, status: "Active", email: "rohan@goatui.dev" },
  { id: 3, name: "Meera Nair", role: "PM", team: "Core", age: 34, salary: 151000, status: "Away", email: "meera@goatui.dev" },
  { id: 4, name: "Dev Kulkarni", role: "Engineer", team: "Infra", age: 25, salary: 118000, status: "Active", email: "dev@goatui.dev" },
  { id: 5, name: "Sana Sheikh", role: "Data", team: "Core", age: 29, salary: 136000, status: "Offline", email: "sana@goatui.dev" },
];

const INVOICES = [
  { id: "INV-2041", client: "Northwind Labs", amount: 4280.0, date: "2026-11-02", status: "Paid", items: 6, method: "UPI", owner: "Asha" },
  { id: "INV-2042", client: "Kite Systems", amount: 1199.5, date: "2026-11-05", status: "Pending", items: 2, method: "Card", owner: "Rohan" },
  { id: "INV-2043", client: "Arbor Coffee Co", amount: 8640.25, date: "2026-11-09", status: "Paid", items: 11, method: "Bank", owner: "Meera" },
  { id: "INV-2044", client: "Lumen Health", amount: 2310.0, date: "2026-11-14", status: "Overdue", items: 4, method: "Card", owner: "Dev" },
  { id: "INV-2045", client: "Pico Robotics", amount: 590.75, date: "2026-11-18", status: "Pending", items: 1, method: "UPI", owner: "Sana" },
];

const money = (n: number) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

const money0 = (n: number) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const statusChip = (s: string) => {
  const map: Record<string, { bg: string; fg: string }> = {
    Active: { bg: "#e7f6ec", fg: "#16a34a" },
    Paid: { bg: "#e7f6ec", fg: "#16a34a" },
    Away: { bg: "#fdf1e3", fg: "#d97706" },
    Pending: { bg: "#fdf1e3", fg: "#d97706" },
    Offline: { bg: "#f4f4f6", fg: "#8a8a94" },
    Overdue: { bg: "#fdeaea", fg: "#dc2626" },
  };
  const c = map[s] ?? map.Offline;
  return (
    <span className="tf-chip" style={{ background: c.bg, color: c.fg }}>
      {s}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* v01 SortableGridTable - click-to-sort headers, spring arrow         */
/* ------------------------------------------------------------------ */

type SortKey = "name" | "age" | "salary" | "team";

export function SortableGridTable() {
  const [key, setKey] = useState<SortKey>("name");
  const [dir, setDir] = useState<1 | -1>(1);
  const rows = useMemo(() => {
    const r = [...PEOPLE];
    r.sort((a, b) => {
      const x = a[key], y = b[key];
      return (typeof x === "number" && typeof y === "number"
        ? x - y
        : String(x).localeCompare(String(y))) * dir;
    });
    return r;
  }, [key, dir]);
  const click = (k: SortKey) => {
    if (k === key) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setKey(k);
      setDir(1);
    }
  };
  const cols: { k: SortKey; label: string; numeric?: boolean }[] = [
    { k: "name", label: "Name" },
    { k: "team", label: "Team" },
    { k: "age", label: "Age", numeric: true },
    { k: "salary", label: "Salary", numeric: true },
  ];
  return (
    <div className="tf-root tfv01 tf-anim-enter">
      <table>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c.k}
                aria-sort={key === c.k ? (dir === 1 ? "ascending" : "descending") : undefined}
              >
                <button onClick={() => click(c.k)} data-demo-sort={c.k === "salary" ? "" : undefined}>
                  {c.label} <span className="tfv01-arrow" aria-hidden>▲</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tf-stagger">
          {rows.map((p) => (
            <tr key={p.id}>
              <td><strong>{p.name}</strong></td>
              <td>{p.team}</td>
              <td className="tf-num">{p.age}</td>
              <td className="tf-num">{money0(p.salary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v02 ExpandingInvoiceTable - spring accordion detail rows            */
/* ------------------------------------------------------------------ */

export function ExpandingInvoiceTable() {
  const [open, setOpen] = useState<string | null>("INV-2041");
  return (
    <div className="tf-root tfv02 tf-anim-enter">
      <table>
        <thead>
          <tr><th style={{ width: 32 }} /><th>Invoice</th><th>Client</th><th>Date</th><th>Status</th><th style={{ textAlign: "right" }}>Amount</th></tr>
        </thead>
        <tbody>
          {INVOICES.map((inv) => {
            const isOpen = open === inv.id;
            return [
              <tr
                key={inv.id}
                className="tfv02-row"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : inv.id)}
                data-demo-expand={inv.id === "INV-2042" ? "" : undefined}
              >
                <td><span className="tfv02-caret" aria-hidden>▸</span></td>
                <td className="tf-num"><strong>{inv.id}</strong></td>
                <td>{inv.client}</td>
                <td className="tf-num">{inv.date}</td>
                <td>{statusChip(inv.status)}</td>
                <td className="tf-num" style={{ textAlign: "right" }}><strong>{money(inv.amount)}</strong></td>
              </tr>,
              isOpen && (
                <tr key={inv.id + "-d"} className="tfv02-detail">
                  <td colSpan={6}>
                    <div className="tfv02-detail-box">
                      <div><h4>Line items</h4><p className="tf-num">{inv.items} items</p></div>
                      <div><h4>Payment method</h4><p>{inv.method}</p></div>
                      <div><h4>Owner</h4><p>{inv.owner}</p></div>
                    </div>
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v03 KanbanPipelineTable - column board with spring card moves       */
/* ------------------------------------------------------------------ */

type KanbanTask = { id: number; title: string; tag: string; col: number };
const KANBAN_INIT: KanbanTask[] = [
  { id: 1, title: "Audit radius scale", tag: "Design", col: 0 },
  { id: 2, title: "Draft v2 tokens", tag: "Tokens", col: 0 },
  { id: 3, title: "Spring presets", tag: "Motion", col: 1 },
  { id: 4, title: "Table family spec", tag: "Spec", col: 1 },
  { id: 5, title: "Ship Buttons 30", tag: "Release", col: 2 },
];
const KANBAN_COLS = [
  { name: "Backlog", color: "#8a8a94" },
  { name: "In progress", color: "#4f46e5" },
  { name: "Done", color: "#16a34a" },
];

export function KanbanPipelineTable() {
  const [tasks, setTasks] = useState(KANBAN_INIT);
  const move = (id: number, delta: number) =>
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, col: Math.min(2, Math.max(0, t.col + delta)) } : t)),
    );
  return (
    <div className="tf-root tfv03">
      {KANBAN_COLS.map((col, ci) => {
        const inCol = tasks.filter((t) => t.col === ci);
        return (
          <div className="tfv03-col" key={col.name} aria-label={col.name}>
            <header>
              <h3><span className="tfv03-dot" style={{ background: col.color }} />{col.name}</h3>
              <span className="tfv03-count tf-num">{inCol.length}</span>
            </header>
            <div className="tf-stagger" style={{ display: "grid", gap: 8 }}>
              {inCol.map((t) => (
                <article className="tfv03-card" key={t.id}>
                  <h4>{t.title}</h4>
                  <footer>
                    <span>{t.tag}</span>
                    <span className="tfv03-move">
                      <button aria-label={`Move ${t.title} left`} disabled={ci === 0} onClick={() => move(t.id, -1)}>◀</button>
                      <button aria-label={`Move ${t.title} right`} disabled={ci === 2} onClick={() => move(t.id, 1)}>▶</button>
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v04 PricingTiersTable - billing toggle with spring thumb            */
/* ------------------------------------------------------------------ */

const TIERS = [
  { name: "Starter", monthly: 0, yearly: 0, blurb: "For trying things out", feats: ["10 components", "Community themes", "Copy-paste export"], hot: false },
  { name: "Pro", monthly: 499, yearly: 399, blurb: "For serious builders", feats: ["All 300+ components", "Figma kit", "Motion presets", "Priority support"], hot: true },
  { name: "Team", monthly: 1499, yearly: 1199, blurb: "For product teams", feats: ["Everything in Pro", "Shared library", "Design reviews", "SSO"], hot: false },
];

export function PricingTiersTable() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="tf-root tfv04 tf-anim-enter">
      <div className="tfv04-toggle">
        <div className="tfv04-toggle-inner" role="group" aria-label="Billing period">
          <span className={"tfv04-thumb" + (yearly ? " right" : "")} aria-hidden />
          <button aria-pressed={!yearly} onClick={() => setYearly(false)} data-demo-toggle="">Monthly</button>
          <button aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly <span style={{ fontSize: 10, opacity: 0.8 }}>-20%</span></button>
        </div>
      </div>
      <div className="tfv04-grid tf-stagger">
        {TIERS.map((t) => (
          <div className={"tfv04-tier" + (t.hot ? " hot" : "")} key={t.name}>
            {t.hot && <span className="tfv04-badge">Most popular</span>}
            <div>
              <strong style={{ fontSize: 15 }}>{t.name}</strong>
              <div style={{ fontSize: 12, color: "var(--tf-ink-3)" }}>{t.blurb}</div>
            </div>
            <div className="tfv04-price tf-num">
              {money0(yearly ? t.yearly : t.monthly)}
              <small> /mo</small>
            </div>
            <ul>{t.feats.map((f) => <li key={f}>{f}</li>)}</ul>
            <button className={"tf-btn" + (t.hot ? " tf-btn--accent" : "")}>Choose {t.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v05 FeatureComparisonTable - sticky first column matrix             */
/* ------------------------------------------------------------------ */

const COMPARE_ROWS: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Components", "10", "300+", "300+"],
  ["Copy-paste export", true, true, true],
  ["Figma kit", false, true, true],
  ["Motion presets", false, true, true],
  ["Shared team library", false, false, true],
  ["Design reviews", false, false, true],
  ["Support", "Community", "Priority", "Dedicated"],
];

export function FeatureComparisonTable() {
  const cell = (v: boolean | string) =>
    typeof v === "string"
      ? <span className="tf-num" style={{ fontWeight: 600 }}>{v}</span>
      : v
        ? <span className="tfv05-yes">✓</span>
        : <span className="tfv05-no">—</span>;
  return (
    <div className="tf-root tfv05 tf-anim-enter">
      <table>
        <thead>
          <tr><th>Feature</th><th><strong>Starter</strong>Free</th><th><strong>Pro</strong>{money0(499)}/mo</th><th><strong>Team</strong>{money0(1499)}/mo</th></tr>
        </thead>
        <tbody className="tf-stagger">
          {COMPARE_ROWS.map(([f, a, b, c]) => (
            <tr key={f}><td>{f}</td><td>{cell(a)}</td><td>{cell(b)}</td><td>{cell(c)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v06 CompactDataGrid - dense enterprise grid with selection          */
/* ------------------------------------------------------------------ */

export function CompactDataGrid() {
  const [sel, setSel] = useState<Set<number>>(new Set([2]));
  const toggle = (id: number) =>
    setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const all = sel.size === PEOPLE.length;
  return (
    <div className="tf-root tfv06 tf-anim-enter">
      <table>
        <thead>
          <tr>
            <th style={{ width: 28 }}>
              <input
                type="checkbox"
                aria-label="Select all rows"
                checked={all}
                onChange={() => setSel(all ? new Set() : new Set(PEOPLE.map((p) => p.id)))}
              />
            </th>
            <th>ID</th><th>Name</th><th>Role</th><th>Team</th><th>Email</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {PEOPLE.map((p) => (
            <tr key={p.id} data-selected={sel.has(p.id)}>
              <td><input type="checkbox" aria-label={`Select ${p.name}`} checked={sel.has(p.id)} onChange={() => toggle(p.id)} /></td>
              <td className="tf-num">#{String(p.id).padStart(3, "0")}</td>
              <td><strong>{p.name}</strong></td>
              <td>{p.role}</td>
              <td>{p.team}</td>
              <td>{p.email}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v07 FloatingCardRowsTable - rows as lifting cards                   */
/* ------------------------------------------------------------------ */

export function FloatingCardRowsTable() {
  return (
    <div className="tf-root tfv07 tf-anim-enter">
      <div className="tfv07-head" role="row">
        <span>Member</span><span>Role</span><span>Team</span><span>Status</span>
      </div>
      <div className="tfv07-rows tf-stagger" role="table" aria-label="Team members">
        {PEOPLE.map((p) => (
          <div className="tfv07-row" role="row" key={p.id} tabIndex={0}>
            <div><div className="tfv07-name">{p.name}</div><div className="tfv07-sub">{p.email}</div></div>
            <span>{p.role}</span>
            <span>{p.team}</span>
            <span>{statusChip(p.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v08 TimelineActivityTable - rows grouped along a timeline spine     */
/* ------------------------------------------------------------------ */

const ACTIVITY = [
  { date: "Nov 24", rows: [["09:12", "Asha pushed Buttons v3", "Release"], ["10:48", "Rohan opened PR #212", "Code"], ["12:05", "Meera approved Cards spec", "Review"]] },
  { date: "Nov 23", rows: [["16:22", "Dev fixed focus rings", "A11y"], ["18:40", "Sana exported token JSON", "Tokens"]] },
];

export function TimelineActivityTable() {
  return (
    <div className="tf-root tfv08">
      {ACTIVITY.map((g) => (
        <div className="tfv08-group" key={g.date}>
          <p className="tfv08-date">{g.date}</p>
          <table>
            <tbody className="tf-stagger">
              {g.rows.map(([t, what, tag]) => (
                <tr key={t + what}>
                  <td className="tf-num" style={{ width: 64, color: "var(--tf-ink-3)" }}>{t}</td>
                  <td>{what}</td>
                  <td style={{ width: 90 }}><span className="tf-chip" style={{ background: "var(--tf-accent-soft)", color: "var(--tf-accent)" }}>{tag}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v09 ProgressMeterTable - animated capacity meters                   */
/* ------------------------------------------------------------------ */

const CAPACITY = [
  { name: "API requests", used: 62, total: "6.2M / 10M" },
  { name: "Storage", used: 31, total: "310 GB / 1 TB" },
  { name: "Bandwidth", used: 88, total: "8.8 TB / 10 TB" },
  { name: "Seats", used: 45, total: "9 / 20" },
];

export function ProgressMeterTable() {
  const tone = (v: number) => (v >= 80 ? "high" : v >= 50 ? "mid" : "low");
  return (
    <div className="tf-root tfv09 tf-anim-enter">
      <table>
        <thead><tr><th>Resource</th><th>Usage</th><th style={{ textAlign: "right" }}>Used</th><th style={{ textAlign: "right" }}>Total</th></tr></thead>
        <tbody>
          {CAPACITY.map((c) => (
            <tr key={c.name}>
              <td><strong>{c.name}</strong></td>
              <td>
                <span className={"tfv09-meter " + tone(c.used)}>
                  <i style={{ transform: `scaleX(${c.used / 100})` }} />
                </span>
              </td>
              <td style={{ textAlign: "right" }}><span className="tfv09-pct tf-num">{c.used}%</span></td>
              <td className="tf-num" style={{ textAlign: "right", color: "var(--tf-ink-2)" }}>{c.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v10 SparklineMetricsTable - dark terminal metrics with sparklines   */
/* ------------------------------------------------------------------ */

const METRICS = [
  { name: "Revenue", value: "₹4.2L", delta: "+12.4%", up: true, pts: [12, 14, 13, 18, 17, 22, 26, 24, 30] },
  { name: "Signups", value: "1,284", delta: "+4.1%", up: true, pts: [8, 10, 9, 12, 11, 13, 12, 15, 16] },
  { name: "Churn", value: "0.8%", delta: "-0.2%", up: true, pts: [9, 8, 8, 7, 6, 6, 5, 5, 4] },
  { name: "Latency", value: "84ms", delta: "+9ms", up: false, pts: [4, 5, 5, 6, 8, 7, 9, 10, 12] },
];

function sparkPath(pts: number[], w = 120, h = 32) {
  const min = Math.min(...pts), max = Math.max(...pts);
  const nx = (i: number) => (i / (pts.length - 1)) * (w - 4) + 2;
  const ny = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${nx(i).toFixed(1)},${ny(p).toFixed(1)}`).join(" ");
}

export function SparklineMetricsTable() {
  return (
    <div className="tf-root tfv10 tf-anim-enter">
      <table>
        <thead><tr><th>Metric</th><th>Last 9 weeks</th><th style={{ textAlign: "right" }}>Value</th><th style={{ textAlign: "right" }}>Change</th></tr></thead>
        <tbody>
          {METRICS.map((m) => (
            <tr key={m.name}>
              <td style={{ fontWeight: 600 }}>{m.name}</td>
              <td>
                <svg width="120" height="32" viewBox="0 0 120 32" aria-hidden>
                  <path className="tfv10-line" d={sparkPath(m.pts)} stroke={m.up ? "#4ade80" : "#f87171"} />
                </svg>
              </td>
              <td className="tf-num" style={{ textAlign: "right", fontWeight: 800 }}>{m.value}</td>
              <td className={"tf-num " + (m.up ? "tfv10-delta-up" : "tfv10-delta-down")} style={{ textAlign: "right" }}>{m.delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v11 HeatmapActivityTable - contribution-graph cells                 */
/* ------------------------------------------------------------------ */

const HEAT_WEEKS = 16;
const HEAT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heat = (w: number, d: number) => ((w * 7 + d * 13 + 5) % 9 > 5 ? 0 : ((w * 7 + d * 13 + 5) % 9) % 5);

export function HeatmapActivityTable() {
  return (
    <div className="tf-root tfv11 tf-anim-enter">
      <table aria-label="Commit activity heatmap">
        <thead>
          <tr>
            <th />
            {Array.from({ length: HEAT_WEEKS }, (_, w) => (
              <th key={w} className="tf-num">{w % 4 === 0 ? `W${w + 1}` : ""}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEAT_DAYS.map((day, d) => (
            <tr key={day}>
              <th>{d % 2 === 0 ? day : ""}</th>
              {Array.from({ length: HEAT_WEEKS }, (_, w) => {
                const lvl = heat(w, d);
                return (
                  <td key={w}>
                    <span className={"tfv11-cell" + (lvl ? " l" + lvl : "")} title={`${lvl * 3} commits`} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tfv11-legend">
        Less
        {[0, 1, 2, 3, 4].map((l) => <span key={l} className={"tfv11-cell" + (l ? " l" + l : "")} />)}
        More
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v12 TreeFileTable - hierarchical rows with spring disclosure        */
/* ------------------------------------------------------------------ */

type TreeNode = { name: string; size: string; kind: "folder" | "file"; children?: TreeNode[] };
const TREE: TreeNode[] = [
  { name: "components", size: "412 KB", kind: "folder", children: [
    { name: "TableFamily.tsx", size: "48 KB", kind: "file" },
    { name: "TableFamily.css", size: "21 KB", kind: "file" },
    { name: "ButtonFamily.tsx", size: "36 KB", kind: "file" },
  ]},
  { name: "app", size: "88 KB", kind: "folder", children: [
    { name: "layout.tsx", size: "2 KB", kind: "file" },
    { name: "page.tsx", size: "6 KB", kind: "file" },
  ]},
  { name: "package.json", size: "1 KB", kind: "file" },
];

const IconFolder = (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
    <path d="M1.5 4A1.5 1.5 0 013 2.5h3L7.5 4.5H13A1.5 1.5 0 0114.5 6v5.5A1.5 1.5 0 0113 13H3A1.5 1.5 0 011.5 11.5V4z" fill="currentColor" />
  </svg>
);
const IconFile = (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
    <path d="M4 1.5h4.5L12.5 5.5v9H4v-13z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export function TreeFileTable() {
  const [open, setOpen] = useState<Set<string>>(new Set(["components"]));
  const toggle = (n: string) =>
    setOpen((s) => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x; });
  const rows: React.ReactNode[] = [];
  TREE.forEach((n) => {
    const isOpen = open.has(n.name);
    rows.push(
      <tr key={n.name}>
        <td>
          <span className="tfv12-label">
            {n.kind === "folder" ? (
              <button className={"tfv12-toggle" + (isOpen ? " open" : "")} aria-expanded={isOpen} aria-label={`Toggle ${n.name}`} onClick={() => toggle(n.name)}>▸</button>
            ) : <span style={{ width: 18, display: "inline-block" }} />}
            <span className={n.kind === "folder" ? "tfv12-folder" : "tfv12-file"}>{n.kind === "folder" ? IconFolder : IconFile}</span>
            <strong>{n.name}</strong>
          </span>
        </td>
        <td className="tf-num" style={{ textAlign: "right" }}>{n.size}</td>
      </tr>,
    );
    if (isOpen && n.children) {
      rows.push(
        <tr key={n.name + "-kids"}>
          <td colSpan={2} style={{ padding: 0 }}>
            <div className="tfv12-kids">
              <table>
                <tbody>
                  {n.children.map((c) => (
                    <tr key={c.name}>
                      <td style={{ paddingLeft: 52 }}>
                        <span className="tfv12-label"><span className="tfv12-file">{IconFile}</span>{c.name}</span>
                      </td>
                      <td className="tf-num" style={{ textAlign: "right" }}>{c.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>,
      );
    }
  });
  return (
    <div className="tf-root tfv12 tf-anim-enter">
      <table>
        <thead><tr><th>Name</th><th style={{ textAlign: "right" }}>Size</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v13 ResponsiveStackTable - grid collapses to stacked cards          */
/* ------------------------------------------------------------------ */

export function ResponsiveStackTable() {
  return (
    <div className="tf-root tfv13 tf-anim-enter">
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Team</th><th>Status</th><th style={{ textAlign: "right" }}>Salary</th></tr></thead>
        <tbody className="tf-stagger">
          {PEOPLE.map((p) => (
            <tr key={p.id}>
              <td data-label="Name"><strong>{p.name}</strong></td>
              <td data-label="Role">{p.role}</td>
              <td data-label="Team">{p.team}</td>
              <td data-label="Status">{statusChip(p.status)}</td>
              <td data-label="Salary" className="tf-num" style={{ textAlign: "right" }}>{money0(p.salary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v14 GroupedSubtotalTable - collapsible groups with subtotals        */
/* ------------------------------------------------------------------ */

const EXPENSES = [
  { group: "Travel", rows: [["Flights - Bengaluru", 18400], ["Hotel - 3 nights", 12600], ["Cabs", 2140]] },
  { group: "Software", rows: [["Figma team", 4500], ["Vercel Pro", 1650], ["Linear", 830]] },
  { group: "Office", rows: [["Coffee + snacks", 3400], ["Standing desk", 21900]] },
] as const;

export function GroupedSubtotalTable() {
  const [open, setOpen] = useState<Set<string>>(new Set(["Travel"]));
  const toggle = (g: string) =>
    setOpen((s) => { const x = new Set(s); x.has(g) ? x.delete(g) : x.add(g); return x; });
  return (
    <div className="tf-root tfv14 tf-anim-enter">
      <table>
        <thead><tr><th>Expense</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
        {EXPENSES.map((g) => {
          const isOpen = open.has(g.group);
          const sub = g.rows.reduce((a, r) => a + r[1], 0);
          return (
            <tbody key={g.group}>
              <tr className="tfv14-group" aria-expanded={isOpen} onClick={() => toggle(g.group)} data-demo-expand={g.group === "Software" ? "" : undefined}>
                <td><span className="tfv14-caret" aria-hidden>▸</span>{g.group}</td>
                <td className="tf-num" style={{ textAlign: "right" }}>{money0(sub)}</td>
              </tr>
              {isOpen && (
                <>
                  {g.rows.map(([label, amt]) => (
                    <tr key={label} className="tfv14-body"><td style={{ paddingLeft: 36 }}>{label}</td><td className="tf-num" style={{ textAlign: "right" }}>{money0(amt)}</td></tr>
                  ))}
                  <tr className="tfv14-sub"><td style={{ paddingLeft: 36 }}>Subtotal</td><td className="tf-num" style={{ textAlign: "right" }}>{money0(sub)}</td></tr>
                </>
              )}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v15 InlineEditTable - contenteditable cells with focus spring       */
/* ------------------------------------------------------------------ */

export function InlineEditTable() {
  const ref = useRef<HTMLTableElement>(null);
  return (
    <div className="tf-root tfv15 tf-anim-enter">
      <table ref={ref}>
        <thead><tr><th>Task</th><th>Owner</th><th>Estimate</th><th>Status</th></tr></thead>
        <tbody className="tf-stagger">
          {[
            ["Radius audit", "Asha", "2d", "In progress"],
            ["Spring tokens", "Rohan", "1d", "Todo"],
            ["Table polish", "Meera", "3d", "In progress"],
            ["Docs pass", "Dev", "1d", "Done"],
          ].map(([task, owner, est, st]) => (
            <tr key={task}>
              {[task, owner, est, st].map((val, i) => (
                <td key={i}>
                  <span className={"tfv15-cell" + (i === 2 ? " tf-num" : "")} contentEditable suppressContentEditableWarning spellCheck={false}>
                    {val}
                  </span>
                  {i === 0 && <span className="tfv15-hint">click to edit</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v16 StatusPulseTable - service health with pulsing dots             */
/* ------------------------------------------------------------------ */

const SERVICES = [
  { name: "api.goatui.dev", uptime: "99.99%", latency: "42ms", tone: "ok", label: "Operational" },
  { name: "cdn.goatui.dev", uptime: "99.95%", latency: "18ms", tone: "ok", label: "Operational" },
  { name: "auth.goatui.dev", uptime: "99.81%", latency: "210ms", tone: "warn", label: "Degraded" },
  { name: "hooks.goatui.dev", uptime: "98.20%", latency: "—", tone: "down", label: "Outage" },
] as const;

export function StatusPulseTable() {
  return (
    <div className="tf-root tfv16 tf-anim-enter">
      <table>
        <thead><tr><th>Service</th><th>Status</th><th>Uptime 30d</th><th>Latency</th></tr></thead>
        <tbody>
          {SERVICES.map((s) => (
            <tr key={s.name} data-tone={s.tone}>
              <td style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{s.name}</td>
              <td><span className="tfv16-status"><span className={"tfv16-dot " + s.tone} />{s.label}</span></td>
              <td className="tf-num">{s.uptime}</td>
              <td className="tf-num">{s.latency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v17 LeaderboardRankTable - podium ranks with score deltas           */
/* ------------------------------------------------------------------ */

const LEADERS = [
  { name: "Asha Verma", handle: "@asha", score: 2841, trend: "+3", up: true },
  { name: "Rohan Iyer", handle: "@rohan", score: 2712, trend: "+1", up: true },
  { name: "Meera Nair", handle: "@meera", score: 2590, trend: "-2", up: false },
  { name: "Dev Kulkarni", handle: "@dev", score: 2404, trend: "+4", up: true },
  { name: "Sana Sheikh", handle: "@sana", score: 2388, trend: "-1", up: false },
];

export function LeaderboardRankTable() {
  return (
    <div className="tf-root tfv17 tf-anim-enter">
      <div className="tfv17-row head"><span>Rank</span><span>Builder</span><span style={{ textAlign: "right" }}>Score</span><span style={{ textAlign: "right" }}>7d</span></div>
      <div className="tf-stagger">
        {LEADERS.map((l, i) => (
          <div className="tfv17-row" key={l.handle}>
            <span className={"tfv17-rank tf-num" + (i < 3 ? " m" + (i + 1) : "")}>{i + 1}</span>
            <span className="tfv17-name">{l.name}<small>{l.handle}</small></span>
            <span className="tfv17-score tf-num">{l.score.toLocaleString("en-IN")}</span>
            <span className={"tfv17-trend tf-num " + (l.up ? "up" : "down")}>{l.up ? "▲" : "▼"} {l.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v18 CalendarEventTable - month grid rendered as a table             */
/* ------------------------------------------------------------------ */

const CAL_EVENTS: Record<number, { label: string; cls?: string }[]> = {
  3: [{ label: "Design sync" }],
  6: [{ label: "Ship v0.9", cls: "g" }],
  11: [{ label: "1:1 Meera" }, { label: "Hiring loop", cls: "a" }],
  17: [{ label: "Sprint review" }],
  24: [{ label: "Tables drop", cls: "g" }, { label: "Retro", cls: "a" }],
  27: [{ label: "OSS triage" }],
};

export function CalendarEventTable() {
  const [off, setOff] = useState(0); // months away from November 2026
  const first = new Date(2026, 10 + off, 1);
  const dim = new Date(2026, 11 + off, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday first
  const isNov = off === 0;
  const weeks: (number | null)[][] = [];
  let day = 1 - lead;
  while (day <= dim) {
    const wk: (number | null)[] = [];
    for (let i = 0; i < 7; i++, day++) wk.push(day >= 1 && day <= dim ? day : null);
    weeks.push(wk);
  }
  const title = first.toLocaleString("en-US", { month: "long", year: "numeric" });
  return (
    <div className="tf-root tfv18 tf-anim-enter">
      <div className="tfv18-head">
        <h3>{title}</h3>
        <span style={{ display: "flex", gap: 8 }}>
          <button className="tf-btn" aria-label="Previous month" onClick={() => setOff((o) => o - 1)}>‹</button>
          <button className="tf-btn" aria-label="Next month" onClick={() => setOff((o) => o + 1)}>›</button>
        </span>
      </div>
      <table>
        <thead><tr>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <th key={d}>{d}</th>)}</tr></thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((d, di) => (
                <td key={di} className={d === null ? "dim" : ""}>
                  {d !== null && (
                    <>
                      <span className={"tfv18-day tf-num" + (isNov && d === 24 ? " today" : "")}>{d}</span>
                      {(isNov ? CAL_EVENTS[d] ?? [] : []).map((e) => (
                        <span key={e.label} className={"tfv18-ev" + (e.cls ? " " + e.cls : "")}>{e.label}</span>
                      ))}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v19 SkillMatrixTable - dot ratings across skills                    */
/* ------------------------------------------------------------------ */

const SKILLS = ["React", "Motion", "A11y", "CSS", "TS"];
const SKILL_ROWS = PEOPLE.map((p, i) => ({
  name: p.name,
  scores: SKILLS.map((_, j) => ((i * 3 + j * 7 + 4) % 5) + 1),
}));

export function SkillMatrixTable() {
  return (
    <div className="tf-root tfv19 tf-anim-enter">
      <table>
        <thead><tr><th>Member</th>{SKILLS.map((s) => <th key={s}>{s}</th>)}</tr></thead>
        <tbody className="tf-stagger">
          {SKILL_ROWS.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              {r.scores.map((s, i) => (
                <td key={i}>
                  <span className="tfv19-dots" role="img" aria-label={`${s} of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= s ? "on" : ""} />)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v20 LedgerTotalsTable - finance ledger with bold totals footer      */
/* ------------------------------------------------------------------ */

const LEDGER = [
  { label: "Component sales", amt: 84200 },
  { label: "Sponsorships", amt: 12000 },
  { label: "Infra (Vercel + CDN)", amt: -9840 },
  { label: "Contractor - icons", amt: -15000 },
  { label: "Domain + email", amt: -1240 },
];

export function LedgerTotalsTable() {
  const net = LEDGER.reduce((a, r) => a + r.amt, 0);
  const income = LEDGER.filter((r) => r.amt > 0).reduce((a, r) => a + r.amt, 0);
  const spend = LEDGER.filter((r) => r.amt < 0).reduce((a, r) => a + r.amt, 0);
  return (
    <div className="tf-root tfv20 tf-anim-enter">
      <table>
        <thead><tr><th>Line</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
        <tbody className="tf-stagger">
          {LEDGER.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td className={"tfv20-amt tf-num" + (r.amt < 0 ? " tfv20-neg" : "")}>
                {r.amt < 0 ? "−" + money0(-r.amt) : money0(r.amt)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td>Income</td><td className="tfv20-amt tf-num">{money0(income)}</td></tr>
          <tr><td>Spend</td><td className="tfv20-amt tf-num tfv20-neg">−{money0(-spend)}</td></tr>
          <tr className="tfv20-grand"><td>Net</td><td className="tfv20-amt tf-num">{money0(net)}</td></tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v21 FileManagerTable - breadcrumbs, icon rows, size bars            */
/* ------------------------------------------------------------------ */

const FILES = [
  { name: "brand-assets", kind: "folder", size: 0, mod: "Nov 20" },
  { name: "goatui-hero.png", kind: "image", size: 1.8, mod: "Nov 22" },
  { name: "tokens.json", kind: "code", size: 0.04, mod: "Nov 23" },
  { name: "pitch-deck.pdf", kind: "doc", size: 4.6, mod: "Nov 18" },
  { name: "registry.csv", kind: "sheet", size: 0.9, mod: "Nov 24" },
];
const FILE_ICONS: Record<string, { icon: React.ReactNode; bg: string; fg: string }> = {
  folder: { icon: IconFolder, bg: "#fdf1e3", fg: "#b45309" },
  image: {
    icon: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="5.5" cy="6.5" r="1.25" fill="currentColor" /><path d="M2 12.5l3.5-3.5 2.5 2.5 3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    bg: "#e7f6ec", fg: "#15803d",
  },
  code: {
    icon: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden><path d="M6 4.5L2.5 8 6 11.5M10 4.5L13.5 8 10 11.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    bg: "#eef0fe", fg: "#4f46e5",
  },
  doc: {
    icon: <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden><path d="M4 1.5h4.5L12.5 5.5v9H4v-13z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M6 7h4M6 9.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" /></svg>,
    bg: "#fdeaea", fg: "#b91c1c",
  },
  sheet: {
    icon: <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden><rect x="2" y="2" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M2 6.5h12M2 10h12M6.5 2v12" stroke="currentColor" strokeWidth="1.25" /></svg>,
    bg: "#e6f6f8", fg: "#0e7490",
  },
};

const FM_FULL = ["goatui", "public", "assets"];
export function FileManagerTable() {
  const [depth, setDepth] = useState(3); // how many crumbs of goatui/public/assets are open
  const rows = depth >= 3
    ? FILES
    : [
        { name: FM_FULL[depth], kind: "folder", size: 0, mod: "Nov 20" },
        { name: depth === 1 ? "package.json" : "favicon.ico", kind: "code", size: 0.02, mod: "Nov 12" },
      ];
  const max = Math.max(...rows.map((f) => f.size));
  return (
    <div className="tf-root tfv21 tf-anim-enter">
      <div className="tfv21-crumbs">
        {FM_FULL.slice(0, depth).map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 && <span>/</span>}
            {i === depth - 1 ? <strong>{c}</strong> : <button onClick={() => setDepth(i + 1)}>{c}</button>}
          </React.Fragment>
        ))}
      </div>
      <table>
        <thead><tr><th>Name</th><th>Size</th><th>Modified</th></tr></thead>
        <tbody>
          {rows.map((f) => {
            const ic = FILE_ICONS[f.kind];
            return (
              <tr key={f.name} onClick={() => f.kind === "folder" && setDepth((d) => Math.min(3, d + 1))} style={f.kind === "folder" ? { cursor: "pointer" } : undefined}>
                <td><span className="tfv21-ico" style={{ background: ic.bg, color: ic.fg }}>{ic.icon}</span>{f.name}</td>
                <td>
                  {f.size > 0 && (
                    <>
                      <span className="tfv21-sizebar"><i style={{ width: `${(f.size / max) * 100}%` }} /></span>
                      <span className="tf-num" style={{ fontSize: 12, color: "var(--tf-ink-2)" }}>{f.size} MB</span>
                    </>
                  )}
                  {f.size === 0 && <span style={{ color: "var(--tf-ink-3)", fontSize: 12 }}>—</span>}
                </td>
                <td className="tf-num" style={{ color: "var(--tf-ink-2)", fontSize: 12 }}>{f.mod}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v22 DirectoryRosterTable - avatars, presence, role chips            */
/* ------------------------------------------------------------------ */

const AVA_COLORS = ["#4f46e5", "#0891b2", "#be185d", "#15803d", "#b45309"];

export function DirectoryRosterTable() {
  return (
    <div className="tf-root tfv22 tf-anim-enter">
      <table>
        <thead><tr><th>Member</th><th>Role</th><th>Team</th><th>Joined</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
        <tbody className="tf-stagger">
          {PEOPLE.map((p, i) => (
            <tr key={p.id}>
              <td>
                <span className="tfv22-person">
                  <span className={"tfv22-ava" + (p.status === "Offline" ? " off" : "")} style={{ background: AVA_COLORS[i] }}>
                    {p.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span className="tfv22-name">{p.name}<small>{p.email}</small></span>
                </span>
              </td>
              <td>{p.role}</td>
              <td><span className="tf-chip" style={{ background: "var(--tf-surface)", color: "var(--tf-ink-2)", border: "1px solid var(--tf-line)" }}>{p.team}</span></td>
              <td className="tf-num">2025-0{i + 3}-14</td>
              <td style={{ textAlign: "right" }}><button className="tf-btn">Message</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v23 LogStreamTable - terminal log stream with blinking caret        */
/* ------------------------------------------------------------------ */

const LOGS: [string, "INFO" | "WARN" | "ERROR" | "DEBUG", string][] = [
  ["09:02:11", "INFO", "GET /api/components 200 12ms"],
  ["09:02:14", "DEBUG", "cache hit: registry@v31"],
  ["09:02:31", "INFO", "POST /api/preview 201 88ms"],
  ["09:03:02", "WARN", "rate-limit 82% for key pk_…9fd2"],
  ["09:03:19", "ERROR", "render timeout: /templates/hero-3 (502)"],
  ["09:03:20", "INFO", "retry queued, attempt 1/3"],
];

export function LogStreamTable() {
  return (
    <div className="tf-root tfv23 tf-anim-enter">
      <div className="tfv23-bar"><i /><i /><i /><span>tail -f /var/log/goatui.log</span></div>
      <table>
        <tbody>
          {LOGS.map(([t, lvl, msg]) => (
            <tr key={t + msg}>
              <td className="tf-num" style={{ color: "#6b6b7c", width: 90 }}>{t}</td>
              <td style={{ width: 80 }}><span className={"tfv23-lvl " + lvl}>{lvl}</span></td>
              <td>{msg}</td>
            </tr>
          ))}
          <tr><td colSpan={3} style={{ borderTop: "1px solid #17171f", color: "#4ade80" }}>$ <span className="tfv23-caret" /></td></tr>
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v24 KpiDigestTable - KPI strip merged with detail rows              */
/* ------------------------------------------------------------------ */

const KPIS = [
  { label: "MRR", value: "₹1.84L", delta: "+9.2%", up: true },
  { label: "Active users", value: "3,412", delta: "+4.0%", up: true },
  { label: "Copies", value: "18.9k", delta: "+21%", up: true },
  { label: "Refunds", value: "0.4%", delta: "-0.1%", up: false },
];

export function KpiDigestTable() {
  return (
    <div className="tf-root tfv24 tf-anim-enter">
      <div className="tfv24-kpis">
        {KPIS.map((k) => (
          <div className="tfv24-kpi" key={k.label}>
            <h4>{k.label}</h4>
            <span className="tfv24-big tf-num">{k.value}</span>
            <span className={"tfv24-delta tf-num " + (k.up ? "up" : "down")}>{k.up ? "▲" : "▼"} {k.delta}</span>
          </div>
        ))}
      </div>
      <table>
        <thead><tr><th>Week</th><th>MRR</th><th>Users</th><th>Copies</th></tr></thead>
        <tbody>
          {[["W47", "₹1.81L", "3,290", "18,204"], ["W46", "₹1.69L", "3,112", "15,980"], ["W45", "₹1.55L", "2,940", "14,311"]].map((w) => (
            <tr key={w[0]}>{w.map((c, i) => <td key={i} className={i ? "tf-num" : ""}><strong>{c}</strong></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v25 PriorityInboxTable - inbox rows with spring star toggle         */
/* ------------------------------------------------------------------ */

const MAILS = [
  { from: "Vercel", subject: "Deployment goatui@main succeeded", time: "9:04", unread: true, starred: true },
  { from: "Figma", subject: "Meera commented on Table family v2", time: "8:41", unread: true, starred: false },
  { from: "GitHub", subject: "[goatui] PR #212: spring presets", time: "8:12", unread: false, starred: false },
  { from: "Linear", subject: "GOAT-88 assigned to you", time: "Yesterday", unread: false, starred: true },
  { from: "Stripe", subject: "Payout of ₹42,800 initiated", time: "Yesterday", unread: false, starred: false },
];

export function PriorityInboxTable() {
  const [stars, setStars] = useState<Set<string>>(new Set(MAILS.filter((m) => m.starred).map((m) => m.subject)));
  const [read, setRead] = useState<Set<string>>(new Set());
  const toggleStar = (s: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStars((x) => { const n = new Set(x); n.has(s) ? n.delete(s) : n.add(s); return n; });
  };
  return (
    <div className="tf-root tfv25 tf-anim-enter" role="table" aria-label="Inbox">
      {MAILS.map((m) => {
        const unread = m.unread && !read.has(m.subject);
        return (
          <div
            key={m.subject}
            className={"tfv25-row" + (unread ? " unread" : "")}
            role="row"
            tabIndex={0}
            onClick={() => setRead((x) => new Set(x).add(m.subject))}
            onKeyDown={(e) => e.key === "Enter" && setRead((x) => new Set(x).add(m.subject))}
          >
            <input type="checkbox" aria-label={`Select message from ${m.from}`} onClick={(e) => e.stopPropagation()} />
            <button
              className={"tfv25-star" + (stars.has(m.subject) ? " on" : "")}
              aria-pressed={stars.has(m.subject)}
              aria-label={`Star message from ${m.from}`}
              data-demo-star={m.subject.startsWith("Meera") ? "" : undefined}
              onClick={(e) => toggleStar(m.subject, e)}
            >★</button>
            <span className="tfv25-from">{m.from}</span>
            <span className="tfv25-subject">{m.subject}</span>
            <span className="tfv25-time">{m.time}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v26 GanttScheduleTable - bars spanning day columns                  */
/* ------------------------------------------------------------------ */

const GANTT_DAYS = 14;
const GANTT_ROWS = [
  { name: "Tokens v2", start: 0, len: 4, cls: "done" },
  { name: "Button family", start: 2, len: 5, cls: "done" },
  { name: "Card family", start: 5, len: 5, cls: "doing" },
  { name: "Table family", start: 8, len: 4, cls: "doing" },
  { name: "Site launch", start: 11, len: 3, cls: "todo" },
] as const;

export function GanttScheduleTable() {
  return (
    <div className="tf-root tfv26 tf-anim-enter">
      <table>
        <thead>
          <tr><th>Workstream</th>{Array.from({ length: GANTT_DAYS }, (_, i) => <th key={i} className="tf-num">D{i + 1}</th>)}</tr>
        </thead>
        <tbody>
          {GANTT_ROWS.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td className="day" colSpan={GANTT_DAYS}>
                <div className="tfv26-track">
                  <span
                    className={"tfv26-bar " + r.cls}
                    style={{ left: `${(r.start / GANTT_DAYS) * 100}%`, width: `${(r.len / GANTT_DAYS) * 100}%` }}
                    title={`${r.name}: D${r.start + 1}-D${r.start + r.len}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v27 SegmentedAssignTable - animated segmented control per row       */
/* ------------------------------------------------------------------ */

const SEG_OPTS = ["Design", "Eng", "QA"] as const;
const SEG_ROWS = [
  { task: "Radius audit", owner: 0 },
  { task: "Spring presets", owner: 1 },
  { task: "Table family", owner: 1 },
  { task: "A11y pass", owner: 2 },
];

export function SegmentedAssignTable() {
  const [assign, setAssign] = useState<Record<string, number>>(
    Object.fromEntries(SEG_ROWS.map((r) => [r.task, r.owner])),
  );
  return (
    <div className="tf-root tfv27 tf-anim-enter">
      <table>
        <thead><tr><th>Task</th><th>Assign to</th><th style={{ textAlign: "right" }}>Current</th></tr></thead>
        <tbody className="tf-stagger">
          {SEG_ROWS.map((r) => {
            const idx = assign[r.task];
            return (
              <tr key={r.task}>
                <td><strong>{r.task}</strong></td>
                <td>
                  <span className="tfv27-seg" role="group" aria-label={`Assign ${r.task}`}>
                    <span
                      className="tfv27-thumb"
                      style={{ left: `calc(${(idx * 100) / SEG_OPTS.length}% + 3px)`, width: `calc(${100 / SEG_OPTS.length}% - 5px)` }}
                      aria-hidden
                    />
                    {SEG_OPTS.map((o, i) => (
                      <button key={o} aria-pressed={i === idx} onClick={() => setAssign((a) => ({ ...a, [r.task]: i }))}>{o}</button>
                    ))}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}><span className="tf-chip" style={{ background: "var(--tf-accent-soft)", color: "var(--tf-accent)" }}>{SEG_OPTS[idx]}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v28 WideScrollTable - sticky first column over a wide grid          */
/* ------------------------------------------------------------------ */

const WIDE_COLS = ["Revenue", "Users", "Copies", "Rating", "Issues", "PRs", "Deploys", "Latency"];
const WIDE_ROWS = ["v0.6", "v0.7", "v0.8", "v0.9"].map((v, i) => ({
  v,
  cells: [`₹${(0.9 + i * 0.3).toFixed(1)}L`, `${(2.1 + i * 0.4).toFixed(1)}k`, `${(9 + i * 3)}k`, (4.5 + i * 0.1).toFixed(1), `${24 - i * 4}`, `${12 + i * 3}`, `${30 + i * 8}`, `${140 - i * 18}ms`],
}));

export function WideScrollTable() {
  return (
    <div className="tf-root tfv28-wrap tf-anim-enter">
      <div className="tfv28-scroll" tabIndex={0} role="region" aria-label="Release metrics, scroll horizontally">
        <table className="tfv28">
          <thead><tr><th>Release</th>{WIDE_COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {WIDE_ROWS.map((r) => (
              <tr key={r.v}><td>{r.v}</td>{r.cells.map((c, i) => <td key={i} className="tf-num">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v29 FilterChipsTable - chip toolbar filtering rows with entrance    */
/* ------------------------------------------------------------------ */

const TICKETS = [
  { id: "GOAT-81", title: "Focus ring clipped in Safari", type: "Bug", prio: "High" },
  { id: "GOAT-82", title: "Add golden-ratio scale to docs", type: "Docs", prio: "Low" },
  { id: "GOAT-83", title: "Spring overshoot on toggle", type: "Feature", prio: "Med" },
  { id: "GOAT-84", title: "Row hover flickers on Windows", type: "Bug", prio: "Med" },
  { id: "GOAT-85", title: "Kanban drag preview", type: "Feature", prio: "High" },
  { id: "GOAT-86", title: "Document pricing toggle", type: "Docs", prio: "Low" },
];
const TICKET_TYPES = ["All", "Bug", "Feature", "Docs"] as const;

export function FilterChipsTable() {
  const [filter, setFilter] = useState<(typeof TICKET_TYPES)[number]>("All");
  const rows = TICKETS.filter((t) => filter === "All" || t.type === filter);
  return (
    <div className="tf-root tfv29 tf-anim-enter">
      <div className="tfv29-bar" role="group" aria-label="Filter tickets">
        {TICKET_TYPES.map((t) => (
          <button key={t} className="tfv29-chip" aria-pressed={filter === t} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <table>
        <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Priority</th></tr></thead>
        <tbody key={filter}>
          {rows.map((t) => (
            <tr key={t.id}>
              <td className="tf-num"><strong>{t.id}</strong></td>
              <td>{t.title}</td>
              <td><span className="tf-chip" style={{ background: "var(--tf-surface)", color: "var(--tf-ink-2)", border: "1px solid var(--tf-line)" }}>{t.type}</span></td>
              <td>{t.prio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* v30 RadialStatusTable - progress rings per row                      */
/* ------------------------------------------------------------------ */

const RADIAL = [
  { name: "Button family", pct: 100 },
  { name: "Card family", pct: 86 },
  { name: "Table family", pct: 64 },
  { name: "Docs pass", pct: 32 },
];

function Ring({ pct }: { pct: number }) {
  const R = 16; // circumference = 2π·16 ≈ 100.53
  const C = 2 * Math.PI * R;
  return (
    <span className="tfv30-ring" role="img" aria-label={`${pct}% complete`}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle className="bg" cx="22" cy="22" r={R} />
        {pct >= 100 ? (
          <circle className="fg" cx="22" cy="22" r={R} />
        ) : (
          <circle className="fg" cx="22" cy="22" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
        )}
      </svg>
      <b className="tf-num">{pct}</b>
    </span>
  );
}

export function RadialStatusTable() {
  return (
    <div className="tf-root tfv30 tf-anim-enter">
      <table>
        <thead><tr><th>Workstream</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody className="tf-stagger">
          {RADIAL.map((r) => (
            <tr key={r.name}>
              <td><strong>{r.name}</strong></td>
              <td><Ring pct={r.pct} /></td>
              <td>{statusChip(r.pct === 100 ? "Paid" : r.pct >= 60 ? "Active" : "Pending")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
                                                                                         }
