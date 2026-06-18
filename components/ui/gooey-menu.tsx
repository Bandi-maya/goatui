import * as React from "react"
import { cn } from "@/lib/utils"

export interface GooeyMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const GooeyMenu = React.forwardRef<HTMLDivElement, GooeyMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Gooey Menu component stub
      </div>
    )
  }
)
GooeyMenu.displayName = "GooeyMenu"

export { GooeyMenu }
