import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface ComboboxProps extends React.HTMLAttributes<any> {
  options?: any[];
  value?: string;
  onValueChange?: (...args: any[]) => void;
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((
  {
    className,
  options = [],
  value = "",
  onValueChange,
  defaultValue = "",
  placeholder = "Select item...",
  searchPlaceholder = "Search items...",
  emptyText = "No items found.",
  disabled = false,
  ...props
  },
  ref
) => {
  const [selectedValue, setSelectedValue] = React.useState(value !== undefined ? value : defaultValue);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const updateSelected = (val: any) => {
    if (disabled) return;
    if (value === undefined) {
      setSelectedValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const handleSelectOption = (val: any) => {
    updateSelected(val);
    setOpen(false);
    setSearch("");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when opening
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex h-11 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 disabled:cursor-not-allowed disabled:opacity-50 text-[var(--foreground)]",
          open ? "border-[var(--primary)]" : "hover:border-[var(--border)]"
        )}
        {...props}
      >
        <span className={clsx(!selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-slate-400">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>
          </svg>
        </span>
      </button>

      {/* Popover overlay */}
      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-xl outline-none flex flex-col gap-1.5"
            style={{
              backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
              borderColor: "var(--border)",
            }}
          >
            {/* Search Input inside popover */}
            <div className="relative flex items-center border-b border-[var(--border)] pb-1 px-1">
              <span className="text-slate-400 absolute left-2.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent pl-8 pr-2 py-1 text-xs font-semibold text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none border-none focus:ring-0"
              />
            </div>

            {/* List */}
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs font-semibold text-slate-400">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selectedValue === option.value;
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})
Combobox.displayName = "Combobox"

export { Combobox }
export default Combobox
