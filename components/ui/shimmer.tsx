import * as React from "react"
import { cn } from "@/lib/utils"

export interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Shimmer component stub
      </div>
    )
  }
)
Shimmer.displayName = "Shimmer"

export { Shimmer }
