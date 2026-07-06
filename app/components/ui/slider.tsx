import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  onValueChange?: (value: number) => void;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: React.ReactNode;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Slider = React.forwardRef<HTMLDivElement, SliderProps>((
  {
    className,
    value,
    onValueChange,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    label,
    ...props
  },
  ref
) => {
  const [val, setVal] = React.useState(value !== undefined ? value : defaultValue);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setVal(value);
    }
  }, [value]);

  const percentage = React.useMemo(() => {
    const pct = ((val - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [val, min, max]);

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const width = rect.width;
    const clickX = clientX - rect.left;
    let pct = clickX / width;
    pct = Math.min(1, Math.max(0, pct));

    const rawVal = min + pct * (max - min);
    // Round to step
    const steppedVal = Math.round(rawVal / step) * step;
    
    // Constrain
    const constrainedVal = Math.min(max, Math.max(min, steppedVal));

    if (value === undefined) {
      setVal(constrainedVal);
    }
    if (onValueChange) {
      onValueChange(constrainedVal);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    const touch = e.touches[0];
    if (touch) updateValue(touch.clientX);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const t = moveEvent.touches[0];
      if (t) updateValue(t.clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      delta = step;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      delta = -step;
    } else {
      return;
    }

    e.preventDefault();
    const nextVal = Math.min(max, Math.max(min, val + delta));
    if (value === undefined) {
      setVal(nextVal);
    }
    if (onValueChange) {
      onValueChange(nextVal);
    }
  };

  return (
    <div
      className={clsx(
        "relative flex w-full select-none flex-col gap-1.5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...(props as any)}
    >
      {label && (
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">
          {label}
        </span>
      )}

      {/* Slider Core Track */}
      <div
        ref={(node) => {
          (trackRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative flex h-5 w-full items-center cursor-pointer"
      >
        {/* Outer track line */}
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 transition-colors">
          {/* Active fill path */}
          <div
            className="h-full rounded-full bg-[var(--primary)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isDragging && setShowTooltip(false)}
          className={clsx(
            "absolute h-5 w-5 -ml-2.5 rounded-full border-2 border-[var(--primary)] bg-white shadow-md transition-shadow focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/30 cursor-grab active:cursor-grabbing",
            isDragging && "shadow-lg scale-110"
          )}
          style={{ left: `${percentage}%` }}
        >
          {/* Tooltip Overlay */}
          <AnimatePresence>
            {(showTooltip || isDragging) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: -32, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute left-1/2 -translate-x-1/2 rounded-md bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold pointer-events-none shadow"
              >
                {val}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
})
Slider.displayName = "Slider"

export { Slider }
export default Slider

