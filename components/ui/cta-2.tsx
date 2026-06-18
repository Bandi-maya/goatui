import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA2Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA2 = React.forwardRef<HTMLDivElement, CTA2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 2 component stub
      </div>
    )
  }
)
CTA2.displayName = "CTA2"

export { CTA2 }
