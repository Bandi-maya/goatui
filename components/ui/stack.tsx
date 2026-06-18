import * as React from "react"
import { cn } from "@/lib/utils"

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Stack component stub
      </div>
    )
  }
)
Stack.displayName = "Stack"

export { Stack }
