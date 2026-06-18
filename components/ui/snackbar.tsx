import * as React from "react"
import { cn } from "@/lib/utils"

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Snackbar component stub
      </div>
    )
  }
)
Snackbar.displayName = "Snackbar"

export { Snackbar }
