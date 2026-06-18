import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Modal component stub
      </div>
    )
  }
)
Modal.displayName = "Modal"

export { Modal }
