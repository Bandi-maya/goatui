import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Time Picker component stub
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"

export { TimePicker }
