import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Tabs component stub
      </div>
    )
  }
)
Tabs.displayName = "Tabs"

export { Tabs }
