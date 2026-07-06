import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface AppModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  [key: string]: any;
}

const AppModal = ({
  isOpen = false,
  onClose,
  size = "md", // "sm" | "md" | "lg" | "xl" | "full"
  className,
  children,
  closeOnOverlayClick = true,
  ...props
}: AppModalProps) => {
  // Lock document body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const sizeClasses: Record<string, string> = {
    sm: "max-w-[500px]",
    md: "max-w-[700px]",
    lg: "max-w-[900px]",
    xl: "max-w-[1200px]",
    full: "max-w-[1200px]"
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 overflow-hidden" 
          style={{ height: "100dvh", width: "100vw" }}
        >
          {/* Backdrop Blur & Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOverlayClick && onClose && onClose()}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            style={{ height: "100dvh", width: "100vw" }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={clsx(
              "relative w-full bg-white rounded-[10px] shadow-2xl border border-slate-200 flex flex-col max-h-[90dvh] overflow-x-hidden text-left focus:outline-none text-black",
              sizeClasses[size] || sizeClasses.md,
              className
            )}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            {...(props as any)}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export interface ModalHeaderProps {
  title?: string;
  subTitle?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const ModalHeader = ({ title, subTitle, onClose, className, children }: ModalHeaderProps) => {
  return (
    <div className={clsx("p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 shrink-0 select-none", className)}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-lg font-bold text-black uppercase tracking-tight truncate">
            {title}
          </h3>
        )}
        {subTitle && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1 truncate">
            {subTitle}
          </p>
        )}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          aria-label="Close modal"
          className="ml-4 w-8 h-8 rounded-[8px] flex shrink-0 items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export interface ModalBodyProps {
  className?: string;
  children?: React.ReactNode;
}

const ModalBody = ({ className, children }: ModalBodyProps) => {
  return (
    <div className={clsx("flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar bg-white text-black", className)}>
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const ModalFooter = ({ className, children }: ModalFooterProps) => {
  return (
    <div className={clsx("p-6 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3 shrink-0", className)}>
      {children}
    </div>
  );
};

export { AppModal, ModalHeader, ModalBody, ModalFooter };
export default AppModal;
