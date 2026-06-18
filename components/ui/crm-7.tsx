import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM7Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM7 = React.forwardRef<HTMLDivElement, CRM7Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 7 component stub
      </div>
    )
  }
)
CRM7.displayName = "CRM7"

export { CRM7 }
