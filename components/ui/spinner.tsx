import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Spinner component stub
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
