import * as React from "react"
import { cn } from "@/lib/utils"

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Circular Progress component stub
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { CircularProgress }
