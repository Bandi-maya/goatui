import * as React from "react"
import { cn } from "@/lib/utils"

export interface ForgotPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

const ForgotPassword = React.forwardRef<HTMLDivElement, ForgotPasswordProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Forgot Password component stub
      </div>
    )
  }
)
ForgotPassword.displayName = "ForgotPassword"

export { ForgotPassword }
