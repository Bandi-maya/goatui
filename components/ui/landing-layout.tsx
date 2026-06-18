import * as React from "react"
import { cn } from "@/lib/utils"

export interface LandingLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const LandingLayout = React.forwardRef<HTMLDivElement, LandingLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Landing Layout component stub
      </div>
    )
  }
)
LandingLayout.displayName = "LandingLayout"

export { LandingLayout }
