import * as React from "react"
import { cn } from "@/lib/utils"

export interface DeleteDialogProps extends React.HTMLAttributes<HTMLDivElement> {}

const DeleteDialog = React.forwardRef<HTMLDivElement, DeleteDialogProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Delete Dialog component stub
      </div>
    )
  }
)
DeleteDialog.displayName = "DeleteDialog"

export { DeleteDialog }
