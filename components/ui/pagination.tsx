import * as React from "react"
import { cn } from "@/lib/utils"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Pagination component stub
      </div>
    )
  }
)
Pagination.displayName = "Pagination"

export { Pagination }
