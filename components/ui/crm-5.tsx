import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM5Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM5 = React.forwardRef<HTMLDivElement, CRM5Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 5 component stub
      </div>
    )
  }
)
CRM5.displayName = "CRM5"

export { CRM5 }
