import * as React from "react"
import { cn } from "@/lib/utils"

export interface UserMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserMessage = React.forwardRef<HTMLDivElement, UserMessageProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        User Message component stub
      </div>
    )
  }
)
UserMessage.displayName = "UserMessage"

export { UserMessage }
