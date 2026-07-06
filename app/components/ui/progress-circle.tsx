import * as React from "react"
import { motion } from "framer-motion"

export interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "error";
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>((
  {
    className,
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  showLabel = false,
  variant = "default", // "default" | "success" | "warning" | "error"
  ...props
  },
  ref
) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColors = {
    default: "stroke-[var(--primary)]",
    success: "stroke-emerald-500",
    warning: "stroke-amber-500",
    error: "stroke-red-500"
  };

  return (
    <div
      ref={ref}
      className={clsx("relative inline-flex items-center justify-center select-none", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
      >
        {/* Background track circle */}
        <circle
          className="text-slate-100 dark:text-slate-800"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Active progress circle */}
        <motion.circle
          className={clsx("transition-all duration-300", strokeColors[variant] || strokeColors.default)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {showLabel && (
        <span className="absolute text-[10px] font-bold text-slate-600 dark:text-slate-400">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
})
ProgressCircle.displayName = "ProgressCircle"

export { ProgressCircle }
export default ProgressCircle
