import * as React from "react"
import { cn } from "@/lib/utils"

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Drawer component stub
      </div>
    )
  }
)
Drawer.displayName = "Drawer"

export { Drawer }
