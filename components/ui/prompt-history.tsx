import * as React from "react"
import { cn } from "@/lib/utils"

export interface PromptHistoryProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptHistory = React.forwardRef<HTMLDivElement, PromptHistoryProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Prompt History component stub
      </div>
    )
  }
)
PromptHistory.displayName = "PromptHistory"

export { PromptHistory }
