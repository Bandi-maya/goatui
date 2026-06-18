import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Avatar Upload component stub
      </div>
    )
  }
)
AvatarUpload.displayName = "AvatarUpload"

export { AvatarUpload }
