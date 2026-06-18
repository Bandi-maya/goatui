import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial9Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial9 = React.forwardRef<HTMLDivElement, Testimonial9Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 9 component stub
      </div>
    )
  }
)
Testimonial9.displayName = "Testimonial9"

export { Testimonial9 }
