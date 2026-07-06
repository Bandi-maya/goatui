import * as React from "react"
import * as ReactDOM from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export interface DialogTriggerProps extends React.HTMLAttributes<any> {
  asChild?: any;
  onClick?: (...args: any[]) => void;
}

export interface DialogCloseProps extends React.HTMLAttributes<any> {
  asChild?: any;
  onClick?: (...args: any[]) => void;
}

export interface DialogContentProps extends React.HTMLAttributes<any> {
}

export interface DialogTitleProps extends React.HTMLAttributes<any> {
}

export interface DialogDescriptionProps extends React.HTMLAttributes<any> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const DialogContext = React.createContext<any>(null)

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Dialog = ({
  open,
  onOpenChange,
  children,
  ...props
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open)
    }
  }, [open])

  const setOpen = React.useCallback((val: boolean) => {
    if (open === undefined) {
      setInternalOpen(val)
    }
    onOpenChange?.(val)
  }, [open, onOpenChange])

  return (
    <DialogContext.Provider value={{ isOpen: internalOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = React.forwardRef<HTMLDivElement, DialogTriggerProps>((
  {
    asChild, onClick, children, ...props
  },
  ref
) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used inside Dialog")

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e)
    context.setOpen(true)
  }

  if (!React.isValidElement(children)) return null
  const element = children as React.ReactElement<any>

  return React.cloneElement(element, {
    ref,
    onClick: handleClick,
    ...props
  })
})
DialogTrigger.displayName = "DialogTrigger"

const DialogClose = React.forwardRef<HTMLDivElement, DialogCloseProps>((
  {
    asChild, onClick, children, ...props
  },
  ref
) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogClose must be used inside Dialog")

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e)
    context.setOpen(false)
  }

  if (!React.isValidElement(children)) return null
  const element = children as React.ReactElement<any>

  return React.cloneElement(element, {
    ref,
    onClick: handleClick,
    ...props
  })
})
DialogClose.displayName = "DialogClose"

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>((
  {
    className, children, ...props
  },
  ref
) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used inside Dialog")
  const { isOpen, setOpen } = context

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            {/* Content Container */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className={clsx(
                "relative z-50 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl transition-colors duration-200 outline-none text-left",
                className
              )}
              {...(props as any)}
            >
              {children}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </div>
        </DialogPortal>
      )}
    </AnimatePresence>
  )
})
DialogContent.displayName = "DialogContent"

const DialogPortal = ({ children }: { children?: React.ReactNode }) => {
  return ReactDOM.createPortal(children, document.body)
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={clsx("flex flex-col space-y-1.5 text-left mb-4", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-[var(--border)]/15 pt-4 mt-6", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLDivElement, DialogTitleProps>((
  {
    className, children, ...props
  },
  ref
) => (
  <h2
    ref={ref}
    className={clsx("text-lg font-bold leading-none tracking-tight text-[var(--foreground)]", className)}
    {...props}
  >
    {children}
  </h2>
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLDivElement, DialogDescriptionProps>((
  {
    className, children, ...props
  },
  ref
) => (
  <p
    ref={ref}
    className={clsx("text-sm text-[var(--muted-foreground)] font-medium mt-1.5", className)}
    {...props}
  >
    {children}
  </p>
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
export default Dialog
