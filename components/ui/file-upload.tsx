import * as React from "react"
import { cn } from "@/lib/utils"

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        File Upload component stub
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
