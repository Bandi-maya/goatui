import * as React from "react"
import { cn } from "@/lib/utils"

export interface OrbitSceneProps extends React.HTMLAttributes<HTMLDivElement> {}

const OrbitScene = React.forwardRef<HTMLDivElement, OrbitSceneProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Orbit Scene component stub
      </div>
    )
  }
)
OrbitScene.displayName = "OrbitScene"

export { OrbitScene }
