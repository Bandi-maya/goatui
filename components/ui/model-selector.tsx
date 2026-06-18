import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModelSelectorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModelSelector = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Model Selector component stub
      </div>
    )
  }
)
ModelSelector.displayName = "ModelSelector"

export { ModelSelector }
