import * as React from "react"
import { motion } from "framer-motion"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  animated?: boolean;
  variant?: "default" | "success" | "warning" | "error";
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((
  {
    className,
  value = 0,
  max = 100,
  showLabel = false,
  animated = true,
  variant = "default", // "default" | "success" | "warning" | "error"
  ...props
  },
  ref
) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const fillVariants = {
    default: "bg-[var(--primary)]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500"
  };

  return (
    <div
      ref={ref}
      className={clsx("w-full flex flex-col gap-1.5 select-none", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...props}
    >
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className={clsx(
            "h-full rounded-full transition-all",
            fillVariants[variant] || fillVariants.default,
            animated && "relative overflow-hidden"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Shimmer animation */}
          {animated && (
            <span
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-transparent
                via-white/20
                to-transparent
                animate-[shimmer_1.5s_infinite]
                skew-x-12
              "
              style={{
                backgroundSize: "200% 100%"
              }}
            />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <span className="text-[10px] font-bold text-slate-500 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
})
Progress.displayName = "Progress"

export { Progress }
export default Progress
