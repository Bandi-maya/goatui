import * as React from "react"
import { cn } from "@/lib/utils"

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 border rounded-md text-center text-muted-foreground", className)} {...props}>
        Blog Card component stub
      </div>
    )
  }
)
BlogCard.displayName = "BlogCard"

export { BlogCard }
