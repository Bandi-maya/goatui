import * as React from "react"
import { cn } from "@/lib/utils"

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tag component stub
      </div>
    )
  }
)
Tag.displayName = "Tag"

export { Tag }
