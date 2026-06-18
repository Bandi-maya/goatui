import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tooltip component stub
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip }
