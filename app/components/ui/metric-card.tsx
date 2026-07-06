import * as React from "react"
import Card from "./card"
import { ResponsiveContainer, AreaChart, Area } from "recharts"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface MetricCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  value?: React.ReactNode;
  description?: React.ReactNode;
  chartData?: any[];
  chartColor?: string;
}

function MetricCard({
  title,
  value,
  description,
  chartData = [], // e.g. [{ value: 10 }, { value: 15 }]
  chartColor = "var(--primary)",
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card hoverable className={clsx("overflow-hidden p-6 flex flex-col justify-between min-h-[160px]", className)} {...props}>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {title}
        </span>
        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {description}
          </p>
        )}
      </div>

      {chartData && chartData.length > 0 && (
        <div className="h-10 w-full mt-4 -mx-6 -mb-6 overflow-hidden rounded-b-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export { MetricCard }
export default MetricCard
