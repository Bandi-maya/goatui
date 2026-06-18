import * as React from "react"
import { cn } from "@/lib/utils"

export interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Testimonial Card component stub
      </div>
    )
  }
)
TestimonialCard.displayName = "TestimonialCard"

export { TestimonialCard }
