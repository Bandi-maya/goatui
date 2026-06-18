import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormBuilderProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormBuilder = React.forwardRef<HTMLDivElement, FormBuilderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Builder component stub
      </div>
    )
  }
)
FormBuilder.displayName = "FormBuilder"

export { FormBuilder }
