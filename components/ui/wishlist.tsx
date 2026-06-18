import * as React from "react"
import { cn } from "@/lib/utils"

export interface WishlistProps extends React.HTMLAttributes<HTMLDivElement> {}

const Wishlist = React.forwardRef<HTMLDivElement, WishlistProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Wishlist component stub
      </div>
    )
  }
)
Wishlist.displayName = "Wishlist"

export { Wishlist }
