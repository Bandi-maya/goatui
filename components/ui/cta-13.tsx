import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA13Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA13 = React.forwardRef<HTMLDivElement, CTA13Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 13 component stub
      </div>
    )
  }
)
CTA13.displayName = "CTA13"

export { CTA13 }
