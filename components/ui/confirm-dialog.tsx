import * as React from "react"
import { cn } from "@/lib/utils"

export interface ConfirmDialogProps extends React.HTMLAttributes<HTMLDivElement> {}

const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Confirm Dialog component stub
      </div>
    )
  }
)
ConfirmDialog.displayName = "ConfirmDialog"

export { ConfirmDialog }
