import * as React from "react"
import { cn } from "@/lib/utils"

export interface ThreeDGlobeProps extends React.HTMLAttributes<HTMLDivElement> {}

const ThreeDGlobe = React.forwardRef<HTMLDivElement, ThreeDGlobeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        3D Globe component stub
      </div>
    )
  }
)
ThreeDGlobe.displayName = "ThreeDGlobe"

export { ThreeDGlobe }
