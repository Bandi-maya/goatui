"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer shrink-0 active:scale-98 active:duration-75",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10",
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60",
        outline: "border border-border bg-background hover:bg-muted/50 hover:text-foreground",
        ghost: "hover:bg-muted/50 hover:text-foreground",
        link: "text-blue-600 underline-offset-4 hover:underline",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/10",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/10",
        neon: "bg-zinc-950 text-blue-500 border border-blue-500/35 hover:bg-zinc-900 shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]",
        glass: "glass bg-white/20 dark:bg-black/20 text-foreground border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8.5 px-3 rounded-lg text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-1.5 justify-center">
            <svg
              className="h-3.5 w-3.5 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {size !== "icon" && children}
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
