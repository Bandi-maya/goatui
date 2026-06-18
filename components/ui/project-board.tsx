import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProjectBoardProps extends React.HTMLAttributes<HTMLDivElement> {}

const ProjectBoard = React.forwardRef<HTMLDivElement, ProjectBoardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Project Board component stub
      </div>
    )
  }
)
ProjectBoard.displayName = "ProjectBoard"

export { ProjectBoard }
