import * as React from "react"
import { cn } from "@/lib/utils"

export interface DragUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const DragUpload = React.forwardRef<HTMLDivElement, DragUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Drag Upload component stub
      </div>
    )
  }
)
DragUpload.displayName = "DragUpload"

export { DragUpload }
