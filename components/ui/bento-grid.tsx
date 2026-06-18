import * as React from "react"
import { cn } from "@/lib/utils"

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Bento Grid component stub
      </div>
    )
  }
)
BentoGrid.displayName = "BentoGrid"

export { BentoGrid }
