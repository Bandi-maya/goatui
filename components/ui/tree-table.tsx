import * as React from "react"
import { cn } from "@/lib/utils"

export interface TreeTableProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tree Table component stub
      </div>
    )
  }
)
TreeTable.displayName = "TreeTable"

export { TreeTable }
