import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Radar Chart component stub
      </div>
    )
  }
)
RadarChart.displayName = "RadarChart"

export { RadarChart }
