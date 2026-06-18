import * as React from "react"
import { cn } from "@/lib/utils"

export interface SalesCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const SalesCard = React.forwardRef<HTMLDivElement, SalesCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Sales Card component stub
      </div>
    )
  }
)
SalesCard.displayName = "SalesCard"

export { SalesCard }
