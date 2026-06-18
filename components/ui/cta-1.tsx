import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA1Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA1 = React.forwardRef<HTMLDivElement, CTA1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 1 component stub
      </div>
    )
  }
)
CTA1.displayName = "CTA1"

export { CTA1 }
