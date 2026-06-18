import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA4Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA4 = React.forwardRef<HTMLDivElement, CTA4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 4 component stub
      </div>
    )
  }
)
CTA4.displayName = "CTA4"

export { CTA4 }
