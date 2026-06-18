import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM6Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM6 = React.forwardRef<HTMLDivElement, CRM6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 6 component stub
      </div>
    )
  }
)
CRM6.displayName = "CRM6"

export { CRM6 }
