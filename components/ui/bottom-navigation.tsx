import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Bottom Navigation component stub
      </div>
    )
  }
)
BottomNavigation.displayName = "BottomNavigation"

export { BottomNavigation }
