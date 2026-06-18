import * as React from "react"
import { cn } from "@/lib/utils"

export interface CRMLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const CRMLayout = React.forwardRef<HTMLDivElement, CRMLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        CRM Layout component stub
      </div>
    )
  }
)
CRMLayout.displayName = "CRMLayout"

export { CRMLayout }
