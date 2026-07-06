import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: Array<{ label: string; value: string }>;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  maxSelected?: number | null;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>((
  {
    className,
    options = [],
    value = [],
    onValueChange,
    defaultValue = [],
    placeholder = "Select options...",
    disabled = false,
    maxSelected = null,
    ...props
  },
  ref
) => {
  const [selected, setSelected] = React.useState<string[]>(value !== undefined ? value : defaultValue);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => containerRef.current as any);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const updateSelected = (newSelected: string[]) => {
    if (disabled) return;
    if (value === undefined) {
      setSelected(newSelected);
    }
    if (onValueChange) {
      onValueChange(newSelected);
    }
  };

  const handleSelectOption = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      updateSelected(selected.filter(item => item !== optionValue));
    } else {
      if (maxSelected && selected.length >= maxSelected) return;
      updateSelected([...selected, optionValue]);
    }
    setSearch("");
    inputRef.current?.focus();
  };

  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    updateSelected(selected.filter(item => item !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    updateSelected([]);
    setSearch("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && search === "" && selected.length > 0) {
      updateSelected(selected.slice(0, -1));
    }

    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }

    if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full", className)}
      onKeyDown={handleKeyDown}
      {...(props as any)}
    >
      {/* Control Box */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={clsx(
          "flex min-h-[44px] w-full flex-wrap items-center justify-between rounded-xl border border-[var(--border)] bg-transparent px-3 py-1 text-sm transition-all focus-within:ring-4 focus-within:ring-[var(--ring)]/20 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          open ? "border-[var(--primary)]" : "hover:border-[var(--border)]"
        )}
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          {selected.map(itemVal => {
            const opt = options.find(o => o.value === itemVal);
            const label = opt ? opt.label : itemVal;
            return (
              <span
                key={itemVal}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 text-xs font-semibold"
              >
                {label}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => handleRemoveOption(itemVal, e)}
                  className="rounded-full hover:bg-[var(--primary)]/20 p-0.5 transition-colors focus:outline-none"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            );
          })}
          
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[60px] bg-transparent py-1 font-medium text-[var(--foreground)] placeholder:text-slate-400 outline-none border-none focus:ring-0 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {selected.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

      {/* Dropdown Options */}
      <AnimatePresence>
        {open && !disabled && (
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
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs font-semibold text-slate-400">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(option.value)}
                    className={clsx(
                      "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none transition-colors",
                      isSelected 
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]" 
                        : "text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="text-[var(--primary)]">
                        <svg className="h-3.5 w-3.5 stroke-[3.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
export default MultiSelect

