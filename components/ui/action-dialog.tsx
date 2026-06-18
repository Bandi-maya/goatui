import * as React from "react"
import { cn } from "@/lib/utils"

export interface ActionDialogProps extends React.HTMLAttributes<HTMLDivElement> {}

const ActionDialog = React.forwardRef<HTMLDivElement, ActionDialogProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Action Dialog component stub
      </div>
    )
  }
)
ActionDialog.displayName = "ActionDialog"

export { ActionDialog }
