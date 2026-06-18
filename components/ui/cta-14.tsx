import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA14Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA14 = React.forwardRef<HTMLDivElement, CTA14Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 14 component stub
      </div>
    )
  }
)
CTA14.displayName = "CTA14"

export { CTA14 }
