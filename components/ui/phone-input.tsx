import * as React from "react"
import { cn } from "@/lib/utils"

export interface PhoneInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const PhoneInput = React.forwardRef<HTMLDivElement, PhoneInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Phone Input component stub
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
