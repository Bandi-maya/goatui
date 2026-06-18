import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Scroll Reveal component stub
      </div>
    )
  }
)
ScrollReveal.displayName = "ScrollReveal"

export { ScrollReveal }
