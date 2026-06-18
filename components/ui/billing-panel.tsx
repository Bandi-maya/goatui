import * as React from "react"
import { cn } from "@/lib/utils"

export interface BillingPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const BillingPanel = React.forwardRef<HTMLDivElement, BillingPanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Billing Panel component stub
      </div>
    )
  }
)
BillingPanel.displayName = "BillingPanel"

export { BillingPanel }
