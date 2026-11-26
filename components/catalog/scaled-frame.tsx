"use client"

import React, { useEffect, useRef, useState } from "react"

// Shows a fixed-size page (iframe) scaled to the available width.
export function ScaledFrame({ src, title, w = 800, h = 600, interactive = true, maxScale = 1, lazy = false }: { src: string; title: string; w?: number; h?: number; interactive?: boolean; maxScale?: number; lazy?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setScale(Math.min(maxScale, el.clientWidth / w))
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    fit()
    return () => ro.disconnect()
  }, [w, maxScale])
  return (
    <div ref={box} className="w-full overflow-hidden" style={{ height: h * scale }}>
      <iframe src={src} title={title} width={w} height={h} loading={lazy ? "lazy" : undefined} tabIndex={interactive ? undefined : -1} className={`block origin-top-left border-0 ${interactive ? "" : "pointer-events-none"}`} style={{ transform: `scale(${scale})` }} />
    </div>
  )
}

// Mounts children only once the box has scrolled near the viewport.
export function WhenVisible({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: "300px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={className} style={style}>{on ? children : null}</div>
}
