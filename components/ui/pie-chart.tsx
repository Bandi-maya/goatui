import * as React from "react"
import { cn } from "@/lib/utils"

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pie Chart component stub
      </div>
    )
  }
)
PieChart.displayName = "PieChart"

export { PieChart }
