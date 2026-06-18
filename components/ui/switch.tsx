import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Switch component stub
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
