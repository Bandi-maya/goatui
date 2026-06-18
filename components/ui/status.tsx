import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Status component stub
      </div>
    )
  }
)
Status.displayName = "Status"

export { Status }
