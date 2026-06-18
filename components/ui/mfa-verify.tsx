import * as React from "react"
import { cn } from "@/lib/utils"

export interface MFAVerifyProps extends React.HTMLAttributes<HTMLDivElement> {}

const MFAVerify = React.forwardRef<HTMLDivElement, MFAVerifyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        MFA Verify component stub
      </div>
    )
  }
)
MFAVerify.displayName = "MFAVerify"

export { MFAVerify }
