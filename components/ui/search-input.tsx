import * as React from "react"
import { cn } from "@/lib/utils"

export interface SearchInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Search Input component stub
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
