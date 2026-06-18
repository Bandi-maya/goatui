import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial2Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial2 = React.forwardRef<HTMLDivElement, Testimonial2Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 2 component stub
      </div>
    )
  }
)
Testimonial2.displayName = "Testimonial2"

export { Testimonial2 }
