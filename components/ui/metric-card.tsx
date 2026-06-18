import * as React from "react"
import { cn } from "@/lib/utils"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Metric Card component stub
      </div>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
