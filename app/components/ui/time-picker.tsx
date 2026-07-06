import * as React from "react"
import { clsx } from "clsx"

export interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  // Format: "HH:MM AM" or "HH:MM PM" or "HH:MM"
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  use24Hour?: boolean;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>((
  {
    className,
    value = "", // Format: "HH:MM AM" or "HH:MM PM" or "HH:MM"
    onValueChange,
    defaultValue = "12:00 AM",
    disabled = false,
    use24Hour = false,
    ...props
  },
  ref
) => {
  const [time, setTime] = React.useState(value !== undefined ? value : defaultValue);

  // Split values
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: "12", minute: "00", period: "AM" };
    const parts = timeStr.split(" ");
    const timeParts = parts[0]?.split(":") || ["12", "00"];
    return {
      hour: timeParts[0] || "12",
      minute: timeParts[1] || "00",
      period: parts[1] || "AM"
    };
  };

  const { hour, minute, period } = React.useMemo(() => parseTime(time), [time]);

  React.useEffect(() => {
    if (value !== undefined) {
      setTime(value);
    }
  }, [value]);

  const updateTime = (newHour: string, newMinute: string, newPeriod: string) => {
    if (disabled) return;
    const formatted = use24Hour 
      ? `${newHour.padStart(2, "0")}:${newMinute.padStart(2, "0")}`
      : `${newHour.padStart(2, "0")}:${newMinute.padStart(2, "0")} ${newPeriod}`;
    
    if (value === undefined) {
      setTime(formatted);
    }
    if (onValueChange) {
      onValueChange(formatted);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    
    const maxHour = use24Hour ? 23 : 12;
    const minHour = use24Hour ? 0 : 1;
    let numeric = parseInt(val, 10);
    
    if (numeric > maxHour) numeric = maxHour;
    if (numeric < minHour && val.length > 1) numeric = minHour;

    updateTime(numeric.toString(), minute, period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    let numeric = parseInt(val, 10);
    if (numeric > 59) numeric = 59;
    if (numeric < 0) numeric = 0;

    updateTime(hour, numeric.toString(), period);
  };

  const togglePeriod = () => {
    if (disabled || use24Hour) return;
    const nextPeriod = period === "AM" ? "PM" : "AM";
    updateTime(hour, minute, nextPeriod);
  };

  const incrementHour = () => {
    const maxHour = use24Hour ? 23 : 12;
    const minHour = use24Hour ? 0 : 1;
    let current = parseInt(hour, 10);
    let next = current + 1;
    if (next > maxHour) next = minHour;
    updateTime(next.toString(), minute, period);
  };

  const decrementHour = () => {
    const maxHour = use24Hour ? 23 : 12;
    const minHour = use24Hour ? 0 : 1;
    let current = parseInt(hour, 10);
    let next = current - 1;
    if (next < minHour) next = maxHour;
    updateTime(next.toString(), minute, period);
  };

  const incrementMinute = () => {
    let current = parseInt(minute, 10);
    let next = current + 1;
    if (next > 59) next = 0;
    updateTime(hour, next.toString(), period);
  };

  const decrementMinute = () => {
    let current = parseInt(minute, 10);
    let next = current - 1;
    if (next < 0) next = 59;
    updateTime(hour, next.toString(), period);
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] p-2 bg-transparent select-none transition-all",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...(props as any)}
    >
      {/* Hour Block */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          disabled={disabled}
          onClick={incrementHour}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <input
          type="text"
          maxLength={2}
          disabled={disabled}
          value={hour.padStart(2, "0")}
          onChange={handleHourChange}
          className="w-9 text-center text-sm font-semibold border-none bg-transparent p-0 focus:ring-0 text-[var(--foreground)]"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={decrementHour}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <span className="text-sm font-bold text-slate-400 select-none pb-1">:</span>

      {/* Minute Block */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          disabled={disabled}
          onClick={incrementMinute}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <input
          type="text"
          maxLength={2}
          disabled={disabled}
          value={minute.padStart(2, "0")}
          onChange={handleMinuteChange}
          className="w-9 text-center text-sm font-semibold border-none bg-transparent p-0 focus:ring-0 text-[var(--foreground)]"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={decrementMinute}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* AM/PM Toggle */}
      {!use24Hour && (
        <button
          type="button"
          disabled={disabled}
          onClick={togglePeriod}
          className={clsx(
            "ml-1 flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold border border-[var(--border)] transition-all active:scale-95 text-[var(--foreground)]",
            disabled ? "cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          {period}
        </button>
      )}
    </div>
  );
})
TimePicker.displayName = "TimePicker"

export { TimePicker }
export default TimePicker

