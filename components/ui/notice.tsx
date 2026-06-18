import * as React from "react"
import { cn } from "@/lib/utils"

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Notice component stub
      </div>
    )
  }
)
Notice.displayName = "Notice"

export { Notice }
