import * as React from "react"
import { cn } from "@/lib/utils"

export interface RippleButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const RippleButton = React.forwardRef<HTMLDivElement, RippleButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Ripple Button component stub
      </div>
    )
  }
)
RippleButton.displayName = "RippleButton"

export { RippleButton }
