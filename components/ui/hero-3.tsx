import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero3Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero3 = React.forwardRef<HTMLDivElement, Hero3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 3 component stub
      </div>
    )
  }
)
Hero3.displayName = "Hero3"

export { Hero3 }
