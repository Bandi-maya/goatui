import * as React from "react"
import { cn } from "@/lib/utils"

export interface PromptBuilderProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptBuilder = React.forwardRef<HTMLDivElement, PromptBuilderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Prompt Builder component stub
      </div>
    )
  }
)
PromptBuilder.displayName = "PromptBuilder"

export { PromptBuilder }
