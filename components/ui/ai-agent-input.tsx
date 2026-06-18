import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIAgentInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIAgentInput = React.forwardRef<HTMLDivElement, AIAgentInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Agent Input component stub
      </div>
    )
  }
)
AIAgentInput.displayName = "AIAgentInput"

export { AIAgentInput }
