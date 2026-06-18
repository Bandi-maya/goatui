import * as React from "react"
import { cn } from "@/lib/utils"

export interface ValidationMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const ValidationMessage = React.forwardRef<HTMLDivElement, ValidationMessageProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Validation Message component stub
      </div>
    )
  }
)
ValidationMessage.displayName = "ValidationMessage"

export { ValidationMessage }
