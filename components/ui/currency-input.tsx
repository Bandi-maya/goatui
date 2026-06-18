import * as React from "react"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const CurrencyInput = React.forwardRef<HTMLDivElement, CurrencyInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Currency Input component stub
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
