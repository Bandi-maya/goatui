import * as React from "react"
import { cn } from "@/lib/utils"

export interface Dashboard8Props extends React.HTMLAttributes<HTMLDivElement> {}

const Dashboard8 = React.forwardRef<HTMLDivElement, Dashboard8Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard 8 component stub
      </div>
    )
  }
)
Dashboard8.displayName = "Dashboard8"

export { Dashboard8 }
