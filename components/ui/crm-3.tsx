import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM3Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM3 = React.forwardRef<HTMLDivElement, CRM3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 3 component stub
      </div>
    )
  }
)
CRM3.displayName = "CRM3"

export { CRM3 }
