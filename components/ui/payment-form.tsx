import * as React from "react"
import { cn } from "@/lib/utils"

export interface PaymentFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const PaymentForm = React.forwardRef<HTMLDivElement, PaymentFormProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Payment Form component stub
      </div>
    )
  }
)
PaymentForm.displayName = "PaymentForm"

export { PaymentForm }
