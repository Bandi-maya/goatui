import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing1Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing1 = React.forwardRef<HTMLDivElement, Pricing1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 1 component stub
      </div>
    )
  }
)
Pricing1.displayName = "Pricing1"

export { Pricing1 }
