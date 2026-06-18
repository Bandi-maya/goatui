import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero6Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero6 = React.forwardRef<HTMLDivElement, Hero6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 6 component stub
      </div>
    )
  }
)
Hero6.displayName = "Hero6"

export { Hero6 }
