import * as React from "react"
import { clsx } from "clsx"

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  time?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  children?: React.ReactNode;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>((
  {
    className, children, ...props
  },
  ref
) => (
  <div
    ref={ref}
    className={clsx("relative border-l border-[var(--border)] ml-3 pl-6 space-y-6 text-left", className)}
    {...props}
  >
    {children}
  </div>
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>((
  {
    className,
    title,
    time,
    description,
    icon,
    variant = "default", // "default" | "success" | "warning" | "error" | "info"
    children,
    ...props
  },
  ref
) => {
  const dotVariants: Record<string, string> = {
    default: "bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-50/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    error: "bg-rose-50/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    info: "bg-sky-50/10 border-sky-500/20 text-sky-600 dark:text-sky-400"
  };

  return (
    <div
      ref={ref}
      className={clsx("relative group select-none", className)}
      {...props}
    >
      {/* Connector Point */}
      <span className={clsx(
        "absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white dark:bg-slate-950 transition-all group-hover:scale-110",
        dotVariants[variant] || dotVariants.default
      )}>
        {icon ? (
          icon
        ) : (
          <span className="h-2 w-2 rounded-full bg-currentColor" />
        )}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-1">
        {time && (
          <time className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {time}
          </time>
        )}
        {title && (
          <h4 className="text-sm font-semibold tracking-tight text-[var(--foreground)] leading-tight">
            {title}
          </h4>
        )}
        {(description || children) && (
          <div className="text-xs font-semibold leading-relaxed text-slate-500 mt-0.5">
            {description || children}
          </div>
        )}
      </div>
    </div>
  );
})
TimelineItem.displayName = "TimelineItem"

export { Timeline, TimelineItem }
export default Timeline

