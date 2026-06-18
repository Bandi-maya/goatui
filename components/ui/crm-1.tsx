import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM1Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM1 = React.forwardRef<HTMLDivElement, CRM1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 1 component stub
      </div>
    )
  }
)
CRM1.displayName = "CRM1"

export { CRM1 }
