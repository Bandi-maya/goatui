import * as React from "react"
import { cn } from "@/lib/utils"

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        KPI Card component stub
      </div>
    )
  }
)
KPICard.displayName = "KPICard"

export { KPICard }
