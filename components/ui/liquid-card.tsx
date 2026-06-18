import * as React from "react"
import { cn } from "@/lib/utils"

export interface LiquidCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const LiquidCard = React.forwardRef<HTMLDivElement, LiquidCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Liquid Card component stub
      </div>
    )
  }
)
LiquidCard.displayName = "LiquidCard"

export { LiquidCard }
