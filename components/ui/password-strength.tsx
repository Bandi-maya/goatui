import * as React from "react"
import { cn } from "@/lib/utils"

export interface PasswordStrengthProps extends React.HTMLAttributes<HTMLDivElement> {}

const PasswordStrength = React.forwardRef<HTMLDivElement, PasswordStrengthProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Password Strength component stub
      </div>
    )
  }
)
PasswordStrength.displayName = "PasswordStrength"

export { PasswordStrength }
