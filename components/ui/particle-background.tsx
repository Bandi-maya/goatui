import * as React from "react"
import { cn } from "@/lib/utils"

export interface ParticleBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const ParticleBackground = React.forwardRef<HTMLDivElement, ParticleBackgroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Particle Background component stub
      </div>
    )
  }
)
ParticleBackground.displayName = "ParticleBackground"

export { ParticleBackground }
