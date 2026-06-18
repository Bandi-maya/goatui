import * as React from "react"
import { cn } from "@/lib/utils"

export interface Testimonial8Props extends React.HTMLAttributes<HTMLDivElement> {}

const Testimonial8 = React.forwardRef<HTMLDivElement, Testimonial8Props>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial 8 component stub
      </div>
    )
  }
)
Testimonial8.displayName = "Testimonial8"

export { Testimonial8 }
