import * as React from "react"
import { cn } from "@/lib/utils"

export interface Hero13Props extends React.HTMLAttributes<HTMLDivElement> {}

const Hero13 = React.forwardRef<HTMLDivElement, Hero13Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero 13 component stub
      </div>
    )
  }
)
Hero13.displayName = "Hero13"

export { Hero13 }
