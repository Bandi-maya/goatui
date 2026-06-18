import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRM8Props extends React.HTMLAttributes<HTMLDivElement> {}

const CRM8 = React.forwardRef<HTMLDivElement, CRM8Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM 8 component stub
      </div>
    )
  }
)
CRM8.displayName = "CRM8"

export { CRM8 }
