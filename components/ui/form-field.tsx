import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Field component stub
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }
