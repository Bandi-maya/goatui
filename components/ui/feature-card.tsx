import * as React from "react"
import { cn } from "@/lib/utils"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Feature Card component stub
      </div>
    )
  }
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
