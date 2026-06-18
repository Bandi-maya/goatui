import * as React from "react"
import { cn } from "@/lib/utils"

export interface SocialButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const SocialButton = React.forwardRef<HTMLDivElement, SocialButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Social Button component stub
      </div>
    )
  }
)
SocialButton.displayName = "SocialButton"

export { SocialButton }
