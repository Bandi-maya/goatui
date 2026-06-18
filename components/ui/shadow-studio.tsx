import * as React from "react"
import { cn } from "@/lib/utils"

export interface ShadowStudioProps extends React.HTMLAttributes<HTMLDivElement> {}

const ShadowStudio = React.forwardRef<HTMLDivElement, ShadowStudioProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Shadow Studio component stub
      </div>
    )
  }
)
ShadowStudio.displayName = "ShadowStudio"

export { ShadowStudio }
