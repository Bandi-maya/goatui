import * as React from "react"
import { cn } from "@/lib/utils"

export interface ConversionCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const ConversionCard = React.forwardRef<HTMLDivElement, ConversionCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Conversion Card component stub
      </div>
    )
  }
)
ConversionCard.displayName = "ConversionCard"

export { ConversionCard }
