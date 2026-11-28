"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { glassItems } from "@/components/catalog/glass-items"
import { DetailView, DetailFile } from "@/components/catalog/detail-view"

// Renders the fixed 800x600 scene scaled down to the available width.
function ScaledFrame({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 800)))
    ro.observe(el)
    setScale(Math.min(1, el.clientWidth / 800))
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl border border-border" style={{ height: 600 * scale }}>
      <iframe src={src} title={title} width={800} height={600} className="block origin-top-left border-0" style={{ transform: `scale(${scale})` }} />
    </div>
  )
}

export default function GlassPage() {
  const [id, setId] = useState(glassItems[0].id)
  useEffect(() => {
    const h = window.location.hash.replace("#", "")
    if (glassItems.some((g) => g.id === h)) setId(h)
  }, [])
  const [files, setFiles] = useState<DetailFile[]>([{ name: "loading…", code: "" }])
  const cur = glassItems.find((g) => g.id === id) || glassItems[0]
  useEffect(() => {
    let live = true
    Promise.all([`/goat-glass/${cur.id}`, "/goat-glass/glass-engine.js"].map((u) => fetch(u).then((r) => r.text()))).then(([html, eng]) => {
      if (live) setFiles([{ name: `${cur.id}.html`, code: html }, { name: "glass-engine.js", code: eng }])
    }).catch(() => {})
    return () => { live = false }
  }, [cur.id])
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
      <aside className="shrink-0 border-b border-border bg-card p-4 lg:w-64 lg:border-b-0 lg:border-r">
        <Link href="/components" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">← Components</Link>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Liquid glass</p>
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
          {glassItems.map((g) => (
            <button
              key={g.id}
              onClick={() => { setId(g.id); window.history.replaceState(null, "", `#${g.id}`) }}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors lg:w-full ${id === g.id ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <DetailView
          key={cur.id}
          title={cur.name}
          category="Liquid glass"
          description={cur.blurb}
          status="stable"
          fillPreview
          preview={<ScaledFrame src={`/goat-glass/${cur.id}`} title={cur.name} />}
          files={files}
          usage={`<iframe src="/goat-glass/${cur.id}" width="800" height="600" />\n\n// shared engine, loaded once by every glass item:\n<script src="/goat-glass/glass-engine.js"></script>`}
          onBack={() => (window.location.href = "/components")}
          backLabel="All components"
          meta={[["Category", "Liquid glass"], ["Engine", "glass-engine.js"], ["Canvas", "800 x 600"]]}
        />
      </main>
    </div>
  )
}
