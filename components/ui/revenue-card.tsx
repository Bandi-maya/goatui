import * as React from "react"
import { cn } from "@/lib/utils"

export interface RevenueCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const RevenueCard = React.forwardRef<HTMLDivElement, RevenueCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Revenue Card component stub
      </div>
    )
  }
)
RevenueCard.displayName = "RevenueCard"

export { RevenueCard }
