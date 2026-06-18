import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Context Menu component stub
      </div>
    )
  }
)
ContextMenu.displayName = "ContextMenu"

export { ContextMenu }
