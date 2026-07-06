import * as React from "react"
import Button from "./button"
import Input from "./input"
import Checkbox from "./checkbox"

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

export interface DataTableProps {
  columns?: any[];
  data?: any[];
  searchKey?: string;
  placeholder?: string;
  pageSize?: number;
  className?: string;
  [key: string]: any;
}

function DataTable({
  columns = [],
  data = [],
  searchKey = "",
  placeholder = "Search...",
  pageSize = 5,
  className,
  ...props
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: string } | null>(null)
  const [selectedRows, setSelectedRows] = React.useState<Set<any>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)
  const visibleColumns = React.useMemo(() => new Set(columns.map(c => c.accessorKey || c.id)), [columns])

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Search logic
  const searchedData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data
    return data.filter(row => {
      const val = row[searchKey]
      return String(val ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [data, searchTerm, searchKey])

  // Sorting logic
  const sortedData = React.useMemo(() => {
    const sortableItems = [...searchedData]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aVal > bVal) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [searchedData, sortConfig])

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pageSize])

  const requestSort = (key: string) => {
    let direction = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Row Selection logic
  const handleSelectAll = (checked: any) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((row, idx) => row.id || idx))
      setSelectedRows(allIds)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (checked: any, rowId: any) => {
    const nextSelected = new Set(selectedRows)
    if (checked) {
      nextSelected.add(rowId)
    } else {
      nextSelected.delete(rowId)
    }
    setSelectedRows(nextSelected)
  }

  const allPageRowsSelected = paginatedData.length > 0 && paginatedData.every((row, idx) => selectedRows.has(row.id || idx))

  const activeColumns = columns.filter(col => visibleColumns.has(col.accessorKey || col.id))

  return (
    <div className={clsx("w-full space-y-4", className)} {...props}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {searchKey && (
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {paginatedData.length} of {sortedData.length} entries
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-4 py-3.5 w-10">
                  <Checkbox
                    checked={allPageRowsSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {activeColumns.map((col) => (
                  <th
                    key={col.accessorKey || col.id}
                    onClick={() => col.sortable && requestSort(col.accessorKey)}
                    className={clsx(
                      "px-4 py-3.5 font-bold uppercase tracking-wider text-[10px]",
                      col.sortable && "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 select-none"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {sortConfig && sortConfig.key === col.accessorKey ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + 1} className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium">
                    No results found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const rowId = row.id || idx
                  const isSelected = selectedRows.has(rowId)
                  return (
                    <tr
                      key={rowId}
                      className={clsx(
                        "hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors",
                        isSelected && "bg-slate-50 dark:bg-slate-800/20"
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectRow(checked, rowId)}
                        />
                      </td>
                      {activeColumns.map((col) => {
                        const cellVal = row[col.accessorKey]
                        return (
                          <td key={col.accessorKey || col.id} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                            {col.cell ? col.cell(row) : cellVal}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Actions */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="h-8 px-2.5 text-xs rounded-lg"
          >
            Previous
          </Button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="h-8 px-2.5 text-xs rounded-lg"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export { DataTable }
export default DataTable
