"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border select-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-blue-500/10 text-primary dark:border-primary/30",
        secondary:
          "border-secondary-foreground/10 bg-secondary/50 text-secondary-foreground",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30",
        outline: "border-border text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
