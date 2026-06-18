import * as React from "react"
import { cn } from "@/lib/utils"

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Area Chart component stub
      </div>
    )
  }
)
AreaChart.displayName = "AreaChart"

export { AreaChart }
