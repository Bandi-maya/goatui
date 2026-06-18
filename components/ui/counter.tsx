import * as React from "react"
import { cn } from "@/lib/utils"

export interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Counter = React.forwardRef<HTMLDivElement, CounterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Counter component stub
      </div>
    )
  }
)
Counter.displayName = "Counter"

export { Counter }
