import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const ProgressCard = React.forwardRef<HTMLDivElement, ProgressCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Progress Card component stub
      </div>
    )
  }
)
ProgressCard.displayName = "ProgressCard"

export { ProgressCard }
