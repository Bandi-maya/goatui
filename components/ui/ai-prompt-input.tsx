import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIPromptInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIPromptInput = React.forwardRef<HTMLDivElement, AIPromptInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Prompt Input component stub
      </div>
    )
  }
)
AIPromptInput.displayName = "AIPromptInput"

export { AIPromptInput }
