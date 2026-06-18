import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA6Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA6 = React.forwardRef<HTMLDivElement, CTA6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 6 component stub
      </div>
    )
  }
)
CTA6.displayName = "CTA6"

export { CTA6 }
