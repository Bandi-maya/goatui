import * as React from "react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Alert component stub
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }
