import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial13Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial13 = React.forwardRef<HTMLDivElement, Testimonial13Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 13 component stub
      </div>
    )
  }
)
Testimonial13.displayName = "Testimonial13"

export { Testimonial13 }
