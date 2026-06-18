import * as React from "react"
import { cn } from "@/lib/utils"

export interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Topbar = React.forwardRef<HTMLDivElement, TopbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Topbar component stub
      </div>
    )
  }
)
Topbar.displayName = "Topbar"

export { Topbar }
