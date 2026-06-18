import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends React.HTMLAttributes<HTMLDivElement> {}

const Radio = React.forwardRef<HTMLDivElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Radio component stub
      </div>
    )
  }
)
Radio.displayName = "Radio"

export { Radio }
