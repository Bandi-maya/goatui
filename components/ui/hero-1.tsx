import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero1Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero1 = React.forwardRef<HTMLDivElement, Hero1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 1 component stub
      </div>
    )
  }
)
Hero1.displayName = "Hero1"

export { Hero1 }
