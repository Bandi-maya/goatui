import * as React from "react"
import { cn } from "@/lib/utils"

export interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Team Card component stub
      </div>
    )
  }
)
TeamCard.displayName = "TeamCard"

export { TeamCard }
