import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA8Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA8 = React.forwardRef<HTMLDivElement, CTA8Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 8 component stub
      </div>
    )
  }
)
CTA8.displayName = "CTA8"

export { CTA8 }
