import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Segmented Control component stub
      </div>
    )
  }
)
SegmentedControl.displayName = "SegmentedControl"

export { SegmentedControl }
