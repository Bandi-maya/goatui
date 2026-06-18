import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Chat Bubble component stub
      </div>
    )
  }
)
ChatBubble.displayName = "ChatBubble"

export { ChatBubble }
