import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroBuilderProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeroBuilder = React.forwardRef<HTMLDivElement, HeroBuilderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Hero Builder component stub
      </div>
    )
  }
)
HeroBuilder.displayName = "HeroBuilder"

export { HeroBuilder }
