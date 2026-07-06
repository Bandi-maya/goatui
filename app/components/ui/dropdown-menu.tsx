import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<any> {
  asChild?: boolean;
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<any> {
  align?: string;
  // "left" | "right"
  sideOffset?: number;
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<any> {
  disabled?: boolean;
  shortcut?: any;
  onClick?: (...args: any[]) => void;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const DropdownMenuContext = React.createContext<any>(null)

export interface DropdownMenuProps {
  children?: React.ReactNode;
}

const DropdownMenu = ({
  children,
  ...props
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, handleToggle, handleClose }}>
      <div
        ref={containerRef}
        className="relative inline-block text-left"
        {...props}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>((
  {
    className, children, asChild = false, ...props
  },
  ref
) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used inside DropdownMenu");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    context.handleToggle();
  };

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>;
    return React.cloneElement(childElement, {
      onClick: handleClick,
      ref
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={clsx("inline-flex focus:outline-none", className)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>((
  {
    className,
  align = "right", // "left" | "right"
  sideOffset = 6,
  children,
  ...props
  },
  ref
) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuContent must be used inside DropdownMenu");

  const alignClasses: Record<string, string> = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right"
  };

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={clsx(
            "absolute z-50 w-56 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-xl focus:outline-none flex flex-col gap-0.5",
            alignClasses[align] || alignClasses.right,
            className
          )}
          style={{
            top: `calc(100% + ${sideOffset}px)`,
            backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
            borderColor: "var(--border)"
          }}
          role="menu"
          tabIndex={-1}
          {...(props as any)}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              const element = child as React.ReactElement<any>;
              return React.cloneElement(element, {
                onClick: (e: React.MouseEvent) => {
                  if (element.props.onClick) element.props.onClick(e);
                  context.handleClose();
                }
              });
            }
            return child;
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>((
  {
    className,
  children,
  disabled = false,
  shortcut,
  onClick,
  ...props
  },
  ref
) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled && onClick) onClick(e as any);
    }
  };

  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          return;
        }
        if (onClick) onClick(e);
      }}
      className={clsx(
        "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold select-none cursor-pointer outline-none transition-colors text-[var(--foreground)]",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      {shortcut && (
        <span className="ml-auto text-[9px] font-bold tracking-widest text-slate-400 select-none">
          {shortcut}
        </span>
      )}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = () => (
  <div className="h-[1px] bg-[var(--border)] my-1" />
);

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuLabel = ({ className, children, ...props }: DropdownMenuLabelProps) => (
  <div
    className={clsx("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none", className)}
    {...props}
  >
    {children}
  </div>
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
}
export default DropdownMenu
