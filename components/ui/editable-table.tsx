import * as React from "react"
import { cn } from "@/lib/utils"

export interface EditableTableProps extends React.HTMLAttributes<HTMLDivElement> {}

const EditableTable = React.forwardRef<HTMLDivElement, EditableTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Editable Table component stub
      </div>
    )
  }
)
EditableTable.displayName = "EditableTable"

export { EditableTable }
