import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial1Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial1 = React.forwardRef<HTMLDivElement, Testimonial1Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 1 component stub
      </div>
    )
  }
)
Testimonial1.displayName = "Testimonial1"

export { Testimonial1 }
