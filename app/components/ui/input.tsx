import * as React from "react";
import { OutlineDraw } from "./OutlineDraw";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  state?: "default" | "success" | "warning" | "error";
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  loading?: boolean;
  readonly?: boolean;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  successText?: React.ReactNode;
  warningText?: React.ReactNode;
  showCounter?: boolean;
  skeleton?: boolean;
}


const clsx = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  {
    className,
      style,
      type = "text",
      label,
      icon: LeadingIcon,
      trailingIcon: TrailingIcon,
      state = "default",
      variant = "default",
      size = "default",
      fullWidth = false,
      disabled = false,
      loading = false,
      readonly = false,
      readOnly = false,
      helperText,
      errorText,
      successText,
      warningText,
      showCounter,
      maxLength,
      value,
      onChange,
      skeleton,
      required,
      id,
      ...props
  },
  ref
) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || "");
    const [cursorOffset, setCursorOffset] = React.useState(0);

    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isReadOnly = readonly || readOnly;
    const mirrorRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      if (mirrorRef.current) {
        setCursorOffset(mirrorRef.current.offsetWidth);
      }
    }, [internalValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || isReadOnly || loading) return;

      if (value === undefined) {
        setInternalValue(e.target.value);
      }

      if (onChange) onChange(e);
    };

    const handleClear = () => {
      if (disabled || isReadOnly) return;

      if (value === undefined) {
        setInternalValue("");
      }

      if (onChange) {
        onChange({
          target: { value: "" },
        } as any);
      }
    };

    const isPassword = type === "password";
    const isSearch = type === "search";

    const computedType =
      isPassword && showPassword ? "text" : type;

    const currentValueString = String(
      internalValue ?? ""
    );

    const hasValue = currentValueString.length > 0;
    const isFloated = isFocused || hasValue;

    const activeState =
      errorText || state === "error"
        ? "error"
        : warningText || state === "warning"
          ? "warning"
          : successText || state === "success"
            ? "success"
            : state;

    const characterCount = currentValueString.length;

    const isApproachingLimit =
      maxLength &&
      characterCount / maxLength >= 0.85;

    if (skeleton) {
      return (
        <div className={clsx("space-y-2 animate-pulse", fullWidth ? "w-full" : "w-auto")}>
          {label && (
            <div className="h-4 w-24 rounded-md bg-[var(--secondary)]" />
          )}
          <div className="h-12 w-full rounded-xl bg-[var(--secondary)]" />
          {helperText && (
            <div className="h-3 w-48 rounded-md bg-[var(--secondary)]" />
          )}
        </div>
      );
    }

    const showClear =
      hasValue && !disabled && !isReadOnly;

    const hasTrailingAction =
      isPassword || TrailingIcon || loading;

    return (
      <div
        className={clsx(
          fullWidth ? "w-full" : "w-auto",
          "flex flex-col gap-1.5 optiflow-outline-parent",
          isFocused && "optiflow-focused",
          activeState === "success" && "optiflow-success-aura",
          activeState === "error" && "optiflow-error-aura",
          activeState === "warning" && "optiflow-warning-aura",
          activeState === "error" &&
          isFocused &&
          "animate-[input-shake_0.25s_ease-in-out_infinite_alternate]"
        )}
        style={{
          "--input-bg":
            variant === "filled"
              ? "var(--secondary)"
              : variant === "glass"
                ? "rgba(255,255,255,0.05)"
                : "var(--background)",

          "--input-text": "var(--foreground)",
          "--input-muted": "var(--muted-foreground)",

          "--state-color":
            activeState === "error"
              ? "var(--destructive)"
              : activeState === "warning"
                ? "var(--warning)"
                : activeState === "success"
                  ? "var(--success)"
                  : "var(--primary)",

          "--border-base":
            activeState !== "default"
              ? "var(--state-color)"
              : isFocused
                ? "var(--state-color)"
                : "var(--border)",

          "--label-transform": isFloated
            ? "translateY(-22px) scale(.82)"
            : "translateY(0) scale(1)",

          "--icon-active-color": isFocused
            ? "var(--primary)"
            : "var(--muted-foreground)",
          ...style
        } as React.CSSProperties}
      >
        <div className="relative flex w-full items-center">
          {/* Focus Aura Underlay */}
          <div className="optiflow-focus-aura-glow" />

          {/* Border Sweep Tracing */}
          <OutlineDraw rx="12px" state={activeState} />

          {/* Mirror span for cursor trail calculation */}
          <span
            ref={mirrorRef}
            className="absolute invisible whitespace-pre font-medium text-sm"
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              fontSize: size === "sm" ? "12px" : size === "lg" ? "16px" : size === "xl" ? "18px" : "14px",
            }}
          >
            {currentValueString}
          </span>

          {/* Cursor typing glow */}
          {isFocused && hasValue && (
            <span
              className="optiflow-cursor-trail"
              style={{
                left: `calc(${cursorOffset}px + ${LeadingIcon || isSearch ? '3.1rem' : '1.35rem'})`,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "var(--state-color)",
              }}
            />
          )}

          <input
            id={inputId}
            ref={ref}
            type={computedType}
            value={internalValue}
            disabled={disabled}
            readOnly={isReadOnly}
            maxLength={maxLength}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={activeState === "error"}
            aria-describedby={
              errorText
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={clsx(
              "w-full rounded-xl border bg-transparent text-sm font-medium outline-none transition-all duration-300",
              "leading-none z-10",

              label && isFloated ? "pt-3.5" : "",

              LeadingIcon || isSearch
                ? "pl-11"
                : "pl-4",

              showClear && hasTrailingAction
                ? "pr-20"
                : showClear || hasTrailingAction
                  ? "pr-11"
                  : "pr-4",

              isFocused
                ? "placeholder:opacity-30"
                : "placeholder:opacity-60",

              disabled || isReadOnly
                ? "cursor-not-allowed opacity-50 bg-[var(--secondary)]"
                : "",

              variant === "glass"
                ? "backdrop-blur-md"
                : "",

              size === "sm" && "h-9 text-xs px-3",
              size === "default" && "h-11 text-sm px-4",
              size === "lg" && "h-12 text-base px-5",
              size === "xl" && "h-14 text-lg px-6",

              className
            )}
            style={{
              borderColor: "var(--border-base)",
              backgroundColor: "var(--input-bg)",
              color: "var(--input-text)",
              boxShadow: "none", // Prevent box shadow spam in favor of Focus Aura underlay
            }}
            {...props}
          />

          {label && (
            <label
              htmlFor={inputId}
              className="absolute pointer-events-none origin-left text-sm font-semibold transition-all duration-300 z-10"
              style={{
                left:
                  LeadingIcon || isSearch
                    ? "2.75rem"
                    : "1rem",

                transform:
                  "var(--label-transform)",

                color: isFocused
                  ? "var(--state-color)"
                  : "var(--input-muted)",

                backgroundColor: isFloated
                  ? "var(--input-bg)"
                  : "transparent",

                padding: isFloated
                  ? "0 4px"
                  : "0",

                borderRadius: "4px",
              }}
            >
              {label}
              {required && (
                <span className="text-red-500 font-bold ml-0.5">
                  *
                </span>
              )}
            </label>
          )}

          {(LeadingIcon || isSearch) && (
            <div
              className="absolute left-3.5 flex h-6 w-6 items-center justify-center pointer-events-none z-10"
              style={{
                color:
                  "var(--icon-active-color)",
              }}
            >
              {isSearch && !LeadingIcon ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              ) : (
                typeof LeadingIcon === 'function' ? React.createElement(LeadingIcon as React.ComponentType<any>) : (LeadingIcon as any)
              )}
            </div>
          )}

          <div className="absolute right-3.5 flex items-center gap-1.5 z-10">
            {showClear && (
              <button
                type="button"
                onClick={handleClear}
                className="
    flex items-center justify-center
    w-6 h-6
    rounded-full
    bg-slate-100
    dark:bg-slate-800
    text-slate-500
    hover:bg-slate-200
    hover:text-slate-700
    dark:hover:bg-slate-700
    dark:hover:text-slate-200
    active:scale-95
    transition-all duration-200
    shadow-sm
  "
                aria-label="Clear input value"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}

            {loading ? (
              <svg
                className="h-4 w-4 animate-spin text-[var(--state-color)]"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
            ) : isPassword ? (
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-sky-500 focus:outline-none transition-colors cursor-pointer select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            ) : TrailingIcon ? (
              <div className="p-1">
                {typeof TrailingIcon === 'function' ? React.createElement(TrailingIcon as React.ComponentType<any>) : (TrailingIcon as any)}
              </div>
            ) : null}
          </div>
        </div>

        {(helperText ||
          errorText ||
          successText ||
          warningText ||
          showCounter) && (
            <div className="flex justify-between px-1.5 text-xs">
              <div className="transition-all duration-300">
                {errorText && (
                  <span
                    id={`${inputId}-error`}
                    className="font-semibold text-red-500 flex items-center gap-1.5 animate-slide-up"
                  >
                    <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorText}
                  </span>
                )}

                {warningText &&
                  !errorText && (
                    <span className="font-semibold text-amber-500 flex items-center gap-1.5 animate-slide-up">
                      <svg className="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      {warningText}
                    </span>
                  )}

                {successText &&
                  !errorText &&
                  !warningText && (
                    <span className="font-semibold text-emerald-500 flex items-center gap-1.5 animate-slide-up">
                      <svg className="h-3.5 w-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" className="optiflow-checkbox-draw" />
                      </svg>
                      {successText}
                    </span>
                  )}

                {helperText &&
                  !errorText &&
                  !warningText &&
                  !successText && (
                    <span
                      id={`${inputId}-helper`}
                      className="text-slate-500 font-medium"
                    >
                      {helperText}
                    </span>
                  )}
              </div>

              {showCounter &&
                maxLength && (
                  <span
                    className={clsx(
                      isApproachingLimit
                        ? "text-amber-500 font-bold"
                        : "text-slate-400 font-medium"
                    )}
                  >
                    {characterCount} /{" "}
                    {maxLength}
                  </span>
                )}
            </div>
          )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
export { Input };