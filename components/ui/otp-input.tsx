import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        OTP Input component stub
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

export { OTPInput }
