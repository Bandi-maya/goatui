import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial6Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial6 = React.forwardRef<HTMLDivElement, Testimonial6Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 6 component stub
      </div>
    )
  }
)
Testimonial6.displayName = "Testimonial6"

export { Testimonial6 }
