import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmployeeDashboardProps extends React.HTMLAttributes<HTMLDivElement> {}

const EmployeeDashboard = React.forwardRef<HTMLDivElement, EmployeeDashboardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Employee Dashboard component stub
      </div>
    )
  }
)
EmployeeDashboard.displayName = "EmployeeDashboard"

export { EmployeeDashboard }
