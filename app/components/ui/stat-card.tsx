import * as React from "react"
import Card from "./card"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  value?: React.ReactNode;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

function StatCard({
  title,
  value,
  trend,
  trendType = "neutral",
  description,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card hoverable className={clsx("overflow-hidden p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {title}
        </span>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={clsx(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold border",
              trendType === "positive" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
              trendType === "negative" && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40",
              trendType === "neutral" && "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            )}
          >
            {trendType === "positive" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            )}
            {trendType === "negative" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 19.5-15-15m0 0h11.25m-11.25 0v11.25" />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {description}
        </p>
      )}
    </Card>
  )
}

export { StatCard }
export default StatCard
