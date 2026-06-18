import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPVerifyProps extends React.HTMLAttributes<HTMLDivElement> {}

const OTPVerify = React.forwardRef<HTMLDivElement, OTPVerifyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        OTP Verify component stub
      </div>
    )
  }
)
OTPVerify.displayName = "OTPVerify"

export { OTPVerify }
