import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard6Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard6 = React.forwardRef<HTMLDivElement, Dashboard6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 6 component stub
      </div>
    )
  }
)
Dashboard6.displayName = "Dashboard6"

export { Dashboard6 }
