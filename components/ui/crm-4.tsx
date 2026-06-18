import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM4Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM4 = React.forwardRef<HTMLDivElement, CRM4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 4 component stub
      </div>
    )
  }
)
CRM4.displayName = "CRM4"

export { CRM4 }
