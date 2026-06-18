import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA5Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA5 = React.forwardRef<HTMLDivElement, CTA5Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 5 component stub
      </div>
    )
  }
)
CTA5.displayName = "CTA5"

export { CTA5 }
