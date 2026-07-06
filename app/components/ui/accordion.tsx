import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface AccordionProps extends React.HTMLAttributes<any> {
  type?: string;
  // "single" | "multiple"
  value?: any;
  onValueChange?: (...args: any[]) => void;
  defaultValue?: any;
}

export interface AccordionItemProps extends React.HTMLAttributes<any> {
  value?: any;
}

export interface AccordionTriggerProps extends React.HTMLAttributes<any> {
  value?: any;
}

export interface AccordionContentProps extends React.HTMLAttributes<any> {
  value?: any;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const AccordionContext = React.createContext<any>(null)

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((
  {
    className,
  type = "single", // "single" | "multiple"
  value,
  onValueChange,
  defaultValue,
  children,
  ...props
  },
  ref
) => {
  const [activeItems, setActiveItems] = React.useState(() => {
    if (type === "single") {
      return defaultValue ? [defaultValue] : [];
    }
    return defaultValue || [];
  });

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveItems(type === "single" ? (value ? [value] : []) : value);
    }
  }, [value, type]);

  const toggleItem = (itemValue: any) => {
    let nextActive;
    if (type === "single") {
      nextActive = activeItems.includes(itemValue) ? [] : [itemValue];
    } else {
      nextActive = activeItems.includes(itemValue)
        ? activeItems.filter((val: any) => val !== itemValue)
        : [...activeItems, itemValue];
    }

    if (value === undefined) {
      setActiveItems(nextActive);
    }
    if (onValueChange) {
      onValueChange(type === "single" ? nextActive[0] || "" : nextActive);
    }
  };

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem }}>
      <div
        ref={ref}
        className={clsx("flex flex-col gap-1.5 border-b border-[var(--border)]", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>((
  {
    className,
  value,
  children,
  ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx("border-t border-[var(--border)] py-1.5 first:border-t-0", className)}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value });
        }
        return child;
      })}
    </div>
  );
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>((
  {
    className,
  children,
  value,
  ...props
  },
  ref
) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");

  const isOpen = context.activeItems.includes(value);

  const handleClick = () => {
    context.toggleItem(value);
  };

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      aria-expanded={isOpen}
      className={clsx(
        "flex w-full items-center justify-between py-3 text-sm font-semibold transition-all hover:underline text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/25 rounded-lg px-2",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="text-slate-400">
        <motion.svg
          className="h-4 w-4 stroke-[2.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </span>
    </button>
  );
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>((
  {
    className,
  children,
  value,
  ...props
  },
  ref
) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within Accordion");

  const isOpen = context.activeItems.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden"
          {...(props as any)}
        >
          <div className={clsx("pb-4 pt-1 px-2 text-sm text-slate-500 font-medium leading-relaxed", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export default Accordion
