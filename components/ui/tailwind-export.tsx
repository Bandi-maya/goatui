import * as React from "react"
import { cn } from "@/lib/utils"

export interface TailwindExportProps extends React.HTMLAttributes<HTMLDivElement> {}

const TailwindExport = React.forwardRef<HTMLDivElement, TailwindExportProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tailwind Export component stub
      </div>
    )
  }
)
TailwindExport.displayName = "TailwindExport"

export { TailwindExport }
