import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIChatInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIChatInput = React.forwardRef<HTMLDivElement, AIChatInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Chat Input component stub
      </div>
    )
  }
)
AIChatInput.displayName = "AIChatInput"

export { AIChatInput }
