import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTA12Props extends React.HTMLAttributes<HTMLDivElement> {}

const CTA12 = React.forwardRef<HTMLDivElement, CTA12Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CTA 12 component stub
      </div>
    )
  }
)
CTA12.displayName = "CTA12"

export { CTA12 }
