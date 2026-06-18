import * as React from "react"
import { cn } from "@/lib/utils"

export interface MegaMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const MegaMenu = React.forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Mega Menu component stub
      </div>
    )
  }
)
MegaMenu.displayName = "MegaMenu"

export { MegaMenu }
