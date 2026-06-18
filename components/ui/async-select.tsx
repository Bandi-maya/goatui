import * as React from "react"
import { cn } from "@/lib/utils"

export interface AsyncSelectProps extends React.HTMLAttributes<HTMLDivElement> {}

const AsyncSelect = React.forwardRef<HTMLDivElement, AsyncSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Async Select component stub
      </div>
    )
  }
)
AsyncSelect.displayName = "AsyncSelect"

export { AsyncSelect }
