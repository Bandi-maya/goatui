import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

const Form = React.forwardRef<HTMLDivElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form component stub
      </div>
    )
  }
)
Form.displayName = "Form"

export { Form }
