import * as React from "react"
import { cn } from "@/lib/utils"

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Sheet component stub
      </div>
    )
  }
)
Sheet.displayName = "Sheet"

export { Sheet }
