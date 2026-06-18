import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial5Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial5 = React.forwardRef<HTMLDivElement, Testimonial5Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 5 component stub
      </div>
    )
  }
)
Testimonial5.displayName = "Testimonial5"

export { Testimonial5 }
