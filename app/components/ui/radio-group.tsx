import * as React from "react"
import { motion } from "framer-motion"

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  name?: string;
}

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
  disabled?: boolean;
  label?: any;
  id?: string;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface RadioGroupContextType {
  selectedValue: any;
  handleSelect: (value: any) => void;
  disabled: boolean;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null)

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((
  {
    className,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    orientation = "vertical",
    name,
    children,
    ...props
  },
  ref
) => {
  const [selectedValue, setSelectedValue] = React.useState(value !== undefined ? value : defaultValue);
  const radioId = React.useId();

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (val: any) => {
    if (disabled) return;
    if (value === undefined) {
      setSelectedValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="radio"]:not([aria-disabled="true"])') || []
    );
    if (!items.length) return;

    const activeEl = document.activeElement as HTMLElement | null;
    const currentIndex = activeEl ? items.indexOf(activeEl) : -1;
    let nextIndex = currentIndex;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (currentIndex !== -1) {
        const itemVal = items[currentIndex].getAttribute("data-value");
        handleSelect(itemVal);
      }
      return;
    } else {
      return;
    }

    const nextItem = items[nextIndex];
    if (nextItem) {
      nextItem.focus();
      const val = nextItem.getAttribute("data-value");
      handleSelect(val);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ selectedValue, handleSelect, disabled, name: name || radioId }}>
      <div
        ref={(node) => {
          (rootRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        role="radiogroup"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={clsx(
          "grid gap-2",
          orientation === "horizontal" ? "grid-flow-col auto-cols-max gap-4" : "grid-cols-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>((
  {
    className,
    value,
    disabled = false,
    label,
    id,
    ...props
  },
  ref
) => {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }

  const generatedId = React.useId();
  const inputId = id || generatedId;
  const isSelected = context.selectedValue === value;
  const isItemDisabled = disabled || context.disabled;

  const handleClick = () => {
    if (isItemDisabled) return;
    context.handleSelect(value);
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        ref={ref}
        role="radio"
        aria-checked={isSelected}
        aria-disabled={isItemDisabled}
        tabIndex={isItemDisabled ? -1 : isSelected || !context.selectedValue ? 0 : -1}
        onClick={handleClick}
        data-value={value}
        id={inputId}
        className={clsx(
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20",
          isSelected ? "border-[var(--primary)] text-[var(--primary)]" : "bg-transparent",
          isItemDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isSelected && (
          <>
            {/* Outer trailing radial glow pulse */}
            <motion.span
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute h-4 w-4 rounded-full bg-[var(--primary)]/30 pointer-events-none"
            />
            {/* Inner dot expanding from center */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]"
            />
          </>
        )}
      </div>
      {label && (
        <label
          htmlFor={inputId}
          onClick={handleClick}
          className={clsx(
            "text-sm font-semibold text-[var(--foreground)] cursor-pointer",
            isItemDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
export default RadioGroup

