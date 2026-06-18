import * as React from "react"
import { cn } from "@/lib/utils"

export interface AnalyticsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const AnalyticsCard = React.forwardRef<HTMLDivElement, AnalyticsCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Analytics Card component stub
      </div>
    )
  }
)
AnalyticsCard.displayName = "AnalyticsCard"

export { AnalyticsCard }
