import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Image Upload component stub
      </div>
    )
  }
)
ImageUpload.displayName = "ImageUpload"

export { ImageUpload }
