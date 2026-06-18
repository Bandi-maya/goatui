import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Loader component stub
      </div>
    )
  }
)
Loader.displayName = "Loader"

export { Loader }
