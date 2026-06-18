import * as React from "react"
import { cn } from "@/lib/utils"

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Grid component stub
      </div>
    )
  }
)
Grid.displayName = "Grid"

export { Grid }
