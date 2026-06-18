import * as React from "react"
import { cn } from "@/lib/utils"

export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Split Button component stub
      </div>
    )
  }
)
SplitButton.displayName = "SplitButton"

export { SplitButton }
