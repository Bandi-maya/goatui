import * as React from "react"
import { cn } from "@/lib/utils"

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing Card component stub
      </div>
    )
  }
)
PricingCard.displayName = "PricingCard"

export { PricingCard }
