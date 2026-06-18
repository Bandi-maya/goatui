import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial4Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial4 = React.forwardRef<HTMLDivElement, Testimonial4Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 4 component stub
      </div>
    )
  }
)
Testimonial4.displayName = "Testimonial4"

export { Testimonial4 }
