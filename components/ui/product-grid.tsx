import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {}

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Product Grid component stub
      </div>
    )
  }
)
ProductGrid.displayName = "ProductGrid"

export { ProductGrid }
