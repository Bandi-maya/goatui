"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, Sun, Moon, Menu, X } from "lucide-react"
import { componentsRegistry } from "@/lib/component-registry"
import { catalogItems } from "@/lib/catalog-index"
import { glassItems } from "@/components/catalog/glass-items"
import { entryFor } from "@/components/catalog/overview-previews"
import { DetailView, DetailFile } from "@/components/catalog/detail-view"
import { renderComponentDemo } from "@/components/catalog/primitive-demo"
import { LiveFamily } from "@/components/catalog/family-loaders"
import { ScaledFrame, WhenVisible } from "@/components/catalog/scaled-frame"
import { CategoryIcon } from "@/components/catalog/category-icons"
import { useTheme } from "@/components/theme-provider"

type Kind = "prim" | "cat" | "glass" | "block"
type Item = { key: string; kind: Kind; name: string; category: string; family?: string; blurb: string; ref?: any }

const PRIM = "Primitives"
const GLASS = "Liquid glass"
const BLOCKS = "Blocks"
const EXTRA = "Standalone"

const blockFiles = ["404-1","banner-1","billing-page-1","blog-cards-1","checkout-1","coming-soon-1","comparison-1","contact-1","content-1","cta-1","cta-split-1","dashboard-1","dashboard-page-1","developer-tool-1","faq-1","feature-grid-1","footer-1","footer-2","gallery-1","hero-1","integrations-1","login-1","logo-cloud-1","newsletter-1","poll-1","portfolio-1","portfolio-2","press-logos-1","pricing-1","pricing-page-1","profile-1","saas-landing-1","settings-1","signup-1","stats-1","stats-chart-1","steps-1","storefront-1","storefront-2","support-inbox-1","support-inbox-2","team-1","testimonial-1","timeline-1"]

const pretty = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/-/g, " ").replace(/\b1$/, "").trim().replace(/^\w/, (c) => c.toUpperCase())
// Families whose pieces are big get a smaller scale in grid thumbnails.
// Stages follow the theme: card surface and foreground ink from the active theme. Button designs keep their warm paper stage in light mode.
const STAGE_BG: Record<string, string> = { ButtonFamily: "var(--stage-btn)", NavbarFamily: "var(--stage-nav)" }
const FULL = new Set(["SectionsFamily", "ModalFamily", "NavbarFamily", "NavFlowFamily", "TableFamily", "TabBatchA", "TabBatchB", "TabBatchC", "TabBatchD", "AccordionFamily"])
const BIG = new Set(["SectionsFamily", "NavbarFamily", "TableFamily", "ChartFamily", "CardFamily", "NavFlowFamily", "DataDisplayFamily"])
const UP: Record<string, number> = { ModalFamily: 1.15, ButtonFamily: 1.1, FormsFamily: 0.9, MenuFamily: 1, InputFamily: 0.9, AccordionFamily: 0.9 }

const bsrc = (it: Item) => (String(it.ref).startsWith("/") ? it.ref : `/goat-blocks/${it.ref}`)
const bw = (it: Item) => (it.category === EXTRA ? (/inline-edit|rolling-countdown/.test(String(it.ref)) ? 400 : 640) : 1280)
const bh = (it: Item) => (it.category === EXTRA ? 260 : 800)

function Thumb({ it }: { it: Item }) {
  if (it.kind === "prim") {
    return <div className="flex h-full items-center justify-center p-4 pointer-events-none select-none">{renderComponentDemo(it.ref.component, it.name, "default")}</div>
  }
  if (it.kind === "glass") return <ScaledFrame src={`/goat-glass/${it.ref.id}`} title={it.name} w={800} h={600} interactive={false} lazy />
  if (it.kind === "block" && it.category === EXTRA) return <WhenVisible className="flex h-full w-full items-center bg-white"><div className="w-full"><ScaledFrame src={bsrc(it)} title={it.name} w={bw(it)} h={bh(it)} interactive={false} maxScale={1} /></div></WhenVisible>
  if (it.kind === "block") return <WhenVisible className="h-full"><ScaledFrame src={bsrc(it)} title={it.name} w={bw(it)} h={bh(it)} interactive={false} maxScale={it.category === EXTRA ? 1 : 0.3} /></WhenVisible>
  if (it.family === "ModalFamily") return <WhenVisible className="h-full overflow-hidden"><ModalThumb it={it} /></WhenVisible>
  const s = UP[it.family!] ?? (BIG.has(it.family!) ? 0.5 : 0.8)
  return (
    <WhenVisible className="h-full overflow-hidden">
      <FitStage it={it} base={s} />
    </WhenVisible>
  )
}


const OVERLAY_FAMILIES = new Set(["ModalFamily", "OverlayFamily"])

// Measures where the visible leaf elements of a live render actually sit and returns the shift that puts their middle on the frame's middle.
export function useCenterShift(frame: React.RefObject<HTMLElement | null>, content: React.RefObject<HTMLElement | null>, dep: unknown) {
  const [d, setD] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const run = () => {
      const f = frame.current, c = content.current
      if (!f || !c) return
      const fr = f.getBoundingClientRect()
      let l = 1e9, t = 1e9, r = -1e9, b = -1e9
      c.querySelectorAll("*").forEach((el) => {
        const e = el as HTMLElement
        const ownText = Array.from(e.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0)
        if (e.children.length && !ownText && !(e instanceof SVGElement)) return
        if (e.closest("svg") && e.tagName.toLowerCase() !== "svg") return
        for (let n: HTMLElement | null = e; n && n !== c.parentElement; n = n.parentElement) {
          const cs = getComputedStyle(n)
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return
        }
        const cs2 = getComputedStyle(e)
        const tag = e.tagName.toLowerCase()
        const paints = (e.textContent || "").trim().length > 0 || ["svg", "img", "canvas", "input", "video", "select", "textarea"].includes(tag) || (cs2.backgroundColor !== "rgba(0, 0, 0, 0)" && cs2.backgroundColor !== "transparent") || cs2.backgroundImage !== "none" || parseFloat(cs2.borderTopWidth) > 0 || parseFloat(cs2.borderBottomWidth) > 0 || cs2.boxShadow !== "none"
        if (!paints) return
        const q0 = e.getBoundingClientRect()
        const q = { left: Math.max(q0.left, fr.left), right: Math.min(q0.right, fr.right), top: Math.max(q0.top, fr.top), bottom: Math.min(q0.bottom, fr.bottom), width: 0, height: 0 }
        q.width = q.right - q.left; q.height = q.bottom - q.top
        if (q.width < 2 || q.height < 2) return
        l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom)
      })
      if (r < l) return
      const dx = (fr.left + fr.right) / 2 - (l + r) / 2, dy = (fr.top + fr.bottom) / 2 - (t + b) / 2
      setD((p) => (Math.abs(dx) < 1 && Math.abs(dy) < 1 ? p : { x: Math.round(p.x + dx), y: Math.round(p.y + dy) }))
    }
    const ts = [150, 500, 1200, 2500].map((ms) => setTimeout(run, ms))
    return () => { ts.forEach(clearTimeout) }
  }, [frame, content, dep])
  return d
}

// Modal, dialog and drawer cards show the component open, in a 480x360 frame scaled to the card, so you see its real content.
function ModalThumb({ it }: { it: Item }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0.6)
  useEffect(() => {
    const o = ref.current
    if (!o) return
    const fit = () => setK(Math.min(o.clientWidth / 480, o.clientHeight / 360))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(o)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="pointer-events-none relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 top-0 [&_.gmf-stagewrap]:!h-[360px]" style={{ width: 480, height: 360, transform: `translateX(-50%) scale(${k})`, transformOrigin: "top center" }}>
        <LiveFamily family="ModalFamily" name={it.name} />
      </div>
    </div>
  )
}

// Centres the live render in the card and shrinks it only as far as needed so nothing is cropped.
function FitStage({ it, base }: { it: Item; base: number }) {
  const outer = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const [k, setK] = useState(base)
  const [w, setW] = useState(0)
  useEffect(() => {
    const o = outer.current, i = inner.current
    if (!o || !i) return
    const fit = () => {
      const W = o.clientWidth, H = o.clientHeight
      setW(W / base)
      const ih = i.offsetHeight, iw = i.firstElementChild ? (i.firstElementChild as HTMLElement).scrollWidth : 0
      let kk = base
      if (ih > 0) kk = Math.min(kk, (H * 0.94) / ih)
      if (iw > 0 && W > 0) kk = Math.min(kk, (W * 0.96) / Math.max(iw, W / base))
      const sc = i.getBoundingClientRect().width / Math.max(1, i.offsetWidth) || 1
      let ul = 1e9, ur = -1e9
      i.querySelectorAll("*").forEach((el) => { const e = el as HTMLElement; if (e.children.length) return; const q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return; ul = Math.min(ul, q.left); ur = Math.max(ur, q.right) })
      if (ur > ul && W > 0) { const natural = (ur - ul) / sc; kk = Math.min(kk, (W * 0.96) / natural) }
      setK(Math.max(0.2, kk))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(o); ro.observe(i)
    const t = setTimeout(fit, 600)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [base])
  const d = useCenterShift(outer, inner, `${k}|${w}`)
  return (
    <div ref={outer} style={{ background: STAGE_BG[it.family!] || "hsl(var(--card))", color: STAGE_BG[it.family!] ? "var(--stage-fg)" : "hsl(var(--foreground))" }} className="pointer-events-none relative h-full select-none overflow-hidden">
      <div style={{ position: "absolute", inset: 0, transform: `translate(${d.x}px,${d.y}px)` }}>
        <div ref={inner} style={{ position: "absolute", left: "50%", top: "50%", width: w || `${100 / base}%`, transform: `translate(-50%,-50%) scale(${k})`, transformOrigin: "center" }} className="flex justify-center [contain:layout]">
          <div className={`flex w-full justify-center ${FULL.has(it.family!) ? "[&>*]:w-full" : ""}`}><LiveFamily family={it.family!} name={it.name} /></div>
        </div>
      </div>
    </div>
  )
}


// Wraps a self-contained HTML page into a copy-paste React component (TSX and JSX), so no code tab shows raw HTML.
const esc = (h: string) => h.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
function htmlToReact(name: string, html: string, w: number, h: number) {
  let comp0 = name.replace(/\.html$/, "").split(/[^A-Za-z0-9]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join("") || "GoatItem"
  const comp = /^[0-9]/.test(comp0) ? "Block" + comp0 : comp0
  const body = `const HTML = \`${esc(html)}\`\n\nexport default function ${comp}() {\n  return (\n    <iframe\n      title="${comp}"\n      srcDoc={HTML}\n      style={{ width: "100%", maxWidth: ${w}, aspectRatio: "${w} / ${h}", border: 0, display: "block", background: "#fff" }}\n    />\n  )\n}\n`
  return { name: `${comp}.tsx`, altName: `${comp}.jsx`, code: `import React from "react"\n\n${body}`, alt: `import React from "react"\n\n${body}` }
}

function useSource(it: Item | null) {
  const [files, setFiles] = useState<DetailFile[]>([])
  useEffect(() => {
    setFiles([])
    if (!it) return
    let live = true
    const done = (f: DetailFile[]) => live && setFiles(f)
    if (it.kind === "prim") {
      const base = { name: `${it.name.toLowerCase()}.tsx`, code: it.ref.source || "" }
      done([base])
      fetch("/catalog-src/prims-jsx.json").then((r) => r.json()).then((j) => { const alt = j[it.name]; if (alt) done([{ ...base, altName: `${it.name.toLowerCase()}.jsx`, alt }]) }).catch(() => {})
    }
    else if (it.kind === "cat") {
      Promise.all([fetch(`/catalog-src/${it.family}.json`).then((r) => r.json()), fetch(`/catalog-src/${it.family}.css`).then((r) => (r.ok ? r.text() : ""))])
        .then(async ([j, css]) => {
          const sa = j.standalone?.[it.name]
          if (!sa) return done([{ name: `${it.name}.tsx`, code: j.fns?.[it.name] || j.full }])
          const extra = await Promise.all((sa.css as string[]).filter((c) => c !== `${it.family}.css`).map((c) => fetch(`/catalog-src/${c}`).then((r) => (r.ok ? r.text() : "")).then((t) => ({ name: c, code: t }))))
          done([{ name: `${it.name}.tsx`, altName: `${it.name}.jsx`, code: sa.tsx, alt: sa.jsx }, ...(css ? [{ name: `${it.family}.css`, code: css }] : []), ...extra.filter((e) => e.code)])
        })
        .catch(() => done([{ name: "source.tsx", code: "// source unavailable" }]))
    } else if (it.kind === "glass") {
      Promise.all([`/goat-glass/${it.ref.id}`, "/goat-glass/glass-engine.js"].map((u) => fetch(u).then((r) => r.text())))
        .then(([h, e]) => done([htmlToReact(String(it.ref.id), h.replace(/<script src="\/goat-glass\/glass-engine\.js"><\/script>/, () => "<script>" + e + "<\/script>"), 800, 600)]))
        .catch(() => {})
    } else {
      fetch(bsrc(it)).then((r) => r.text()).then((h) => done([htmlToReact(String(it.ref).split("/").pop() || "block", h, bw(it), bh(it))])).catch(() => {})
    }
    return () => { live = false }
  }, [it])
  return files
}

export default function ComponentsExplorer() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === "goat-light" || theme === "glass-frost"
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [q, setQ] = useState("")
  const [cat, setCat] = useState("All")
  const [sel, setSel] = useState<Item | null>(null)
  const [shown, setShown] = useState(60)

  const items = useMemo<Item[]>(() => {
    const prim: Item[] = componentsRegistry.map((c: any) => ({ key: `prim.${c.name}`, kind: "prim", name: c.name, category: PRIM, blurb: entryFor(c.name).blurb, ref: c }))
    const cats: Item[] = catalogItems.map((c) => ({ key: c.id, kind: "cat", name: c.name, category: c.category, family: c.family, blurb: pretty(c.name) + " · " + c.category }))
    const gl: Item[] = glassItems.map((g) => ({ key: `glass.${g.id}`, kind: "glass", name: g.name, category: GLASS, blurb: g.blurb, ref: g }))
    const bl: Item[] = blockFiles.map((f) => ({ key: `block.${f}`, kind: "block", name: pretty(f.replace(/\.html$/, "")), category: BLOCKS, blurb: "Full page block", ref: `${f}` }))
    const ex: Item[] = [["inline-edit", "Inline edit", "Click to edit text, Enter saves, Esc cancels."], ["rolling-countdown", "Rolling countdown", "Digits roll like a counter, with pause and resume."], ["scrolling-strip", "Scrolling strip", "Endless marquee strip."], ["overlay-scrollbar", "Overlay scrollbar", "Scroll area with a thin overlay scrollbar."], ["floating-panel", "Floating panel", "Draggable, resizable panel with minimize and close."]].map(([f, n, b]) => ({ key: `extra.${f}`, kind: "block", name: n, category: EXTRA, blurb: b, ref: `/goat-extras/${f}` }))
    return [...gl, ...ex, ...cats, ...prim, ...bl]
  }, [])

  const categories = useMemo(() => {
    const m = new Map<string, number>()
    items.forEach((i) => m.set(i.category, (m.get(i.category) || 0) + 1))
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [items])

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return items.filter((i) => (cat === "All" || i.category === cat) && (!s || i.name.toLowerCase().includes(s) || pretty(i.name).toLowerCase().includes(s) || i.category.toLowerCase().includes(s)))
  }, [items, q, cat])

  useEffect(() => setShown(60), [q, cat])
  useEffect(() => {
    const sync = () => {
      const h = decodeURIComponent(window.location.hash.replace("#", ""))
      setSel(h ? items.find((i) => i.key === h) || null : null)
    }
    sync()
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync) }
  }, [items])
  // Opening a component is a real history entry, so Back returns to the list with its category and search intact.
  const open = (i: Item | null) => {
    if (typeof window === "undefined") return
    if (i) {
      listScroll.current = mainRef.current?.scrollTop ?? 0
      history.pushState({ goatDetail: true }, "", `#${encodeURIComponent(i.key)}`)
      setSel(i)
    } else if (history.state && history.state.goatDetail) {
      history.back()
    } else {
      history.replaceState(null, "", window.location.pathname)
      setSel(null)
    }
    window.scrollTo?.(0, 0)
  }
  const files = useSource(sel)
  const [variant, setVariant] = useState("default")
  useEffect(() => setVariant("default"), [sel])
  const mainRef = React.useRef<HTMLElement>(null)
  // Remember where the list was so Back returns to the same card, not the top.
  const listScroll = React.useRef(0)
  const prevSel = React.useRef<Item | null>(null)
  React.useLayoutEffect(() => {
    const m = mainRef.current
    if (!m) return
    if (sel && !prevSel.current) m.scrollTo?.(0, 0)
    else if (!sel && prevSel.current) m.scrollTo?.(0, listScroll.current)
    else if (sel) m.scrollTo?.(0, 0)
    prevSel.current = sel
  }, [sel])


  const preview = (it: Item): { node: React.ReactNode; fill?: boolean } => {
    if (it.kind === "prim") return { node: renderComponentDemo(it.ref.component, it.name, variant) }
    if (it.kind === "cat") return { node: <DetailStage it={it} /> }
    if (it.kind === "glass") return { node: <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl border border-border"><ScaledFrame src={`/goat-glass/${it.ref.id}`} title={it.name} w={800} h={600} /></div>, fill: true }
    return it.category === EXTRA ? { node: <div className="w-full overflow-hidden rounded-xl border border-border bg-white"><ScaledFrame src={bsrc(it)} title={it.name} w={bw(it)} h={300} maxScale={1.6} /></div>, fill: true } : { node: <ScaledFrame src={bsrc(it)} title={it.name} w={1280} h={800} />, fill: true }
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <div onClick={() => setSidebarOpen(false)} className={`liq-backdrop fixed inset-0 z-40 bg-black/60 lg:hidden ${sidebarOpen ? "is-open" : "pointer-events-none"}`} />
      <aside className={`liq-drawer fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-card lg:static lg:z-auto lg:translate-x-0 ${sidebarOpen ? "is-open" : ""}`}>
        <div className="relative border-b border-border p-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-neutral-950"><img src="/goat-red/assets/goat-logo.png" alt="" className="h-6 w-6 object-contain" /></div>
            <div><h1 className="text-lg font-bold tracking-wide">GOAT UI</h1><p className="text-xs text-muted-foreground">v0.1.0</p></div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-5 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${items.length} components...`} className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
          {[["All", items.length] as [string, number], ...categories].map(([c, n], idx) => {
                        return (
              <button key={c} style={{ "--i": idx } as React.CSSProperties} onClick={() => { setCat(c); open(null); setSidebarOpen(false) }} className={`liq-item flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${cat === c ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}>
                <span className="flex items-center gap-2"><CategoryIcon name={c} className="h-4 w-4" />{c === "All" ? "All components" : c}</span>
                <span className="text-xs opacity-60">{n}</span>
              </button>
            )
          })}
        </div>
        <div className="space-y-2 border-t border-border p-4">
          <button onClick={() => setTheme(isLight ? "leather-black" : "goat-light")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted">
            {!isLight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{!isLight ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg border border-border p-2 hover:bg-muted" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="font-semibold tracking-wide">GOAT UI</span>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} items</span>
        </div>
        {!sel ? (
          <div className="p-4 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Components</h2>
                <p className="text-muted-foreground">{items.length} components and blocks. Every card is a live render, open one to use it and copy the code.</p>
              </div>
              <div className="mb-4 text-xs text-muted-foreground">{cat === "All" ? "All components" : cat} · {filtered.length} results</div>
              {filtered.length === 0 ? <p className="py-12 text-center text-muted-foreground">Nothing matches your search.</p> : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.slice(0, shown).map((it) => (
                    <button key={it.key} onClick={() => open(it)} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                      <div className={`relative w-full overflow-hidden border-b border-border bg-muted/30 ${it.family === "ModalFamily" ? "h-56" : "h-44"}`}>
                        <Thumb it={it} />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"><span className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background">Open</span></div>
                      </div>
                      <div className="flex w-full items-center gap-3 p-4">
                        <div className="min-w-0"><h3 className="truncate font-semibold leading-tight">{pretty(it.name)}</h3><p className="truncate text-xs text-muted-foreground">{it.blurb}</p></div>
                        <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{it.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {filtered.length > shown && (
                <div className="mt-8 flex justify-center"><button onClick={() => setShown((n) => n + 60)} className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-muted">Show more ({filtered.length - shown} left)</button></div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-8">
            <DetailView
              title={pretty(sel.name)}
              category={sel.category}
              description={sel.kind === "cat" ? `${pretty(sel.name)} from the ${sel.category} set. Live and interactive, copy the code below.` : sel.blurb}
              status={sel.kind === "prim" ? "stable" : undefined}
              preview={preview(sel).node}
              fillPreview={preview(sel).fill}
              files={files.length ? files : [{ name: "loading…", code: "" }]}
              usage={sel.kind === "cat" ? `import { ${sel.name} } from "@/components/${sel.family}"\n\nexport default function Example() {\n  return <${sel.name} />\n}` : sel.kind === "prim" ? `import { ${sel.name} } from "@/components/ui/${sel.name.toLowerCase()}"\n\nexport default function Example() {\n  return <${sel.name} />\n}` : undefined}
              variants={sel.kind === "prim" ? ["default", "secondary", "outline", "ghost"] : undefined}
              variant={variant}
              onVariant={setVariant}
              onBack={() => open(null)}
              meta={[["Category", sel.category]]}
            />
          </div>
        )}
      </main>
    </div>
  )
}

function DetailStage({ it }: { it: Item }) {
  const f = React.useRef<HTMLDivElement>(null)
  const c = React.useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  const [hh, setHh] = useState<number | undefined>(undefined)
  useEffect(() => {
    const fit = () => {
      const fe = f.current, ce = c.current
      if (!fe || !ce) return
      const cs = getComputedStyle(fe)
      const avail = fe.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const sc = ce.getBoundingClientRect().width / Math.max(1, ce.offsetWidth) || 1
      let ul = 1e9, ur = -1e9
      ce.querySelectorAll("*").forEach((el) => { const e = el as HTMLElement; if (e.children.length) return; const q = e.getBoundingClientRect(); if (q.width < 2 || q.height < 2) return; ul = Math.min(ul, q.left); ur = Math.max(ur, q.right) })
      const natural = ur > ul ? (ur - ul) / sc : 0
      const kk = !FULL.has(it.family!) && !/Marquee|AvatarV04/.test(it.name) && natural > avail && avail > 0 ? Math.max(0.3, avail / natural) : 1
      setK((p) => (Math.abs(p - kk) > 0.01 ? kk : p))
      setHh((p) => (p === undefined ? ce.offsetHeight * kk : p))
    }
    const ts = [200, 800].map((ms) => setTimeout(fit, ms))
    return () => { ts.forEach(clearTimeout) }
  }, [it.name])
  const d0 = useCenterShift(f, c, `${it.name}|${k}`)
  const d = (it.family === "MenuFamily" || it.family === "ModalFamily" || it.family === "NavbarFamily" || it.family === "NavFlowFamily" || it.family === "TableFamily" || it.family === "AccordionFamily" || it.family === "SectionsFamily" || /Marquee|AvatarV04/.test(it.name) || /^TabBatch/.test(it.family || "")) ? { x: 0, y: 0 } : d0
  return (
    <div ref={f} style={{ background: STAGE_BG[it.family!] || "hsl(var(--card))", color: STAGE_BG[it.family!] ? "var(--stage-fg)" : "hsl(var(--foreground))" }} className={`flex w-full min-w-0 items-center justify-center overflow-hidden rounded-lg p-3 sm:p-6 ${OVERLAY_FAMILIES.has(it.family!) ? "min-h-[620px]" : it.family === "NavFlowFamily" ? "min-h-[440px]" : /^MegaMenu/.test(it.name) ? "min-h-[580px] items-start" : "min-h-[320px]"}`}>
      <div style={{ minHeight: hh, width: "100%" }} className="flex items-start justify-center">
        <div ref={c} style={{ transform: `translate(${d.x}px,${d.y}px) scale(${k})`, transformOrigin: "center" }} className={`flex w-full flex-none justify-center ${FULL.has(it.family!) ? "[&>*]:w-full" : ""}`}><LiveFamily family={it.family!} name={it.name} /></div>
      </div>
    </div>
  )
}
