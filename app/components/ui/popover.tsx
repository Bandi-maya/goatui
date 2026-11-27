import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

export interface PopoverProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface PopoverContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | null>(null)

const Popover = ({ children, defaultOpen = false, open, onOpenChange }: PopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const isControlled = open !== undefined;
  const activeOpen = isControlled ? open : isOpen;

  const setOpen = React.useCallback((val: boolean) => {
    if (!isControlled) {
      setIsOpen(val);
    }
    if (onOpenChange) {
      onOpenChange(val);
    }
  }, [isControlled, onOpenChange]);

  return (
    <PopoverContext.Provider value={{ isOpen: activeOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>((
  {
    className, children, asChild = false, ...props
  },
  ref
) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be used inside Popover");

  const triggerRef = React.useRef<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    context.setOpen(!context.isOpen);
  };

  const combinedRef = (node: any) => {
    triggerRef.current = node;
    (context.triggerRef as any).current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as any).current = node;
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ref: combinedRef,
      ...props
    });
  }

  return (
    <button
      ref={combinedRef}
      type="button"
      onClick={handleClick}
      className={clsx("inline-flex focus:outline-none", className)}
      {...(props as any)}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>((
  {
    className,
    align = "center", // "start" | "center" | "end"
    side = "bottom", // "top" | "bottom" | "left" | "right"
    sideOffset = 6,
    children,
    ...props
  },
  ref
) => {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverContent must be used inside Popover");

  const { isOpen, setOpen, triggerRef } = context;
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    // Calculate side positions
    if (side === "bottom") {
      top = triggerRect.bottom + window.scrollY + sideOffset;
    } else if (side === "top") {
      top = triggerRect.top + window.scrollY - contentRect.height - sideOffset;
    } else if (side === "left") {
      left = triggerRect.left + window.scrollX - contentRect.width - sideOffset;
    } else if (side === "right") {
      left = triggerRect.right + window.scrollX + sideOffset;
    }

    // Calculate alignments
    if (side === "bottom" || side === "top") {
      if (align === "center") {
        left = triggerRect.left + window.scrollX + (triggerRect.width - contentRect.width) / 2;
      } else if (align === "start") {
        left = triggerRect.left + window.scrollX;
      } else if (align === "end") {
        left = triggerRect.right + window.scrollX - contentRect.width;
      }
    } else {
      if (align === "center") {
        top = triggerRect.top + window.scrollY + (triggerRect.height - contentRect.height) / 2;
      } else if (align === "start") {
        top = triggerRect.top + window.scrollY;
      } else if (align === "end") {
        top = triggerRect.bottom + window.scrollY - contentRect.height;
      }
    }

    // Safety checks against screen boundaries
    left = Math.max(10, Math.min(left, window.innerWidth - contentRect.width - 10));
    top = Math.max(10, Math.min(top, window.innerHeight + window.scrollY - contentRect.height - 10));

    setCoords({ top, left });
  }, [triggerRef, side, align, sideOffset]);

  // Update positioning dynamically on open, scroll, or window resize
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Delay measurement slightly to allow DOM layout
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

  // Click outside triggers close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        contentRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, triggerRef, setOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

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
          initial={{ opacity: 0, scale: 0.95, y: side === "bottom" ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: side === "bottom" ? 4 : -4 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className={clsx(
            "fixed z-50 w-72 rounded-2xl border p-4 text-sm font-medium outline-none shadow-xl",
            className
          )}
          style={{
            top: coords.top,
            left: coords.left,
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          role="dialog"
          aria-modal="true"
          {...(props as any)}
        >
          {/* Close button icon */}
          <button
            type="button"
            onClick={() => context.setOpen(false)}
            className="absolute right-3 top-3 p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all active:scale-90 outline-none"
            aria-label="Close popover"
          >
            <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="pr-5">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent }
export default Popover