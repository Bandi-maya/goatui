import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const Checkout = React.forwardRef<HTMLDivElement, CheckoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Checkout component stub
      </div>
    )
  }
)
Checkout.displayName = "Checkout"

export { Checkout }
