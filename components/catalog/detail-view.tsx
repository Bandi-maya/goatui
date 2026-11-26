"use client"

import React, { useMemo, useState } from "react"
import { Check, ChevronRight, Code2, Copy, Eye, Monitor, Smartphone, Sparkles, Tablet } from "lucide-react"

export type DetailFile = { name: string; code: string }

type Props = {
  title: string
  category?: string
  description: string
  status?: string
  preview: React.ReactNode
  files: DetailFile[]
  usage?: string
  prompt?: string
  variants?: string[]
  variant?: string
  onVariant?: (v: string) => void
  onBack: () => void
  backLabel?: string
  fillPreview?: boolean // preview brings its own full canvas (no dotted stage)
  meta?: [string, string][]
}

function useCopy() {
  const [done, setDone] = useState<string | null>(null)
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text)
    setDone(key)
    setTimeout(() => setDone((d) => (d === key ? null : d)), 1800)
  }
  return { done, copy }
}

export function DetailView(p: Props) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [file, setFile] = useState(0)
  const [vp, setVp] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const { done, copy } = useCopy()
  const cur = p.files[Math.min(file, p.files.length - 1)] || { name: "", code: "" }
  const lines = useMemo(() => cur.code.split("\n"), [cur.code])
  const prompt =
    p.prompt ||
    `Build a ${p.title} component for a React + Tailwind project.\n\n${p.description}\n\nUse theme tokens (bg-background, text-foreground, border-border, bg-primary), keep it accessible and responsive, and make it work in light and dark themes.\n\nReference implementation (${cur.name}):\n\n\`\`\`\n${cur.code}\n\`\`\``
  const vpW = { desktop: "100%", tablet: "768px", mobile: "375px" }[vp]

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <button onClick={p.onBack} className="mb-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            {p.backLabel || "All components"}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{p.title}</h2>
            {p.category && <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{p.category}</span>}
            {p.status && <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500">{p.status}</span>}
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{p.description}</p>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button onClick={() => copy("prompt", prompt)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted sm:flex-none">
            {done === "prompt" ? <Check className="h-4 w-4 text-emerald-500" /> : <Sparkles className="h-4 w-4" />}
            {done === "prompt" ? "Copied" : "Copy prompt"}
          </button>
          <button onClick={() => copy("code", p.files.map((f) => f.code).join("\n\n"))} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:flex-none">
            {done === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {done === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-sm">
          {([["preview", "Preview", Eye], ["code", "Code", Code2]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${tab === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        {tab === "preview" && p.variants && p.variants.length > 1 && (
          <div className="flex max-w-full gap-1 overflow-x-auto">
            {p.variants.map((v) => (
              <button
                key={v}
                onClick={() => p.onVariant?.(v)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${p.variant === v ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        {tab === "preview" && !p.fillPreview && (
          <div className="ml-auto hidden items-center gap-1 sm:flex">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([id, Icon]) => (
              <button key={id} onClick={() => setVp(id)} aria-label={id} className={`rounded-md p-2 transition-colors ${vp === id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
        {tab === "code" && p.files.length > 1 && (
          <div className="flex max-w-full gap-1 overflow-x-auto">
            {p.files.map((f, i) => (
              <button key={f.name} onClick={() => setFile(i)} className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${i === file ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Canvas / code */}
      {tab === "preview" ? (
        p.fillPreview ? (
          <div className="flex justify-center overflow-hidden rounded-xl border border-border bg-muted/20"><div className="w-full">{p.preview}</div></div>
        ) : (
          <div
            className="flex min-h-[320px] justify-center overflow-auto rounded-xl border border-border bg-muted/20 p-4 sm:min-h-[460px] sm:p-8"
            style={{ backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          >
            <div className="flex w-full items-center justify-center transition-all duration-300" style={{ maxWidth: vpW }}>
              {p.preview}
            </div>
          </div>
        )
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-xs text-muted-foreground">{cur.name}</span>
            <button onClick={() => copy("file", cur.code)} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {done === "file" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {done === "file" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="max-h-[560px] overflow-auto py-3 font-mono text-[12.5px] leading-[1.65] text-foreground/90">
            {lines.map((l, i) => (
              <div key={i} className="flex min-w-max">
                <span className="w-12 shrink-0 select-none pr-4 text-right text-muted-foreground/50">{i + 1}</span>
                <span className="whitespace-pre pr-6">{l || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage + details */}
      {(p.usage || p.meta) && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          {p.usage && (
            <section className="min-w-0">
              <h3 className="mb-2 text-sm font-semibold">Usage</h3>
              <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-[12.5px] leading-relaxed"><code>{p.usage}</code></pre>
            </section>
          )}
          {p.meta && (
            <section>
              <h3 className="mb-2 text-sm font-semibold">Details</h3>
              <dl className="divide-y divide-border rounded-xl border border-border text-sm">
                {p.meta.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 px-3 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
