import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Neon Card component stub
      </div>
    )
  }
)
NeonCard.displayName = "NeonCard"

export { NeonCard }
