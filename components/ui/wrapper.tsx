import * as React from "react"
import { cn } from "@/lib/utils"

export interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const Wrapper = React.forwardRef<HTMLDivElement, WrapperProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Wrapper component stub
      </div>
    )
  }
)
Wrapper.displayName = "Wrapper"

export { Wrapper }
