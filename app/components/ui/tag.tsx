import * as React from "react"

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  showDot?: boolean;
  interactive?: boolean;
  label?: React.ReactNode;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Tag = React.forwardRef<HTMLDivElement, TagProps>((
  {
    className,
    variant = "default", // "default" | "success" | "warning" | "error" | "info"
    showDot = false,
    interactive = false,
    label,
    children,
    ...props
  },
  ref
) => {
  const variants: Record<string, string> = {
    default: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    error: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
    info: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30"
  };

  const dotVariants: Record<string, string> = {
    default: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-sky-500"
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider select-none transition-all duration-200",
        variants[variant] || variants.default,
        interactive && "cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 active:scale-95",
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={clsx("h-1.5 w-1.5 rounded-full shrink-0", dotVariants[variant] || dotVariants.default)}
        />
      )}
      <span>{label || children}</span>
    </div>
  );
})
Tag.displayName = "Tag"

export { Tag }
export default Tag

