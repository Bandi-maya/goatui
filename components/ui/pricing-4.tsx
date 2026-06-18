import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing4Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing4 = React.forwardRef<HTMLDivElement, Pricing4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 4 component stub
      </div>
    )
  }
)
Pricing4.displayName = "Pricing4"

export { Pricing4 }
