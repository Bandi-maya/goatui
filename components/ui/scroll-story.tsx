import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollStoryProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollStory = React.forwardRef<HTMLDivElement, ScrollStoryProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Scroll Story component stub
      </div>
    )
  }
)
ScrollStory.displayName = "ScrollStory"

export { ScrollStory }
