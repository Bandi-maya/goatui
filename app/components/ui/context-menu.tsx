import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export interface ContextMenuTriggerProps extends React.HTMLAttributes<any> {
}

export interface ContextMenuContentProps extends React.HTMLAttributes<any> {
}

export interface ContextMenuItemProps extends React.HTMLAttributes<any> {
  disabled?: boolean;
  shortcut?: any;
  onClick?: (...args: any[]) => void;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const ContextMenuContext = React.createContext<any>(null)

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ContextMenu = ({
  children,
  ...props
}: ContextMenuProps) => {
  const [menuState, setMenuState] = React.useState({ isOpen: false, x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Bounds calculations to prevent screen clipping
    const menuWidth = 224; // Width of menu card (w-56)
    const menuHeight = 200; // Expected approximate height
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setMenuState({
      isOpen: true,
      x,
      y
    });
  };

  const handleClose = () => {
    setMenuState(prev => ({ ...prev, isOpen: false }));
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      handleClose();
    };
    if (menuState.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, [menuState.isOpen]);

  return (
    <ContextMenuContext.Provider value={{ menuState, handleClose, handleContextMenu }}>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className="w-full"
        {...props}
      >
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>((
  {
    className, children, ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx("cursor-context-menu", className)}
      {...props}
    >
      {children}
    </div>
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>((
  {
    className,
  children,
  ...props
  },
  ref
) => {
  const context = React.useContext(ContextMenuContext);
  if (!context) throw new Error("ContextMenuContent must be used within ContextMenu");

  const { isOpen, x, y } = context.menuState;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          className={clsx(
            "fixed z-50 w-56 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-xl outline-none flex flex-col gap-0.5 select-none",
            className
          )}
          style={{
            left: x,
            top: y,
            backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
            borderColor: "var(--border)",
            color: "var(--foreground)"
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
    </AnimatePresence>,
    document.body
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>((
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
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuSeparator = () => (
  <div className="h-[1px] bg-[var(--border)] my-1" />
);

export interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
}

const ContextMenuLabel = ({ className, children, ...props }: ContextMenuLabelProps) => (
  <div
    className={clsx("px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none", className)}
    {...props}
  >
    {children}
  </div>
);

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel
}
export default ContextMenu
