import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA20Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA20 = React.forwardRef<HTMLDivElement, CTA20Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 20 component stub
      </div>
    )
  }
)
CTA20.displayName = "CTA20"

export { CTA20 }
