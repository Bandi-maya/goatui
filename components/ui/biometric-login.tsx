import * as React from "react"
import { cn } from "@/lib/utils"

export interface BiometricLoginProps extends React.HTMLAttributes<HTMLDivElement> {}

const BiometricLogin = React.forwardRef<HTMLDivElement, BiometricLoginProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Biometric Login component stub
      </div>
    )
  }
)
BiometricLogin.displayName = "BiometricLogin"

export { BiometricLogin }
