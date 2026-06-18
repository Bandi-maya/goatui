import * as React from "react"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.HTMLAttributes<HTMLDivElement> {}

const Link = React.forwardRef<HTMLDivElement, LinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Link component stub
      </div>
    )
  }
)
Link.displayName = "Link"

export { Link }
