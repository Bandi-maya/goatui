import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmailInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const EmailInput = React.forwardRef<HTMLDivElement, EmailInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Email Input component stub
      </div>
    )
  }
)
EmailInput.displayName = "EmailInput"

export { EmailInput }
