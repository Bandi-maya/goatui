import * as React from "react"
import { cn } from "@/lib/utils"

export interface UserProfileProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserProfile = React.forwardRef<HTMLDivElement, UserProfileProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        User Profile component stub
      </div>
    )
  }
)
UserProfile.displayName = "UserProfile"

export { UserProfile }
