import * as React from "react"
import Button from "./button"

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {}

export interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {}

export interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export interface PaginationLinkProps extends React.ComponentProps<typeof Button> {
  isActive?: boolean;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={clsx("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>((
  {
    className, ...props
  },
  ref
) => (
  <ul
    ref={ref}
    className={clsx("flex flex-row items-center gap-1.5 list-none m-0 p-0", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>((
  {
    className, ...props
  },
  ref
) => (
  <li ref={ref} className={clsx("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "default" : "outline"}
    size={size}
    className={clsx("h-9 w-9 rounded-lg text-xs font-semibold", className)}
    {...(props as any)}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    aria-label="Go to previous page"
    variant="outline"
    className={clsx("gap-1.5 h-9 px-3 text-xs rounded-lg", className)}
    {...(props as any)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-3.5 w-3.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Previous</span>
  </Button>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    aria-label="Go to next page"
    variant="outline"
    className={clsx("gap-1.5 h-9 px-3 text-xs rounded-lg", className)}
    {...(props as any)}
  >
    <span>Next</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-3.5 w-3.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </Button>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={clsx("flex h-9 w-9 items-center justify-center text-slate-400", className)}
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
export default Pagination

