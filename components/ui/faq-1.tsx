import * as React from "react"
import { cn } from "@/lib/utils"

export interface FAQ1Props extends React.HTMLAttributes<HTMLDivElement> {}

const FAQ1 = React.forwardRef<HTMLDivElement, FAQ1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        FAQ 1 component stub
      </div>
    )
  }
)
FAQ1.displayName = "FAQ1"

export { FAQ1 }
