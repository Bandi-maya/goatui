import * as React from "react"
import { cn } from "@/lib/utils"

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Dashboard Layout component stub
      </div>
    )
  }
)
DashboardLayout.displayName = "DashboardLayout"

export { DashboardLayout }
