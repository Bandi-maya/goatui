import * as React from "react"
import * as ReactDOM from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

export interface DrawerTriggerProps extends React.HTMLAttributes<any> {
  asChild?: any;
  onClick?: (...args: any[]) => void;
}

export interface DrawerCloseProps extends React.HTMLAttributes<any> {
  asChild?: any;
  onClick?: (...args: any[]) => void;
}

export interface DrawerContentProps extends React.HTMLAttributes<any> {
}

export interface DrawerTitleProps extends React.HTMLAttributes<any> {
}

export interface DrawerDescriptionProps extends React.HTMLAttributes<any> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const DrawerContext = React.createContext<any>(null)

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Drawer = ({
  open,
  onOpenChange,
  children,
  ...props
}: DrawerProps) => {
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
    <DrawerContext.Provider value={{ isOpen: internalOpen, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

const DrawerTrigger = React.forwardRef<HTMLDivElement, DrawerTriggerProps>((
  {
    asChild, onClick, children, ...props
  },
  ref
) => {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error("DrawerTrigger must be used inside Drawer")

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
DrawerTrigger.displayName = "DrawerTrigger"

const DrawerClose = React.forwardRef<HTMLDivElement, DrawerCloseProps>((
  {
    asChild, onClick, children, ...props
  },
  ref
) => {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error("DrawerClose must be used inside Drawer")

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
DrawerClose.displayName = "DrawerClose"

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>((
  {
    className, children, ...props
  },
  ref
) => {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error("DrawerContent must be used inside Drawer")
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
        <DrawerPortal>
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            {/* Content Panel */}
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={clsx(
                "relative z-50 w-full max-w-md h-full bg-[var(--card)] border-l border-[var(--border)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left",
                className
              )}
              {...(props as any)}
            >
              <div className="flex-1">
                {children}
              </div>
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
        </DrawerPortal>
      )}
    </AnimatePresence>
  )
})
DrawerContent.displayName = "DrawerContent"

const DrawerPortal = ({ children }: { children?: React.ReactNode }) => {
  return ReactDOM.createPortal(children, document.body)
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <div className={clsx("flex flex-col space-y-1.5 text-left mb-4", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <div className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-[var(--border)]/15 pt-4 mt-6", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<HTMLDivElement, DrawerTitleProps>((
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
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<HTMLDivElement, DrawerDescriptionProps>((
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
DrawerDescription.displayName = "DrawerDescription"

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
}
export default Drawer
