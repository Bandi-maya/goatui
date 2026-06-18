import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard1Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard1 = React.forwardRef<HTMLDivElement, Dashboard1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 1 component stub
      </div>
    )
  }
)
Dashboard1.displayName = "Dashboard1"

export { Dashboard1 }
