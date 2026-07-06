import React, { useState, useRef, useEffect } from 'react';

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface TabItem {
  id: string;
  label: string;
}

export interface ResponsiveTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: string;
  state?: "default" | "success" | "warning" | "error";
  fullWidth?: boolean;
}

export default function ResponsiveTabs({
  tabs,
  activeTab,
  setActiveTab,
  className,
  style,
  disabled = false,
  loading = false,
  readonly = false,
  size = "default",
  variant = "default",
  state = "default",
  fullWidth = false
}: ResponsiveTabsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizes: Record<string, string> = {
    sm: "min-h-[36px] text-xs px-3 py-1.5",
    default: "min-h-[44px] text-sm px-4 py-2.5",
    lg: "min-h-[48px] text-base px-5 py-3",
    xl: "min-h-[56px] text-lg px-6 py-4"
  };

  const activeStates: Record<string, string> = {
    default: "text-[var(--primary)] bg-[var(--card)] shadow-md font-bold",
    success: "text-[var(--success)] bg-[var(--card)] shadow-md font-bold",
    warning: "text-[var(--warning)] bg-[var(--card)] shadow-md font-bold",
    error: "text-[var(--destructive)] bg-[var(--card)] shadow-md font-bold"
  };

  const activeTextState = activeStates[state] || activeStates.default;

  return (
    <div 
      className={clsx(
        fullWidth ? "w-full" : "w-auto", 
        "relative mb-6", 
        disabled && "opacity-50 pointer-events-none",
        className
      )} 
      style={style}
      ref={dropdownRef}
    >
      {/* Mobile view: Dropdown selector */}
      <div className="md:hidden">
        <button
          type="button"
          disabled={disabled || loading || readonly}
          onClick={() => !readonly && setIsOpen(!isOpen)}
          className={clsx(
            "flex justify-between items-center w-full rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20",
            sizes[size] || sizes.default
          )}
        >
          <span className="font-bold flex items-center gap-2">
            {loading && (
              <svg className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M22 12A10 10 0 0 0 12 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
            )}
            {activeTabObj?.label}
          </span>
          <svg
            className={clsx("w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-200", isOpen && "transform rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 z-50 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg py-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (!readonly) {
                    setActiveTab(tab.id);
                  }
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-wider transition-colors",
                  activeTab === tab.id
                    ? 'bg-[var(--secondary)] text-[var(--primary)] font-bold'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop/Tablet view: Tab Row */}
      <div className="hidden md:flex bg-[var(--secondary)] p-1.5 rounded-2xl gap-1.5 w-full flex-wrap sm:flex-nowrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              if (!readonly) {
                setActiveTab(tab.id);
              }
            }}
            className={clsx(
              "flex-1 text-center rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap outline-none",
              sizes[size] || sizes.default,
              activeTab === tab.id
                ? activeTextState
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

