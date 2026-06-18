import * as React from "react"
import { cn } from "@/lib/utils"

export interface InvoiceProps extends React.HTMLAttributes<HTMLDivElement> {}

const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Invoice component stub
      </div>
    )
  }
)
Invoice.displayName = "Invoice"

export { Invoice }
