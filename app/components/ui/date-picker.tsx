import * as React from "react"
import Calendar from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import Button from "./button"

export interface DatePickerProps extends React.HTMLAttributes<any> {
  value?: any;
  onChange?: (...args: any[]) => void;
  placeholder?: string;
  disabled?: boolean;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>((
  {
    className,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  ...props
  },
  ref
) => {
  const [date, setDate] = React.useState(value || null)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value || null)
  }, [value])

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          disabled={disabled}
          className={clsx(
            "w-full h-11 justify-start text-left font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
            !date && "text-slate-400 dark:text-slate-500",
            className
          )}
          {...props}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-2 h-4 w-4 text-slate-400"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="truncate">
            {date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50">
        <Calendar
          value={date}
          onChange={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
})
DatePicker.displayName = "DatePicker"

export { DatePicker }
export default DatePicker
