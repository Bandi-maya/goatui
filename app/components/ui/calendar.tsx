"use client";

import React, { useMemo, useState, useEffect } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

function Calendar({
  value = null,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  className = "",
}: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState((value || today).getMonth());
  const [currentYear, setCurrentYear] = useState((value || today).getFullYear());
  const [viewMode, setViewMode] = useState("days");
  
  // Track continuous sequential clicks using a unique key state primitive
  const [clickTrigger, setClickTrigger] = useState(0);

  useEffect(() => {
    if (value) {
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
    }
  }, [value]);

  const years = useMemo(() => {
    const baseYear = today.getFullYear();
    const start = baseYear - 50;
    const end = baseYear + 50;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [today]);

  const matrixData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysArray = [];
    
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      prevDate.setHours(0, 0, 0, 0);
      daysArray.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currDate = new Date(currentYear, currentMonth, day);
      currDate.setHours(0, 0, 0, 0);
      daysArray.push({ date: currDate, isCurrentMonth: true });
    }

    const remainingSlots = 42 - daysArray.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextDate = new Date(currentYear, currentMonth + 1, day);
      nextDate.setHours(0, 0, 0, 0);
      daysArray.push({ date: nextDate, isCurrentMonth: false });
    }

    return daysArray;
  }, [currentYear, currentMonth]);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const isSameDate = (dateA: Date | null, dateB: Date | null) => {
    if (!dateA || !dateB) return false;
    return (
      dateA.getDate() === dateB.getDate() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getFullYear() === dateB.getFullYear()
    );
  };

  const isDisabled = (date: Date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (checkDate < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (checkDate > max) return true;
    }

    return disabledDates.some((d) => isSameDate(d, checkDate));
  };

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    
    // Increment layout signature state to force an instant reflow of style properties
    setClickTrigger(prev => prev + 1);
    
    if (onChange) {
      onChange(date);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setViewMode("days");
    handleSelect(today);
  };

  return (
    <div 
      className={`w-full max-w-full md:max-w-md rounded-3xl border p-4 sm:p-6 shadow-xl transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--calendar-bg, var(--bg-surface, #ffffff))',
        borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))',
        color: 'var(--calendar-text, var(--text-main, #0f172a))',
        boxShadow: '0 20px 25px -5px var(--calendar-shadow, rgba(148, 163, 184, 0.1)), 0 8px 10px -6px var(--calendar-shadow, rgba(148, 163, 184, 0.1))'
      }}
    >
      {/* Header Controls */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            if (viewMode === "days") previousMonth();
            if (viewMode === "years") setCurrentYear((p) => p - 12);
          }}
          disabled={viewMode === "months"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          style={{
            borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))',
            color: 'var(--calendar-text-muted, var(--text-muted, #64748b))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode(viewMode === "months" ? "days" : "months")}
            className="rounded-xl px-3 py-1.5 text-sm font-bold transition-all active:scale-95"
            style={{ color: 'var(--calendar-text, var(--text-main, #0f172a))' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {MONTHS[currentMonth]}
          </button>
          <button
            onClick={() => setViewMode(viewMode === "years" ? "days" : "years")}
            className="rounded-xl px-3 py-1.5 text-sm font-bold transition-all active:scale-95"
            style={{ color: 'var(--calendar-text, var(--text-main, #0f172a))' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {currentYear}
          </button>
        </div>

        <button
          onClick={() => {
            if (viewMode === "days") nextMonth();
            if (viewMode === "years") setCurrentYear((p) => p + 12);
          }}
          disabled={viewMode === "months"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          style={{
            borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))',
            color: 'var(--calendar-text-muted, var(--text-muted, #64748b))',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Days View Matrix */}
      {viewMode === "days" && (
        <>
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div 
                key={day} 
                className="flex h-10 items-center justify-center text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--calendar-text-dim, var(--text-dim, #94a3b8))' }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 justify-items-center">
            {matrixData.map(({ date, isCurrentMonth }, index) => {
              const disabled = isDisabled(date);
              const selected = isSameDate(value, date);
              const isToday = isSameDate(today, date);

              return (
                <div key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`} className="w-full aspect-square flex items-center justify-center max-w-[40px] max-h-[40px]">
                  <button
                    // Adding clickTrigger into the element key forces React to completely re-render active/selected nodes 
                    // on subsequent clicks, causing animations to clean-execute every single time.
                    key={selected ? `selected-${clickTrigger}` : 'unselected'}
                    disabled={disabled}
                    onClick={() => handleSelect(date)}
                    className="relative flex h-full w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none origin-center animate-click"
                    style={{
                      color: selected 
                        ? 'var(--calendar-selected-text, #ffffff)' 
                        : !isCurrentMonth 
                          ? 'var(--calendar-text-dim, var(--text-dim, #94a3b8))' 
                          : 'var(--calendar-text, var(--text-main, #0f172a))',
                      background: selected 
                        ? 'var(--calendar-selected-bg, linear-gradient(to right, #2563eb, #4f46e5))' 
                        : 'transparent',
                      boxShadow: selected ? '0 4px 12px -1px var(--calendar-selected-shadow, rgba(37, 99, 235, 0.4))' : 'none',
                      border: isToday && !selected ? '2px solid var(--calendar-today-border, #2563eb)' : 'none',
                      transform: selected ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!selected && !disabled) {
                        e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))';
                        e.currentTarget.style.transform = 'scale(1.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      } else {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                  >
                    {date.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Month Selection Overlay */}
      {viewMode === "months" && (
        <div className="grid grid-cols-3 gap-3 py-2">
          {MONTHS.map((month, index) => {
            const isSelected = index === currentMonth;
            return (
              <button
                key={month}
                onClick={() => {
                  setCurrentMonth(index);
                  setViewMode("days");
                }}
                className="py-3 text-sm font-semibold rounded-2xl transition-all active:scale-95 border border-transparent"
                style={{
                  backgroundColor: isSelected ? 'var(--calendar-selected-bg, #2563eb)' : 'transparent',
                  color: isSelected ? 'var(--calendar-selected-text, #ffffff)' : 'var(--calendar-text, var(--text-main, #0f172a))',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))';
                    e.currentTarget.style.borderColor = 'var(--calendar-border, var(--border-muted, #e2e8f0))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {month.substring(0, 3)}
              </button>
            );
          })}
        </div>
      )}

      {/* Year Selection View */}
      {viewMode === "years" && (
        <div className="grid grid-cols-3 gap-y-3 gap-x-4 py-2 max-h-64 overflow-y-auto pr-1">
          {years.map((year) => {
            const isSelected = year === currentYear;
            return (
              <button
                key={year}
                onClick={() => {
                  setCurrentYear(year);
                  setViewMode("days");
                }}
                className="py-2.5 px-4 text-sm font-semibold rounded-2xl border transition-all active:scale-95 text-center"
                style={{
                  backgroundColor: isSelected ? 'var(--calendar-selected-bg, #2563eb)' : 'var(--calendar-bg, var(--bg-surface, #ffffff))',
                  color: isSelected ? 'var(--calendar-selected-text, #ffffff)' : 'var(--calendar-text, var(--text-main, #0f172a))',
                  borderColor: isSelected ? 'transparent' : 'var(--calendar-border, var(--border-muted, #e2e8f0))'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))';
                    e.currentTarget.style.borderColor = 'var(--calendar-border-hover, var(--border-strong, #cbd5e1))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--calendar-bg, var(--bg-surface, #ffffff))';
                    e.currentTarget.style.borderColor = 'var(--calendar-border, var(--border-muted, #e2e8f0))';
                  }
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer Meta Sections */}
      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))' }}>
        <button
          onClick={goToToday}
          className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
          style={{
            backgroundColor: 'var(--calendar-secondary-bg, var(--bg-secondary, #f1f5f9))',
            color: 'var(--calendar-text-muted, var(--text-muted, #64748b))'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-secondary-bg, var(--bg-secondary, #f1f5f9))'}
        >
          Today
        </button>

        {value && (
          <div 
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--calendar-secondary-bg, var(--bg-secondary, #f1f5f9))',
              color: 'var(--calendar-text-muted, var(--text-muted, #64748b))',
              borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))'
            }}
          >
            {value.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
export default Calendar;
