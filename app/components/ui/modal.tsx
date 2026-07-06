import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface ModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  [key: string]: any;
}

const Modal = ({
  children,
  isOpen = false,
  onClose,
  title,
  description,
  showCloseButton = true,
  size = "md", // "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  ...props
}: ModalProps) => {
  // Lock scroll when open
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

  const sizeClasses: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full h-full rounded-none"
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur & Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOverlayClick && onClose && onClose()}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md dark:bg-slate-950/60"
          />

          {/* Modal Card Spring Scale */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={clsx(
              "relative w-full rounded-2xl border border-[var(--border)] bg-[var(--popover)] p-6 shadow-2xl overflow-hidden flex flex-col gap-4 text-left focus:outline-none",
              sizeClasses[size] || sizeClasses.md,
              className
            )}
            style={{
              backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-desc" : undefined}
            tabIndex={-1}
            {...(props as any)}
          >
            {/* Close Button */}
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
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
                  <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-desc" className="text-xs font-semibold text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export { Modal }
export default Modal
