import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero14Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero14 = React.forwardRef<HTMLDivElement, Hero14Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 14 component stub
      </div>
    )
  }
)
Hero14.displayName = "Hero14"

export { Hero14 }
