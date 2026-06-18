import * as React from "react"
import { cn } from "@/lib/utils"

export interface CommandMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandMenu = React.forwardRef<HTMLDivElement, CommandMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Command Menu component stub
      </div>
    )
  }
)
CommandMenu.displayName = "CommandMenu"

export { CommandMenu }
