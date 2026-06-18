import * as React from "react"
import { cn } from "@/lib/utils"

export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Step Progress component stub
      </div>
    )
  }
)
StepProgress.displayName = "StepProgress"

export { StepProgress }
