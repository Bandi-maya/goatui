import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Glass Card component stub
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
