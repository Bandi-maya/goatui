import * as React from "react"
import { cn } from "@/lib/utils"

export interface Pricing13Props extends React.HTMLAttributes<HTMLDivElement> {}

const Pricing13 = React.forwardRef<HTMLDivElement, Pricing13Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pricing 13 component stub
      </div>
    )
  }
)
Pricing13.displayName = "Pricing13"

export { Pricing13 }
