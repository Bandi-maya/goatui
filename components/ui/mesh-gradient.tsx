import * as React from "react"
import { cn } from "@/lib/utils"

export interface MeshGradientProps extends React.HTMLAttributes<HTMLDivElement> {}

const MeshGradient = React.forwardRef<HTMLDivElement, MeshGradientProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Mesh Gradient component stub
      </div>
    )
  }
)
MeshGradient.displayName = "MeshGradient"

export { MeshGradient }
