import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard3Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard3 = React.forwardRef<HTMLDivElement, Dashboard3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 3 component stub
      </div>
    )
  }
)
Dashboard3.displayName = "Dashboard3"

export { Dashboard3 }
