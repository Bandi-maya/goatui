import * as React from "react"
import { cn } from "@/lib/utils"

export interface CartProps extends React.HTMLAttributes<HTMLDivElement> {}

const Cart = React.forwardRef<HTMLDivElement, CartProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Cart component stub
      </div>
    )
  }
)
Cart.displayName = "Cart"

export { Cart }
