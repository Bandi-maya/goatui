import * as React from "react"
import { cn } from "@/lib/utils"

export interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Date Picker component stub
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
