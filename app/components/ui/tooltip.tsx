import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

function Tooltip({
  content,
  children,
  side = "top",
  className,
  ...props
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const directions: Record<string, any> = {
    top: { initial: { y: 6, x: "-50%" }, animate: { y: 0, x: "-50%" } },
    bottom: { initial: { y: -6, x: "-50%" }, animate: { y: 0, x: "-50%" } },
    left: { initial: { x: 6, y: "-50%" }, animate: { x: 0, y: "-50%" } },
    right: { initial: { x: -6, y: "-50%" }, animate: { x: 0, y: "-50%" } },
  };

  const animStyles = directions[side] || directions.top;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.92, ...animStyles.initial } as any}
            animate={{ opacity: 1, scale: 1, ...animStyles.animate } as any}
            exit={{ opacity: 0, scale: 0.92, ...animStyles.initial } as any}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={clsx(
              "absolute z-[100] px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-md whitespace-nowrap select-none pointer-events-none border border-slate-800 dark:border-slate-700",
              side === "top" && "bottom-full left-1/2 mb-2",
              side === "bottom" && "top-full left-1/2 mt-2",
              side === "left" && "right-full top-1/2 mr-2",
              side === "right" && "left-full top-1/2 ml-2",
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Tooltip }
export default Tooltip

