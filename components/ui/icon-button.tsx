import * as React from "react"
import { cn } from "@/lib/utils"

export interface IconButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const IconButton = React.forwardRef<HTMLDivElement, IconButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Icon Button component stub
      </div>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton }
