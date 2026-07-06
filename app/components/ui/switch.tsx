import * as React from "react"
import { motion } from "framer-motion"

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  id?: string;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>((
  {
    className,
    checked = false,
    onCheckedChange,
    disabled = false,
    label,
    id,
    ...props
  },
  ref
) => {
  const [internalChecked, setInternalChecked] = React.useState(checked);
  const [pulse, setPulse] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !internalChecked;
    
    // Trigger radar glow pulse wave
    setPulse(true);
    setTimeout(() => setPulse(false), 400);

    if (onCheckedChange) {
      onCheckedChange(nextState);
    } else {
      setInternalChecked(nextState);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        ref={ref}
        role="switch"
        aria-checked={internalChecked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleToggle}
        id={inputId}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 overflow-hidden",
          internalChecked ? "bg-[var(--primary)]" : "bg-slate-200 dark:bg-slate-800",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...(props as any)}
      >
        {/* Radar glow pulse wave */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[var(--primary)]/40 pointer-events-none animate-[optiflow-radar-pulse_0.4s_ease-out]" />
        )}

        {/* Spring thumb slider */}
        <motion.span
          animate={{ x: internalChecked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0"
        />
      </div>
      {label && (
        <label
          htmlFor={inputId}
          onClick={handleToggle}
          className={clsx(
            "text-sm font-semibold text-[var(--foreground)] cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
})
Switch.displayName = "Switch"

export { Switch }
export default Switch

