import * as React from "react"
import { cn } from "@/lib/utils"

export interface CursorFollowerProps extends React.HTMLAttributes<HTMLDivElement> {}

const CursorFollower = React.forwardRef<HTMLDivElement, CursorFollowerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Cursor Follower component stub
      </div>
    )
  }
)
CursorFollower.displayName = "CursorFollower"

export { CursorFollower }
