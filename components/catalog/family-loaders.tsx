"use client"

import React from "react"

// One dynamic import per family; each pulls in its own css. A component is picked by export name.
const loaders: Record<string, () => Promise<Record<string, any>>> = {
  ButtonFamily: () => import("./ButtonFamily"),
  BadgesFamily: () => import("./BadgesFamily.css").then(() => import("./BadgesFamily")),
  CardFamily: () => import("./CardFamily"),
  ChartFamily: () => import("./ChartFamily.css").then(() => import("./ChartFamily")),
  DataDisplayFamily: () => import("./DataDisplayFamily"),
  FormsFamily: () => import("./FormsFamily"),
  InputFamily: () => import("./InputFamily"),
  MenuFamily: () => import("./MenuFamily"),
  ModalFamily: () => import("./ModalFamily"),
  NavFlowFamily: () => import("./NavFlowFamily"),
  NavbarFamily: () => import("./NavbarFamily"),
  SectionsFamily: () => import("./SectionsFamily"),
  SliderFamily: () => import("./SliderFamily"),
  TableFamily: () => import("./TableFamily.css").then(() => import("./TableFamily")),
  ToastFamily: () => import("./ToastFamily"),
  LoadersFamily: () => import("./LoadersFamily"),
  AccordionFamily: () => import("./AccordionFamily"),
  TabBatchA: () => import("./TabBatchA.css").then(() => import("./TabBatchA")),
  TabBatchB: () => import("./TabBatchB.css").then(() => import("./TabBatchB")),
  TabBatchC: () => import("./TabBatchC.css").then(() => import("./TabBatchC")),
  TabBatchD: () => import("./TabBatchD.css").then(() => import("./TabBatchD")),
}

// Components that need props get a small stateful demo wrapper (what the lab pages did by hand).
const DEMOS: Record<string, (C: any) => React.ComponentType<any>> = {
  "ButtonFamily.PlayPauseMorphButton": (C) => function Demo() {
    const [playing, setPlaying] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    React.useEffect(() => {
      if (!playing) return
      const t = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.02)), 120)
      return () => clearInterval(t)
    }, [playing])
    return <C playing={playing} onToggle={setPlaying} label="Sundown" progress={progress} />
  },
  "ButtonFamily.SubmitFlowButton": (C) => function Demo() {
    const [email, setEmail] = React.useState("")
    const [msg, setMsg] = React.useState("")
    return (
      <div className="flex w-full max-w-xs flex-col items-stretch gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <C email={() => email} onState={(m: string) => setMsg(m)} />
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      </div>
    )
  },
}

const cache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>()

export function familyComponent(family: string, name: string) {
  const key = `${family}.${name}`
  let c = cache.get(key)
  if (!c) {
    c = React.lazy(() => loaders[family]().then((m) => ({ default: DEMOS[key] ? DEMOS[key](m[name]) : m[name] || (() => null) })))
    cache.set(key, c)
  }
  return c
}

class Boundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? <div className="text-xs text-muted-foreground">Preview failed to load</div> : this.props.children }
}

// Some families keep their design tokens on a root class that the lab pages added by hand.
const ROOT: Record<string, string> = { NavbarFamily: "nf-root", TableFamily: "tf-root", ToastFamily: "tf-root", ButtonFamily: "bf-page" }

export function LiveFamily({ family, name }: { family: string; name: string }) {
  const C = familyComponent(family, name)
  return (
    <Boundary>
      <React.Suspense fallback={<div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />}>
        {ROOT[family] ? <div className={ROOT[family]} style={{ background: "transparent", minHeight: 0, padding: 0, width: "100%" }}><C /></div> : <C />}
      </React.Suspense>
    </Boundary>
  )
}
