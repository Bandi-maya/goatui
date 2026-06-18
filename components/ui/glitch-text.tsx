import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Glitch Text component stub
      </div>
    )
  }
)
GlitchText.displayName = "GlitchText"

export { GlitchText }
