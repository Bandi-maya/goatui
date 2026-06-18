import * as React from "react"
import { cn } from "@/lib/utils"

export interface ServerTableProps extends React.HTMLAttributes<HTMLDivElement> {}

const ServerTable = React.forwardRef<HTMLDivElement, ServerTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Server Table component stub
      </div>
    )
  }
)
ServerTable.displayName = "ServerTable"

export { ServerTable }
