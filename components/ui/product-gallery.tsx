import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProductGalleryProps extends React.HTMLAttributes<HTMLDivElement> {}

const ProductGallery = React.forwardRef<HTMLDivElement, ProductGalleryProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Product Gallery component stub
      </div>
    )
  }
)
ProductGallery.displayName = "ProductGallery"

export { ProductGallery }
