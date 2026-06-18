import * as React from "react"
import { cn } from "@/lib/utils"

export interface AgentMarketplaceProps extends React.HTMLAttributes<HTMLDivElement> {}

const AgentMarketplace = React.forwardRef<HTMLDivElement, AgentMarketplaceProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Agent Marketplace component stub
      </div>
    )
  }
)
AgentMarketplace.displayName = "AgentMarketplace"

export { AgentMarketplace }
