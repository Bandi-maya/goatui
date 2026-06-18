import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {}

const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Spotlight component stub
      </div>
    )
  }
)
Spotlight.displayName = "Spotlight"

export { Spotlight }
