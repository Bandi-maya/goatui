import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard13Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard13 = React.forwardRef<HTMLDivElement, Dashboard13Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 13 component stub
      </div>
    )
  }
)
Dashboard13.displayName = "Dashboard13"

export { Dashboard13 }
