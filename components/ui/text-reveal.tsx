import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextRevealProps extends React.HTMLAttributes<HTMLDivElement> {}

const TextReveal = React.forwardRef<HTMLDivElement, TextRevealProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Text Reveal component stub
      </div>
    )
  }
)
TextReveal.displayName = "TextReveal"

export { TextReveal }
