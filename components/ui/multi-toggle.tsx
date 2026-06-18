import * as React from "react"
import { cn } from "@/lib/utils"

export interface MultiToggleProps extends React.HTMLAttributes<HTMLDivElement> {}

const MultiToggle = React.forwardRef<HTMLDivElement, MultiToggleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Multi Toggle component stub
      </div>
    )
  }
)
MultiToggle.displayName = "MultiToggle"

export { MultiToggle }
