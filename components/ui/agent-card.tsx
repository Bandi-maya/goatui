"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Play, Shield, Zap } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

export interface AgentCardProps {
  name?: string
  status?: "active" | "idle" | "running"
  description?: string
  successRate?: string
  category?: string
  onClick?: () => void
}

export function AgentCard({
  name = "AutoCoder Enterprise",
  status = "active",
  description = "Autonomously refactors TypeScript projects, resolves syntax compilation errors, and builds premium Tailwind v4 React interfaces.",
  successRate = "99.2%",
  category = "Engineering",
  onClick,
}: AgentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-hover hover:border-blue-600/30 overflow-hidden text-left"
    >
      {/* Background soft glow on hover */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

      {/* Top row: Status & Category */}
      <div className="flex items-center justify-between">
        <Badge variant="default" className="border-blue-600/15 bg-blue-600/5 text-blue-600">
          {category}
        </Badge>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85">
            {status}
          </span>
        </div>
      </div>

      {/* Agent details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
          <h3 className="text-sm font-bold text-foreground tracking-tight group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Metrics breakdown */}
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border/60 py-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block">Success Rate</span>
          <span className="text-sm font-extrabold text-foreground mt-0.5 block">{successRate}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block">Avg. Velocity</span>
          <span className="text-sm font-extrabold text-foreground mt-0.5 block">1.8s / run</span>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span>Security Guarded</span>
        </div>
        <Button
          onClick={onClick}
          variant="outline"
          size="sm"
          className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all gap-1.5"
        >
          <span>Configure</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}
