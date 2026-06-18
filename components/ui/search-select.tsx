import * as React from "react"
import { cn } from "@/lib/utils"

export interface SearchSelectProps extends React.HTMLAttributes<HTMLDivElement> {}

const SearchSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Search Select component stub
      </div>
    )
  }
)
SearchSelect.displayName = "SearchSelect"

export { SearchSelect }
