import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  side?: "top" | "right" | "bottom" | "left";
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Sheet = ({
  children,
  isOpen = false,
  onClose,
  side = "right", // "top" | "right" | "bottom" | "left"
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  ...props
}: SheetProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape" && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Position class mappings
  const positionClasses: Record<string, string> = {
    top: "top-0 left-0 right-0 border-b w-full max-h-[40vh]",
    right: "top-0 right-0 bottom-0 border-l w-full max-w-md h-full",
    bottom: "bottom-0 left-0 right-0 border-t w-full max-h-[40vh]",
    left: "top-0 left-0 bottom-0 border-r w-full max-w-md h-full"
  };

  // Animation variants
  const slideVariants: Record<string, any> = {
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } }
  };

  const selectedVariant = slideVariants[side] || slideVariants.right;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOverlayClick && onClose && onClose()}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Sliding Sheet Panel */}
          <motion.div
            variants={selectedVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={clsx(
              "fixed z-50 flex flex-col gap-4 bg-[var(--popover)] p-6 shadow-2xl border-[var(--border)] focus:outline-none overflow-y-auto text-left",
              positionClasses[side] || positionClasses.right,
              className
            )}
            style={{
              backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "sheet-title" : undefined}
            aria-describedby={description ? "sheet-desc" : undefined}
            tabIndex={-1}
            {...(props as any)}
          >
            {/* Close Button */}
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sheet"
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90 outline-none"
              >
                <svg className="h-4 w-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="flex flex-col gap-1 pr-6 select-none">
                {title && (
                  <h2 id="sheet-title" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="sheet-desc" className="text-xs font-semibold text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 text-sm font-medium leading-relaxed mt-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export { Sheet }
export default Sheet

