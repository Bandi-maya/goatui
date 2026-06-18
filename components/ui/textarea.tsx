import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.HTMLAttributes<HTMLDivElement> {}

const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Textarea component stub
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
