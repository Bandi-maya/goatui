import * as React from "react"
import { cn } from "@/lib/utils"

export interface MonthPickerProps extends React.HTMLAttributes<HTMLDivElement> {}

const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Month Picker component stub
      </div>
    )
  }
)
MonthPicker.displayName = "MonthPicker"

export { MonthPicker }
