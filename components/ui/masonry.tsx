import * as React from "react"
import { cn } from "@/lib/utils"

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {}

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Masonry component stub
      </div>
    )
  }
)
Masonry.displayName = "Masonry"

export { Masonry }
