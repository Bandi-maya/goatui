import * as React from "react"
import { cn } from "@/lib/utils"

export interface FAQ3Props extends React.HTMLAttributes<HTMLDivElement> {}

const FAQ3 = React.forwardRef<HTMLDivElement, FAQ3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        FAQ 3 component stub
      </div>
    )
  }
)
FAQ3.displayName = "FAQ3"

export { FAQ3 }
