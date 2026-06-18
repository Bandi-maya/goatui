import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActionMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActionMenu = React.forwardRef<HTMLDivElement, ActionMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Action Menu component stub
      </div>
    )
  }
)
ActionMenu.displayName = "ActionMenu"

export { ActionMenu }
