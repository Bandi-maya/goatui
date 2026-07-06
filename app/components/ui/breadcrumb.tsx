import * as React from "react"

export interface BreadcrumbProps extends React.HTMLAttributes<any> {
}

export interface BreadcrumbListProps extends React.HTMLAttributes<any> {
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<any> {
}

export interface BreadcrumbLinkProps extends React.HTMLAttributes<any> {
  asChild?: any;
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<any> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>((
  {
    ...props
  },
  ref
) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>((
  {
    className, ...props
  },
  ref
) => (
  <ol
    ref={ref}
    className={clsx(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-[var(--muted-foreground)] font-medium",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>((
  {
    className, ...props
  },
  ref
) => (
  <li
    ref={ref}
    className={clsx("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>((
  {
    asChild, className, ...props
  },
  ref
) => {
  const Comp = "a"
  return (
    <Comp
      ref={ref}
      className={clsx("transition-colors hover:text-[var(--foreground)] cursor-pointer", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>((
  {
    className, ...props
  },
  ref
) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={clsx("font-semibold text-[var(--foreground)]", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={clsx("[&>svg]:size-3 text-slate-400 dark:text-slate-600", className)}
    {...props}
  >
    {children || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-3 h-3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
      </svg>
    )}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export interface BreadcrumbEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
}

const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={clsx("flex h-5 w-5 items-center justify-center", className)}
    {...props}
  >
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
    </svg>
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
export default Breadcrumb
