import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const MobileNav = React.forwardRef<HTMLDivElement, MobileNavProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Mobile Nav component stub
      </div>
    )
  }
)
MobileNav.displayName = "MobileNav"

export { MobileNav }
