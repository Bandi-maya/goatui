import * as React from "react"
import { cn } from "@/lib/utils"

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        List component stub
      </div>
    )
  }
)
List.displayName = "List"

export { List }
