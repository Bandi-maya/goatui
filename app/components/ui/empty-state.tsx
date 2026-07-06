import * as React from "react"
import Button from "./button"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
}

function EmptyState({
  title = "No data found",
  description = "Get started by creating a new entry.",
  actionText,
  onActionClick,
  icon,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-950/10 min-h-[300px]",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 mb-4 optiflow-float-anim">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">{description}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} className="mt-5 h-9 text-xs rounded-xl" size="default">
          {actionText}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
export default EmptyState
