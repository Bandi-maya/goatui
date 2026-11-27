"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const YEAR_PAGE_SIZE = 12;

// Shared spring physics for the calendar's motion language.
const VIEW_SPRING = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;
const CELL_SPRING = { type: "spring", stiffness: 520, damping: 28, mass: 0.7 } as const;
const LABEL_SPRING = { type: "spring", stiffness: 500, damping: 32 } as const;

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

type ViewMode = "days" | "months" | "years";

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
  const reduceMotion = useReducedMotion();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState((value || today).getMonth());
  const [currentYear, setCurrentYear] = useState((value || today).getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>("days");

  // Direction of travel for the sliding day grid: 1 = forward, -1 = back, 0 = crossfade/scale.
  const [direction, setDirection] = useState(0);
  // First year shown on the 12-year picker page.
  const [yearPageStart, setYearPageStart] = useState(() => Math.floor((value || today).getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE);

  const daysGridRef = useRef<HTMLDivElement>(null);
  const monthsGridRef = useRef<HTMLDivElement>(null);
  const yearsGridRef = useRef<HTMLDivElement>(null);

  const viewTransition = reduceMotion ? { duration: 0.15, ease: "easeOut" as const } : VIEW_SPRING;
  const cellTransition = reduceMotion ? { duration: 0.1 } : CELL_SPRING;
  const labelTransition = reduceMotion ? { duration: 0.12 } : LABEL_SPRING;
  const stagger = reduceMotion ? 0 : 0.018;

  useEffect(() => {
    if (value) {
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
    }
  }, [value]);

  const yearPage = useMemo(
    () => Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => yearPageStart + i),
    [yearPageStart]
  );

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
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    setDirection(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (viewMode === "days") previousMonth();
    else if (viewMode === "months") setCurrentYear((p) => p - 1);
    else setYearPageStart((p) => p - YEAR_PAGE_SIZE);
  };

  const handleNext = () => {
    if (viewMode === "days") nextMonth();
    else if (viewMode === "months") setCurrentYear((p) => p + 1);
    else setYearPageStart((p) => p + YEAR_PAGE_SIZE);
  };

  const toggleMonths = () => {
    setDirection(0);
    setViewMode((v) => (v === "months" ? "days" : "months"));
  };

  const toggleYears = () => {
    setDirection(0);
    setYearPageStart(Math.floor(currentYear / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE);
    setViewMode((v) => (v === "years" ? "days" : "years"));
  };

  const selectMonth = (index: number) => {
    setDirection(0);
    setCurrentMonth(index);
    setViewMode("days");
  };

  const selectYear = (year: number) => {
    setDirection(0);
    setCurrentYear(year);
    // Drill down: after picking a year, land on the month picker.
    setViewMode("months");
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
    if (onChange) {
      onChange(date);
    }
  };

  const goToToday = () => {
    setDirection(0);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setViewMode("days");
    handleSelect(today);
  };

  // Roving-focus keyboard navigation shared by the day, month and year grids.
  const focusCell = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
    const cells = ref.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
    cells?.[index]?.focus();
  };

  const handleGridKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    count: number,
    cols: number,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    let next = index;
    switch (e.key) {
      case "ArrowLeft": next = index - 1; break;
      case "ArrowRight": next = index + 1; break;
      case "ArrowUp": next = index - cols; break;
      case "ArrowDown": next = index + cols; break;
      case "Home": next = 0; break;
      case "End": next = count - 1; break;
      case "Escape":
        e.preventDefault();
        setDirection(0);
        setViewMode("days");
        return;
      default:
        return;
    }
    e.preventDefault();
    if (next < 0) next = 0;
    if (next >= count) next = count - 1;
    focusCell(ref, next);
  };

  // Move focus into a picker grid when it opens. With AnimatePresence mode="wait" the
  // grid only mounts after the previous view's exit animation finishes, so poll briefly.
  useEffect(() => {
    if (viewMode === "days") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const tryFocus = (attempt: number) => {
      if (cancelled) return;
      const ref = viewMode === "months" ? monthsGridRef : yearsGridRef;
      const idx =
        viewMode === "months"
          ? currentMonth
          : Math.min(Math.max(currentYear - yearPageStart, 0), YEAR_PAGE_SIZE - 1);
      if (ref.current) {
        focusCell(ref, idx);
        return;
      }
      if (attempt < 30) timer = setTimeout(() => tryFocus(attempt + 1), 50);
    };
    timer = setTimeout(() => tryFocus(0), reduceMotion ? 30 : 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Motion variants. `custom` carries the slide direction for the day grid.
  const dayVariants = {
    enter: (dir: number) =>
      dir === 0 ? { opacity: 0, scale: 0.96 } : { opacity: 0, x: dir * 56 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) =>
      dir === 0 ? { opacity: 0, scale: 0.96 } : { opacity: 0, x: dir * -56 },
  };

  const panelVariants = {
    enter: { opacity: 0, scale: 0.94, y: 12 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: -8, transition: { duration: reduceMotion ? 0.08 : 0.14 } },
  };

  const gridVariants = {
    enter: {},
    center: { transition: { staggerChildren: stagger } },
    exit: {},
  };

  const cellVariants = {
    enter: { opacity: 0, scale: 0.72, y: 10 },
    center: { opacity: 1, scale: 1, y: 0, transition: cellTransition },
    exit: { opacity: 0, transition: { duration: 0.08 } },
  };

  const labelVariants = {
    enter: { opacity: 0, y: 8 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8, transition: { duration: reduceMotion ? 0.06 : 0.1 } },
  };

  const prevLabel =
    viewMode === "days" ? "Previous month" : viewMode === "months" ? "Previous year" : "Previous 12 years";
  const nextLabel =
    viewMode === "days" ? "Next month" : viewMode === "months" ? "Next year" : "Next 12 years";

  const headerButtonStyle = {
    color: 'var(--calendar-text, var(--text-main, #0f172a))'
  };

  const navButtonStyle = {
    borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))',
    color: 'var(--calendar-text-muted, var(--text-muted, #64748b))',
    backgroundColor: 'transparent'
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
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          onClick={handlePrev}
          aria-label={prevLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200"
          style={navButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronLeft />
        </motion.button>

        <div className="flex min-w-0 items-center justify-center gap-0.5 sm:gap-1" style={{ minHeight: 32 }}>
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === "days" && (
              <motion.div
                key="labels-days"
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={labelTransition}
                className="flex items-center gap-1"
              >
                <button
                  onClick={toggleMonths}
                  aria-expanded={false}
                  aria-haspopup="grid"
                  aria-label={`Choose month, currently ${MONTHS[currentMonth]}`}
                  className="whitespace-nowrap rounded-xl px-1.5 sm:px-3 py-1.5 text-sm font-bold transition-colors active:scale-95"
                  style={headerButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="hidden sm:inline">{MONTHS[currentMonth]}</span>
                  <span className="sm:hidden">{MONTHS[currentMonth].substring(0, 3)}</span>
                </button>
                <button
                  onClick={toggleYears}
                  aria-expanded={false}
                  aria-haspopup="grid"
                  aria-label={`Choose year, currently ${currentYear}`}
                  className="whitespace-nowrap rounded-xl px-1.5 sm:px-3 py-1.5 text-sm font-bold transition-colors active:scale-95"
                  style={headerButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {currentYear}
                </button>
              </motion.div>
            )}

            {viewMode === "months" && (
              <motion.button
                key="labels-months"
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={labelTransition}
                onClick={toggleYears}
                aria-label={`Choose year, currently ${currentYear}`}
                className="whitespace-nowrap rounded-xl px-1.5 sm:px-3 py-1.5 text-sm font-bold transition-colors active:scale-95"
                style={headerButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {currentYear}
              </motion.button>
            )}

            {viewMode === "years" && (
              <motion.button
                key="labels-years"
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={labelTransition}
                onClick={() => { setDirection(0); setViewMode("days"); }}
                aria-label={`Showing years ${yearPageStart} to ${yearPageStart + YEAR_PAGE_SIZE - 1}, back to calendar`}
                className="whitespace-nowrap rounded-xl px-1.5 sm:px-3 py-1.5 text-sm font-bold tabular-nums transition-colors active:scale-95"
                style={headerButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {yearPageStart} – {yearPageStart + YEAR_PAGE_SIZE - 1}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          onClick={handleNext}
          aria-label={nextLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200"
          style={navButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRight />
        </motion.button>
      </div>

      {/* Animated view area */}
      <div className="relative overflow-hidden" style={{ minHeight: 322 }}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {/* Days View Matrix */}
          {viewMode === "days" && (
            <motion.div
              key={`days-${currentYear}-${currentMonth}`}
              custom={direction}
              variants={dayVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={viewTransition}
            >
              <div className="mb-2 grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="flex h-10 items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--calendar-text-dim, var(--text-dim, #94a3b8))' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div
                ref={daysGridRef}
                role="grid"
                aria-label={`${MONTHS[currentMonth]} ${currentYear}`}
                className="grid grid-cols-7 gap-1.5 justify-items-center"
                onKeyDown={(e) => {
                  const idx = Number((e.target as HTMLElement).getAttribute("data-cell-index"));
                  if (!Number.isNaN(idx)) handleGridKeyDown(e, idx, matrixData.length, 7, daysGridRef);
                }}
              >
                {matrixData.map(({ date, isCurrentMonth }, index) => {
                  const disabled = isDisabled(date);
                  const selected = isSameDate(value, date);
                  const isToday = isSameDate(today, date);

                  return (
                    <div key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`} className="w-full aspect-square flex items-center justify-center max-w-[40px] max-h-[40px]">
                      <motion.button
                        data-cell-index={index}
                        disabled={disabled}
                        onClick={() => handleSelect(date)}
                        initial={false}
                        animate={{ scale: selected ? 1.05 : 1 }}
                        whileHover={!selected && !disabled && !reduceMotion ? { scale: 1.08 } : undefined}
                        whileTap={!disabled && !reduceMotion ? { scale: 0.88 } : undefined}
                        transition={cellTransition}
                        aria-label={date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        aria-pressed={selected}
                        className="relative flex h-full w-full items-center justify-center rounded-full text-sm font-semibold focus:outline-none origin-center"
                        style={{
                          color: selected
                            ? 'var(--calendar-selected-text, #ffffff)'
                            : !isCurrentMonth
                              ? 'var(--calendar-text-dim, var(--text-dim, #94a3b8))'
                              : 'var(--calendar-text, var(--text-main, #0f172a))',
                          background: selected
                            ? 'var(--calendar-selected-bg, linear-gradient(to right, #2563eb, #4680e5))'
                            : 'transparent',
                          boxShadow: selected ? '0 4px 12px -1px var(--calendar-selected-shadow, rgba(37, 99, 235, 0.4))' : 'none',
                          border: isToday && !selected ? '2px solid var(--calendar-today-border, #2563eb)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!selected && !disabled) {
                            e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {date.getDate()}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Month Selection View */}
          {viewMode === "months" && (
            <motion.div
              key="months"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={viewTransition}
            >
              <motion.div
                ref={monthsGridRef}
                role="grid"
                aria-label={`Choose month in ${currentYear}`}
                variants={gridVariants}
                className="grid grid-cols-3 gap-3 py-2"
                onKeyDown={(e) => {
                  const idx = Number((e.target as HTMLElement).getAttribute("data-cell-index"));
                  if (!Number.isNaN(idx)) handleGridKeyDown(e, idx, MONTHS.length, 3, monthsGridRef);
                }}
              >
                {MONTHS.map((month, index) => {
                  const isSelected = index === currentMonth;
                  const isThisMonth = index === today.getMonth() && currentYear === today.getFullYear();
                  return (
                    <motion.button
                      key={month}
                      data-cell-index={index}
                      variants={cellVariants}
                      whileHover={!isSelected && !reduceMotion ? { scale: 1.05 } : undefined}
                      whileTap={!reduceMotion ? { scale: 0.94 } : undefined}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => selectMonth(index)}
                      aria-label={month}
                      aria-pressed={isSelected}
                      className="min-w-0 py-3 text-sm font-semibold rounded-2xl border focus:outline-none"
                      style={{
                        backgroundColor: isSelected ? 'var(--calendar-selected-bg, #2563eb)' : 'transparent',
                        color: isSelected ? 'var(--calendar-selected-text, #ffffff)' : 'var(--calendar-text, var(--text-main, #0f172a))',
                        borderColor: isThisMonth && !isSelected ? 'var(--calendar-today-border, #2563eb)' : 'transparent',
                        boxShadow: isSelected ? '0 4px 12px -1px var(--calendar-selected-shadow, rgba(37, 99, 235, 0.4))' : 'none'
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
                          e.currentTarget.style.borderColor = isThisMonth ? 'var(--calendar-today-border, #2563eb)' : 'transparent';
                        }
                      }}
                    >
                      {month.substring(0, 3)}
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Year Selection View */}
          {viewMode === "years" && (
            <motion.div
              key="years"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={viewTransition}
            >
              <motion.div
                ref={yearsGridRef}
                role="grid"
                aria-label={`Choose year, ${yearPageStart} to ${yearPageStart + YEAR_PAGE_SIZE - 1}`}
                variants={gridVariants}
                className="grid grid-cols-3 gap-y-3 gap-x-2 sm:gap-x-4 py-2"
                onKeyDown={(e) => {
                  const idx = Number((e.target as HTMLElement).getAttribute("data-cell-index"));
                  if (!Number.isNaN(idx)) handleGridKeyDown(e, idx, yearPage.length, 3, yearsGridRef);
                }}
              >
                {yearPage.map((year, index) => {
                  const isSelected = year === currentYear;
                  const isThisYear = year === today.getFullYear();
                  return (
                    <motion.button
                      key={year}
                      data-cell-index={index}
                      variants={cellVariants}
                      whileHover={!isSelected && !reduceMotion ? { scale: 1.05 } : undefined}
                      whileTap={!reduceMotion ? { scale: 0.94 } : undefined}
                      tabIndex={isSelected || (!yearPage.includes(currentYear) && index === 0) ? 0 : -1}
                      onClick={() => selectYear(year)}
                      aria-label={`${year}`}
                      aria-pressed={isSelected}
                      className="min-w-0 py-2.5 px-1.5 sm:px-4 text-sm font-semibold rounded-2xl border text-center tabular-nums focus:outline-none"
                      style={{
                        backgroundColor: isSelected ? 'var(--calendar-selected-bg, #2563eb)' : 'var(--calendar-bg, var(--bg-surface, #ffffff))',
                        color: isSelected ? 'var(--calendar-selected-text, #ffffff)' : 'var(--calendar-text, var(--text-main, #0f172a))',
                        borderColor: isSelected
                          ? 'transparent'
                          : isThisYear
                            ? 'var(--calendar-today-border, #2563eb)'
                            : 'var(--calendar-border, var(--border-muted, #e2e8f0))',
                        boxShadow: isSelected ? '0 4px 12px -1px var(--calendar-selected-shadow, rgba(37, 99, 235, 0.4))' : 'none'
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
                          e.currentTarget.style.borderColor = isThisYear
                            ? 'var(--calendar-today-border, #2563eb)'
                            : 'var(--calendar-border, var(--border-muted, #e2e8f0))';
                        }
                      }}
                    >
                      {year}
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Meta Sections */}
      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--calendar-border, var(--border-muted, #e2e8f0))' }}>
        <motion.button
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          onClick={goToToday}
          className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
          style={{
            backgroundColor: 'var(--calendar-secondary-bg, var(--bg-secondary, #f1f5f9))',
            color: 'var(--calendar-text-muted, var(--text-muted, #64748b))'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-hover-bg, var(--bg-hover, #f8fafc))'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--calendar-secondary-bg, var(--bg-secondary, #f1f5f9))'}
        >
          Today
        </motion.button>

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
