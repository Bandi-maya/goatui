import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Progress Bar component stub
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
