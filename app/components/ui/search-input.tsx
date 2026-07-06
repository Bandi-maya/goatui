import * as React from "react"

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (e: any) => void;
  onClear?: () => void;
  loading?: boolean;
  placeholder?: string;
}

const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>((
  {
    className,
    value,
    onChange,
    onClear,
    loading = false,
    placeholder = "Search...",
    ...props
  },
  ref
) => {
  const [internalValue, setInternalValue] = React.useState(value || "")

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (value === undefined) {
      setInternalValue(val)
    }
    onChange?.(e)
  }

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("")
    }
    onClear?.()
    onChange?.({ target: { value: "" } })
  }

  const hasValue = String(internalValue ?? "").length > 0

  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        ref={ref}
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={clsx(
          "w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[10px] pl-10 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all duration-150",
          className
        )}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        ) : hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-3 w-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
export default SearchInput

