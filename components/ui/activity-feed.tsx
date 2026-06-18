import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActivityFeed = React.forwardRef<HTMLDivElement, ActivityFeedProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Activity Feed component stub
      </div>
    )
  }
)
ActivityFeed.displayName = "ActivityFeed"

export { ActivityFeed }
