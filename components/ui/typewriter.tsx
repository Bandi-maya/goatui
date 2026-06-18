import * as React from "react"
import { cn } from "@/lib/utils"

export interface TypewriterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Typewriter = React.forwardRef<HTMLDivElement, TypewriterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Typewriter component stub
      </div>
    )
  }
)
Typewriter.displayName = "Typewriter"

export { Typewriter }
