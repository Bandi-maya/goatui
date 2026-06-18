import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const FloatingMenu = React.forwardRef<HTMLDivElement, FloatingMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Floating Menu component stub
      </div>
    )
  }
)
FloatingMenu.displayName = "FloatingMenu"

export { FloatingMenu }
