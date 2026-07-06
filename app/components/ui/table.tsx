import * as React from "react"

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Table = React.forwardRef<HTMLTableElement, TableProps>((
  {
    className, ...props
  },
  ref
) => (
  <div className="relative w-full overflow-auto rounded-xl border border-[var(--border)] bg-transparent">
    <table
      ref={ref}
      className={clsx("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>((
  {
    className, ...props
  },
  ref
) => (
  <thead ref={ref} className={clsx("[&_tr]:border-b bg-slate-50/50 dark:bg-slate-900/30", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>((
  {
    className, ...props
  },
  ref
) => (
  <tbody
    ref={ref}
    className={clsx("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>((
  {
    className, ...props
  },
  ref
) => (
  <tfoot
    ref={ref}
    className={clsx(
      "border-t bg-slate-50/50 dark:bg-slate-900/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>((
  {
    className, ...props
  },
  ref
) => (
  <tr
    ref={ref}
    className={clsx(
      "border-b border-[var(--border)] transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800/50",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>((
  {
    className, ...props
  },
  ref
) => (
  <th
    ref={ref}
    className={clsx(
      "h-12 px-4 text-left align-middle text-xs font-bold uppercase tracking-wider text-slate-400 select-none [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>((
  {
    className, ...props
  },
  ref
) => (
  <td
    ref={ref}
    className={clsx("p-4 align-middle font-medium text-slate-700 dark:text-slate-300 [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>((
  {
    className, ...props
  },
  ref
) => (
  <caption
    ref={ref}
    className={clsx("mt-4 text-xs text-slate-400 font-semibold select-none", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
export default Table

