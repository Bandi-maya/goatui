import * as React from "react"
import { cn } from "@/lib/utils"

export interface URLInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const URLInput = React.forwardRef<HTMLDivElement, URLInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        URL Input component stub
      </div>
    )
  }
)
URLInput.displayName = "URLInput"

export { URLInput }
