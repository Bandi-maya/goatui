import * as React from "react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Breadcrumb component stub
      </div>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
