import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing6Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing6 = React.forwardRef<HTMLDivElement, Pricing6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 6 component stub
      </div>
    )
  }
)
Pricing6.displayName = "Pricing6"

export { Pricing6 }
