import * as React from "react"
import { cn } from "@/lib/utils"

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hover Card component stub
      </div>
    )
  }
)
HoverCard.displayName = "HoverCard"

export { HoverCard }
