import * as React from "react"
import { cn } from "@/lib/utils"

export interface TokenViewerProps extends React.HTMLAttributes<HTMLDivElement> {}

const TokenViewer = React.forwardRef<HTMLDivElement, TokenViewerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Token Viewer component stub
      </div>
    )
  }
)
TokenViewer.displayName = "TokenViewer"

export { TokenViewer }
