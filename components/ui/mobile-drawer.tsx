import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileDrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

const MobileDrawer = React.forwardRef<HTMLDivElement, MobileDrawerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Mobile Drawer component stub
      </div>
    )
  }
)
MobileDrawer.displayName = "MobileDrawer"

export { MobileDrawer }
