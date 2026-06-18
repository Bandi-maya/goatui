import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial10Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial10 = React.forwardRef<HTMLDivElement, Testimonial10Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 10 component stub
      </div>
    )
  }
)
Testimonial10.displayName = "Testimonial10"

export { Testimonial10 }
