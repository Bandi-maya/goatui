import * as React from "react"
import { cn } from "@/lib/utils"

export interface TeamWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

const TeamWidget = React.forwardRef<HTMLDivElement, TeamWidgetProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Team Widget component stub
      </div>
    )
  }
)
TeamWidget.displayName = "TeamWidget"

export { TeamWidget }
