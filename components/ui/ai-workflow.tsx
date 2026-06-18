import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIWorkflowProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIWorkflow = React.forwardRef<HTMLDivElement, AIWorkflowProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Workflow component stub
      </div>
    )
  }
)
AIWorkflow.displayName = "AIWorkflow"

export { AIWorkflow }
