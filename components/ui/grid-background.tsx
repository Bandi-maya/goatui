import * as React from "react"
import { cn } from "@/lib/utils"

export interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const GridBackground = React.forwardRef<HTMLDivElement, GridBackgroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Grid Background component stub
      </div>
    )
  }
)
GridBackground.displayName = "GridBackground"

export { GridBackground }
