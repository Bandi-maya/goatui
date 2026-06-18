import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const FloatingButton = React.forwardRef<HTMLDivElement, FloatingButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Floating Button component stub
      </div>
    )
  }
)
FloatingButton.displayName = "FloatingButton"

export { FloatingButton }
