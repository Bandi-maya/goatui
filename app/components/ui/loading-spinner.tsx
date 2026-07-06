import * as React from "react"
import { motion } from "framer-motion"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "spin" | "dots" | "pulse" | "ring";
  color?: "primary" | "muted" | "white";
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>((
  {
    className,
  size = "default", // "sm" | "default" | "lg" | "xl"
  variant = "spin", // "spin" | "dots" | "pulse" | "ring"
  color = "primary", // "primary" | "muted" | "white"
  ...props
  },
  ref
) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-9 w-9",
    xl: "h-12 w-12"
  };

  const colors = {
    primary: "text-[var(--primary)]",
    muted: "text-slate-400 dark:text-slate-600",
    white: "text-white"
  };

  const activeSize = sizeClasses[size] || sizeClasses.default;
  const activeColor = colors[color] || colors.primary;

  if (variant === "dots") {
    return (
      <div
        ref={ref}
        className={clsx("flex items-center gap-1 select-none", activeColor, className)}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={clsx(
              "rounded-full bg-currentColor",
              size === "sm" ? "h-1 w-1" : size === "lg" ? "h-2 w-2" : size === "xl" ? "h-2.5 w-2.5" : "h-1.5 w-1.5"
            )}
            animate={{
              y: ["0%", "-50%", "0%"]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        ref={ref}
        className={clsx("relative inline-flex items-center justify-center select-none", activeSize, className)}
        {...props}
      >
        <span className={clsx("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-currentColor", activeColor)} />
        <span className={clsx("relative inline-flex rounded-full bg-currentColor", activeSize, activeColor)} />
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <div
        ref={ref}
        className={clsx("relative select-none", activeSize, activeColor, className)}
        {...props}
      >
        <svg
          className="animate-spin h-full w-full"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Default "spin" spinner
  return (
    <div
      ref={ref}
      className={clsx("animate-spin select-none", activeSize, activeColor, className)}
      {...props}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" className="opacity-25" />
        <path d="M22 12A10 10 0 0 0 12 2" className="opacity-75" />
      </svg>
    </div>
  );
})
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner }
export default LoadingSpinner
