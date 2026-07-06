import * as React from "react"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
export default Skeleton
