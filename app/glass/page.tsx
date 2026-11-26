"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { glassItems } from "@/components/catalog/glass-items"

export default function GlassPage() {
  const [id, setId] = useState(glassItems[0].id)
  useEffect(() => {
    const h = window.location.hash.replace("#", "")
    if (glassItems.some((g) => g.id === h)) setId(h)
  }, [])
  const cur = glassItems.find((g) => g.id === id) || glassItems[0]
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border bg-card p-4">
        <Link href="/components" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">← Components</Link>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Liquid glass</p>
        {glassItems.map((g) => (
          <button
            key={g.id}
            onClick={() => { setId(g.id); window.history.replaceState(null, "", `#${g.id}`) }}
            className={`mb-0.5 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${id === g.id ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
          >
            {g.name}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <h1 className="mb-1 text-3xl font-bold">{cur.name}</h1>
        <p className="mb-6 text-muted-foreground">{cur.blurb}</p>
        <div className="inline-block overflow-hidden rounded-xl border border-border">
          <iframe key={cur.id} src={`/goat-glass/${cur.id}`} title={cur.name} width={800} height={600} className="block" />
        </div>
      </main>
    </div>
  )
}
