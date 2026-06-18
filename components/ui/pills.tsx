import * as React from "react"
import { cn } from "@/lib/utils"

export interface PillsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pills = React.forwardRef<HTMLDivElement, PillsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pills component stub
      </div>
    )
  }
)
Pills.displayName = "Pills"

export { Pills }
