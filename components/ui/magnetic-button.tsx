import * as React from "react"
import { cn } from "@/lib/utils"

export interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const MagneticButton = React.forwardRef<HTMLDivElement, MagneticButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Magnetic Button component stub
      </div>
    )
  }
)
MagneticButton.displayName = "MagneticButton"

export { MagneticButton }
