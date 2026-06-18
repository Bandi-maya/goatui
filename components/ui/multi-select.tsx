import * as React from "react"
import { cn } from "@/lib/utils"

export interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Multi Select component stub
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
