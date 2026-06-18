import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero8Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero8 = React.forwardRef<HTMLDivElement, Hero8Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 8 component stub
      </div>
    )
  }
)
Hero8.displayName = "Hero8"

export { Hero8 }
