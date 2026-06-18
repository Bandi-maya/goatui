import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientTextProps extends React.HTMLAttributes<HTMLDivElement> {}

const GradientText = React.forwardRef<HTMLDivElement, GradientTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Gradient Text component stub
      </div>
    )
  }
)
GradientText.displayName = "GradientText"

export { GradientText }
