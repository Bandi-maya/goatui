import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
  onClose?: () => void;
  actions?: Array<{ label: string; onClick: () => void }>;
  duration?: number;
  variant?: "default" | "success" | "info" | "warning" | "error";
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>((
  {
    className,
    title,
    description,
    avatar, // Optional avatar component or image source
    onClose,
    actions = [], // Array of { label: "...", onClick: ... }
    duration = 5000,
    variant = "default", // "default" | "success" | "info" | "warning" | "error"
    ...props
  },
  ref
) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const icons = {
    default: null,
    success: (
      <span className="text-emerald-500">
        <svg className="h-5 w-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    ),
    info: (
      <span className="text-sky-500">
        <svg className="h-5 w-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </span>
    ),
    warning: (
      <span className="text-amber-500">
        <svg className="h-5 w-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        </svg>
      </span>
    ),
    error: (
      <span className="text-red-500">
        <svg className="h-5 w-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      </span>
    )
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          className={clsx(
            "flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--popover)] p-4 shadow-xl select-none text-left relative overflow-hidden",
            className
          )}
          style={{
            backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
            color: "var(--foreground)",
            borderColor: "var(--border)"
          }}
          {...(props as any)}
        >
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {avatar && (
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--border)]">
                {typeof avatar === "string" ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  avatar
                )}
              </div>
            )}

            {!avatar && icons[variant] && (
              <div className="mt-0.5 shrink-0">{icons[variant]}</div>
            )}

            <div className="flex-1 flex flex-col gap-0.5 pr-5">
              {title && (
                <h4 className="text-sm font-semibold tracking-tight leading-tight text-[var(--foreground)]">
                  {title}
                </h4>
              )}
              {description && (
                <p className="text-xs font-semibold text-slate-400 leading-normal">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Action Row */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2 mt-1 pl-[45px]">
              {actions.map((act, index) => (
                <button
                   key={index}
                   type="button"
                   onClick={act.onClick}
                   className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}

          {/* Timer progress bar at the bottom */}
          {duration && duration > 0 && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[3px] bg-[var(--primary)]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
Notification.displayName = "Notification";

export { Notification }
export default Notification

