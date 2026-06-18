import * as React from "react"
import { cn } from "@/lib/utils"
import { Shield, Sparkles, Terminal, Activity } from "lucide-react"

export interface AgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  role?: string
  status?: "active" | "inactive"
  successRate?: string
  avgResponse?: string
}

const AgentCard = React.forwardRef<HTMLDivElement, AgentCardProps>(
  ({ className, name = "Ava", role = "AI Developer Agent", status = "active", successRate = "99.4%", avgResponse = "1.8s", ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md",
          className
        )} 
        {...props}
      >
        {/* Header section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar container */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
              {/* Online status indicator */}
              <span className={cn(
                "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card",
                status === "active" ? "bg-green-500" : "bg-zinc-400"
              )} />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-semibold text-sm text-foreground">{name}</span>
              <span className="text-xs text-muted-foreground">{role}</span>
            </div>
          </div>

          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase border",
            status === "active" 
              ? "bg-green-500/10 text-green-500 border-green-500/20" 
              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/10"
          )}>
            {status}
          </span>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 border border-border/60 p-3">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">Success Rate</span>
            <span className="text-sm font-bold text-foreground mt-0.5">{successRate}</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">Response Speed</span>
            <span className="text-sm font-bold text-foreground mt-0.5">{avgResponse}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 text-xs">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium">
            <Terminal className="h-3.5 w-3.5" />
            View logs
          </button>
          
          <button className="rounded-lg bg-primary text-primary-foreground font-semibold px-3 py-1.5 hover:bg-primary/90 transition-all flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Initialize
          </button>
        </div>
      </div>
    )
  }
)
AgentCard.displayName = "AgentCard"

export { AgentCard }
