import * as React from "react"
import { cn } from "@/lib/utils"

export interface NumberInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Number Input component stub
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
