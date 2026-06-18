import * as React from "react"
import { cn } from "@/lib/utils"

export interface VirtualTableProps extends React.HTMLAttributes<HTMLDivElement> {}

const VirtualTable = React.forwardRef<HTMLDivElement, VirtualTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Virtual Table component stub
      </div>
    )
  }
)
VirtualTable.displayName = "VirtualTable"

export { VirtualTable }
