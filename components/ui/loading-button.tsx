import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoadingButton = React.forwardRef<HTMLDivElement, LoadingButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Loading Button component stub
      </div>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
