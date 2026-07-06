import * as React from "react"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, Tooltip } from "recharts"
import { clsx } from "clsx"

export interface AnalyticsCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  value?: React.ReactNode;
  trend?: React.ReactNode;
  trendType?: "positive" | "negative" | "neutral";
  description?: React.ReactNode;
  chartData?: any[];
  chartType?: "area" | "bar" | "line";
  chartColor?: string;
}


const AnalyticsCard = React.forwardRef<HTMLDivElement, AnalyticsCardProps>((
  {
    className,
  title,
  value,
  trend,
  trendType = "neutral", // "positive" | "negative" | "neutral"
  description,
  chartData = [], // Array of { value: 10, label: "..." }
  chartType = "area", // "area" | "bar" | "line"
  chartColor = "var(--primary)",
  ...props
  },
  ref
) => {
  const isPositive = trendType === "positive";
  const isNegative = trendType === "negative";

  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-md text-[10px] font-bold text-[var(--foreground)]">
                      {payload[0].value}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-md text-[10px] font-bold text-[var(--foreground)]">
                      {payload[0].value}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Default "area" chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1.5 shadow-md text-[10px] font-bold text-[var(--foreground)]">
                    {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#gradientColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-2xl border border-[var(--border)] bg-[var(--popover)] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-[180px] w-full text-left overflow-hidden",
        className
      )}
      style={{
        backgroundColor: "var(--popover-bg, var(--bg-surface, #ffffff))",
        borderColor: "var(--border)",
        color: "var(--foreground)"
      }}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            {title}
          </span>
          {trend && (
            <span
              className={clsx(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase select-none",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isNegative && "bg-red-500/10 text-red-600 dark:text-red-400",
                !isPositive && !isNegative && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {trend}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {value}
          </span>
          {description && (
            <span className="text-xs font-semibold text-slate-400">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Embedded Sparkline Chart */}
      <div className="h-14 w-full mt-4 shrink-0">
        {renderChart()}
      </div>
    </div>
  );
})
AnalyticsCard.displayName = "AnalyticsCard"

export { AnalyticsCard }
export default AnalyticsCard
