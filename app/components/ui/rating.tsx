import * as React from "react"
import { motion } from "framer-motion"

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  onValueChange?: (value: number) => void;
  defaultValue?: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Rating = React.forwardRef<HTMLDivElement, RatingProps>((
  {
    className,
    value = 0,
    onValueChange,
    defaultValue = 0,
    max = 5,
    size = "default", // "sm" | "default" | "lg"
    disabled = false,
    readOnly = false,
    ...props
  },
  ref
) => {
  const [rating, setRating] = React.useState(value !== undefined ? value : defaultValue);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setRating(value);
    }
  }, [value]);

  const handleSelect = (val: number) => {
    if (disabled || readOnly) return;
    if (value === undefined) {
      setRating(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const handleMouseEnter = (val: number) => {
    if (disabled || readOnly) return;
    setHoverRating(val);
  };

  const handleMouseLeave = () => {
    if (disabled || readOnly) return;
    setHoverRating(null);
  };

  const activeVal = hoverRating !== null ? hoverRating : rating;

  const starSizes: Record<string, string> = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled || readOnly) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelect(Math.min(max, rating + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelect(Math.max(1, rating - 1));
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSelect(index);
    }
  };

  return (
    <div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "flex items-center gap-1",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...(props as any)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;
        const isActive = index <= activeVal;

        return (
          <div
            key={index}
            role="button"
            aria-label={`Rate ${index} out of ${max}`}
            tabIndex={disabled || readOnly ? -1 : 0}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => handleSelect(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={clsx(
              "p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40 transition-all",
              !disabled && !readOnly && "cursor-pointer active:scale-90 hover:scale-110"
            )}
          >
            <motion.svg
              className={clsx(
                starSizes[size] || starSizes.default,
                isActive 
                  ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" 
                  : "text-slate-200 dark:text-slate-800"
              )}
              viewBox="0 0 24 24"
              fill={isActive ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                scale: isActive ? [1, 1.15, 1] : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </motion.svg>
          </div>
        );
      })}
    </div>
  );
})
Rating.displayName = "Rating"

export { Rating }
export default Rating

