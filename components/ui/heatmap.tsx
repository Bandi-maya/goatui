import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {}

const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Heatmap component stub
      </div>
    )
  }
)
Heatmap.displayName = "Heatmap"

export { Heatmap }
