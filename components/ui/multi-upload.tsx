import * as React from "react"
import { cn } from "@/lib/utils"

export interface MultiUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const MultiUpload = React.forwardRef<HTMLDivElement, MultiUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Multi Upload component stub
      </div>
    )
  }
)
MultiUpload.displayName = "MultiUpload"

export { MultiUpload }
