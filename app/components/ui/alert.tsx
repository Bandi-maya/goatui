import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface AlertProps extends React.HTMLAttributes<any> {
  variant?: string;
  // "default" | "success" | "warning" | "error" | "info"
  title?: any;
  description?: any;
  onClose?: (...args: any[]) => void;
  showIcon?: boolean;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((
  {
    className,
  variant = "default", // "default" | "success" | "warning" | "error" | "info"
  title,
  description,
  onClose,
  showIcon = true,
  children,
  ...props
  },
  ref
) => {
  const [visible, setVisible] = React.useState(true);

  const variants: Record<string, string> = {
    default: "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400",
    error: "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-400",
    info: "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/10 dark:border-sky-900/30 dark:text-sky-400"
  };

  const icons: Record<string, React.ReactNode> = {
    default: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
    success: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    )
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          className={clsx(
            "relative flex w-full items-start gap-3.5 rounded-xl border p-4 shadow-sm",
            variants[variant] || variants.default,
            className
          )}
          {...(props as any)}
        >
          {showIcon && <div className="mt-0.5">{icons[variant] || icons.default}</div>}
          
          <div className="flex-1 flex flex-col gap-0.5 text-left">
            {title && <h5 className="text-sm font-semibold tracking-tight leading-tight">{title}</h5>}
            {(description || children) && (
              <div className="text-xs font-semibold leading-relaxed opacity-90">
                {description || children}
              </div>
            )}
          </div>

          {onClose && (
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-slate-300"
              aria-label="Dismiss Alert"
            >
              <svg className="h-4 w-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
})
Alert.displayName = "Alert"

export { Alert }
export default Alert
