import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {}

const Heading = React.forwardRef<HTMLDivElement, HeadingProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Heading component stub
      </div>
    )
  }
)
Heading.displayName = "Heading"

export { Heading }
