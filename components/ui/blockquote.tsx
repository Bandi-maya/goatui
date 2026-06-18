import * as React from "react"
import { cn } from "@/lib/utils"

export interface BlockquoteProps extends React.HTMLAttributes<HTMLDivElement> {}

const Blockquote = React.forwardRef<HTMLDivElement, BlockquoteProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Blockquote component stub
      </div>
    )
  }
)
Blockquote.displayName = "Blockquote"

export { Blockquote }
