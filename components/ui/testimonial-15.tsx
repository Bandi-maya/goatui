import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial15Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial15 = React.forwardRef<HTMLDivElement, Testimonial15Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 15 component stub
      </div>
    )
  }
)
Testimonial15.displayName = "Testimonial15"

export { Testimonial15 }
