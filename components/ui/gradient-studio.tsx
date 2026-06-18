import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientStudioProps extends React.HTMLAttributes<HTMLDivElement> {}

const GradientStudio = React.forwardRef<HTMLDivElement, GradientStudioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Gradient Studio component stub
      </div>
    )
  }
)
GradientStudio.displayName = "GradientStudio"

export { GradientStudio }
