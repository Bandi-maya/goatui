import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Chip component stub
      </div>
    )
  }
)
Chip.displayName = "Chip"

export { Chip }
