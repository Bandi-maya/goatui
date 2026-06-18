import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextProps extends React.HTMLAttributes<HTMLDivElement> {}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Text component stub
      </div>
    )
  }
)
Text.displayName = "Text"

export { Text }
