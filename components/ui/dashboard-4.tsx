import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard4Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard4 = React.forwardRef<HTMLDivElement, Dashboard4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 4 component stub
      </div>
    )
  }
)
Dashboard4.displayName = "Dashboard4"

export { Dashboard4 }
