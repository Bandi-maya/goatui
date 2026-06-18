import * as React from "react"
import { cn } from "@/lib/utils"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Stepper component stub
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

export { Stepper }
