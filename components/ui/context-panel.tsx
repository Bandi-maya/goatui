import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContextPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextPanel = React.forwardRef<HTMLDivElement, ContextPanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Context Panel component stub
      </div>
    )
  }
)
ContextPanel.displayName = "ContextPanel"

export { ContextPanel }
