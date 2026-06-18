import * as React from "react"
import { cn } from "@/lib/utils"

export interface BorderStudioProps extends React.HTMLAttributes<HTMLDivElement> {}

const BorderStudio = React.forwardRef<HTMLDivElement, BorderStudioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Border Studio component stub
      </div>
    )
  }
)
BorderStudio.displayName = "BorderStudio"

export { BorderStudio }
