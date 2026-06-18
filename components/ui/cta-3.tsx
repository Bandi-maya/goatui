import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA3Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA3 = React.forwardRef<HTMLDivElement, CTA3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 3 component stub
      </div>
    )
  }
)
CTA3.displayName = "CTA3"

export { CTA3 }
