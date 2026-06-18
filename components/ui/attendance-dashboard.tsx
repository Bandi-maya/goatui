import * as React from "react"
import { cn } from "@/lib/utils"

export interface AttendanceDashboardProps extends React.HTMLAttributes<HTMLDivElement> {}

const AttendanceDashboard = React.forwardRef<HTMLDivElement, AttendanceDashboardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Attendance Dashboard component stub
      </div>
    )
  }
)
AttendanceDashboard.displayName = "AttendanceDashboard"

export { AttendanceDashboard }
