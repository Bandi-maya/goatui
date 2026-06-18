import * as React from "react"
import { cn } from "@/lib/utils"

export interface LayoutBuilderProps extends React.HTMLAttributes<HTMLDivElement> {}

const LayoutBuilder = React.forwardRef<HTMLDivElement, LayoutBuilderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Layout Builder component stub
      </div>
    )
  }
)
LayoutBuilder.displayName = "LayoutBuilder"

export { LayoutBuilder }
