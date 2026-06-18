import * as React from "react"
import { cn } from "@/lib/utils"

export interface TreeSelectProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeSelect = React.forwardRef<HTMLDivElement, TreeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tree Select component stub
      </div>
    )
  }
)
TreeSelect.displayName = "TreeSelect"

export { TreeSelect }
