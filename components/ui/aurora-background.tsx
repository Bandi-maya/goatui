import * as React from "react"
import { cn } from "@/lib/utils"

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Aurora Background component stub
      </div>
    )
  }
)
AuroraBackground.displayName = "AuroraBackground"

export { AuroraBackground }
