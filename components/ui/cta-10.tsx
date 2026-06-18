import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA10Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA10 = React.forwardRef<HTMLDivElement, CTA10Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 10 component stub
      </div>
    )
  }
)
CTA10.displayName = "CTA10"

export { CTA10 }
