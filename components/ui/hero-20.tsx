import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero20Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero20 = React.forwardRef<HTMLDivElement, Hero20Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 20 component stub
      </div>
    )
  }
)
Hero20.displayName = "Hero20"

export { Hero20 }
