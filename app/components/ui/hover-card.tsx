import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface HoverCardTriggerProps extends React.HTMLAttributes<any> {
}

export interface HoverCardContentProps extends React.HTMLAttributes<any> {
  align?: string;
  // "left" | "center" | "right"
  sideOffset?: number;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface HoverCardProps {
  children?: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard = ({
  children,
  openDelay = 300,
  closeDelay = 200,
  ...props
}: HoverCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openTimerRef = React.useRef<any>(null);
  const closeTimerRef = React.useRef<any>(null);

  const handleOpen = () => {
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
  };

  const handleClose = () => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <HoverCardContext.Provider value={{ isOpen, handleOpen, handleClose }}>
      <div
        className="relative inline-block"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        {...props}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

const HoverCardContext = React.createContext<any>(null);

const HoverCardTrigger = React.forwardRef<HTMLSpanElement, HoverCardTriggerProps>((
  {
    className, children, ...props
  },
  ref
) => {
  const context = React.useContext(HoverCardContext);
  if (!context) throw new Error("HoverCardTrigger must be used within HoverCard");

  return (
    <span
      ref={ref}
      className={clsx("cursor-pointer focus:outline-none focus:underline", className)}
      tabIndex={0}
      onFocus={context.handleOpen}
      onBlur={context.handleClose}
      {...props}
    >
      {children}
    </span>
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>((
  {
    className,
  align = "center", // "left" | "center" | "right"
  sideOffset = 8,
  children,
  ...props
  },
  ref
) => {
  const context = React.useContext(HoverCardContext);
  if (!context) throw new Error("HoverCardContent must be used within HoverCard");

  const alignClasses: Record<string, string> = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0"
  };

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={clsx(
            "absolute z-50 w-64 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-4 shadow-xl text-left outline-none",
            alignClasses[align] || alignClasses.center,
            className
          )}
          style={{
            top: `calc(100% + ${sideOffset}px)`,
            backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
            color: "var(--foreground)",
            borderColor: "var(--border)"
          }}
          role="tooltip"
          {...(props as any)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent }
export default HoverCard
