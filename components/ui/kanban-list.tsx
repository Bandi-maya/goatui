import * as React from "react"
import { cn } from "@/lib/utils"

export interface KanbanListProps extends React.HTMLAttributes<HTMLDivElement> {}

const KanbanList = React.forwardRef<HTMLDivElement, KanbanListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Kanban List component stub
      </div>
    )
  }
)
KanbanList.displayName = "KanbanList"

export { KanbanList }
