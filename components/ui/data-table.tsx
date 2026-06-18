import * as React from "react"
import { cn } from "@/lib/utils"

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Data Table component stub
      </div>
    )
  }
)
DataTable.displayName = "DataTable"

export { DataTable }
