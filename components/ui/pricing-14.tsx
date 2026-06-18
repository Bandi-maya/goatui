import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing14Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing14 = React.forwardRef<HTMLDivElement, Pricing14Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 14 component stub
      </div>
    )
  }
)
Pricing14.displayName = "Pricing14"

export { Pricing14 }
