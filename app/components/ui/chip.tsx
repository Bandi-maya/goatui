import * as React from "react"
import { OutlineDraw } from "./OutlineDraw"

export interface ChipProps extends React.HTMLAttributes<any> {
  variant?: string;
  // "default" | "secondary" | "outline" | "success" | "destructive" | "warning"
  size?: string;
  // "sm" | "default" | "lg"
  label?: any;
  icon?: any;
  onDelete?: (...args: any[]) => void;
  onClick?: (...args: any[]) => void;
  disabled?: boolean;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Chip = React.forwardRef<HTMLDivElement, ChipProps>((
  {
    className,
  variant = "default", // "default" | "secondary" | "outline" | "success" | "destructive" | "warning"
  size = "default", // "sm" | "default" | "lg"
  label,
  icon,
  onDelete,
  onClick,
  disabled = false,
  ...props
  },
  ref
) => {
  const variants: Record<string, string> = {
    default: "bg-[var(--primary)]/10 text-[var(--primary)] border-transparent",
    secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-transparent",
    outline: "border-[var(--border)] bg-transparent text-[var(--foreground)]",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-transparent",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent"
  };

  const sizes: Record<string, string> = {
    sm: "h-6 px-2.5 text-[10px]",
    default: "h-7 px-3 text-xs",
    lg: "h-9 px-4 text-sm"
  };

  const isInteractive = onClick && !disabled;

  return (
    <div
      ref={ref}
      onClick={!disabled ? onClick : undefined}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold select-none transition-all duration-200 relative",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        isInteractive && "cursor-pointer hover:opacity-90 active:scale-95 optiflow-outline-parent",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 relative z-10">{icon}</span>}
      <span className="relative z-10">{label}</span>
      {onDelete && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[var(--ring)] relative z-20"
          aria-label="Remove"
        >
          <svg className="h-3 w-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      {isInteractive && (
        <OutlineDraw rx="999px" />
      )}
    </div>
  );
})
Chip.displayName = "Chip"

export { Chip }
export default Chip
