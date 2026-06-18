import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial3Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial3 = React.forwardRef<HTMLDivElement, Testimonial3Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 3 component stub
      </div>
    )
  }
)
Testimonial3.displayName = "Testimonial3"

export { Testimonial3 }
