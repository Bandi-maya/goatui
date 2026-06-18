import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero4Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero4 = React.forwardRef<HTMLDivElement, Hero4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 4 component stub
      </div>
    )
  }
)
Hero4.displayName = "Hero4"

export { Hero4 }
