import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface AutocompleteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  options?: Array<{ label: string; value?: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  id?: string;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>((
  {
    className,
    options = [],
    value = "",
    onValueChange,
    defaultValue = "",
    placeholder = "Search items...",
    disabled = false,
    label,
    id,
    ...props
  },
  ref
) => {
  const [inputValue, setInputValue] = React.useState(value !== undefined ? value : defaultValue);
  const [open, setOpen] = React.useState(false);
  const [activeSuggestion, setActiveSuggestion] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const inputId = id || generatedId;

  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const updateValue = (val: string) => {
    if (disabled) return;
    if (value === undefined) {
      setInputValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  // Click outside listener to collapse
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (option: { label: string; value?: string }) => {
    updateValue(option.label);
    setOpen(false);
    setActiveSuggestion(0);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateValue("");
    setOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveSuggestion(prev => 
        prev + 1 >= filteredOptions.length ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return;
      setActiveSuggestion(prev => 
        prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (open && filteredOptions[activeSuggestion]) {
        e.preventDefault();
        handleSelectOption(filteredOptions[activeSuggestion]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full", className)}
      onKeyDown={handleKeyDown}
      {...(props as any)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={(node) => {
            (inputRef as any).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          id={inputId}
          type="text"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            updateValue(e.target.value);
            setOpen(true);
            setActiveSuggestion(0);
          }}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          className={clsx(
            "flex h-11 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 disabled:cursor-not-allowed disabled:opacity-50 pr-10 font-medium text-[var(--foreground)] placeholder:text-slate-400",
            open ? "border-[var(--primary)]" : "hover:border-[var(--border)]"
          )}
        />

        {/* Clear/Dropdown Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          <span className="text-slate-400">
            <svg
              className={clsx("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && !disabled && filteredOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-xl outline-none"
            style={{
              backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
              borderColor: "var(--border)",
            }}
          >
            {filteredOptions.map((option, index) => {
              const isActive = index === activeSuggestion;
              const isSelected = inputValue === option.label;

              return (
                <div
                  key={option.value || option.label}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  className={clsx(
                    "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none transition-colors",
                    isActive || isSelected
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className={clsx(isActive ? "text-white" : "text-[var(--primary)]")}>
                      <svg className="h-3.5 w-3.5 stroke-[3.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})
Autocomplete.displayName = "Autocomplete"

export { Autocomplete }
export default Autocomplete

