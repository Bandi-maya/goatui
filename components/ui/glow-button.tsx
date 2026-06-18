import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlowButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlowButton = React.forwardRef<HTMLDivElement, GlowButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Glow Button component stub
      </div>
    )
  }
)
GlowButton.displayName = "GlowButton"

export { GlowButton }
