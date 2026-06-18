import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing3Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing3 = React.forwardRef<HTMLDivElement, Pricing3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 3 component stub
      </div>
    )
  }
)
Pricing3.displayName = "Pricing3"

export { Pricing3 }
