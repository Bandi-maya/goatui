import * as React from "react"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const PasswordInput = React.forwardRef<HTMLDivElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Password Input component stub
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
