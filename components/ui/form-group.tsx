import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Group component stub
      </div>
    )
  }
)
FormGroup.displayName = "FormGroup"

export { FormGroup }
