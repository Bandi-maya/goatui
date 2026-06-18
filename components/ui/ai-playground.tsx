import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIPlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIPlayground = React.forwardRef<HTMLDivElement, AIPlaygroundProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Playground component stub
      </div>
    )
  }
)
AIPlayground.displayName = "AIPlayground"

export { AIPlayground }
