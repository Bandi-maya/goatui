import * as React from "react"
import { cn } from "@/lib/utils"

export interface AgentBuilderProps extends React.HTMLAttributes<HTMLDivElement> {}

const AgentBuilder = React.forwardRef<HTMLDivElement, AgentBuilderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Agent Builder component stub
      </div>
    )
  }
)
AgentBuilder.displayName = "AgentBuilder"

export { AgentBuilder }
