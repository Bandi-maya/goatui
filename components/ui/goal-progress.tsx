import * as React from "react"
import { cn } from "@/lib/utils"

export interface GoalProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const GoalProgress = React.forwardRef<HTMLDivElement, GoalProgressProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Goal Progress component stub
      </div>
    )
  }
)
GoalProgress.displayName = "GoalProgress"

export { GoalProgress }
