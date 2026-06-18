import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA18Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA18 = React.forwardRef<HTMLDivElement, CTA18Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 18 component stub
      </div>
    )
  }
)
CTA18.displayName = "CTA18"

export { CTA18 }
