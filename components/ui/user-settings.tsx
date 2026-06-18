import * as React from "react"
import { cn } from "@/lib/utils"

export interface UserSettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserSettings = React.forwardRef<HTMLDivElement, UserSettingsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        User Settings component stub
      </div>
    )
  }
)
UserSettings.displayName = "UserSettings"

export { UserSettings }
