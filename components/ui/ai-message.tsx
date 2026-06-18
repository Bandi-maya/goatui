import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIMessage = React.forwardRef<HTMLDivElement, AIMessageProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI Message component stub
      </div>
    )
  }
)
AIMessage.displayName = "AIMessage"

export { AIMessage }
