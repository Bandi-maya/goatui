import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard14Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard14 = React.forwardRef<HTMLDivElement, Dashboard14Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 14 component stub
      </div>
    )
  }
)
Dashboard14.displayName = "Dashboard14"

export { Dashboard14 }
