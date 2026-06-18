import * as React from "react"
import { cn } from "@/lib/utils"

export interface RoadmapProps extends React.HTMLAttributes<HTMLDivElement> {}

const Roadmap = React.forwardRef<HTMLDivElement, RoadmapProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Roadmap component stub
      </div>
    )
  }
)
Roadmap.displayName = "Roadmap"

export { Roadmap }
