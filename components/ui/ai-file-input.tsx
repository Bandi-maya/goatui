import * as React from "react"
import { cn } from "@/lib/utils"

export interface AIFileInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const AIFileInput = React.forwardRef<HTMLDivElement, AIFileInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        AI File Input component stub
      </div>
    )
  }
)
AIFileInput.displayName = "AIFileInput"

export { AIFileInput }
