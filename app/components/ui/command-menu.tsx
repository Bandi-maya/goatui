import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface CommandMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
  groups?: Array<{
    label: string;
    items: Array<{
      id: string;
      label: string;
      icon?: React.ReactNode;
      action?: () => void;
      shortcut?: string;
    }>;
  }>;
  className?: string;
  [key: string]: any;
}

const CommandMenu = ({
  isOpen = false,
  onClose,
  placeholder = "Type a command or search...",
  groups = [], // Array of { label: "...", items: [{ id: "...", label: "...", icon: ..., action: ..., shortcut: "..." }] }
  className,
  ...props
}: CommandMenuProps) => {
  const [search, setSearch] = React.useState("");
  const [activeItemIndex, setActiveItemIndex] = React.useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const itemsContainerRef = React.useRef<HTMLDivElement>(null);

  // Ctrl+K or Cmd+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen && onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
      setActiveItemIndex(0);
      setSearch("");
    }
  }, [isOpen]);

  // Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Flattened items for keyboard indexing
  const filteredItems = React.useMemo(() => {
    const flat: any[] = [];
    groups.forEach(group => {
      const matchedItems = group.items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
      if (matchedItems.length) {
        flat.push({
          isGroupHeader: true,
          label: group.label
        });
        matchedItems.forEach(mi => {
          flat.push({
            ...mi,
            isGroupHeader: false
          });
        });
      }
    });
    return flat;
  }, [groups, search]);

  const realActions = React.useMemo(() => {
    return filteredItems.filter(item => !item.isGroupHeader);
  }, [filteredItems]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveItemIndex(prev =>
        prev + 1 >= realActions.length ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveItemIndex(prev =>
        prev - 1 < 0 ? realActions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = realActions[activeItemIndex];
      if (selected && selected.action) {
        selected.action();
        if (onClose) onClose();
      }
    }
  };

  // Scroll active item into view
  React.useEffect(() => {
    if (!itemsContainerRef.current) return;
    const activeEl = itemsContainerRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeItemIndex]);

  let currentActionIndex = -1;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDown}
            className={clsx(
              "relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--popover)] shadow-2xl overflow-hidden flex flex-col focus:outline-none max-h-[50vh]",
              className
            )}
            style={{
              backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
              borderColor: "var(--border)",
              color: "var(--foreground)"
            }}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            {...(props as any)}
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 shrink-0">
              <span className="text-slate-400">
                <svg className="h-4.5 w-4.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveItemIndex(0);
                }}
                placeholder={placeholder}
                className="w-full bg-transparent border-none p-0 text-sm font-semibold text-[var(--foreground)] placeholder:text-slate-400 focus:outline-none focus:ring-0 outline-none"
              />
              <button
                onClick={onClose}
                className="rounded px-1.5 py-0.5 border border-[var(--border)] text-[9px] font-bold text-slate-400 select-none hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                ESC
              </button>
            </div>

            {/* List */}
            <div
              ref={itemsContainerRef}
              className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5"
            >
              {filteredItems.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs font-semibold text-slate-400">
                  No results found.
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  if (item.isGroupHeader) {
                    return (
                      <div
                        key={`header-${item.label}`}
                        className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none"
                      >
                        {item.label}
                      </div>
                    );
                  }

                  currentActionIndex++;
                  const isCurrentActive = currentActionIndex === activeItemIndex;
                  const itemIndex = currentActionIndex;

                  return (
                    <div
                      key={item.id}
                      role="option"
                      data-active={isCurrentActive}
                      aria-selected={isCurrentActive}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                          if (onClose) onClose();
                        }
                      }}
                      onMouseEnter={() => setActiveItemIndex(itemIndex)}
                      className={clsx(
                        "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer select-none transition-colors",
                        isCurrentActive
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span className={clsx("text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded border select-none", isCurrentActive ? "border-white/30 text-white" : "border-[var(--border)] text-slate-400")}>
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export { CommandMenu }
export default CommandMenu
