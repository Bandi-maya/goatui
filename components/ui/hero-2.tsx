import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero2Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero2 = React.forwardRef<HTMLDivElement, Hero2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 2 component stub
      </div>
    )
  }
)
Hero2.displayName = "Hero2"

export { Hero2 }
