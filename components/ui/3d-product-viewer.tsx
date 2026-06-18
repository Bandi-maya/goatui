"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Orbit, RotateCw, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

export function ThreeDProductViewer() {
  const [color, setColor] = React.useState<"blue" | "silver" | "black">("blue")
  const [wireframe, setWireframe] = React.useState(false)
  const [zoom, setZoom] = React.useState(1)

  const cardRef = React.useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring values for smooth perspective rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { damping: 20, stiffness: 150 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { damping: 20, stiffness: 150 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Mouse position relative to center of component in percentage (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5
    
    x.set(relativeX)
    y.set(relativeY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const colorHex = {
    blue: "#2563EB",
    silver: "#94A3B8",
    black: "#0F172A",
  }

  return (
    <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-soft space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Viewport</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Move cursor over screen to rotate model in 3D space.</p>
        </div>
        
        {/* Color swatches */}
        <div className="flex items-center gap-2">
          {(["blue", "silver", "black"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-5 w-5 rounded-full border transition-all cursor-pointer ${
                color === c ? "ring-2 ring-primary ring-offset-2 scale-105" : "border-border hover:scale-105"
              }`}
              style={{ backgroundColor: colorHex[c] }}
              title={`Color: ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Box */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-[300px] w-full rounded-xl border border-border bg-secondary/15 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: 1000 }}
      >
        {/* Background mesh grid */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* 3D Model representation */}
        <motion.div
          style={{ rotateX, rotateY, scale: zoom }}
          className="relative w-44 h-64 bg-card border-2 border-border/80 rounded-[24px] shadow-2xl flex flex-col items-center justify-between p-4 transition-colors duration-300"
        >
          {/* Internal screen frame */}
          <div className="absolute inset-1.5 rounded-[18px] border border-border/60 overflow-hidden flex flex-col justify-between p-3">
            {/* Top camera notch */}
            <div className="h-3 w-16 bg-black rounded-full mx-auto shrink-0" />
            
            {/* Screen content mockup */}
            <div className="flex-1 flex flex-col justify-center space-y-2 mt-4">
              {wireframe ? (
                // Wireframe outline simulation
                <div className="space-y-2 opacity-60">
                  <div className="h-2 w-24 border border-blue-600/40 rounded mx-auto" />
                  <div className="h-16 w-16 border border-blue-600/40 rounded-full mx-auto animate-pulse" />
                  <div className="h-1.5 w-16 border border-blue-600/40 rounded mx-auto" />
                </div>
              ) : (
                // Full render simulation
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-blue-600/10 rounded mx-auto" />
                  <div className="h-16 w-16 bg-blue-600/10 rounded-full mx-auto flex items-center justify-center">
                    <Orbit className="h-8 w-8 text-blue-600 animate-spin-slow" />
                  </div>
                  <div className="h-1.5 w-12 bg-blue-600/20 rounded mx-auto" />
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div className="h-1 w-12 bg-muted-foreground/30 rounded-full mx-auto shrink-0" />
          </div>

          {/* Wireframe outer overlay */}
          {wireframe && (
            <div className="absolute inset-0 border-2 border-dashed border-blue-600/60 rounded-[24px] pointer-events-none" />
          )}
        </motion.div>

        {/* Canvas Toolbar buttons */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer border-0 bg-transparent ${wireframe ? "bg-muted text-blue-600" : ""}`}
            title="Toggle Wireframe Mode"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats specs footer */}
      <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-muted-foreground pt-2">
        <div>
          <span>Polygons:</span>
          <span className="text-foreground block font-bold mt-0.5">14,240</span>
        </div>
        <div>
          <span>Materials:</span>
          <span className="text-foreground block font-bold mt-0.5">Glass, Metal</span>
        </div>
        <div>
          <span>Scale:</span>
          <span className="text-foreground block font-bold mt-0.5">1 : 1.25</span>
        </div>
      </div>
    </div>
  )
}
