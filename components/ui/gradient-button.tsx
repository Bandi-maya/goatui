import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const GradientButton = React.forwardRef<HTMLDivElement, GradientButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Gradient Button component stub
      </div>
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
