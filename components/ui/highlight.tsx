import * as React from "react"
import { cn } from "@/lib/utils"

export interface HighlightProps extends React.HTMLAttributes<HTMLDivElement> {}

const Highlight = React.forwardRef<HTMLDivElement, HighlightProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Highlight component stub
      </div>
    )
  }
)
Highlight.displayName = "Highlight"

export { Highlight }
