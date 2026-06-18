import * as React from "react"
import { cn } from "@/lib/utils"

export interface SuccessStateProps extends React.HTMLAttributes<HTMLDivElement> {}

const SuccessState = React.forwardRef<HTMLDivElement, SuccessStateProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Success State component stub
      </div>
    )
  }
)
SuccessState.displayName = "SuccessState"

export { SuccessState }
