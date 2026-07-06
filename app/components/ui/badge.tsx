import * as React from "react"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors select-none",
        variant === "default" && "bg-[var(--primary)] text-white border-transparent",
        variant === "secondary" && "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-transparent",
        variant === "destructive" && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40",
        variant === "success" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
        variant === "warning" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40",
        variant === "outline" && "bg-transparent text-[var(--foreground)] border-[var(--border)]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
export default Badge
