import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial12Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial12 = React.forwardRef<HTMLDivElement, Testimonial12Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 12 component stub
      </div>
    )
  }
)
Testimonial12.displayName = "Testimonial12"

export { Testimonial12 }
