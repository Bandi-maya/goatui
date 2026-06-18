import * as React from "react"
import { cn } from "@/lib/utils"

export interface NoiseBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const NoiseBackground = React.forwardRef<HTMLDivElement, NoiseBackgroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Noise Background component stub
      </div>
    )
  }
)
NoiseBackground.displayName = "NoiseBackground"

export { NoiseBackground }
