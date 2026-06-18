import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormWizardProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormWizard = React.forwardRef<HTMLDivElement, FormWizardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Wizard component stub
      </div>
    )
  }
)
FormWizard.displayName = "FormWizard"

export { FormWizard }
