import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing2Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing2 = React.forwardRef<HTMLDivElement, Pricing2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 2 component stub
      </div>
    )
  }
)
Pricing2.displayName = "Pricing2"

export { Pricing2 }
