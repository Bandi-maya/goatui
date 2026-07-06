import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: any;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: any;
  value?: any;
  onValueChange?: (value: any) => void;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: string;
  state?: "default" | "success" | "warning" | "error";
  fullWidth?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface TabsContextType {
  activeTab: any;
  setTab: (val: any) => void;
  disabled: boolean;
  loading: boolean;
  readonly: boolean;
  size: string;
  variant: string;
  state: string;
  fullWidth: boolean;
}

const TabsContext = React.createContext<TabsContextType | null>(null)

const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  className,
  style,
  disabled = false,
  loading = false,
  readonly = false,
  size = "default",
  variant = "default",
  state = "default",
  fullWidth = false,
  children,
  ...props
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const setTab = React.useCallback((val: any) => {
    if (disabled || loading || readonly) return;
    if (value === undefined) {
      setActiveTab(val)
    }
    onValueChange?.(val)
  }, [value, onValueChange, disabled, loading, readonly])

  return (
    <TabsContext.Provider value={{
      activeTab,
      setTab,
      disabled,
      loading,
      readonly,
      size,
      variant,
      state,
      fullWidth
    }}>
      <div 
        style={style}
        className={clsx(
          fullWidth ? "w-full" : "w-auto", 
          disabled && "opacity-50 pointer-events-none",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>((
  {
    className, ...props
  },
  ref
) => {
  const context = React.useContext(TabsContext);
  const sizeClasses: Record<string, string> = {
    sm: "p-0.5 rounded-lg",
    default: "p-1 rounded-xl",
    lg: "p-1.5 rounded-xl",
    xl: "p-2 rounded-2xl",
  };
  return (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center bg-[var(--secondary)] text-[var(--muted-foreground)]",
        (context?.size && sizeClasses[context.size]) || sizeClasses.default,
        context?.fullWidth ? "w-full flex" : "",
        className
      )}
      {...props}
    />
  );
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>((
  {
    className, value, children, ...props
  },
  ref
) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used inside Tabs")
  const { activeTab, setTab, disabled, loading, readonly, size, state, fullWidth } = context
  const isActive = activeTab === value

  const sizeClasses: Record<string, string> = {
    sm: "px-2.5 py-1 text-xs rounded-md",
    default: "px-3 py-1.5 text-xs rounded-lg",
    lg: "px-4 py-2 text-sm rounded-lg",
    xl: "px-5 py-2.5 text-base rounded-xl",
  };

  const activeStates: Record<string, string> = {
    default: "text-[var(--foreground)]",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
    error: "text-[var(--destructive)]",
  };

  const activeText = activeStates[state] || activeStates.default;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading || readonly}
      onClick={() => setTab(value)}
      className={clsx(
        "relative inline-flex items-center justify-center whitespace-nowrap font-semibold uppercase tracking-wider transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none z-10",
        fullWidth ? "flex-1" : "",
        sizeClasses[size] || sizeClasses.default,
        isActive ? clsx("font-bold", activeText) : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        className
      )}
      {...(props as any)}
    >
      {isActive && (
        <motion.span
          layoutId="active-tab-indicator"
          className="absolute inset-0 bg-[var(--card)] rounded-lg shadow-sm -z-10 border border-[var(--border)]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="flex items-center gap-2">
        {loading && isActive && (
          <svg className="h-3 w-3 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M22 12A10 10 0 0 0 12 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>((
  {
    className, value, children, ...props
  },
  ref
) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used inside Tabs")
  const { activeTab } = context

  return (
    <AnimatePresence mode="wait">
      {activeTab === value && (
        <motion.div
          ref={ref}
          className={clsx("mt-4 focus-visible:outline-none", className)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
export default Tabs

