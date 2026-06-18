import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActivityWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActivityWidget = React.forwardRef<HTMLDivElement, ActivityWidgetProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Activity Widget component stub
      </div>
    )
  }
)
ActivityWidget.displayName = "ActivityWidget"

export { ActivityWidget }
