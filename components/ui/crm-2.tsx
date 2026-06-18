import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM2Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM2 = React.forwardRef<HTMLDivElement, CRM2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 2 component stub
      </div>
    )
  }
)
CRM2.displayName = "CRM2"

export { CRM2 }
