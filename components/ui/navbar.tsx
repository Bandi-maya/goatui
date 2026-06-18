import * as React from "react"
import { cn } from "@/lib/utils"

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Navbar component stub
      </div>
    )
  }
)
Navbar.displayName = "Navbar"

export { Navbar }
