import * as React from "react"

export interface CheckboxProps extends React.HTMLAttributes<any> {
  checked?: boolean;
  onCheckedChange?: (...args: any[]) => void;
  disabled?: boolean;
  required?: boolean;
  label?: any;
  id?: any;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>((
  {
    className,
  checked = false,
  onCheckedChange,
  disabled = false,
  required = false,
  label,
  id,
  ...props
  },
  ref
) => {
  const [internalChecked, setInternalChecked] = React.useState(checked);
  const generatedId = React.useId();
  const inputId = id || generatedId;

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !internalChecked;
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
    <div className="flex items-center gap-2.5 select-none">
      <div
        ref={ref}
        role="checkbox"
        aria-checked={internalChecked}
        aria-required={required}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleToggle}
        id={inputId}
        className={clsx(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[var(--border)] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 relative overflow-hidden",
          internalChecked ? "bg-[var(--primary)] border-[var(--primary)] text-white" : "bg-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {internalChecked && (
          <svg
            className="h-3.5 w-3.5 stroke-[3] overflow-visible"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" className="optiflow-checkbox-draw" />
          </svg>
        )}
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
Checkbox.displayName = "Checkbox"

export { Checkbox }
export default Checkbox
