import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { OutlineDraw } from "./OutlineDraw"

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: any;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
}

export interface SelectProps {
  children?: React.ReactNode;
  value?: any;
  onValueChange?: (value: any) => void;
  defaultValue?: any;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "filled" | "glass";
  state?: "default" | "success" | "warning" | "error";
  fullWidth?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue: any;
  updateValue: (value: any, label: any) => void;
  selectedLabel: any;
  setSelectedLabel: (label: any) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  disabled: boolean;
  loading: boolean;
  readonly: boolean;
  size: string;
  variant: string;
  state: string;
  fullWidth: boolean;
}

const SelectContext = React.createContext<SelectContextType | null>(null)

const Select = ({
  children,
  value,
  onValueChange,
  defaultValue = "",
  disabled = false,
  loading = false,
  readonly = false,
  size = "default",
  variant = "default",
  state = "default",
  fullWidth = false
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value !== undefined ? value : defaultValue);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const updateValue = React.useCallback((val: any, label: any) => {
    if (disabled || loading || readonly) return;
    if (value === undefined) {
      setSelectedValue(val);
    }
    setSelectedLabel(label);
    if (onValueChange) {
      onValueChange(val);
    }
    setIsOpen(false);
  }, [disabled, loading, readonly, value, onValueChange]);

  return (
    <SelectContext.Provider value={{
      isOpen,
      setIsOpen,
      selectedValue,
      updateValue,
      selectedLabel,
      setSelectedLabel,
      triggerRef,
      disabled,
      loading,
      readonly,
      size,
      variant,
      state,
      fullWidth
    }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("flex flex-col gap-0.5", className)} {...props} />
);

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>((
  {
    placeholder, className, ...props
  },
  ref
) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  return (
    <span
      ref={ref}
      className={clsx(
        "block truncate text-sm font-semibold relative z-10",
        !context.selectedValue && "text-[var(--muted-foreground)]/60 font-medium",
        className
      )}
      {...props}
    >
      {context.selectedLabel || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>((
  {
    className, children, ...props
  },
  ref
) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  const {
    disabled,
    loading,
    readonly,
    size,
    variant,
    state,
    fullWidth,
    isOpen,
    setIsOpen
  } = context;

  const combinedRef = (node: any) => {
    (context.triggerRef as any).current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as any).current = node;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || loading || readonly) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const states: Record<string, string> = {
    default: "",
    success: "border-[var(--success)] focus:ring-[var(--success)]/20",
    warning: "border-[var(--warning)] focus:ring-[var(--warning)]/20",
    error: "border-[var(--destructive)] focus:ring-[var(--destructive)]/20",
  };

  const variants: Record<string, string> = {
    default: "bg-[var(--background)] border-[var(--border)]",
    filled: "bg-[var(--secondary)] border-transparent",
    glass: "bg-[var(--background)]/10 backdrop-blur-md border-[var(--border)]",
  };

  const sizes: Record<string, string> = {
    sm: "h-9 text-xs px-3",
    default: "h-11 text-sm px-4",
    lg: "h-12 text-base px-5",
    xl: "h-14 text-lg px-6",
  };

  return (
    <button
      ref={combinedRef}
      type="button"
      disabled={disabled || loading || readonly}
      onClick={() => !(disabled || loading || readonly) && setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      className={clsx(
        "flex items-center justify-between rounded-xl font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 disabled:cursor-not-allowed disabled:opacity-50 text-[var(--foreground)] optiflow-outline-parent",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        states[state] || states.default,
        fullWidth ? "w-full" : "w-auto",
        isOpen ? "border-[var(--primary)]" : "",
        className
      )}
      {...(props as any)}
    >
      <span className="flex items-center gap-2 relative z-10">
        {loading && (
          <svg className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M22 12A10 10 0 0 0 12 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
        )}
        {children}
      </span>
      <span className="text-[var(--muted-foreground)] shrink-0 ml-2 relative z-10">
        <svg
          className={clsx("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
      <OutlineDraw state={state} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>((
  {
    className,
    children,
    sideOffset = 6,
    ...props
  },
  ref
) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");

  const { isOpen, setIsOpen, triggerRef } = context;
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let top = triggerRect.bottom + window.scrollY + sideOffset;
    let left = triggerRect.left + window.scrollX;

    if (top + contentRect.height > window.innerHeight + window.scrollY) {
      top = triggerRect.top + window.scrollY - contentRect.height - sideOffset;
    }

    setCoords({
      top,
      left,
      width: triggerRect.width
    });
  }, [triggerRef, sideOffset]);

  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      const timer = setTimeout(updatePosition, 10);

      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        contentRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, triggerRef, setIsOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const combinedContentRef = (node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as any).current = node;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          ref={combinedContentRef}
          initial={{ opacity: 0, scaleY: 0, originY: 0 }}
          animate={{ opacity: 1, scaleY: 1, originY: 0 }}
          exit={{ opacity: 0, scaleY: 0, originY: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className={clsx(
            "fixed z-50 max-h-60 overflow-y-auto rounded-xl border p-1.5 shadow-xl outline-none flex flex-col gap-0.5 origin-top",
            className
          )}
          style={{
            top: coords.top,
            left: coords.left,
            width: coords.width,
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            color: "var(--foreground)"
          }}
          role="listbox"
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>((
  {
    className, value, children, ...props
  },
  ref
) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const { selectedValue, setSelectedLabel, updateValue } = context;
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    if (isSelected) {
      setSelectedLabel(children);
    }
  }, [isSelected, children, setSelectedLabel]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateValue(value, children);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      updateValue(value, children);
    }
  };

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        "relative overflow-hidden z-10 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none outline-none transition-colors text-[var(--foreground)]",
        isSelected 
          ? "text-[var(--primary)] font-bold" 
          : "hover:bg-[var(--secondary)] focus:bg-[var(--secondary)]",
        className
      )}
      {...props}
    >
      {isSelected && (
        <motion.div
          layoutId="select-item-bg"
          className="absolute inset-0 bg-[var(--primary)]/10 -z-10 rounded-lg"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span>{children}</span>
      {isSelected && (
        <span className="text-[var(--primary)] shrink-0 ml-2">
          <svg className="h-3.5 w-3.5 stroke-[3.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" className="optiflow-select-check-draw" />
          </svg>
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectLabel = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] select-none", className)}
    {...props}
  >
    {children}
  </div>
);
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = () => (
  <div className="h-[1px] bg-[var(--border)] my-1" />
);
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator
}
export default Select

