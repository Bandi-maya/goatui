import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial14Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial14 = React.forwardRef<HTMLDivElement, Testimonial14Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 14 component stub
      </div>
    )
  }
)
Testimonial14.displayName = "Testimonial14"

export { Testimonial14 }
