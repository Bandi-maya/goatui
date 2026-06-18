import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Timeline component stub
      </div>
    )
  }
)
Timeline.displayName = "Timeline"

export { Timeline }
