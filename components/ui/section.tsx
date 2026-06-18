import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Section component stub
      </div>
    )
  }
)
Section.displayName = "Section"

export { Section }
