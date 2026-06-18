import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormStepperProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormStepper = React.forwardRef<HTMLDivElement, FormStepperProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Stepper component stub
      </div>
    )
  }
)
FormStepper.displayName = "FormStepper"

export { FormStepper }
