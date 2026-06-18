import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Bottom Sheet component stub
      </div>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet }
