import * as React from "react"
import { cn } from "@/lib/utils"

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Banner component stub
      </div>
    )
  }
)
Banner.displayName = "Banner"

export { Banner }
