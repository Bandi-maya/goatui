import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChatUIProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatUI = React.forwardRef<HTMLDivElement, ChatUIProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Chat UI component stub
      </div>
    )
  }
)
ChatUI.displayName = "ChatUI"

export { ChatUI }
