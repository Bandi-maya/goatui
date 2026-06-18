import * as React from "react"
import { cn } from "@/lib/utils"

export interface YearPickerProps extends React.HTMLAttributes<HTMLDivElement> {}

const YearPicker = React.forwardRef<HTMLDivElement, YearPickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Year Picker component stub
      </div>
    )
  }
)
YearPicker.displayName = "YearPicker"

export { YearPicker }
