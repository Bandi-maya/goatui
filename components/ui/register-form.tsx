import * as React from "react"
import { cn } from "@/lib/utils"

export interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const RegisterForm = React.forwardRef<HTMLDivElement, RegisterFormProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Register Form component stub
      </div>
    )
  }
)
RegisterForm.displayName = "RegisterForm"

export { RegisterForm }
