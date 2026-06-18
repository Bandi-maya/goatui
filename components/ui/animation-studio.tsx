import * as React from "react"
import { cn } from "@/lib/utils"

export interface AnimationStudioProps extends React.HTMLAttributes<HTMLDivElement> {}

const AnimationStudio = React.forwardRef<HTMLDivElement, AnimationStudioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Animation Studio component stub
      </div>
    )
  }
)
AnimationStudio.displayName = "AnimationStudio"

export { AnimationStudio }
