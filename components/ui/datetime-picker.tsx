import * as React from "react"
import { cn } from "@/lib/utils"

export interface DateTimePickerProps extends React.HTMLAttributes<HTMLDivElement> {}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        DateTime Picker component stub
      </div>
    )
  }
)
DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker }
