import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Login Form component stub
      </div>
    )
  }
)
LoginForm.displayName = "LoginForm"

export { LoginForm }
