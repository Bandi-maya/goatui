import * as React from "react"
import { cn } from "@/lib/utils"

export interface CompareProps extends React.HTMLAttributes<HTMLDivElement> {}

const Compare = React.forwardRef<HTMLDivElement, CompareProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Compare component stub
      </div>
    )
  }
)
Compare.displayName = "Compare"

export { Compare }
