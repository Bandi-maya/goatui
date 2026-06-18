import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Form Section component stub
      </div>
    )
  }
)
FormSection.displayName = "FormSection"

export { FormSection }
