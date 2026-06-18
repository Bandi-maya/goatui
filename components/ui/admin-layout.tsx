import * as React from "react"
import { cn } from "@/lib/utils"

export interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const AdminLayout = React.forwardRef<HTMLDivElement, AdminLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Admin Layout component stub
      </div>
    )
  }
)
AdminLayout.displayName = "AdminLayout"

export { AdminLayout }
