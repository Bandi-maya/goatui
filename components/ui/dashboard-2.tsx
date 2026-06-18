import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard2Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard2 = React.forwardRef<HTMLDivElement, Dashboard2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 2 component stub
      </div>
    )
  }
)
Dashboard2.displayName = "Dashboard2"

export { Dashboard2 }
